-- =============================================
-- Migration: Create knowledge_base table and match function
-- Date: 2026-07-09
-- =============================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge_base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT,
    file_type TEXT NOT NULL, -- 'text', 'pdf', 'image', 'docx'
    content TEXT NOT NULL,
    embedding vector(768),   -- Vector size for Gemini 'text-embedding-004' (768 dimensions)
    created_at TIMESTAMPTZ DEFAULT now(),
    uploaded_by TEXT DEFAULT 'admin'
);

-- 3. Enable RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Allow admin (ssaivaraprasad51@gmail.com) full access
DROP POLICY IF EXISTS "Admin full access on knowledge_base" ON public.knowledge_base;
CREATE POLICY "Admin full access on knowledge_base"
ON public.knowledge_base
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'ssaivaraprasad51@gmail.com');

-- Allow authenticated users (clients/employees) select access
DROP POLICY IF EXISTS "Authenticated select on knowledge_base" ON public.knowledge_base;
CREATE POLICY "Authenticated select on knowledge_base"
ON public.knowledge_base
FOR SELECT
TO authenticated
USING (true);

-- 5. Create match function for cosine similarity search
CREATE OR REPLACE FUNCTION match_knowledge_base (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  file_name TEXT,
  file_type TEXT,
  content TEXT,
  similarity float
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.file_name,
    kb.file_type,
    kb.content,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_base kb
  WHERE kb.embedding IS NOT NULL AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. Create Supabase Storage Bucket for knowledge base files
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge_base', 'knowledge_base', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket objects
-- Allow admin full access
DROP POLICY IF EXISTS "Admin full access on knowledge_base bucket objects" ON storage.objects;
CREATE POLICY "Admin full access on knowledge_base bucket objects"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'knowledge_base')
WITH CHECK (bucket_id = 'knowledge_base');

-- Allow authenticated users read-only select access
DROP POLICY IF EXISTS "Authenticated read on knowledge_base bucket objects" ON storage.objects;
CREATE POLICY "Authenticated read on knowledge_base bucket objects"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'knowledge_base');
