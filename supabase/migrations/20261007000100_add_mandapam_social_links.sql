ALTER TABLE public.navaratri_mandapams
  ADD COLUMN IF NOT EXISTS instagram_url text,
  ADD COLUMN IF NOT EXISTS twitter_url text;

COMMENT ON COLUMN public.navaratri_mandapams.instagram_url IS
  'Optional public Instagram profile URL or handle for a Navaratri mandapam organizer or committee.';

COMMENT ON COLUMN public.navaratri_mandapams.twitter_url IS
  'Optional public Twitter/X profile URL or handle for a Navaratri mandapam organizer or committee.';
