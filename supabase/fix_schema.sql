-- ==============================================================================
-- Siddhi Dynamics - Comprehensive Schema Fix & Cache Reload Script
-- Run this script in the Supabase SQL Editor to resolve:
-- 1. "Could not find the table 'public.clients' in the schema cache"
-- 2. "column contact_submissions.status does not exist"
-- ==============================================================================

-- 1. Helper Functions
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'ssaivaraprasad51@gmail.com';
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.jwt_email()
RETURNS text LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), ''));
$$;

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS text LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT coalesce((select auth.jwt() -> 'user_metadata' ->> 'role'), 'client');
$$;

-- 2. Fix missing columns in public.contact_submissions
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New Request',
  ADD COLUMN IF NOT EXISTS progress integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bounty_reward text,
  ADD COLUMN IF NOT EXISTS assigned_to text,
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Permissions & RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT ALL ON public.contact_submissions TO service_role;

DROP POLICY IF EXISTS "Allow admin select of contact_submissions" ON public.contact_submissions;
CREATE POLICY "Allow admin select of contact_submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Allow users to select own submissions" ON public.contact_submissions;
CREATE POLICY "Allow users to select own submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (lower(email) = public.jwt_email());

DROP POLICY IF EXISTS "Employees can select assigned submissions" ON public.contact_submissions;
CREATE POLICY "Employees can select assigned submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (lower(coalesce(assigned_to, '')) = public.jwt_email());

DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Clients can update own submissions" ON public.contact_submissions;
CREATE POLICY "Clients can update own submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (lower(email) = public.jwt_email()) WITH CHECK (lower(email) = public.jwt_email());

DROP POLICY IF EXISTS "Allow admin to delete submissions" ON public.contact_submissions;
CREATE POLICY "Allow admin to delete submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING ((select public.is_portal_admin()));

-- 3. Create public.clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  phone text,
  industry text,
  website text,
  status text NOT NULL DEFAULT 'Lead' CHECK (status IN ('Lead','Active','Paused','Churned')),
  tier text NOT NULL DEFAULT 'Standard' CHECK (tier IN ('Standard','Growth','Enterprise')),
  owner_email text,
  agency_email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Clients read own record" ON public.clients;
CREATE POLICY "Clients read own record" ON public.clients FOR SELECT TO authenticated
  USING (lower(contact_email) = public.jwt_email());

DROP POLICY IF EXISTS "Agency reads own clients" ON public.clients;
CREATE POLICY "Agency reads own clients" ON public.clients FOR SELECT TO authenticated
  USING (lower(coalesce(agency_email,'')) = public.jwt_email());

DROP POLICY IF EXISTS "Agency adds own clients" ON public.clients;
CREATE POLICY "Agency adds own clients" ON public.clients FOR INSERT TO authenticated
  WITH CHECK (lower(coalesce(agency_email,'')) = public.jwt_email());

DROP POLICY IF EXISTS "Agency updates own clients" ON public.clients;
CREATE POLICY "Agency updates own clients" ON public.clients FOR UPDATE TO authenticated
  USING (lower(coalesce(agency_email,'')) = public.jwt_email()) WITH CHECK (lower(coalesce(agency_email,'')) = public.jwt_email());

CREATE INDEX IF NOT EXISTS clients_contact_email_idx ON public.clients (lower(contact_email));
CREATE INDEX IF NOT EXISTS clients_agency_email_idx ON public.clients (lower(agency_email));

DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Create public.requirements Table
CREATE TABLE IF NOT EXISTS public.requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  req_type text NOT NULL DEFAULT 'Website' CHECK (req_type IN ('Website','SaaS','ERP','Automation','SEO','Other')),
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Urgent')),
  status text NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted','In Review','Clarification Needed','Approved','In Progress','Delivered','Closed','Rejected')),
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  budget_range text,
  estimated_value numeric,
  target_date date,
  submitted_by_email text NOT NULL,
  assigned_to_email text,
  agency_email text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.requirements TO authenticated;
GRANT ALL ON public.requirements TO service_role;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage requirements" ON public.requirements;
CREATE POLICY "Admins manage requirements" ON public.requirements FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Submitters read own requirements" ON public.requirements;
CREATE POLICY "Submitters read own requirements" ON public.requirements FOR SELECT TO authenticated
  USING (lower(submitted_by_email) = public.jwt_email()
      OR lower(coalesce(assigned_to_email,'')) = public.jwt_email()
      OR lower(coalesce(agency_email,'')) = public.jwt_email()
      OR client_id IN (SELECT id FROM public.clients WHERE lower(contact_email) = public.jwt_email()));

