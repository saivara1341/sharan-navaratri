-- Allow additional administrators through the server-controlled app_metadata
-- role while preserving the original owner account during migration.
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT
    lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'ssaivaraprasad51@gmail.com'
    OR coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin';
$$;
