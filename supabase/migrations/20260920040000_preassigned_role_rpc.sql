-- RPC function to let authenticated users check if their email has a preassigned role.
-- Returns the role string or NULL. Used by PortalGateway.tsx on first sign-in.
CREATE OR REPLACE FUNCTION public.get_my_preassigned_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role text;
  v_email text;
BEGIN
  v_email := lower(trim((SELECT auth.jwt() ->> 'email')));
  IF v_email IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT role INTO v_role
  FROM public.admin_preassigned_roles
  WHERE lower(email) = v_email
    AND applied_at IS NULL;   -- only fire once (before first application)

  RETURN v_role;
END;
$$;

-- Mark the preassigned role as applied (called after role has been set on the user)
CREATE OR REPLACE FUNCTION public.mark_preassigned_role_applied()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email text;
BEGIN
  v_email := lower(trim((SELECT auth.jwt() ->> 'email')));
  IF v_email IS NULL THEN RETURN; END IF;

  UPDATE public.admin_preassigned_roles
  SET applied_at = now()
  WHERE lower(email) = v_email
    AND applied_at IS NULL;
END;
$$;

-- Grant execute to authenticated users so PortalGateway can call these RPCs
GRANT EXECUTE ON FUNCTION public.get_my_preassigned_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_preassigned_role_applied() TO authenticated;
