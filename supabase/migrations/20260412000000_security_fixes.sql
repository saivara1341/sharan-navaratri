-- =============================================
-- SECURITY HARDENING & DATABASE BUG FIXES
-- Date: 2026-04-12
-- =============================================

-- 1. FIX DATA LEAK: Restrict SELECT access to Admin Only
-- We drop the public policies and replace them with restricted ones.

DROP POLICY IF EXISTS "Allow public select of contact_submissions" ON public.contact_submissions;
CREATE POLICY "Allow admin select of contact_submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

DROP POLICY IF EXISTS "Allow public select of project_waitlist" ON public.project_waitlist;
CREATE POLICY "Allow admin select of project_waitlist"
ON public.project_waitlist
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

-- 2. FIX FUNCTIONAL CRASH: Update inquiry_type validation
-- We need to update the check constraint to include 'investor'.
-- First, identify the constraint name (usually check_contact_inquiry_type from our lookup)

ALTER TABLE public.contact_submissions
DROP CONSTRAINT IF EXISTS check_contact_inquiry_type;

ALTER TABLE public.contact_submissions
ADD CONSTRAINT check_contact_inquiry_type 
CHECK (inquiry_type IN ('problem', 'requirement', 'inquiry', 'investor'));

-- 3. CHAT TABLE RECOVERY (Non-destructive update)
-- Ensure chat table has proper RLS if it was recreated.
ALTER TABLE IF EXISTS public.chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read all chat messages" ON public.chat_messages;
CREATE POLICY "Admin can read all chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');
