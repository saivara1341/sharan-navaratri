-- Restores the column expected by the current project-requirement form and
-- stores attachment metadata alongside each private submission.
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS attachments jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Some older database installations predate the portal migration that first
-- introduced this helper. Define it here as well so this migration can run
-- independently and keep attachment reads restricted to the portal admin.
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), '')) = 'ssaivaraprasad51@gmail.com';
$$;

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
