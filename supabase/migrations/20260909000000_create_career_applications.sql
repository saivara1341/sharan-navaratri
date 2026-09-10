-- ==============================================================================
-- Migration: Create career_applications table
-- Description: Dedicated table for storing internship and career registrations
-- from the Siddhi Dynamics Careers portal with full RLS and indexing.
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    degree TEXT NOT NULL,
    graduation_year TEXT NOT NULL DEFAULT '2026',
    role TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '6 Months',
    linkedin TEXT,
    portfolio_or_social TEXT,
    statement_of_purpose TEXT NOT NULL,
    resume_url TEXT,
    status TEXT NOT NULL DEFAULT 'Received',
    interview_details JSONB DEFAULT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- 3. Grants
GRANT ALL ON public.career_applications TO postgres, service_role;
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.career_applications TO authenticated;

-- 4. Policies
-- Allow anyone (visitors/candidates) to submit an internship/career registration
DROP POLICY IF EXISTS "Allow public insert of career_applications" ON public.career_applications;
CREATE POLICY "Allow public insert of career_applications"
    ON public.career_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow applicants to view their own application
DROP POLICY IF EXISTS "Applicants can view own career_applications" ON public.career_applications;
CREATE POLICY "Applicants can view own career_applications"
    ON public.career_applications
    FOR SELECT
    TO authenticated
    USING (
        lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
        OR public.is_portal_admin()
    );

-- Allow admins full access
DROP POLICY IF EXISTS "Admins can view all career_applications" ON public.career_applications;
CREATE POLICY "Admins can view all career_applications"
    ON public.career_applications
    FOR SELECT
    TO authenticated
    USING (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can update career_applications" ON public.career_applications;
CREATE POLICY "Admins can update career_applications"
    ON public.career_applications
    FOR UPDATE
    TO authenticated
    USING (public.is_portal_admin())
    WITH CHECK (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can delete career_applications" ON public.career_applications;
CREATE POLICY "Admins can delete career_applications"
    ON public.career_applications
    FOR DELETE
    TO authenticated
    USING (public.is_portal_admin());

-- 5. Auto updated_at Trigger
DROP TRIGGER IF EXISTS tr_career_applications_updated_at ON public.career_applications;
CREATE TRIGGER tr_career_applications_updated_at
    BEFORE UPDATE ON public.career_applications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Indexes for queries & deduplication
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON public.career_applications(lower(email));
CREATE INDEX IF NOT EXISTS idx_career_applications_phone ON public.career_applications(phone);
CREATE INDEX IF NOT EXISTS idx_career_applications_role ON public.career_applications(role);
CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_created_at ON public.career_applications(created_at DESC);

-- 7. Storage Bucket for Candidate Resumes & Supporting Documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'career-resumes',
  'career-resumes',
  true,
  10485760, -- 10MB per file
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png', 'image/webp'
  ]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow candidate file uploads (PDF, DOC, DOCX, Images)
DROP POLICY IF EXISTS "Public candidate resume uploads" ON storage.objects;
CREATE POLICY "Public candidate resume uploads"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'career-resumes'
);

-- Allow reading of candidate resumes by applicants and administrators
DROP POLICY IF EXISTS "Allow reading candidate resumes" ON storage.objects;
CREATE POLICY "Allow reading candidate resumes"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'career-resumes');

