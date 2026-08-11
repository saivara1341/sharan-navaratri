-- Client Operations Hub: organisation-scoped records for onboarding, agreements,
-- billing and project delivery. Apply through the Supabase migration workflow.

CREATE TABLE IF NOT EXISTS public.organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL,
  display_name text NOT NULL,
  billing_email text,
  phone text,
  tax_id text,
  onboarding_status text NOT NULL DEFAULT 'invited'
    CHECK (onboarding_status IN ('invited', 'in_progress', 'awaiting_review', 'complete', 'blocked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organisation_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('client_owner', 'client_contributor', 'account_manager', 'project_manager', 'finance_manager', 'delivery_member', 'partner')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, user_id)
);
CREATE INDEX IF NOT EXISTS organisation_memberships_user_org_idx
  ON public.organisation_memberships (user_id, organisation_id);

CREATE TABLE IF NOT EXISTS public.client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned', 'active', 'at_risk', 'on_hold', 'completed', 'cancelled')),
  project_manager_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  starts_on date,
  target_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS client_projects_organisation_status_idx
  ON public.client_projects (organisation_id, status, target_date);

CREATE TABLE IF NOT EXISTS public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  project_id uuid REFERENCES public.client_projects(id) ON DELETE SET NULL,
  service_key text NOT NULL,
  title text NOT NULL,
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'submitted', 'discovery', 'scoped', 'revision_requested', 'approved', 'declined')),
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS service_requests_organisation_status_idx
  ON public.service_requests (organisation_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  project_id uuid REFERENCES public.client_projects(id) ON DELETE SET NULL,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'viewed', 'revision_requested', 'signed', 'expired', 'void')),
  expires_at timestamptz,
  signed_at timestamptz,
  document_path text,
  document_sha256 text,
  provider_envelope_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, project_id, version)
);
CREATE INDEX IF NOT EXISTS agreements_organisation_status_idx
  ON public.agreements (organisation_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  project_id uuid REFERENCES public.client_projects(id) ON DELETE SET NULL,
  invoice_number text NOT NULL UNIQUE,
  currency char(3) NOT NULL DEFAULT 'INR',
  subtotal_paise bigint NOT NULL CHECK (subtotal_paise >= 0),
  tax_paise bigint NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
  discount_paise bigint NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  total_paise bigint NOT NULL CHECK (total_paise >= 0),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'void', 'refunded')),
  issued_on date,
  due_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invoices_organisation_status_due_idx
  ON public.invoices (organisation_id, status, due_on);

CREATE TABLE IF NOT EXISTS public.payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  currency char(3) NOT NULL DEFAULT 'INR',
  method text NOT NULL CHECK (method IN ('upi', 'bank_transfer', 'payment_link', 'cash', 'cheque')),
  reference text,
  proof_path text,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'under_review', 'reconciled', 'rejected', 'refunded')),
  submitted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  reconciled_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reconciled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payment_submissions_organisation_status_idx
  ON public.payment_submissions (organisation_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_submissions_invoice_idx
  ON public.payment_submissions (invoice_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  project_id uuid REFERENCES public.client_projects(id) ON DELETE SET NULL,
  subject_type text NOT NULL CHECK (subject_type IN ('scope', 'agreement', 'milestone', 'change_request', 'invoice', 'handover')),
  subject_id uuid NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested', 'expired')),
  due_at timestamptz,
  responded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  responded_at timestamptz,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS approval_requests_organisation_status_idx
  ON public.approval_requests (organisation_id, status, due_at);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_organisation_created_idx
  ON public.audit_events (organisation_id, created_at DESC);

ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- This narrowly scoped helper avoids recursive RLS when a member lists the
-- people in their organisation. It exposes only a boolean about the caller's
-- own membership; direct table access remains governed by the policies below.
CREATE OR REPLACE FUNCTION public.is_organisation_member(target_organisation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organisation_memberships AS membership
    WHERE membership.organisation_id = target_organisation_id
      AND membership.user_id = (select auth.uid())
  );
$$;
REVOKE ALL ON FUNCTION public.is_organisation_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_organisation_member(uuid) TO authenticated;

-- Membership grants client isolation. Admin access is handled by the existing
-- is_portal_admin() function; invites, membership changes and reconciliation
-- must run in a trusted server-side function.
CREATE POLICY "Members can view their organisations" ON public.organisations FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(organisations.id)));
CREATE POLICY "Members can view memberships in their organisations" ON public.organisation_memberships FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(organisation_memberships.organisation_id)));

CREATE POLICY "Members can view organisation projects" ON public.client_projects FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(client_projects.organisation_id)));
CREATE POLICY "Members can view organisation service requests" ON public.service_requests FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(service_requests.organisation_id)));
CREATE POLICY "Members can create service requests" ON public.service_requests FOR INSERT TO authenticated
  WITH CHECK (submitted_by = (select auth.uid()) AND (select public.is_organisation_member(service_requests.organisation_id)));
CREATE POLICY "Request authors can revise their requests" ON public.service_requests FOR UPDATE TO authenticated
  USING (submitted_by = (select auth.uid()) AND (select public.is_organisation_member(service_requests.organisation_id)))
  WITH CHECK (submitted_by = (select auth.uid()) AND (select public.is_organisation_member(service_requests.organisation_id)));
CREATE POLICY "Members can view organisation agreements" ON public.agreements FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(agreements.organisation_id)));
CREATE POLICY "Members can view organisation invoices" ON public.invoices FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(invoices.organisation_id)));
CREATE POLICY "Members can view organisation payments" ON public.payment_submissions FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(payment_submissions.organisation_id)));
CREATE POLICY "Members can submit their organisation payments" ON public.payment_submissions FOR INSERT TO authenticated
  WITH CHECK (submitted_by = (select auth.uid()) AND (select public.is_organisation_member(payment_submissions.organisation_id)));
CREATE POLICY "Members can view organisation approvals" ON public.approval_requests FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(approval_requests.organisation_id)));
CREATE POLICY "Members can view organisation audit events" ON public.audit_events FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()) OR (select public.is_organisation_member(audit_events.organisation_id)));

-- Only trusted operations staff can mutate operational records. This prevents
-- a client from self-approving an agreement or marking an invoice paid.
CREATE POLICY "Admins manage organisations" ON public.organisations FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage memberships" ON public.organisation_memberships FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage projects" ON public.client_projects FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage service requests" ON public.service_requests FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage agreements" ON public.agreements FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage payments" ON public.payment_submissions FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage approvals" ON public.approval_requests FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
CREATE POLICY "Admins manage audit events" ON public.audit_events FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

GRANT SELECT ON public.organisations, public.organisation_memberships, public.client_projects,
  public.service_requests, public.agreements, public.invoices, public.payment_submissions,
  public.approval_requests, public.audit_events TO authenticated;
GRANT INSERT, UPDATE ON public.service_requests TO authenticated;
GRANT INSERT ON public.payment_submissions TO authenticated;
-- RLS remains the authorisation layer for these grants: only platform admins
-- match the management policies, while ordinary members remain read-only.
GRANT INSERT, UPDATE, DELETE ON public.organisations, public.organisation_memberships,
  public.client_projects, public.agreements, public.invoices, public.payment_submissions,
  public.approval_requests, public.audit_events TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
