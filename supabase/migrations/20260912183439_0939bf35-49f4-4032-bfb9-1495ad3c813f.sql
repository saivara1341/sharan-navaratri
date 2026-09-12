-- 4. Policies
DROP POLICY IF EXISTS "Allow public insert of career_applications" ON public.career_applications;
CREATE POLICY "Allow public insert of career_applications"
    ON public.career_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Applicants can view own career_applications" ON public.career_applications;
CREATE POLICY "Applicants can view own career_applications"
    ON public.career_applications
    FOR SELECT
    TO authenticated
    USING (
        lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
        OR public.is_portal_admin()
    );

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

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON public.career_applications(lower(email));
CREATE INDEX IF NOT EXISTS idx_career_applications_phone ON public.career_applications(phone);
CREATE INDEX IF NOT EXISTS idx_career_applications_role ON public.career_applications(role);
CREATE INDEX IF NOT EXISTS idx_career_applications_status ON public.career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_created_at ON public.career_applications(created_at DESC);

-- 7. Storage policies for career-resumes bucket
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
