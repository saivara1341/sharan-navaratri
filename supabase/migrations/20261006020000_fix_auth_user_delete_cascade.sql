-- Migration: Fix auth user deletion cascade & foreign keys
-- Timestamp: 20261006020000
-- Purpose: Fix "Database error deleting user" in Supabase Dashboard (Auth -> Users)
-- Allows smooth deletion of test users during development.

-- 1. Ensure target_mandapam_id in navaratri_advertisements cascades or sets null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'navaratri_advertisements_target_mandapam_id_fkey'
  ) THEN
    ALTER TABLE public.navaratri_advertisements 
      DROP CONSTRAINT navaratri_advertisements_target_mandapam_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'navaratri_advertisements' AND column_name = 'target_mandapam_id'
  ) THEN
    ALTER TABLE public.navaratri_advertisements 
      ADD CONSTRAINT navaratri_advertisements_target_mandapam_id_fkey 
      FOREIGN KEY (target_mandapam_id) 
      REFERENCES public.navaratri_mandapams(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Ensure client_invoices does NOT restrict auth user deletion (change RESTRICT to CASCADE)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'client_invoices_submitted_by_fkey'
  ) THEN
    ALTER TABLE public.client_invoices 
      DROP CONSTRAINT client_invoices_submitted_by_fkey;
    ALTER TABLE public.client_invoices 
      ADD CONSTRAINT client_invoices_submitted_by_fkey 
      FOREIGN KEY (submitted_by) 
      REFERENCES auth.users(id) 
      ON DELETE CASCADE;
  END IF;
END $$;

-- 3. Dynamically convert ANY foreign key constraint pointing to auth.users(id) that has RESTRICT or NO ACTION to ON DELETE CASCADE
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT
      tc.table_schema,
      tc.table_name,
      tc.constraint_name,
      kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints rc
      ON rc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_schema = 'auth'
      AND ccu.table_name = 'users'
      AND rc.delete_rule IN ('RESTRICT', 'NO ACTION')
  ) LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.constraint_name);
      EXECUTE format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE CASCADE',
                     r.table_schema, r.table_name, r.constraint_name, r.column_name);
      RAISE NOTICE 'Updated constraint % on table % to ON DELETE CASCADE', r.constraint_name, r.table_name;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not alter constraint %: %', r.constraint_name, SQLERRM;
    END;
  END LOOP;
END $$;

-- 4. Replace trigger with a robust BEFORE DELETE trigger on auth.users
-- In PostgreSQL, BEFORE DELETE triggers clean up dependent records BEFORE foreign key constraint enforcement occurs.
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Safe deletion of mandapams owned by the user or registered with their email
  BEGIN
    DELETE FROM public.navaratri_mandapams WHERE owner_user_id = OLD.id;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  BEGIN
    IF OLD.email IS NOT NULL THEN
      DELETE FROM public.navaratri_mandapams WHERE organizer_email ILIKE OLD.email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  -- Safe deletion of child tables
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

-- Drop previous triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create BEFORE DELETE trigger on auth.users
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- 5. Helper function to immediately purge a test user by email if needed
CREATE OR REPLACE FUNCTION public.admin_delete_user_by_email(p_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email LIMIT 1;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found in auth.users');
  END IF;

  DELETE FROM public.navaratri_mandapams WHERE owner_user_id = v_user_id OR organizer_email ILIKE p_email;
  DELETE FROM auth.users WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'deleted_user_id', v_user_id, 'email', p_email);
END;
$$;

-- 6. Immediate cleanup for test user 23eg510a07@anurag.edu.in
DO $$
DECLARE
  v_uid uuid;
BEGIN
  SELECT id INTO v_uid FROM auth.users WHERE email = '23eg510a07@anurag.edu.in';
  IF v_uid IS NOT NULL THEN
    DELETE FROM public.navaratri_mandapams WHERE owner_user_id = v_uid OR organizer_email ILIKE '23eg510a07@anurag.edu.in';
    DELETE FROM auth.users WHERE id = v_uid;
    RAISE NOTICE 'Test user 23eg510a07@anurag.edu.in deleted successfully';
  END IF;
END $$;
