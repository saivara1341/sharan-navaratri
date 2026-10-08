import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const sameText = (a?: string | null, b?: string | null) =>
  Boolean(a && b && String(a).trim().toLowerCase() === String(b).trim().toLowerCase());

const last10 = (value?: string | null) => String(value || '').replace(/\D/g, '').slice(-10);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return json({ error: 'Delete service is not configured.' }, 500);

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') || '';
  if (!token) return json({ error: 'Please sign in again before deleting this account.' }, 401);

  const { data: authData, error: authError } = await db.auth.getUser(token);
  const user = authData?.user;
  if (authError || !user) return json({ error: 'Your session expired. Please sign in again before deleting this account.' }, 401);

  try {
    const body = await req.json().catch(() => ({}));
    const mandapamId = String(body?.mandapamId || '').trim();
    const userEmail = user.email?.trim().toLowerCase() || '';
    const userMobile = last10(user.user_metadata?.mobile || user.phone || null);

    const mandapamIds = new Set<string>();

    if (mandapamId) {
      const { data: mandapam, error } = await db
        .from('navaratri_mandapams')
        .select('id, owner_user_id, organizer_email, organizer_mobile, contact_phone')
        .eq('id', mandapamId)
        .maybeSingle();
      if (error) throw error;

      if (mandapam) {
        const mandapamMobile = last10(mandapam.organizer_mobile || mandapam.contact_phone);
        const ownsMandapam =
          mandapam.owner_user_id === user.id ||
          sameText(mandapam.organizer_email, userEmail) ||
          Boolean(userMobile && mandapamMobile && userMobile === mandapamMobile);

        if (!ownsMandapam) return json({ error: 'This mandapam is not linked to your signed-in account.' }, 403);
        mandapamIds.add(mandapam.id);
      }
    }

    const { data: ownedRows, error: ownedError } = await db
      .from('navaratri_mandapams')
      .select('id')
      .eq('owner_user_id', user.id);
    if (ownedError) throw ownedError;
    for (const row of ownedRows || []) mandapamIds.add(row.id);

    if (userEmail) {
      const { data: emailRows, error: emailError } = await db
        .from('navaratri_mandapams')
        .select('id')
        .ilike('organizer_email', userEmail);
      if (emailError) throw emailError;
      for (const row of emailRows || []) mandapamIds.add(row.id);
    }

    const ids = [...mandapamIds];
    if (ids.length > 0) {
      // Most Navaratri child tables have ON DELETE CASCADE from navaratri_mandapams.
      // Deleting the parent rows keeps this function resilient as the schema evolves.
      const { error: mandapamDeleteError } = await db.from('navaratri_mandapams').delete().in('id', ids);
      if (mandapamDeleteError) throw mandapamDeleteError;
    }

    const deleteOwnRows = async (table: string, column = 'user_id') => {
      const { error } = await db.from(table).delete().eq(column, user.id);
      if (error && error.code !== '42P01' && error.code !== '42703') {
        console.warn(`[navaratri-account-delete] ${table} cleanup warning`, error);
      }
    };

    await deleteOwnRows('navaratri_bookings');
    await deleteOwnRows('navaratri_reminders');
    await deleteOwnRows('navaratri_questions');
    await deleteOwnRows('navaratri_community_questions');
    await deleteOwnRows('navaratri_advertisements');
    await deleteOwnRows('navaratri_mandapam_members');

    const { error: deleteUserError } = await db.auth.admin.deleteUser(user.id);
    if (deleteUserError) throw deleteUserError;

    return json({ success: true, deletedMandapams: ids.length });
  } catch (error) {
    console.error('[navaratri-account-delete]', error);
    return json({ error: error instanceof Error ? error.message : 'Unable to delete account.' }, 500);
  }
});
