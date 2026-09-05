-- Keep the readable portal profile in sync when a client corrects details in
-- their own authenticated profile. The browser only updates auth metadata;
-- this trigger runs inside the existing auth-to-profile sync boundary.

CREATE OR REPLACE FUNCTION public.sync_portal_user_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.portal_users (
    auth_user_id,
    email,
    name,
    role,
    organization,
    designation,
    phone,
    confirmed
  )
  VALUES (
    NEW.id,
    lower(NEW.email),
    coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    coalesce(NEW.raw_user_meta_data ->> 'role', 'client'),
    NEW.raw_user_meta_data ->> 'organization',
    NEW.raw_user_meta_data ->> 'designation',
    NEW.raw_user_meta_data ->> 'phone',
    NEW.email_confirmed_at IS NOT NULL
  )
  ON CONFLICT (email) DO UPDATE
  SET
    auth_user_id = EXCLUDED.auth_user_id,
    name = coalesce(EXCLUDED.name, public.portal_users.name),
    organization = coalesce(EXCLUDED.organization, public.portal_users.organization),
    designation = coalesce(EXCLUDED.designation, public.portal_users.designation),
    phone = coalesce(EXCLUDED.phone, public.portal_users.phone),
    confirmed = EXCLUDED.confirmed,
    updated_at = now();
  RETURN NEW;
END;
$$;
