/**
 * Siddhi Dynamics — send-email Edge Function
 * ────────────────────────────────────────────────────────────────────────────
 * Deployed as a Supabase Edge Function (Deno runtime).
 * Receives a template + payload from the frontend emailService.ts
 * and calls the Resend API to send the email.
 *
 * Secrets required (set via Supabase dashboard or CLI):
 *   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
 *   FROM_EMAIL=noreply@siddhidynamics.com   (or onboarding@resend.dev for testing)
 *
 * Deploy:
 *   npx supabase functions deploy send-email --project-ref xppusnjbnhrndionbgaf
 * ────────────────────────────────────────────────────────────────────────────
 */

import {
  buildWelcome,
  buildLoginAlert,
  buildProjectStart,
  buildProjectComplete,
  buildStatusUpdate,
  buildInvoice,
  buildPaymentConfirm,
  buildOffer,
  buildSlaRenewal,
  buildAdminMessage,
} from './templates.ts';

const RESEND_API_URL = 'https://api.resend.com/emails';

const TEMPLATE_MAP: Record<string, (data: any) => { subject: string; html: string }> = {
  welcome: buildWelcome,
  login_alert: buildLoginAlert,
  project_start: buildProjectStart,
  project_complete: buildProjectComplete,
  status_update: buildStatusUpdate,
  invoice: buildInvoice,
  payment_confirm: buildPaymentConfirm,
  offer: buildOffer,
  sla_renewal: buildSlaRenewal,
  admin_message: buildAdminMessage,
};

Deno.serve(async (req: Request) => {
  // CORS for local development
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev';
  const FROM_NAME = 'Siddhi Dynamics';

  if (!RESEND_API_KEY) {
    console.error('[send-email] RESEND_API_KEY secret not set.');
    return new Response(JSON.stringify({ error: 'Email service not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { template, to, data } = body as {
      template: string;
      to: string;
      data: Record<string, any>;
    };

    // Validate
    if (!template || !to || !data) {
      return new Response(JSON.stringify({ error: 'Missing template, to, or data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const builder = TEMPLATE_MAP[template];
    if (!builder) {
      return new Response(JSON.stringify({ error: `Unknown template: ${template}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { subject, html } = builder(data);

    // Send via Resend
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [to],
        subject,
        html,
      }),
    });

    const resendBody = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('[send-email] Resend error:', resendBody);
      return new Response(JSON.stringify({ error: resendBody }), {
        status: resendResponse.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    console.log(`[send-email] ✓ Sent "${template}" → ${to} (id: ${resendBody.id})`);
    return new Response(JSON.stringify({ success: true, id: resendBody.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

  } catch (err: any) {
    console.error('[send-email] Unhandled error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
