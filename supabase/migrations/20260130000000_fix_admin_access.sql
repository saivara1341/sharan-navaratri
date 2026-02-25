-- Allow admin to select all submissions
CREATE POLICY "Allow admin to select submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

-- Allow regular users to see their own submissions (fixes Portal.tsx)
CREATE POLICY "Allow users to select own submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (email = (auth.jwt() ->> 'email'));
