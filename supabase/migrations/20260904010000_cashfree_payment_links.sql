CREATE TABLE public.cashfree_payment_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
  invoice_id text NOT NULL,
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  cashfree_link_id text NOT NULL UNIQUE,
  link_url text NOT NULL,
  cashfree_status text NOT NULL DEFAULT 'ACTIVE',
  paid_at timestamptz,
  expires_at timestamptz,
  webhook_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cashfree_payment_links_submission_invoice_idx ON public.cashfree_payment_links (submission_id, invoice_id, created_at DESC);
ALTER TABLE public.cashfree_payment_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own Cashfree payment links" ON public.cashfree_payment_links FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.contact_submissions AS submission WHERE submission.id = cashfree_payment_links.submission_id AND lower(submission.email) = public.jwt_email()));
CREATE POLICY "Admins can manage Cashfree payment links" ON public.cashfree_payment_links FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));
GRANT SELECT ON public.cashfree_payment_links TO authenticated;
