-- Service progress and deliverables columns on contact_submissions
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS service_progress int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deliverables jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS service_agreement_url text,
  ADD COLUMN IF NOT EXISTS admin_notes text;

-- Manual / admin-created invoices table
CREATE TABLE IF NOT EXISTS public.admin_manual_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL,
  invoice_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  -- link to either a submission or an agency client
  submission_id uuid REFERENCES public.contact_submissions(id) ON DELETE SET NULL,
  agency_client_id text REFERENCES public.agency_clients(id) ON DELETE SET NULL,
  -- billing party
  billed_to_name text NOT NULL,
  billed_to_email text NOT NULL,
  billed_to_org text,
  billed_to_address text,
  -- line items as JSON array [{description, qty, rate, amount}]
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  tax_pct numeric(5,2) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'INR',
  notes text,
  status text DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','cancelled')),
  created_by text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_manual_invoices ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_manual_invoices FROM anon, authenticated;
GRANT ALL ON public.admin_manual_invoices TO service_role;

-- Allow admins via service_role, clients read their own via their email
DROP POLICY IF EXISTS "Client can read their own invoices" ON public.admin_manual_invoices;
CREATE POLICY "Client can read their own invoices"
  ON public.admin_manual_invoices
  FOR SELECT TO authenticated
  USING (lower(billed_to_email) = lower((SELECT auth.jwt() ->> 'email')));
