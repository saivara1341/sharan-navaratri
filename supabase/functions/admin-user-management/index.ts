import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const response = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  try {
    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    const { data: { user: caller }, error: callerError } = token ? await db.auth.getUser(token) : { data: { user: null }, error: null };
    if (callerError || caller?.email?.toLowerCase() !== 'ssaivaraprasad51@gmail.com') return response({ error: 'Administrator access is required.' }, 403);

    const body = await req.json();
    if (body.action === 'list') {
      const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) throw error;
      return response({ users: (data.users || []).map((user) => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        role: user.user_metadata?.role || 'client',
        organization: user.user_metadata?.organization || null,
        designation: user.user_metadata?.designation || null,
        confirmed: Boolean(user.email_confirmed_at),
        created_at: user.created_at,
        lastLogin: user.last_sign_in_at,
      })) });
    }
    const userId = String(body.id || '').trim();
    const previousEmail = String(body.previousEmail || '').trim().toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response({ error: 'A valid email is required.' }, 400);

    const authUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId) ? userId : null;
    const profile = {
      auth_user_id: authUserId,
      email,
      name: String(body.name || '').trim() || null,
      role: ['client', 'partner', 'investor', 'employee', 'admin'].includes(body.role) ? body.role : 'client',
      organization: String(body.organization || '').trim() || null,
      designation: String(body.designation || '').trim() || null,
      phone: String(body.phone || '').trim() || null,
      quote: String(body.quote || '').trim() || null,
      notes: String(body.notes || '').trim() || null,
      confirmed: body.confirmed !== false,
      updated_at: new Date().toISOString(),
    };

    if (authUserId) {
      const { error } = await db.auth.admin.updateUserById(userId, { email, user_metadata: { full_name: profile.name, role: profile.role, organization: profile.organization, designation: profile.designation } });
      if (error) throw error;
    }

    if (previousEmail && previousEmail !== email) {
      const { data: movedProfile, error: moveProfileError } = await db.from('portal_users').update(profile).eq('email', previousEmail).select('id').maybeSingle();
      if (moveProfileError) throw moveProfileError;
      if (!movedProfile) {
        const { error: profileError } = await db.from('portal_users').upsert(profile, { onConflict: 'email' });
        if (profileError) throw profileError;
      }
      const { error: projectsError } = await db.from('contact_submissions').update({ email }).ilike('email', previousEmail);
      if (projectsError) throw projectsError;
      const { error: agencyError } = await db.from('agency_clients').update({ email, updated_at: new Date().toISOString() }).ilike('email', previousEmail);
      if (agencyError) throw agencyError;
    } else {
      const { error: profileError } = await db.from('portal_users').upsert(profile, { onConflict: 'email' });
      if (profileError) throw profileError;
    }
    return response({ profile });
  } catch (error) {
    console.error('[admin-user-management]', error);
    return response({ error: error instanceof Error ? error.message : 'Unable to save user.' }, 500);
  }
});
