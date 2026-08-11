-- ============ helpers ============
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

-- ============ contact_submissions extra columns ============
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New Request',
  ADD COLUMN IF NOT EXISTS progress integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bounty_reward text,
  ADD COLUMN IF NOT EXISTS assigned_to text;

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

GRANT INSERT ON public.project_waitlist TO anon;
GRANT SELECT, INSERT ON public.project_waitlist TO authenticated;
GRANT ALL ON public.project_waitlist TO service_role;

-- ============ chat_messages ============
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  submission_id uuid NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  sender_email text NOT NULL,
  message text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false
);
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin manages chat messages" ON public.chat_messages;
CREATE POLICY "Admin manages chat messages" ON public.chat_messages
  FOR ALL TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
DROP POLICY IF EXISTS "Participants read chat messages" ON public.chat_messages;
CREATE POLICY "Participants read chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (
    lower(sender_email) = public.jwt_email()
    OR submission_id IN (SELECT id FROM public.contact_submissions WHERE lower(email) = public.jwt_email() OR lower(coalesce(assigned_to,'')) = public.jwt_email())
  );
DROP POLICY IF EXISTS "Participants write chat messages" ON public.chat_messages;
CREATE POLICY "Participants write chat messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (
    lower(sender_email) = public.jwt_email()
    AND submission_id IN (SELECT id FROM public.contact_submissions WHERE lower(email) = public.jwt_email() OR lower(coalesce(assigned_to,'')) = public.jwt_email())
  );
CREATE INDEX IF NOT EXISTS idx_chat_messages_submission_id ON public.chat_messages(submission_id);

-- ============ knowledge_base ============
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text,
  file_type text NOT NULL,
  content text NOT NULL,
  embedding vector(768),
  created_at timestamptz DEFAULT now(),
  uploaded_by text DEFAULT 'admin'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_base TO authenticated;
GRANT ALL ON public.knowledge_base TO service_role;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access on knowledge_base" ON public.knowledge_base;
CREATE POLICY "Admin full access on knowledge_base" ON public.knowledge_base
  FOR ALL TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
DROP POLICY IF EXISTS "Authenticated select on knowledge_base" ON public.knowledge_base;
CREATE POLICY "Authenticated select on knowledge_base" ON public.knowledge_base
  FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.match_knowledge_base(query_embedding vector(768), match_threshold float, match_count int)
RETURNS TABLE (id uuid, file_name text, file_type text, content text, similarity float)
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT kb.id, kb.file_name, kb.file_type, kb.content, 1 - (kb.embedding <=> query_embedding)
  FROM public.knowledge_base kb
  WHERE kb.embedding IS NOT NULL AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding LIMIT match_count;
$$;
GRANT EXECUTE ON FUNCTION public.match_knowledge_base(vector, float, int) TO authenticated, service_role;

-- ============ agency tables ============
CREATE TABLE IF NOT EXISTS public.agency_clients (
  id text PRIMARY KEY,
  agency_email text NOT NULL,
  business_name text NOT NULL,
  brand_name text,
  category text,
  description text,
  website text,
  contact_name text NOT NULL,
  mobile text NOT NULL,
  whatsapp text,
  email text,
  address text,
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  payment_strategy text,
  retainer_fee text,
  status text NOT NULL DEFAULT 'Onboarding & Audit',
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  intake_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  tenure_months integer,
  tenure_start_date date,
  geo_score integer NOT NULL DEFAULT 0,
  seo_score integer NOT NULL DEFAULT 0,
  gbp_score integer NOT NULL DEFAULT 0,
  aeo_score integer NOT NULL DEFAULT 0,
  monthly_impressions text,
  monthly_clicks text,
  ctr text,
  ai_citations text,
  admin_quote_assigned boolean NOT NULL DEFAULT false,
  admin_quote_assigned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_clients TO authenticated;
GRANT ALL ON public.agency_clients TO service_role;
ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agency owners can view their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can view their clients" ON public.agency_clients FOR SELECT TO authenticated USING (lower(agency_email) = public.jwt_email());
DROP POLICY IF EXISTS "Agency owners can add their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can add their clients" ON public.agency_clients FOR INSERT TO authenticated WITH CHECK (lower(agency_email) = public.jwt_email());
DROP POLICY IF EXISTS "Agency owners can update their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can update their clients" ON public.agency_clients FOR UPDATE TO authenticated USING (lower(agency_email) = public.jwt_email()) WITH CHECK (lower(agency_email) = public.jwt_email());
DROP POLICY IF EXISTS "Admins can manage agency clients" ON public.agency_clients;
CREATE POLICY "Admins can manage agency clients" ON public.agency_clients FOR ALL TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE INDEX IF NOT EXISTS agency_clients_agency_email_idx ON public.agency_clients (lower(agency_email));
DROP TRIGGER IF EXISTS set_agency_clients_updated_at ON public.agency_clients;
CREATE TRIGGER set_agency_clients_updated_at BEFORE UPDATE ON public.agency_clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.agency_client_intake_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  agency_email text NOT NULL,
  agency_name text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  client_id text REFERENCES public.agency_clients(id) ON DELETE SET NULL
);
GRANT ALL ON public.agency_client_intake_links TO service_role;
ALTER TABLE public.agency_client_intake_links ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.agency_client_intake_links FROM anon, authenticated;
CREATE INDEX IF NOT EXISTS agency_client_intake_links_token_idx ON public.agency_client_intake_links (token);

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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_invoices TO authenticated;
GRANT ALL ON public.agency_invoices TO service_role;
ALTER TABLE public.agency_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agency owners can view invoices" ON public.agency_invoices;
CREATE POLICY "Agency owners can view invoices" ON public.agency_invoices FOR SELECT TO authenticated USING (lower(agency_email) = public.jwt_email());
DROP POLICY IF EXISTS "Admins can manage agency invoices" ON public.agency_invoices;
CREATE POLICY "Admins can manage agency invoices" ON public.agency_invoices FOR ALL TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

