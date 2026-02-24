-- Add SELECT policies to allow the Admin Portal and User Portal to read data
-- Note: This enables public read access which is required for the current 
-- client-side admin authentication logic.

-- Policies for contact_submissions
CREATE POLICY "Allow public select of contact_submissions"
ON public.contact_submissions
FOR SELECT
USING (true);

-- Policies for project_waitlist
CREATE POLICY "Allow public select of project_waitlist"
ON public.project_waitlist
FOR SELECT
USING (true);
