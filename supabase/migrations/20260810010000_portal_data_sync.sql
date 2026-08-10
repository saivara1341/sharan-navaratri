-- Persisted portal data and access rules for admin, agency and client workflows.
-- The admin check is deliberately centralized so policies remain consistent.
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'ssaivaraprasad51@gmail.com';
$$;

-- Columns already used by the agency and admin portals.
ALTER TABLE public.agency_clients
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS tenure_months integer,
  ADD COLUMN IF NOT EXISTS tenure_start_date date,
  ADD COLUMN IF NOT EXISTS geo_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS seo_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gbp_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS aeo_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_impressions text,
  ADD COLUMN IF NOT EXISTS monthly_clicks text,
  ADD COLUMN IF NOT EXISTS ctr text,
  ADD COLUMN IF NOT EXISTS ai_citations text,
  ADD COLUMN IF NOT EXISTS admin_quote_assigned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_quote_assigned_at timestamptz;

ALTER TABLE public.agency_clients
  DROP CONSTRAINT IF EXISTS agency_clients_progress_check;
ALTER TABLE public.agency_clients
  ADD CONSTRAINT agency_clients_progress_check CHECK (progress BETWEEN 0 AND 100);

DROP POLICY IF EXISTS "Admins can manage agency clients" ON public.agency_clients;
CREATE POLICY "Admins can manage agency clients" ON public.agency_clients
  FOR ALL TO authenticated
  USING ((select public.is_portal_admin()))
  WITH CHECK ((select public.is_portal_admin()));

CREATE INDEX IF NOT EXISTS agency_clients_agency_email_idx ON public.agency_clients (lower(agency_email));
CREATE INDEX IF NOT EXISTS agency_clients_email_idx ON public.agency_clients (lower(email));

CREATE TABLE IF NOT EXISTS public.agency_invoices (
  id text PRIMARY KEY,
  agency_email text NOT NULL,
  client_id text REFERENCES public.agency_clients(id) ON DELETE SET NULL,
  month text NOT NULL,
  amount text NOT NULL,
  raw_amount numeric,
  status text NOT NULL DEFAULT 'Pending',
  due_date date,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agency_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agency owners can view invoices" ON public.agency_invoices;
CREATE POLICY "Agency owners can view invoices" ON public.agency_invoices
  FOR SELECT TO authenticated
  USING (lower((select auth.jwt() ->> 'email')) = lower(agency_email));
DROP POLICY IF EXISTS "Admins can manage agency invoices" ON public.agency_invoices;
CREATE POLICY "Admins can manage agency invoices" ON public.agency_invoices
  FOR ALL TO authenticated
  USING ((select public.is_portal_admin()))
  WITH CHECK ((select public.is_portal_admin()));
CREATE INDEX IF NOT EXISTS agency_invoices_agency_client_idx ON public.agency_invoices (lower(agency_email), client_id, created_at DESC);

-- Admin edits are persisted; clients can safely read their own profile and quote.
CREATE TABLE IF NOT EXISTS public.portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'partner', 'investor', 'employee', 'admin')),
  organization text,
  designation text,
  phone text,
  quote text,
  notes text,
  confirmed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own portal profile" ON public.portal_users;
CREATE POLICY "Users can read own portal profile" ON public.portal_users
  FOR SELECT TO authenticated
  USING (lower(email) = lower((select auth.jwt() ->> 'email')));
DROP POLICY IF EXISTS "Admins can manage portal users" ON public.portal_users;
CREATE POLICY "Admins can manage portal users" ON public.portal_users
  FOR ALL TO authenticated
  USING ((select public.is_portal_admin()))
  WITH CHECK ((select public.is_portal_admin()));

-- Keep profile records in sync at account creation. Email changes are handled by
-- the admin edge function so the profile, projects, and Auth account update together.
CREATE OR REPLACE FUNCTION public.sync_portal_user_from_auth()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  INSERT INTO public.portal_users (auth_user_id, email, name, role, organization, designation, confirmed)
  VALUES (NEW.id, lower(NEW.email), coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
          coalesce(NEW.raw_user_meta_data ->> 'role', 'client'), NEW.raw_user_meta_data ->> 'organization',
          NEW.raw_user_meta_data ->> 'designation', NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (email) DO UPDATE SET auth_user_id = EXCLUDED.auth_user_id, updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sync_portal_user_from_auth ON auth.users;
CREATE TRIGGER sync_portal_user_from_auth AFTER INSERT OR UPDATE OF email, raw_user_meta_data, email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_portal_user_from_auth();

-- Import all accounts that were created before this portal-user table existed.
INSERT INTO public.portal_users (auth_user_id, email, name, role, organization, designation, confirmed)
SELECT
  u.id,
  lower(u.email),
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  CASE WHEN coalesce(u.raw_user_meta_data ->> 'role', 'client') IN ('client', 'partner', 'investor', 'employee', 'admin')
       THEN coalesce(u.raw_user_meta_data ->> 'role', 'client') ELSE 'client' END,
  u.raw_user_meta_data ->> 'organization',
  u.raw_user_meta_data ->> 'designation',
  u.email_confirmed_at IS NOT NULL
FROM auth.users u
WHERE u.email IS NOT NULL
ON CONFLICT (email) DO UPDATE
SET auth_user_id = EXCLUDED.auth_user_id,
    name = coalesce(EXCLUDED.name, public.portal_users.name),
    role = EXCLUDED.role,
    organization = coalesce(EXCLUDED.organization, public.portal_users.organization),
    designation = coalesce(EXCLUDED.designation, public.portal_users.designation),
    confirmed = EXCLUDED.confirmed,
    updated_at = now();

-- These were absent, causing successful-looking updates to affect zero rows.
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING ((select public.is_portal_admin()))
  WITH CHECK ((select public.is_portal_admin()));
DROP POLICY IF EXISTS "Clients can update own submissions" ON public.contact_submissions;
CREATE POLICY "Clients can update own submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (lower(email) = lower((select auth.jwt() ->> 'email')))
  WITH CHECK (lower(email) = lower((select auth.jwt() ->> 'email')));
