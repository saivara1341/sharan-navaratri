-- Migration: Enforce foreign key cascade & complete cleanup when auth user is deleted
-- Timestamp: 20261007235500
-- Purpose: When a user is deleted from Supabase Authentication (auth.users),
-- automatically delete all their mandapams and associated data (slots, bookings, services,
-- alankaranas, schedules, announcements, etc.) via ON DELETE CASCADE and BEFORE DELETE trigger.

-- 1. Clean up existing orphaned mandapams in the database whose owner_user_id no longer exists in auth.users
DELETE FROM public.navaratri_mandapams
WHERE owner_user_id IS NOT NULL
  AND owner_user_id NOT IN (SELECT id FROM auth.users);

-- 2. Drop any previous foreign key constraint on owner_user_id if present
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

-- 3. Add explicit FOREIGN KEY constraint with ON DELETE CASCADE to auth.users(id)
ALTER TABLE public.navaratri_mandapams
  ADD CONSTRAINT navaratri_mandapams_owner_user_id_fkey
  FOREIGN KEY (owner_user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- 4. Replace or create the BEFORE DELETE trigger on auth.users
-- This handles cases where owner_user_id might be null but organizer_email matches,
-- or cleans up associated bookings, reminders, questions, advertisements, and memberships.
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Delete all mandapams owned by the user ID
  BEGIN
    DELETE FROM public.navaratri_mandapams WHERE owner_user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- 2. Also delete mandapams matching the deleted user's email (case-insensitive)
  BEGIN
    IF OLD.email IS NOT NULL AND trim(OLD.email) <> '' THEN
      DELETE FROM public.navaratri_mandapams WHERE organizer_email ILIKE trim(OLD.email);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- 3. Delete user data across all platform tables
  BEGIN
    DELETE FROM public.navaratri_mandapam_members WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.navaratri_bookings WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.navaratri_reminders WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.navaratri_community_questions WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.navaratri_advertisements WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.portal_users WHERE auth_user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.client_profiles WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    DELETE FROM public.user_roles WHERE user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN OLD;
END;
$$;

-- Drop and re-create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- 5. RPC function allowing authenticated organizers to securely delete their own account and all data
CREATE OR REPLACE FUNCTION public.delete_own_user_account()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid;
  v_email text;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  -- Delete all mandapams owned by the caller
  DELETE FROM public.navaratri_mandapams WHERE owner_user_id = v_uid;
  IF v_email IS NOT NULL AND trim(v_email) <> '' THEN
    DELETE FROM public.navaratri_mandapams WHERE organizer_email ILIKE trim(v_email);
  END IF;

  -- Delete user record in auth.users (which also fires before delete trigger)
  DELETE FROM auth.users WHERE id = v_uid;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_own_user_account() TO authenticated;
