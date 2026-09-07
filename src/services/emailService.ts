/**
 * emailService.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Central email trigger service for Siddhi Dynamics.
 *
 * All emails are sent via the Supabase Edge Function `send-email`, which in
 * turn calls the Resend API server-side (API key is never exposed to the
 * browser). To enable:
 *
 *   1. Add your Resend key to Supabase:
 *        npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
 *   2. Deploy the edge function:
 *        npx supabase functions deploy send-email
 *
 * Usage:
 *   import { emailService } from '@/services/emailService';
 *   await emailService.projectStart(clientEmail, clientName, projectName);
 * ────────────────────────────────────────────────────────────────────────────
 */

import { supabase } from '@/integrations/supabase/client';

// ── Types ────────────────────────────────────────────────────────────────────

export type EmailTemplate =
  | 'welcome'
  | 'login_alert'
  | 'project_start'
  | 'project_complete'
  | 'status_update'
  | 'invoice'
  | 'payment_confirm'
  | 'offer'
  | 'sla_renewal'
  | 'admin_message'
  | 'password_reset_custom';

interface SendEmailPayload {
  template: EmailTemplate;
  to: string;
  data: Record<string, any>;
}

// ── Core Sender ──────────────────────────────────────────────────────────────

async function send(payload: SendEmailPayload): Promise<boolean> {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: payload,
    });
    if (error) {
      console.error('[emailService] Edge function error:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[emailService] Failed to invoke send-email:', err.message);
    return false;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export const emailService = {
  /** Sent when a new user signs up */
  async welcome(to: string, name: string) {
    return send({
      template: 'welcome',
      to,
      data: { name, portalUrl: window.location.origin + '/auth' },
    });
  },

  /** Sent after every successful login */
  async loginAlert(to: string, name: string) {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return send({
      template: 'login_alert',
      to,
      data: { name, loginTime: now, portalUrl: window.location.origin },
    });
  },

  /** Fired when admin sets a project status to "In Progress" / "Analysing" */
  async projectStart(to: string, clientName: string, projectName: string, timeline?: string) {
    return send({
      template: 'project_start',
      to,
      data: {
        clientName,
        projectName,
        timeline: timeline || 'As discussed in our agreement',
        portalUrl: window.location.origin + '/portal/client',
      },
    });
  },

  /** Fired when admin marks a project as "Completed" */
  async projectComplete(to: string, clientName: string, projectName: string) {
    return send({
      template: 'project_complete',
      to,
      data: {
        clientName,
        projectName,
        portalUrl: window.location.origin + '/portal/client',
      },
    });
  },

  /** Generic progress/status update notification */
  async statusUpdate(
    to: string,
    clientName: string,
    projectName: string,
    status: string,
    progress: number
  ) {
    return send({
      template: 'status_update',
      to,
      data: { clientName, projectName, status, progress, portalUrl: window.location.origin + '/portal/client' },
    });
  },

  /** New invoice generated for a partner / client */
  async invoice(
    to: string,
    recipientName: string,
    invoiceId: string,
    amount: string,
    dueDate: string,
    upiId?: string
  ) {
    return send({
      template: 'invoice',
      to,
      data: { recipientName, invoiceId, amount, dueDate, upiId: upiId || 'siddhi@upi', portalUrl: window.location.origin },
    });
  },

  /** Payment confirmed by admin */
  async paymentConfirm(to: string, recipientName: string, amount: string, invoiceId: string) {
    return send({
      template: 'payment_confirm',
      to,
      data: { recipientName, amount, invoiceId, portalUrl: window.location.origin },
    });
  },

  /** New offer / proposal sent to a client or partner */
  async offer(
    to: string,
    recipientName: string,
    offerTitle: string,
    offerSummary: string,
    validUntil?: string
  ) {
    return send({
      template: 'offer',
      to,
      data: {
        recipientName,
        offerTitle,
        offerSummary,
        validUntil: validUntil || '7 days from now',
        portalUrl: window.location.origin + '/portal',
      },
    });
  },

  /** SLA renewal reminder (sent 30 days before expiry) */
  async slaRenewal(to: string, partnerName: string, expiryDate: string) {
    return send({
      template: 'sla_renewal',
      to,
      data: { partnerName, expiryDate, portalUrl: window.location.origin + '/portal/v-magnetic-minds' },
    });
  },

  /** Admin direct message forwarded to user email */
  async adminMessage(to: string, recipientName: string, message: string) {
    return send({
      template: 'admin_message',
      to,
      data: { recipientName, message, portalUrl: window.location.origin },
    });
  },

  /** Send Internship Interview Invitation */
  async internInterviewInvite(
    to: string,
    applicantName: string,
    roleTitle: string,
    interviewDate: string,
    interviewTime: string,
    meetingLink: string
  ) {
    const inviteMessage = `Dear ${applicantName},

Thank you for applying for the ${roleTitle} position at Siddhi Dynamics LLP.
We were impressed by your profile and would like to invite you for a virtual interview round.

Interview Details:
- Role: ${roleTitle}
- Date: ${interviewDate}
- Time: ${interviewTime} IST
- Video Meeting: ${meetingLink}
- Reporting Authority: CEO / Founder Office

Please be prepared with your portfolio, past business/marketing campaign work, and questions regarding Siddhi Dynamics.

Warm regards,
Talent Acquisition Team
careers@siddhidynamics.in
Siddhi Dynamics LLP`;

    return send({
      template: 'admin_message',
      to,
      data: {
        recipientName: applicantName,
        message: inviteMessage,
        portalUrl: window.location.origin + '/careers',
      },
    });
  },

  /** Send Internship Offer Letter Notification */
  async internOfferLetter(
    to: string,
    internName: string,
    roleTitle: string,
    duration: string,
    startDate: string
  ) {
    return send({
      template: 'offer',
      to,
      data: {
        recipientName: internName,
        offerTitle: `Official Internship Offer: ${roleTitle} (${duration})`,
        offerSummary: `Congratulations ${internName}! We are pleased to offer you an internship at Siddhi Dynamics LLP starting on ${startDate}. Please log into the portal to review and digitally sign your offer letter.`,
        validUntil: '3 days from now',
        portalUrl: window.location.origin + '/portal',
      },
    });
  },
};

