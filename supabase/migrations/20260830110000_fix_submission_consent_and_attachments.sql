-- Restores the column expected by the current project-requirement form and
-- stores attachment metadata alongside each private submission.
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Files are kept private. The application only lets clients upload a small,
-- supported set of files and administrators can read them through the portal.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-attachments',
  'project-attachments',
  false,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public project attachment uploads" ON storage.objects;
CREATE POLICY "Public project attachment uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'project-attachments'
  AND name ~ '^[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}-[A-Za-z0-9._-]+$'
  AND (storage.extension(name)) IN ('pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp', 'gif')
);

DROP POLICY IF EXISTS "Administrators can read project attachments" ON storage.objects;
CREATE POLICY "Administrators can read project attachments"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-attachments' AND public.is_portal_admin());
