-- Admin Payment Settings
-- Allows admin to configure UPI ID, QR code (stored in admin-assets bucket),
-- and bank details shown in the payment modals.

CREATE TABLE IF NOT EXISTS public.admin_payment_settings (
  id int PRIMARY KEY DEFAULT 1,
  upi_id text NOT NULL DEFAULT 'siddhidynamics@sbi',
  -- Storage path inside the 'admin-assets' bucket, e.g. 'qr/payment-qr.png'
  qr_storage_path text,
  qr_public_url text,           -- cached public URL for fast rendering
  bank_name text DEFAULT 'State Bank of India (SBI)',
  account_holder text DEFAULT 'SIDDHI DYNAMICS PVT LTD',
  account_no text DEFAULT '45170121323',
  ifsc text DEFAULT 'SBIN0020149',
  updated_at timestamptz DEFAULT now()
);

-- Seed with one row of defaults (upsert-safe)
INSERT INTO public.admin_payment_settings (id, upi_id)
VALUES (1, 'siddhidynamics@sbi')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.admin_payment_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated users (clients etc.) can read, only service_role can write
DROP POLICY IF EXISTS "Anyone authenticated can read payment settings" ON public.admin_payment_settings;
CREATE POLICY "Anyone authenticated can read payment settings"
  ON public.admin_payment_settings
  FOR SELECT
  TO authenticated
  USING (true);

REVOKE INSERT, UPDATE, DELETE ON public.admin_payment_settings FROM anon, authenticated;
GRANT ALL ON public.admin_payment_settings TO service_role;
