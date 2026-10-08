-- PrintFlow launch waitlist submissions from Sharan Navaratri ad CTA.

CREATE TABLE IF NOT EXISTS public.printflow_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'print_shop_owner', 'other')),
  custom_role TEXT,
  product_name TEXT NOT NULL DEFAULT 'PrintFlow',
  launch_status TEXT NOT NULL DEFAULT 'LAUNCHING_SOON' CHECK (launch_status IN ('LAUNCHING_SOON', 'INVITED', 'CONTACTED', 'CONVERTED', 'ARCHIVED')),
  consent_to_share BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'sharan_navaratri_ad',
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT printflow_waitlist_consent_required CHECK (consent_to_share IS TRUE),
  CONSTRAINT printflow_waitlist_other_role_required CHECK (role <> 'other' OR NULLIF(BTRIM(custom_role), '') IS NOT NULL),
  CONSTRAINT printflow_waitlist_whatsapp_digits CHECK (whatsapp_number ~ '^[0-9]{10,15}$'),
  CONSTRAINT printflow_waitlist_email_format CHECK (email IS NULL OR email ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_printflow_waitlist_created_at ON public.printflow_waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_printflow_waitlist_role ON public.printflow_waitlist(role);
CREATE INDEX IF NOT EXISTS idx_printflow_waitlist_launch_status ON public.printflow_waitlist(launch_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_printflow_waitlist_whatsapp_unique ON public.printflow_waitlist(whatsapp_number);

ALTER TABLE public.printflow_waitlist ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.printflow_waitlist TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.printflow_waitlist TO authenticated;
GRANT ALL ON public.printflow_waitlist TO service_role;

DROP POLICY IF EXISTS "Public can join PrintFlow waitlist" ON public.printflow_waitlist;
CREATE POLICY "Public can join PrintFlow waitlist"
ON public.printflow_waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (consent_to_share IS TRUE);

DROP POLICY IF EXISTS "Admins manage PrintFlow waitlist" ON public.printflow_waitlist;
CREATE POLICY "Admins manage PrintFlow waitlist"
ON public.printflow_waitlist
FOR ALL
TO authenticated
USING (public.is_portal_admin())
WITH CHECK (public.is_portal_admin());

DROP TRIGGER IF EXISTS printflow_waitlist_set_updated_at ON public.printflow_waitlist;
CREATE TRIGGER printflow_waitlist_set_updated_at
  BEFORE UPDATE ON public.printflow_waitlist
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.printflow_waitlist IS 'Launch waitlist for PrintFlow, a Siddhi Dynamics LLP product, collected from Sharan Navaratri ad CTA.';
COMMENT ON COLUMN public.printflow_waitlist.launch_status IS 'PrintFlow waitlist pipeline status. New public submissions default to LAUNCHING_SOON.';
