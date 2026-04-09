-- Migration: Create chat_messages table (Fixing "sender_email does not exist" error)
-- Description: Drops the existing table (if broken) and creates it with the correct schema.

-- 1. Drop the table if it exists to ensure a clean schema (CAUTION: This will delete existing chat data)
DROP TABLE IF EXISTS public.chat_messages;

-- 2. Create the table with all required columns
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submission_id UUID NOT NULL REFERENCES public.contact_submissions(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false
);

-- 3. Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Admin (ssaivaraprasad51@gmail.com)
CREATE POLICY "Admin can read all chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

CREATE POLICY "Admin can insert chat messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

-- 5. Policies for Users (associated with the submission)
CREATE POLICY "Users can read their own submission chat"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
    sender_email = (auth.jwt() ->> 'email') OR 
    submission_id IN (
        SELECT id FROM public.contact_submissions WHERE email = (auth.jwt() ->> 'email')
    )
);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
    sender_email = (auth.jwt() ->> 'email') AND
    submission_id IN (
        SELECT id FROM public.contact_submissions WHERE email = (auth.jwt() ->> 'email')
    )
);

-- 6. Index for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_submission_id ON public.chat_messages(submission_id);
