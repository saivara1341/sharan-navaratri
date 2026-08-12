-- 1. knowledge_base: admin-only direct reads
DROP POLICY IF EXISTS "Authenticated select on knowledge_base" ON public.knowledge_base;

CREATE OR REPLACE FUNCTION public.match_knowledge_base(query_embedding vector, match_threshold double precision, match_count integer)
 RETURNS TABLE(id uuid, file_name text, file_type text, content text, similarity double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT kb.id, kb.file_name, kb.file_type, kb.content, 1 - (kb.embedding <=> query_embedding)
  FROM public.knowledge_base kb
  WHERE kb.embedding IS NOT NULL AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding LIMIT match_count;
$function$;

REVOKE ALL ON FUNCTION public.match_knowledge_base(vector, double precision, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_knowledge_base(vector, double precision, integer) TO authenticated, service_role;

-- 2. requirement_events: participants only
DROP POLICY IF EXISTS "Participants write requirement events" ON public.requirement_events;
CREATE POLICY "Participants write requirement events" ON public.requirement_events
FOR INSERT TO authenticated
WITH CHECK (
  lower(actor_email) = jwt_email()
  AND requirement_id IN (
    SELECT r.id FROM public.requirements r
    LEFT JOIN public.clients c ON c.id = r.client_id
    WHERE lower(r.submitted_by_email) = jwt_email()
       OR lower(coalesce(r.assigned_to_email,'')) = jwt_email()
       OR lower(coalesce(r.agency_email,'')) = jwt_email()
       OR lower(coalesce(c.contact_email,'')) = jwt_email()
  )
);

-- 3. project_likes: no arbitrary writes
DROP POLICY IF EXISTS "Anyone can update likes" ON public.project_likes;
DROP POLICY IF EXISTS "Anyone can add likes" ON public.project_likes;
REVOKE INSERT, UPDATE, DELETE ON public.project_likes FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.toggle_project_like(_project_id text, _delta integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  step integer := CASE WHEN _delta >= 0 THEN 1 ELSE -1 END;
  result integer;
BEGIN
  IF _project_id IS NULL OR length(_project_id) = 0 OR length(_project_id) > 100 THEN
    RAISE EXCEPTION 'invalid project id';
  END IF;

  INSERT INTO public.project_likes (project_id, likes_count, updated_at)
  VALUES (_project_id, GREATEST(step, 0), now())
  ON CONFLICT (project_id) DO UPDATE
    SET likes_count = GREATEST(public.project_likes.likes_count + step, 0),
        updated_at = now()
  RETURNING likes_count INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_project_like(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_project_like(text, integer) TO anon, authenticated, service_role;

-- 4. Lock down SECURITY DEFINER internals (trigger + reporting functions)
REVOKE ALL ON FUNCTION public.sync_portal_user_from_auth() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_waitlist_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.check_contact_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.requirement_pipeline_summary() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.requirement_pipeline_summary() TO authenticated, service_role;

-- 5. Remove anonymous/needless API discoverability
REVOKE ALL ON public.knowledge_base FROM anon;
REVOKE ALL ON public.chat_messages FROM anon;
REVOKE ALL ON public.agency_clients FROM anon;
REVOKE ALL ON public.agency_invoices FROM anon;
REVOKE ALL ON public.agency_profiles FROM anon;
REVOKE ALL ON public.portal_users FROM anon;
REVOKE ALL ON public.clients FROM anon;
REVOKE ALL ON public.requirements FROM anon;
REVOKE ALL ON public.requirement_messages FROM anon;
REVOKE ALL ON public.requirement_events FROM anon;
REVOKE ALL ON public.contact_submissions FROM anon;
GRANT INSERT ON public.contact_submissions TO anon;
REVOKE ALL ON public.project_waitlist FROM anon, authenticated;
GRANT INSERT ON public.project_waitlist TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.project_likes FROM anon, authenticated;
GRANT SELECT ON public.project_likes TO anon, authenticated;