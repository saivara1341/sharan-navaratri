-- SQL Fix for Admin Access
-- Execute this in the Supabase SQL Editor to allow ssaivaraprasad51@gmail.com to read submissions

-- 1. Enable RLS on contact_submissions (if not already enabled)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Create policy to allow specifically the admin user to read all submissions
-- Replace the UUID if you have the actual auth.uid() for ssaivaraprasad51@gmail.com, 
-- or simply check by email (requires a custom function or joining with auth.users which is restricted).
-- Simpler approach: Allow any authenticated user to read (if you trust authenticated users)
-- OR restrict by email if you use a trigger to sync emails to a public profiles table.

-- Best practice: Use a policy that checks the authenticated user's email from the JWT
CREATE POLICY "Admin read access" ON contact_submissions
FOR SELECT TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

-- 3. Also allow any user to insert (to keep the contact form working)
CREATE POLICY "Public insert access" ON contact_submissions
FOR INSERT WITH CHECK (true);
