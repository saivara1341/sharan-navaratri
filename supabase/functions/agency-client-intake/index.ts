import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const response = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const admin = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return response({ error: 'Method not allowed' }, 405);
  try {
    const body = await req.json();
    const db = admin();
    if (body.action === 'create') {
      const bearer = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
      if (!bearer) return response({ error: 'Sign in to create an intake link.' }, 401);
      const { data: { user }, error } = await db.auth.getUser(bearer);
      if (error || !user?.email) return response({ error: 'Your session could not be verified.' }, 401);
      const agencyName = String(body.agencyName || '').trim();
      if (!agencyName) return response({ error: 'Agency name is required.' }, 400);
      const token = `${crypto.randomUUID().replaceAll('-', '')}${crypto.randomUUID().replaceAll('-', '')}`;
      const { error: insertError } = await db.from('agency_client_intake_links').insert({ token, agency_email: user.email.toLowerCase(), agency_name: agencyName, created_by: user.id });
      if (insertError) throw insertError;
      return response({ token });
    }
    const token = String(body.token || '').trim();
    if (!token || token.length < 32) return response({ error: 'Invalid intake link.' }, 400);
    if (body.action === 'status') {
      const { data, error } = await db.from('agency_client_intake_links').select('agency_name, submitted_at').eq('token', token).maybeSingle();
      if (error) throw error;
      if (!data) return response({ error: 'This intake link is invalid.' }, 404);
      return response({ agencyName: data.agency_name, submitted: Boolean(data.submitted_at) });
    }
    if (body.action === 'submit') {
      const payload = body.payload || {};
      const mobile = String(payload.mobile || '').replace(/\D/g, '');
      if (!String(payload.businessName || '').trim() || !String(payload.contactName || '').trim() || mobile.length !== 10) return response({ error: 'Business name, contact name, and a 10-digit mobile number are required.' }, 400);
      payload.mobile = mobile;
      if (payload.whatsapp) payload.whatsapp = String(payload.whatsapp).replace(/\D/g, '');
      const { data, error } = await db.rpc('consume_agency_client_intake_link', { p_token: token, p_payload: payload });
      if (error) return response({ error: error.message }, error.message.includes('already been submitted') ? 409 : 400);
      return response({ clientId: data });
    }
    return response({ error: 'Unknown action.' }, 400);
  } catch (error) {
    console.error('[agency-client-intake]', error);
    return response({ error: 'Unable to process this intake request.' }, 500);
  }
});