CREATE TABLE IF NOT EXISTS public.agency_profiles (
  user_email text PRIMARY KEY,
  agency_name text,
  agency_logo text,
  contact_person text,
  phone text,
  website text,
  facebook text,
  instagram text,
  linkedin text,
  youtube text,
  custom_socials jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.agency_profiles TO authenticated;
GRANT ALL ON public.agency_profiles TO service_role;
ALTER TABLE public.agency_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners manage their agency profile" ON public.agency_profiles;
CREATE POLICY "Owners manage their agency profile" ON public.agency_profiles FOR ALL TO authenticated USING (lower(user_email) = public.jwt_email() OR (select public.is_portal_admin())) WITH CHECK (lower(user_email) = public.jwt_email() OR (select public.is_portal_admin()));

-- ============ portal_users ============
CREATE TABLE IF NOT EXISTS public.portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL UNIQUE,
  name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client','partner','investor','employee','admin')),
  organization text,
  designation text,
  phone text,
  quote text,
  notes text,
  confirmed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_users TO authenticated;
GRANT ALL ON public.portal_users TO service_role;
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own portal profile" ON public.portal_users;
CREATE POLICY "Users can read own portal profile" ON public.portal_users FOR SELECT TO authenticated USING (lower(email) = public.jwt_email());
DROP POLICY IF EXISTS "Admins can manage portal users" ON public.portal_users;
CREATE POLICY "Admins can manage portal users" ON public.portal_users FOR ALL TO authenticated USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

CREATE OR REPLACE FUNCTION public.sync_portal_user_from_auth()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth AS $$
BEGIN
  INSERT INTO public.portal_users (auth_user_id, email, name, role, organization, designation, confirmed)
  VALUES (NEW.id, lower(NEW.email), coalesce(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
          CASE WHEN coalesce(NEW.raw_user_meta_data ->> 'role','client') IN ('client','partner','investor','employee','admin')
               THEN coalesce(NEW.raw_user_meta_data ->> 'role','client') ELSE 'client' END,
          NEW.raw_user_meta_data ->> 'organization', NEW.raw_user_meta_data ->> 'designation', NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (email) DO UPDATE SET auth_user_id = EXCLUDED.auth_user_id, updated_at = now();
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS sync_portal_user_from_auth ON auth.users;
CREATE TRIGGER sync_portal_user_from_auth AFTER INSERT OR UPDATE OF email, raw_user_meta_data, email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_portal_user_from_auth();

-- ============ project_likes ============
CREATE TABLE IF NOT EXISTS public.project_likes (
  project_id text PRIMARY KEY,
  likes_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.project_likes TO anon, authenticated;
GRANT ALL ON public.project_likes TO service_role;
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read likes" ON public.project_likes;
CREATE POLICY "Anyone can read likes" ON public.project_likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can add likes" ON public.project_likes;
CREATE POLICY "Anyone can add likes" ON public.project_likes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update likes" ON public.project_likes;
CREATE POLICY "Anyone can update likes" ON public.project_likes FOR UPDATE USING (true) WITH CHECK (true);

-- ============ NEW MODULE: clients & requirements ============
CREATE TABLE public.clients (
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
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Clients read own record" ON public.clients FOR SELECT TO authenticated
  USING (lower(contact_email) = public.jwt_email());
CREATE POLICY "Agency reads own clients" ON public.clients FOR SELECT TO authenticated
  USING (lower(coalesce(agency_email,'')) = public.jwt_email());
CREATE POLICY "Agency adds own clients" ON public.clients FOR INSERT TO authenticated
  WITH CHECK (lower(coalesce(agency_email,'')) = public.jwt_email());
CREATE POLICY "Agency updates own clients" ON public.clients FOR UPDATE TO authenticated
  USING (lower(coalesce(agency_email,'')) = public.jwt_email()) WITH CHECK (lower(coalesce(agency_email,'')) = public.jwt_email());
CREATE INDEX clients_contact_email_idx ON public.clients (lower(contact_email));
CREATE INDEX clients_agency_email_idx ON public.clients (lower(agency_email));
CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.requirements (
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
CREATE POLICY "Admins manage requirements" ON public.requirements FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Submitters read own requirements" ON public.requirements FOR SELECT TO authenticated
  USING (lower(submitted_by_email) = public.jwt_email()
      OR lower(coalesce(assigned_to_email,'')) = public.jwt_email()
      OR lower(coalesce(agency_email,'')) = public.jwt_email()
      OR client_id IN (SELECT id FROM public.clients WHERE lower(contact_email) = public.jwt_email()));
CREATE POLICY "Clients and agencies create requirements" ON public.requirements FOR INSERT TO authenticated
  WITH CHECK (lower(submitted_by_email) = public.jwt_email());
CREATE POLICY "Submitters update own requirements" ON public.requirements FOR UPDATE TO authenticated
  USING (lower(submitted_by_email) = public.jwt_email() OR lower(coalesce(agency_email,'')) = public.jwt_email())
  WITH CHECK (lower(submitted_by_email) = public.jwt_email() OR lower(coalesce(agency_email,'')) = public.jwt_email());
CREATE POLICY "Assignees update their requirements" ON public.requirements FOR UPDATE TO authenticated
  USING (lower(coalesce(assigned_to_email,'')) = public.jwt_email())
  WITH CHECK (lower(coalesce(assigned_to_email,'')) = public.jwt_email());
CREATE INDEX requirements_client_idx ON public.requirements (client_id);
CREATE INDEX requirements_status_idx ON public.requirements (status);
CREATE INDEX requirements_assignee_idx ON public.requirements (lower(assigned_to_email));
CREATE TRIGGER set_requirements_updated_at BEFORE UPDATE ON public.requirements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.requirement_messages (
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
CREATE POLICY "Admins manage requirement messages" ON public.requirement_messages FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Participants read requirement messages" ON public.requirement_messages FOR SELECT TO authenticated
  USING (requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));
CREATE POLICY "Participants write requirement messages" ON public.requirement_messages FOR INSERT TO authenticated
  WITH CHECK (lower(sender_email) = public.jwt_email() AND requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));
CREATE INDEX requirement_messages_req_idx ON public.requirement_messages (requirement_id, created_at);

CREATE TABLE public.requirement_events (
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
CREATE POLICY "Admins manage requirement events" ON public.requirement_events FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Participants read requirement events" ON public.requirement_events FOR SELECT TO authenticated
  USING (requirement_id IN (
    SELECT r.id FROM public.requirements r LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = public.jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = public.jwt_email()
       OR lower(coalesce(r.agency_email,'')) = public.jwt_email()
       OR lower(coalesce(c.contact_email,'')) = public.jwt_email()));
CREATE POLICY "Participants write requirement events" ON public.requirement_events FOR INSERT TO authenticated
  WITH CHECK (lower(actor_email) = public.jwt_email());
CREATE INDEX requirement_events_req_idx ON public.requirement_events (requirement_id, created_at DESC);

-- Investor rollup: aggregates only, no client identities
CREATE OR REPLACE FUNCTION public.requirement_pipeline_summary()
RETURNS TABLE (status text, requirement_count bigint, total_value numeric, avg_progress numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.status, count(*)::bigint, coalesce(sum(r.estimated_value), 0), coalesce(round(avg(r.progress), 1), 0)
  FROM public.requirements r GROUP BY r.status;
$$;
GRANT EXECUTE ON FUNCTION public.requirement_pipeline_summary() TO authenticated, service_role;