-- Migration: Enforce foreign key cascade & complete cleanup when auth user is deleted
-- Timestamp: 20261007235500
-- Purpose: When a user is deleted from Supabase Authentication (auth.users),
-- automatically delete all their mandapams and associated data (slots, bookings, services,
-- alankaranas, schedules, announcements, etc.) via ON DELETE CASCADE and BEFORE DELETE trigger.
--
-- SAFE TO RE-RUN: All statements are idempotent (IF EXISTS / IF NOT EXISTS guards).
-- Does NOT remove any mandapam whose owner_user_id still exists in auth.users.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Clean up ONLY orphaned mandapams (owner deleted from auth.users)
--    This does NOT touch any mandapam whose owner still exists.
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM public.navaratri_mandapams
WHERE owner_user_id IS NOT NULL
  AND owner_user_id NOT IN (SELECT id FROM auth.users);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Drop any stale FK constraint on owner_user_id and add ON DELETE CASCADE
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'navaratri_mandapams_owner_user_id_fkey'
      AND table_name = 'navaratri_mandapams'
  ) THEN
    ALTER TABLE public.navaratri_mandapams
      DROP CONSTRAINT navaratri_mandapams_owner_user_id_fkey;
  END IF;
END $$;

ALTER TABLE public.navaratri_mandapams
  ADD CONSTRAINT navaratri_mandapams_owner_user_id_fkey
  FOREIGN KEY (owner_user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. BEFORE DELETE trigger on auth.users
--    Fires BEFORE the FK cascade, covering organizer_email-linked mandapams
--    and all associated child-table rows.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete mandapams owned by owner_user_id
  BEGIN
    DELETE FROM public.navaratri_mandapams WHERE owner_user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Also delete mandapams linked by email (for orgs registered before owner_user_id was set)
  BEGIN
    IF OLD.email IS NOT NULL AND trim(OLD.email) <> '' THEN
      DELETE FROM public.navaratri_mandapams WHERE organizer_email ILIKE trim(OLD.email);
    END IF;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- Clean up user-level data across all related tables
  BEGIN DELETE FROM public.navaratri_mandapam_members WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.navaratri_bookings WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.navaratri_reminders WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.navaratri_community_questions WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.navaratri_advertisements WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.portal_users WHERE auth_user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.client_profiles WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN DELETE FROM public.user_roles WHERE user_id = OLD.id; EXCEPTION WHEN OTHERS THEN NULL; END;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RPC: delete_own_user_account()
--    Called by the organizer's "Delete Account" button.
--    Drops the old function first (signature may differ from prior migration).
-- ─────────────────────────────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS public.delete_own_user_account();

CREATE OR REPLACE FUNCTION public.delete_own_user_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid   uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  -- Delete all mandapams (and cascade-linked children: services, slots, bookings, etc.)
  DELETE FROM public.navaratri_mandapams WHERE owner_user_id = v_uid;
  IF v_email IS NOT NULL AND trim(v_email) <> '' THEN
    DELETE FROM public.navaratri_mandapams WHERE organizer_email ILIKE trim(v_email);
  END IF;

  -- Delete the auth.users row — this fires the BEFORE DELETE trigger above
  DELETE FROM auth.users WHERE id = v_uid;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_own_user_account() TO authenticated;
