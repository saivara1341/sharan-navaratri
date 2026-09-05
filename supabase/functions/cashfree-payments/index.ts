import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
const admin = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const encoder = new TextEncoder();

async function signatureIsValid(payload: string, timestamp: string | null, signature: string | null) {
  const secret = Deno.env.get('CASHFREE_CLIENT_SECRET');
  if (!secret || !timestamp || !signature) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${timestamp}${payload}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) mismatch |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return mismatch === 0;
}

const amountFromInvoice = (amount?: string) => Number(String(amount || '').replace(/[^0-9.]/g, ''));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  const rawBody = await req.text();

  // Cashfree uses a raw-body HMAC signature. This endpoint intentionally does
  // not require a JWT so Cashfree can deliver events, but rejects unsigned data.
  if (req.headers.get('x-webhook-signature')) {
    if (!await signatureIsValid(rawBody, req.headers.get('x-webhook-timestamp'), req.headers.get('x-webhook-signature'))) return json({ error: 'Invalid webhook signature.' }, 401);
    const event = JSON.parse(rawBody);
    const linkId = String(event.link_id || event.data?.link?.link_id || '');
    const status = String(event.link_status || event.data?.link?.link_status || event.order_status || '');
    if (!linkId) return json({ error: 'Missing Cashfree link id.' }, 400);
    const db = admin();
    const update: Record<string, unknown> = { cashfree_status: status, webhook_payload: event, updated_at: new Date().toISOString() };
    if (status === 'PAID' || event.event === 'PAYMENT_LINK_PAID') update.paid_at = new Date().toISOString();
    const { error } = await db.from('cashfree_payment_links').update(update).eq('cashfree_link_id', linkId);
    if (error) throw error;
    return json({ received: true });
  }

  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const bearer = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!bearer) return json({ error: 'Sign in to pay an invoice.' }, 401);
  const db = admin();
  const { data: { user }, error: authError } = await db.auth.getUser(bearer);
  if (authError || !user?.email) return json({ error: 'Your session could not be verified.' }, 401);
  const { submissionId, invoiceId } = JSON.parse(rawBody);
  if (!submissionId || !invoiceId) return json({ error: 'Invoice details are required.' }, 400);
  const { data: submission, error: submissionError } = await db.from('contact_submissions').select('id, name, email, bounty_reward').eq('id', submissionId).eq('email', user.email.toLowerCase()).maybeSingle();
  if (submissionError || !submission) return json({ error: 'Invoice not found.' }, 404);
  let metadata: { invoices?: Array<{ id?: string; amount?: string; description?: string }> } = {};
  try { metadata = JSON.parse(submission.bounty_reward || '{}'); } catch { return json({ error: 'This invoice is not ready for online payment.' }, 400); }
  const invoice = metadata.invoices?.find((item) => item.id === invoiceId);
  const amount = amountFromInvoice(invoice?.amount);
  if (!invoice || !Number.isFinite(amount) || amount <= 0) return json({ error: 'This invoice does not have a valid amount.' }, 400);
  const { data: profile } = await db.from('portal_users').select('phone').eq('auth_user_id', user.id).maybeSingle();
  const phone = String(profile?.phone || user.user_metadata?.phone || '').replace(/\D/g, '').slice(-10);
  if (phone.length !== 10) return json({ error: 'Add a valid 10-digit mobile number to your profile before paying.' }, 400);
  const { data: existing } = await db.from('cashfree_payment_links').select('link_url, cashfree_status').eq('submission_id', submission.id).eq('invoice_id', invoiceId).in('cashfree_status', ['ACTIVE', 'PARTIALLY_PAID']).order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (existing?.link_url) return json({ url: existing.link_url, status: existing.cashfree_status });
  const clientId = Deno.env.get('CASHFREE_CLIENT_ID');
  const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET');
  const environment = Deno.env.get('CASHFREE_ENVIRONMENT') === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';
  const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/cashfree-payments`;
  const returnUrl = Deno.env.get('CASHFREE_RETURN_URL') || 'https://siddhidynamics.in/portal/client';
  if (!clientId || !clientSecret) return json({ error: 'Cashfree is not configured yet.' }, 503);
  const localId = `sd_${crypto.randomUUID().replaceAll('-', '')}`;
  const cashfree = await fetch(`${environment}/pg/links`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-version': '2025-01-01', 'x-client-id': clientId, 'x-client-secret': clientSecret }, body: JSON.stringify({ customer_details: { customer_name: submission.name, customer_email: submission.email, customer_phone: phone }, link_id: localId, link_amount: amount, link_currency: 'INR', link_purpose: invoice.description || `Invoice ${invoiceId}`, link_partial_payments: false, link_auto_reminders: true, link_notify: { send_email: true, send_sms: true, send_whatsapp: false }, link_meta: { notify_url: webhookUrl, return_url: returnUrl }, link_notes: { submission_id: submission.id, invoice_id: invoiceId }, enable_invoice: true }) });
  const result = await cashfree.json();
  if (!cashfree.ok) return json({ error: result.message || 'Cashfree could not create the payment link.' }, 502);
  const { error: insertError } = await db.from('cashfree_payment_links').insert({ submission_id: submission.id, invoice_id: invoiceId, amount_paise: Math.round(amount * 100), cashfree_link_id: result.link_id, link_url: result.link_url, cashfree_status: result.link_status, expires_at: result.link_expiry_time });
  if (insertError) throw insertError;
  return json({ url: result.link_url, status: result.link_status });
});