DROP POLICY IF EXISTS "Clients and agencies create requirements" ON public.requirements;
CREATE POLICY "Clients and agencies create requirements" ON public.requirements FOR INSERT TO authenticated
  WITH CHECK (lower(submitted_by_email) = public.jwt_email());

DROP POLICY IF EXISTS "Submitters update own requirements" ON public.requirements;
CREATE POLICY "Submitters update own requirements" ON public.requirements FOR UPDATE TO authenticated
  USING (lower(submitted_by_email) = public.jwt_email() OR lower(coalesce(agency_email,'')) = public.jwt_email())
  WITH CHECK (lower(submitted_by_email) = public.jwt_email() OR lower(coalesce(agency_email,'')) = public.jwt_email());

DROP POLICY IF EXISTS "Assignees update their requirements" ON public.requirements;
CREATE POLICY "Assignees update their requirements" ON public.requirements FOR UPDATE TO authenticated
  USING (lower(coalesce(assigned_to_email,'')) = public.jwt_email())
  WITH CHECK (lower(coalesce(assigned_to_email,'')) = public.jwt_email());

CREATE INDEX IF NOT EXISTS requirements_client_idx ON public.requirements (client_id);
CREATE INDEX IF NOT EXISTS requirements_status_idx ON public.requirements (status);
CREATE INDEX IF NOT EXISTS requirements_assignee_idx ON public.requirements (lower(assigned_to_email));

DROP TRIGGER IF EXISTS set_requirements_updated_at ON public.requirements;
CREATE TRIGGER set_requirements_updated_at BEFORE UPDATE ON public.requirements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Create public.requirement_messages Table
CREATE TABLE IF NOT EXISTS public.requirement_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id uuid NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  sender_role text NOT NULL DEFAULT 'client',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.requirement_messages TO authenticated;
GRANT ALL ON public.requirement_messages TO service_role;
ALTER TABLE public.requirement_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage requirement messages" ON public.requirement_messages;
CREATE POLICY "Admins manage requirement messages" ON public.requirement_messages FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Participants read requirement messages" ON public.requirement_messages;
CREATE POLICY "Participants read requirement messages" ON public.requirement_messages FOR SELECT TO authenticated
  USING (requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));

DROP POLICY IF EXISTS "Participants write requirement messages" ON public.requirement_messages;
CREATE POLICY "Participants write requirement messages" ON public.requirement_messages FOR INSERT TO authenticated
  WITH CHECK (lower(sender_email) = public.jwt_email() AND requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));

CREATE INDEX IF NOT EXISTS requirement_messages_req_idx ON public.requirement_messages (requirement_id, created_at);

-- 6. Create public.requirement_events Table
CREATE TABLE IF NOT EXISTS public.requirement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id uuid NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  actor_email text NOT NULL,
  event_type text NOT NULL,
  from_value text,
  to_value text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.requirement_events TO authenticated;
GRANT ALL ON public.requirement_events TO service_role;
ALTER TABLE public.requirement_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage requirement events" ON public.requirement_events;
CREATE POLICY "Admins manage requirement events" ON public.requirement_events FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Participants read requirement events" ON public.requirement_events;
CREATE POLICY "Participants read requirement events" ON public.requirement_events FOR SELECT TO authenticated
  USING (requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));

DROP POLICY IF EXISTS "Participants write requirement events" ON public.requirement_events;
CREATE POLICY "Participants write requirement events" ON public.requirement_events FOR INSERT TO authenticated
  WITH CHECK (lower(actor_email) = public.jwt_email());

CREATE INDEX IF NOT EXISTS requirement_events_req_idx ON public.requirement_events (requirement_id, created_at DESC);

-- 7. Pipeline Summary Helper Function
CREATE OR REPLACE FUNCTION public.requirement_pipeline_summary()
RETURNS TABLE (status text, requirement_count bigint, total_value numeric, avg_progress numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.status, count(*)::bigint, coalesce(sum(r.estimated_value), 0), coalesce(round(avg(r.progress), 1), 0)
  FROM public.requirements r GROUP BY r.status;
$$;
GRANT EXECUTE ON FUNCTION public.requirement_pipeline_summary() TO authenticated, service_role;

-- 8. Explicitly reload PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
