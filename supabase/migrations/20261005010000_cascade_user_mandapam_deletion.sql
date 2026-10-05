-- Migration: Cascade user & organizer account deletion across all tables
-- Timestamp: 20261005010000

-- 1. Ensure Organizers and Admins can delete their own Mandapams via RLS
DROP POLICY IF EXISTS "Organizer delete owned mandapam" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Admin manage all mandapams" ON public.navaratri_mandapams;

CREATE POLICY "Organizer delete owned mandapam"
  ON public.navaratri_mandapams
  FOR DELETE TO anon, authenticated
  USING (
    owner_user_id = (select auth.uid())
    OR (select public.is_portal_admin())
    OR owner_user_id IS NULL
  );

-- 2. Trigger on auth.users so whenever a user or organizer is deleted from auth.users,
-- all their mandapams and corresponding sub-tables cascade delete automatically.
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete all mandapams owned by the deleted user (PostgreSQL CASCADE foreign keys
  -- automatically clean up day_settings, alankaranas, services, slots, bookings,
  -- activities, nimarjanam schedules, announcements, pallaki, dheeksha, questions,
  -- reminders, analytics, and memberships)
  DELETE FROM public.navaratri_mandapams WHERE owner_user_id = OLD.id;

  -- Delete memberships
  DELETE FROM public.navaratri_mandapam_members WHERE user_id = OLD.id;

  -- Delete citizen bookings created by this user
  DELETE FROM public.navaratri_bookings WHERE user_id = OLD.id;

  -- Delete reminders created by this user
  DELETE FROM public.navaratri_reminders WHERE user_id = OLD.id;

  -- Delete community questions created by this user
  DELETE FROM public.navaratri_community_questions WHERE user_id = OLD.id;

  -- Delete advertisements placed by this user
  DELETE FROM public.navaratri_advertisements WHERE user_id = OLD.id;

  -- Delete client profiles and roles
  DELETE FROM public.client_profiles WHERE user_id = OLD.id;
  DELETE FROM public.user_roles WHERE user_id = OLD.id;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- 3. Callable RPC for an authenticated user / organizer to permanently delete their account and data
CREATE OR REPLACE FUNCTION public.delete_own_user_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid;
  v_deleted_mandapams int := 0;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete all mandapams owned by the user (cascades to all 15 child tables)
  DELETE FROM public.navaratri_mandapams WHERE owner_user_id = v_uid;
  GET DIAGNOSTICS v_deleted_mandapams = ROW_COUNT;

  -- Delete memberships
  DELETE FROM public.navaratri_mandapam_members WHERE user_id = v_uid;

  -- Delete user bookings, reminders, questions, ads
  DELETE FROM public.navaratri_bookings WHERE user_id = v_uid;
  DELETE FROM public.navaratri_reminders WHERE user_id = v_uid;
  DELETE FROM public.navaratri_community_questions WHERE user_id = v_uid;
  DELETE FROM public.navaratri_advertisements WHERE user_id = v_uid;
  DELETE FROM public.client_profiles WHERE user_id = v_uid;
  DELETE FROM public.user_roles WHERE user_id = v_uid;

  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = v_uid;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_user_id', v_uid,
    'deleted_mandapams', v_deleted_mandapams
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_own_user_account() TO authenticated;

NOTIFY pgrst, 'reload schema';
