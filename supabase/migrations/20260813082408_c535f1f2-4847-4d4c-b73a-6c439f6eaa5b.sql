
CREATE TABLE IF NOT EXISTS public.dpdp_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  request_type text NOT NULL CHECK (request_type IN ('access','correction','erasure','nomination','withdraw_consent','grievance')),
  details text NOT NULL CHECK (char_length(details) BETWEEN 10 AND 4000),
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','in_review','completed','rejected')),
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.dpdp_requests TO anon;
GRANT INSERT ON public.dpdp_requests TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.dpdp_requests TO authenticated;
GRANT ALL ON public.dpdp_requests TO service_role;

ALTER TABLE public.dpdp_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a data rights request" ON public.dpdp_requests;
CREATE POLICY "Anyone can submit a data rights request"
  ON public.dpdp_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read data rights requests" ON public.dpdp_requests;
CREATE POLICY "Admins can read data rights requests"
  ON public.dpdp_requests FOR SELECT TO authenticated
  USING (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can update data rights requests" ON public.dpdp_requests;
CREATE POLICY "Admins can update data rights requests"
  ON public.dpdp_requests FOR UPDATE TO authenticated
  USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can delete data rights requests" ON public.dpdp_requests;
CREATE POLICY "Admins can delete data rights requests"
  ON public.dpdp_requests FOR DELETE TO authenticated
  USING (public.is_portal_admin());

DROP TRIGGER IF EXISTS dpdp_requests_set_updated_at ON public.dpdp_requests;
CREATE TRIGGER dpdp_requests_set_updated_at
  BEFORE UPDATE ON public.dpdp_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz;

ALTER TABLE public.project_waitlist
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz;
