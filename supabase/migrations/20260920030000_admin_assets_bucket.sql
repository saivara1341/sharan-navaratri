-- Create admin-assets storage bucket for QR codes, docs, and other admin uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-assets',
  'admin-assets',
  true,
  5242880,   -- 5 MB
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Only service_role can upload to admin-assets
DROP POLICY IF EXISTS "Admin service role can manage admin-assets" ON storage.objects;
CREATE POLICY "Admin service role can manage admin-assets"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'admin-assets')
  WITH CHECK (bucket_id = 'admin-assets');

-- Public can read (so QR images render without auth)
DROP POLICY IF EXISTS "Public can read admin-assets" ON storage.objects;
CREATE POLICY "Public can read admin-assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'admin-assets');
