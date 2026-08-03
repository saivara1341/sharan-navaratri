/**
 * Siddhi Dynamics — Email Templates
 * All branded HTML emails matching the dark glassmorphism design system.
 */

const BASE_STYLE = `
  body { margin: 0; padding: 0; background: #0a0a0f; font-family: 'Inter', -apple-system, sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .card {
    background: linear-gradient(135deg, #111827 0%, #1a1f2e 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 20px;
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #1a0533 0%, #0d1117 50%, #0a1628 100%);
    border-bottom: 1px solid rgba(139, 92, 246, 0.3);
    padding: 36px 40px 28px;
    text-align: center;
  }
  .logo { font-size: 22px; font-weight: 900; color: #a855f7; letter-spacing: -0.5px; }
  .logo span { color: #e2e8f0; }
  .badge {
    display: inline-block;
    margin-top: 10px;
    padding: 4px 14px;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    color: #a855f7;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .body { padding: 40px; }
  h1 { font-size: 26px; font-weight: 800; color: #f1f5f9; margin: 0 0 10px; line-height: 1.3; }
  p { color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 18px; }
  .highlight { color: #e2e8f0; font-weight: 600; }
  .stat-row { display: flex; gap: 16px; margin: 24px 0; }
  .stat {
    flex: 1;
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }
  .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
  .stat-value { font-size: 18px; font-weight: 800; color: #a855f7; margin-top: 6px; }
  .cta {
    display: block;
    margin: 28px 0 0;
    padding: 16px 28px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border-radius: 12px;
    color: #fff !important;
    font-weight: 800;
    font-size: 15px;
    text-decoration: none;
    text-align: center;
  }
  .divider { border: none; border-top: 1px solid rgba(139, 92, 246, 0.15); margin: 28px 0; }
  .footer { padding: 28px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
  .footer p { font-size: 12px; color: #475569; margin: 0; }
  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .tag-success { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .tag-warning { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
  .tag-info { background: rgba(139, 92, 246, 0.15); color: #a855f7; border: 1px solid rgba(139,92,246,0.25); }
  .tag-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }
  .progress-bar { background: rgba(255,255,255,0.08); border-radius: 100px; height: 8px; margin: 10px 0; overflow: hidden; }
  .progress-fill { height: 8px; border-radius: 100px; background: linear-gradient(90deg, #7c3aed, #a855f7); }
`;

