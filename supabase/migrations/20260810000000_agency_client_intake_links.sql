-- One-time public intake links. The token is the only credential exposed in
-- the URL; all reading and submission is performed through the Edge Function.
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
  progress integer NOT NULL DEFAULT 0,
  intake_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agency_clients ADD COLUMN IF NOT EXISTS intake_data jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.agency_clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Agency owners can view their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can view their clients" ON public.agency_clients FOR SELECT TO authenticated USING (lower((select auth.jwt() ->> 'email')) = lower(agency_email));
DROP POLICY IF EXISTS "Agency owners can add their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can add their clients" ON public.agency_clients FOR INSERT TO authenticated WITH CHECK (lower((select auth.jwt() ->> 'email')) = lower(agency_email));
DROP POLICY IF EXISTS "Agency owners can update their clients" ON public.agency_clients;
CREATE POLICY "Agency owners can update their clients" ON public.agency_clients FOR UPDATE TO authenticated USING (lower((select auth.jwt() ->> 'email')) = lower(agency_email)) WITH CHECK (lower((select auth.jwt() ->> 'email')) = lower(agency_email));

CREATE TABLE public.agency_client_intake_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  agency_email text NOT NULL,
  agency_name text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  client_id text REFERENCES public.agency_clients(id) ON DELETE SET NULL
);

CREATE INDEX agency_client_intake_links_token_idx ON public.agency_client_intake_links (token);
ALTER TABLE public.agency_client_intake_links ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.agency_client_intake_links FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_agency_client_intake_link(p_token text, p_payload jsonb)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  v_link public.agency_client_intake_links%ROWTYPE;
  v_client_id text := 'client-' || replace(gen_random_uuid()::text, '-', '');
BEGIN
  SELECT * INTO v_link FROM public.agency_client_intake_links WHERE token = p_token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'This intake link is invalid.' USING ERRCODE = 'P0001'; END IF;
  IF v_link.submitted_at IS NOT NULL THEN RAISE EXCEPTION 'This intake link has already been submitted.' USING ERRCODE = 'P0001'; END IF;

  INSERT INTO public.agency_clients (id, agency_email, business_name, brand_name, category, description, website, contact_name, mobile, whatsapp, email, address, services, payment_strategy, status, progress, intake_data)
  VALUES (v_client_id, v_link.agency_email, trim(p_payload->>'businessName'), COALESCE(NULLIF(trim(p_payload->>'brandName'), ''), trim(p_payload->>'businessName')), COALESCE(NULLIF(trim(p_payload->>'category'), ''), 'General Business'), COALESCE(p_payload->>'description', ''), COALESCE(p_payload->>'website', ''), trim(p_payload->>'contactName'), trim(p_payload->>'mobile'), COALESCE(p_payload->>'whatsapp', ''), COALESCE(p_payload->>'email', ''), COALESCE(p_payload->>'address', ''), COALESCE(p_payload->'services', '[]'::jsonb), 'Custom Agreement', 'Onboarding & Audit', 0, p_payload);

  INSERT INTO public.contact_submissions (name, email, organization, designation, inquiry_type, message, status, progress, bounty_reward)
  VALUES (trim(p_payload->>'contactName'), COALESCE(NULLIF(lower(trim(p_payload->>'email')), ''), v_link.agency_email), trim(p_payload->>'businessName') || ' (' || v_link.agency_name || ' Client)', 'Agency Client (shared intake)', 'requirement', '[Submitted through a secure agency intake link]' || E'\n[Agency Partner: ' || v_link.agency_name || ' (' || v_link.agency_email || ')]' || E'\n[Services Availed: ' || array_to_string(ARRAY(SELECT jsonb_array_elements_text(COALESCE(p_payload->'services', '[]'::jsonb))), ', ') || ']' || E'\n' || COALESCE(p_payload->>'description', ''), 'New Request', 0, jsonb_build_object('agency_email', v_link.agency_email, 'agency_name', v_link.agency_name, 'client_id', v_client_id)::text);

  UPDATE public.agency_client_intake_links SET submitted_at = now(), client_id = v_client_id WHERE id = v_link.id;
  RETURN v_client_id;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_agency_client_intake_link(text, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_agency_client_intake_link(text, jsonb) TO service_role;
