-- Organizer-provided Google Maps share link used by devotees for navigation.
ALTER TABLE public.navaratri_mandapams
  ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

COMMENT ON COLUMN public.navaratri_mandapams.google_maps_url IS
  'Google Maps or maps.app.goo.gl share URL for the mandapam location.';

NOTIFY pgrst, 'reload schema';