function shell(badgeText: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>${BASE_STYLE}</style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="logo">Siddhi<span>Dynamics</span></div>
      <div class="badge">${badgeText}</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Siddhi Dynamics · <a href="https://siddhidynamics.com" style="color:#7c3aed;">siddhidynamics.com</a></p>
      <p style="margin-top:6px;">You received this because you have an account with Siddhi Dynamics.</p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ── Template Builders ─────────────────────────────────────────────────────────

export function buildWelcome(data: any): { subject: string; html: string } {
  return {
    subject: `Welcome to Siddhi Dynamics, ${data.name}! 🚀`,
    html: shell('Welcome Aboard', `
      <h1>Hey ${data.name}, welcome! 🎉</h1>
      <p>We're thrilled to have you in the <span class="highlight">Siddhi Dynamics ecosystem</span>. Your portal is ready — manage your projects, track progress, and connect with our team anytime.</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-label">Portal Access</div><div class="stat-value">✓ Live</div></div>
        <div class="stat"><div class="stat-label">Support</div><div class="stat-value">24/7</div></div>
        <div class="stat"><div class="stat-label">AI Chat</div><div class="stat-value">Active</div></div>
      </div>
      <a class="cta" href="${data.portalUrl}">Enter Your Portal →</a>
    `),
  };
}

export function buildLoginAlert(data: any): { subject: string; html: string } {
  return {
    subject: `New login to your Siddhi Dynamics account`,
    html: shell('Security Alert', `
      <h1>New Login Detected</h1>
      <p>Hi <span class="highlight">${data.name}</span>, we noticed a new login to your Siddhi Dynamics account.</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-label">Time (IST)</div><div class="stat-value" style="font-size:14px">${data.loginTime}</div></div>
      </div>
      <p>If this was you, no action needed. If not, please <a href="${data.portalUrl}/auth" style="color:#a855f7;">reset your password immediately</a>.</p>
      <a class="cta" href="${data.portalUrl}">Go to Portal →</a>
    `),
  };
}

export function buildProjectStart(data: any): { subject: string; html: string } {
  return {
    subject: `🚀 Your project "${data.projectName}" has officially started!`,
    html: shell('Project Kickoff', `
      <span class="tag tag-success">Project Started</span>
      <h1 style="margin-top:16px;">We're building something amazing</h1>
      <p>Hi <span class="highlight">${data.clientName}</span>, great news! Your project <span class="highlight">"${data.projectName}"</span> is now officially underway.</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-label">Status</div><div class="stat-value" style="color:#4ade80;">In Progress</div></div>
        <div class="stat"><div class="stat-label">Timeline</div><div class="stat-value" style="font-size:13px;">${data.timeline}</div></div>
      </div>
      <p>You can track live progress, view the roadmap, and communicate with our team directly from your portal.</p>
      <a class="cta" href="${data.portalUrl}">Track Progress →</a>
    `),
  };
}

export function buildProjectComplete(data: any): { subject: string; html: string } {
  return {
    subject: `✅ Project "${data.projectName}" is complete — congrats!`,
    html: shell('Project Complete', `
      <span class="tag tag-success">Completed</span>
      <h1 style="margin-top:16px;">Mission accomplished! 🎯</h1>
      <p>Hi <span class="highlight">${data.clientName}</span>, your project <span class="highlight">"${data.projectName}"</span> has been completed and delivered successfully.</p>
      <p>Thank you for trusting Siddhi Dynamics. View your final deliverables, download assets, and request any final reviews from your portal.</p>
      <a class="cta" href="${data.portalUrl}">View Deliverables →</a>
      <hr class="divider" />
      <p style="font-size:13px; color:#64748b;">Have feedback or want to start your next project? Reply to this email or reach us in your portal chat.</p>
    `),
  };
}

export function buildStatusUpdate(data: any): { subject: string; html: string } {
  return {
    subject: `📊 Update on "${data.projectName}" — ${data.status}`,
    html: shell('Status Update', `
      <span class="tag tag-info">${data.status}</span>
      <h1 style="margin-top:16px;">Project Update</h1>
      <p>Hi <span class="highlight">${data.clientName}</span>, here's the latest on your project <span class="highlight">"${data.projectName}"</span>.</p>
      <p><strong style="color:#e2e8f0;">Current Status:</strong> ${data.status}</p>
      <p style="margin-bottom:6px;"><strong style="color:#e2e8f0;">Progress:</strong> ${data.progress}%</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${data.progress}%"></div></div>
      <a class="cta" href="${data.portalUrl}">View Full Roadmap →</a>
    `),
  };
}

export function buildInvoice(data: any): { subject: string; html: string } {
  return {
    subject: `🧾 Invoice #${data.invoiceId} — ₹${data.amount} due ${data.dueDate}`,
    html: shell('Invoice', `
      <span class="tag tag-warning">Payment Due</span>
      <h1 style="margin-top:16px;">New Invoice Raised</h1>
      <p>Hi <span class="highlight">${data.recipientName}</span>, a new invoice has been generated for your account.</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-label">Invoice #</div><div class="stat-value" style="font-size:14px;">${data.invoiceId}</div></div>
        <div class="stat"><div class="stat-label">Amount</div><div class="stat-value">₹${data.amount}</div></div>
        <div class="stat"><div class="stat-label">Due Date</div><div class="stat-value" style="font-size:13px;">${data.dueDate}</div></div>
      </div>
      <p><strong style="color:#e2e8f0;">UPI Payment ID:</strong> ${data.upiId}</p>
      <a class="cta" href="${data.portalUrl}">View & Pay Invoice →</a>
    `),
  };
}

export function buildPaymentConfirm(data: any): { subject: string; html: string } {
  return {
    subject: `✅ Payment of ₹${data.amount} confirmed — Invoice #${data.invoiceId}`,
    html: shell('Payment Confirmed', `
      <span class="tag tag-success">Payment Received</span>
      <h1 style="margin-top:16px;">Payment Confirmed!</h1>
      <p>Hi <span class="highlight">${data.recipientName}</span>, we've confirmed your payment of <span class="highlight">₹${data.amount}</span> for Invoice #${data.invoiceId}.</p>
      <p>Your receipt is available in your portal. Thank you for your trust in Siddhi Dynamics!</p>
      <a class="cta" href="${data.portalUrl}">Download Receipt →</a>
    `),
  };
}

export function buildOffer(data: any): { subject: string; html: string } {
  return {
    subject: `🎁 New Offer for You: "${data.offerTitle}"`,
    html: shell('Special Offer', `
      <span class="tag tag-info">New Offer</span>
      <h1 style="margin-top:16px;">${data.offerTitle}</h1>
      <p>Hi <span class="highlight">${data.recipientName}</span>, we have an exclusive offer prepared just for you.</p>
      <p style="padding: 16px; background: rgba(139,92,246,0.08); border-left: 3px solid #7c3aed; border-radius: 0 8px 8px 0;">${data.offerSummary}</p>
      <div class="stat-row">
        <div class="stat"><div class="stat-label">Valid Until</div><div class="stat-value" style="font-size:13px;">${data.validUntil}</div></div>
      </div>
      <a class="cta" href="${data.portalUrl}">View Full Offer →</a>
    `),
  };
}

export function buildSlaRenewal(data: any): { subject: string; html: string } {
  return {
    subject: `⚠️ SLA Renewal Reminder — Expires ${data.expiryDate}`,
    html: shell('SLA Renewal', `
      <span class="tag tag-warning">Action Required</span>
      <h1 style="margin-top:16px;">Your SLA is expiring soon</h1>
      <p>Hi <span class="highlight">${data.partnerName}</span>, your Service Level Agreement with Siddhi Dynamics is set to expire on <span class="highlight">${data.expiryDate}</span>.</p>
      <p>To ensure uninterrupted service, please renew your SLA from your portal or contact our team.</p>
      <a class="cta" href="${data.portalUrl}">Renew SLA →</a>
    `),
  };
}

export function buildAdminMessage(data: any): { subject: string; html: string } {
  return {
    subject: `💬 New message from Siddhi Dynamics`,
    html: shell('Admin Message', `
      <h1>New Message</h1>
      <p>Hi <span class="highlight">${data.recipientName}</span>, you have a new message from the Siddhi Dynamics team.</p>
      <div style="padding: 20px; background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2); border-radius: 12px; margin: 20px 0;">
        <p style="margin:0; color: #e2e8f0; font-size:15px; line-height:1.7;">${data.message}</p>
      </div>
      <a class="cta" href="${data.portalUrl}">Reply in Portal →</a>
    `),
  };
}
