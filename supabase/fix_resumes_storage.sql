-- ============================================================================
-- SIDDHI DYNAMICS: Fix Resume Storage Bucket & Project Attachments
-- ============================================================================
-- Execute this entire script in your Supabase Dashboard -> SQL Editor -> Run
-- This solves: {"statusCode":"404","error":"Bucket not found","message":"Bucket not found","code":"NoSuchBucket"}
-- ============================================================================

-- 1. Create the dedicated 'career-resumes' public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'career-resumes',
  'career-resumes',
  true,
  10485760, -- 10MB limit per resume
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png', 'image/webp'
    ];

-- 2. Ensure 'project-attachments' bucket is also public so previously uploaded resumes open seamlessly
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-attachments',
  'project-attachments',
  true,
  10485760,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp', 'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 10485760;

-- 3. Storage Policies for 'career-resumes'
DROP POLICY IF EXISTS "Public candidate resume uploads" ON storage.objects;
CREATE POLICY "Public candidate resume uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'career-resumes'
);

DROP POLICY IF EXISTS "Allow reading candidate resumes" ON storage.objects;
CREATE POLICY "Allow reading candidate resumes"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'career-resumes');

-- 4. Storage Policies for 'project-attachments'
DROP POLICY IF EXISTS "Public project attachment uploads" ON storage.objects;
CREATE POLICY "Public project attachment uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'project-attachments'
);

DROP POLICY IF EXISTS "Allow reading project attachments" ON storage.objects;
CREATE POLICY "Allow reading project attachments"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'project-attachments');

-- 5. Ensure career_applications table has RLS policies for reading and writing
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'career_applications') THEN
    ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow anon insert to career_applications" ON public.career_applications;
    CREATE POLICY "Allow anon insert to career_applications"
    ON public.career_applications FOR INSERT TO anon, authenticated
    WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow reading career_applications" ON public.career_applications;
    CREATE POLICY "Allow reading career_applications"
    ON public.career_applications FOR SELECT TO anon, authenticated
    USING (true);

    DROP POLICY IF EXISTS "Allow updating career_applications" ON public.career_applications;
    CREATE POLICY "Allow updating career_applications"
    ON public.career_applications FOR UPDATE TO anon, authenticated
    USING (true);

    DROP POLICY IF EXISTS "Allow deleting career_applications" ON public.career_applications;
    CREATE POLICY "Allow deleting career_applications"
    ON public.career_applications FOR DELETE TO anon, authenticated
    USING (true);
  END IF;
END $$;
