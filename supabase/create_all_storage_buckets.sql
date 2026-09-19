-- ============================================================================
-- SIDDHI DYNAMICS: Comprehensive Storage Buckets & Policies Setup
-- ============================================================================
-- Execute this script in your Supabase Dashboard -> SQL Editor -> Run
-- This sets up dedicated buckets for:
-- 1. 'media'              -> Images, logos, banners, branding assets (PNG, JPG, WEBP, SVG, GIF)
-- 2. 'client-documents'  -> Client proposals, contracts, briefs, agreements, deliverables (PDF, DOCX, XLSX, etc.)
-- 3. 'project-attachments'-> Project submissions and RFP uploads
-- 4. 'career-resumes'     -> Candidate job/internship applications
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 'media' BUCKET (Public: logos, banners, brand assets, photos)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  26214400, -- 25MB per file
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
    'video/mp4'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 26214400,
    allowed_mime_types = ARRAY[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'video/mp4'
    ];

DROP POLICY IF EXISTS "Public media view access" ON storage.objects;
CREATE POLICY "Public media view access"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow uploads to media bucket" ON storage.objects;
CREATE POLICY "Allow uploads to media bucket"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow update media bucket" ON storage.objects;
CREATE POLICY "Allow update media bucket"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Allow delete media bucket" ON storage.objects;
CREATE POLICY "Allow delete media bucket"
ON storage.objects FOR DELETE TO anon, authenticated
USING (bucket_id = 'media');

-- ----------------------------------------------------------------------------
-- 2. 'client-documents' BUCKET (Client contracts, proposals, invoices, briefs)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-documents',
  'client-documents',
  true,
  52428800, -- 50MB per file
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 52428800;

DROP POLICY IF EXISTS "Public client-documents view access" ON storage.objects;
CREATE POLICY "Public client-documents view access"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'client-documents');

DROP POLICY IF EXISTS "Allow uploads to client-documents" ON storage.objects;
CREATE POLICY "Allow uploads to client-documents"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'client-documents');

DROP POLICY IF EXISTS "Allow update client-documents" ON storage.objects;
CREATE POLICY "Allow update client-documents"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id = 'client-documents');

DROP POLICY IF EXISTS "Allow delete client-documents" ON storage.objects;
CREATE POLICY "Allow delete client-documents"
ON storage.objects FOR DELETE TO anon, authenticated
USING (bucket_id = 'client-documents');

-- ----------------------------------------------------------------------------
-- 3. 'project-attachments' BUCKET (Customer inquiry attachments)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-attachments',
  'project-attachments',
  true,
  26214400,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'text/plain',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 26214400;

DROP POLICY IF EXISTS "Allow reading project attachments" ON storage.objects;
CREATE POLICY "Allow reading project attachments"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'project-attachments');

DROP POLICY IF EXISTS "Public project attachment uploads" ON storage.objects;
CREATE POLICY "Public project attachment uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'project-attachments');

-- ----------------------------------------------------------------------------
-- 4. 'career-resumes' BUCKET (Candidate Resumes & CVs)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'career-resumes',
  'career-resumes',
  true,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760;

DROP POLICY IF EXISTS "Public candidate resume uploads" ON storage.objects;
CREATE POLICY "Public candidate resume uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'career-resumes');

DROP POLICY IF EXISTS "Allow reading candidate resumes" ON storage.objects;
CREATE POLICY "Allow reading candidate resumes"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'career-resumes');

-- ----------------------------------------------------------------------------
-- 5. 'admin-assets' BUCKET (Payment QRs, deliverable attachments, brand stamps)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'admin-assets',
  'admin-assets',
  true,
  26214400, -- 25MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 26214400;

DROP POLICY IF EXISTS "Public view admin-assets" ON storage.objects;
CREATE POLICY "Public view admin-assets"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'admin-assets');

DROP POLICY IF EXISTS "Allow admin upload to admin-assets" ON storage.objects;
CREATE POLICY "Allow admin upload to admin-assets"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'admin-assets');

DROP POLICY IF EXISTS "Allow admin update admin-assets" ON storage.objects;
CREATE POLICY "Allow admin update admin-assets"
ON storage.objects FOR UPDATE TO anon, authenticated
USING (bucket_id = 'admin-assets');

DROP POLICY IF EXISTS "Allow admin delete admin-assets" ON storage.objects;
CREATE POLICY "Allow admin delete admin-assets"
ON storage.objects FOR DELETE TO anon, authenticated
USING (bucket_id = 'admin-assets');

