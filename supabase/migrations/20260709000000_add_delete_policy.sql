-- =============================================
-- ADD DELETE POLICY FOR ADMIN
-- Date: 2026-07-09
-- =============================================

-- Create a policy to allow the admin user (ssaivaraprasad51@gmail.com) to delete submissions.
-- Without this, delete operations from the client will succeed with "0 rows deleted" (returning no error) due to RLS, leaving data intact.
DROP POLICY IF EXISTS "Allow admin to delete submissions" ON public.contact_submissions;

CREATE POLICY "Allow admin to delete submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');
