# Siddhi Dynamics Client Operations Hub

## Product requirement document

**Version:** 1.0
**Owner:** Siddhi Dynamics
**Status:** Build-ready
**Primary outcome:** Make the journey from first enquiry to signed-off delivery and recurring support transparent, secure, and effortless for clients and the delivery team.

## 1. Product vision

The Client Operations Hub is Siddhi Dynamics' operating system for service delivery. It combines client onboarding, service selection, scope approval, e-sign agreements, invoicing, payment collection, project delivery, communication, and support in one role-aware workspace.

It replaces fragmented WhatsApp threads, spreadsheets, ad-hoc payment confirmations, and email attachments with an auditable, human-friendly client journey. A client always knows the next required action; the team always knows who owns the next step.

## 2. Goals and success metrics

| Goal | Measure | Target |
| --- | --- | --- |
| Faster conversion | Qualified enquiry to signed agreement | 7 days or less |
| Clear payments | Invoices with an assigned payment status | 100% |
| Fewer follow-ups | Client actions completed without manual chase | 75%+ |
| Reliable access | Portal records protected by organisation membership | 100% |
| Delivery confidence | Milestones approved in portal | 90%+ |

Non-goals for v1: replacing a full accounting system, holding card data, or giving clients unrestricted access to internal delivery notes.

## 3. Users, roles, and permissions

| Role | Core permissions | Primary workspace |
| --- | --- | --- |
| Platform administrator | Full access, roles, financial controls, templates, reporting | Operations command centre |
| Account manager | Onboard clients, create scopes/quotes, send agreements, follow payment status | Client pipeline |
| Project manager | Manage timeline, milestones, deliverables, meetings and client updates | Delivery board |
| Finance manager | Issue invoices, reconcile payments, approve refunds and credit notes | Finance console |
| Delivery member | View assigned projects, update assigned work, submit deliverables | My work |
| Client owner | Invite client colleagues, approve scope/agreement, approve payments | Client command centre |
| Client contributor | View project, upload assets, comment, approve assigned requests | Project workspace |
| Partner/agency | Submit and track referred clients, view only their own commercial records | Partner console |

Permission rules: access is granted through organisation membership, never by a client-editable profile role. Every financial, agreement, approval, and role change produces an audit event.

## 4. Client journey

1. **Discover and enquire:** a prospect submits a service enquiry or is created by staff.
2. **Qualify:** account manager records discovery notes, qualification result, budget range and next meeting.
3. **Onboard:** client accepts an invitation, verifies email, completes company profile, contacts, billing details, and required documents.
4. **Select service:** client browses service cards, compares inclusions, chooses a package/add-ons, and submits requirements.
5. **Scope and quote:** account manager publishes a versioned scope, delivery plan and quote. Client can comment, request revision, or approve.
6. **Agreement:** the system generates an agreement from an approved template. Both parties e-sign; the immutable signed PDF and audit trail are stored.
7. **Invoice and payment:** finance issues a schedule. Client chooses UPI, bank transfer, payment link/card, or approved cash/cheque route, uploads proof if required, and sees verification status.
8. **Delivery:** the project workspace surfaces milestones, files, decisions, meetings, support, change requests, and explicit approvals.
9. **Close and retain:** client accepts handover, receives final invoice/receipt, rates the engagement, and can start support or a new service request.

## 5. Functional requirements

### 5.1 Onboarding

- Invite by email with expiring, single-use links and resend/revoke controls.
- A 4-step progressive profile: organisation, primary contacts, billing/tax details, and delivery preferences.
- Save-and-resume, contextual help, validation, duplicate organisation detection, and an onboarding checklist.
- Staff review gate for tax, KYC, or enterprise documents where needed.

### 5.2 Service catalogue and request intake

- Service cards show outcome, deliverables, starting price/range, timeline, dependencies and add-ons.
- Categories: websites, SaaS platforms, ERP solutions, business automation, startup blueprint, and managed support.
- Guided request form adapts to selected service; supports attachments, deadline, budget, integrations, and decision-maker details.
- Requests progress through Draft, Submitted, Discovery, Scope sent, Revision requested, Approved, Declined.

### 5.3 Agreements and approvals

- Versioned proposal and agreement templates, variable fields, optional clauses, revision history and expiry date.
- Explicit client acceptance plus e-sign provider status; no project starts before agreement status is `signed` unless an administrator records an exception.
- Approval inbox for scope, milestone, change request, agreement, invoice and handover decisions, with reminders and a clear due date.
- Downloadable signed agreement, certificate/audit log, and read-only historical versions.

### 5.4 Billing and payments

- Invoice lifecycle: Draft → Issued → Partially paid → Paid / Overdue / Void / Refunded.
- Payment schedules: 100% upfront, 50/50, milestone-based, monthly retainer, or custom instalments.
- Supported modes: UPI, bank transfer, payment-link/card gateway, cash, cheque. Cash and cheque must be explicitly approved by finance; clients cannot mark them paid.
- A payment submission records amount, method, reference/UTR, proof, payer and timestamp. Finance reconciles it; only finance can change invoice paid state.
- Auto-calculated totals, taxes, discounts, credits, receipts, overdue reminders and a client-visible statement of account.
- Never store card PAN/CVV or bank credentials; use a PCI-compliant gateway for card collection.

### 5.5 Delivery and support

- Project overview: health, next action, financial status, timeline, milestone progress, owner and latest update.
- Milestones contain description, dependencies, due date, deliverables, acceptance criteria and approval state.
- Secure file area with folder-level client visibility. Activity comments mention people and notify relevant participants.
- Scheduling supports proposed slots, confirmed calendar invite, Google Meet/phone mode, agenda and meeting notes.
- Change requests display scope, cost, timeline effect and approval path before work begins.
- Support tickets capture priority, SLA clock, assignee, status, conversation and resolution.

### 5.6 Operations and reporting

- Pipeline and workload views for staff; finance ageing, collections, outstanding balance and payment-method reports.
- Client health model based on payment risk, timeline risk, unresolved tickets and engagement.
- Filters, exportable CSV/PDF reports and complete audit history.

## 6. Information architecture and UI/UX

**Client navigation:** Overview · Services · Requests · Agreements · Billing · Project · Files · Meetings · Support · Settings.

**Staff navigation:** Command centre · Clients · Requests · Projects · Approvals · Billing · Service catalogue · Templates · Reports · Settings.

Every overview begins with a single `Next action` card, then a small set of meaningful metrics, followed by activity. Destructive actions require confirmation; long forms use a clear stepper; every status uses text in addition to colour. Empty states explain why there is no data and offer the one relevant next action.

### Visual system

The interface preserves Siddhi Dynamics' warm, premium identity:

- **Canvas:** Ivory `#F2EAD9`; **surfaces:** soft ivory `#F9F4EB`; **ink:** espresso `#221A14`.
- **Primary action:** refined olive `#4F8F24`; **highlight/action-needed:** saffron `#F97316`; **success:** forest `#15803D`; **danger:** `#DC2626`.
- **Typography:** Inter for UI and body. Use 700–800 weight only for page titles/card headings; body at 14–16px, 1.5–1.65 line-height. Use tabular figures for currency and invoice numbers.
- **Layout:** 8px spacing grid, 12px input radius, 16px card radius, generous white space, responsive single-column mobile layouts.
- **Accessibility:** WCAG AA contrast, visible keyboard focus, 44px touch targets, reduced-motion support, semantic labels, and no colour-only status communication.

## 7. Core data model

`organisations` owns the account. `organisation_memberships` grants users a role within it. `client_projects` belongs to the organisation. `service_requests`, `agreements`, `invoices`, `payments`, `approval_requests`, `meetings`, and `audit_events` all belong to an organisation and optionally a project.

Money is stored in the smallest currency unit (`amount_paise`) with a 3-character ISO currency, avoiding rounding errors. External payment/e-sign IDs are unique when supplied. Files live in private storage and are referenced by path/metadata; signed records retain a content hash.

## 8. Workflow states

| Area | States |
| --- | --- |
| Onboarding | Invited, In progress, Awaiting review, Complete, Blocked |
| Service request | Draft, Submitted, Discovery, Scoped, Revision requested, Approved, Declined |
| Agreement | Draft, Sent, Viewed, Revision requested, Signed, Expired, Void |
| Invoice | Draft, Issued, Partially paid, Paid, Overdue, Void, Refunded |
| Payment | Submitted, Under review, Reconciled, Rejected, Refunded |
| Project | Planned, Active, At risk, On hold, Completed, Cancelled |
| Approval | Pending, Approved, Rejected, Changes requested, Expired |

## 9. Security, privacy, and compliance

- Supabase Auth with verified email; membership-level RLS for every operational table.
- Server-side/Edge Function only for invitations, role assignment, agreement generation, payment gateway verification, reconciliation and notifications.
- Client-entered role metadata is never an authorization source.
- Private document storage, signed URL expiry, malware scanning before sharing, audit event retention, and least-privilege database policies.
- Invoice edits, payment reconciliation and agreement status changes are immutable/audited operations.

## 10. Implementation plan

**Foundation (this repository):** secure operational schema migration, existing portal integration, design tokens, role-aware navigation, client overview, agreement/billing data panels.

**Release 1:** invite/onboarding workflow, catalogue/request lifecycle, project/milestone workspace, agreement generation/e-sign adapter, invoice/payment submission and finance reconciliation.

**Release 2:** gateway webhooks, receipts/tax documents, support SLA automation, client health reporting, partner referrals, exports and integrations.

## 11. Acceptance criteria

1. A client owner can complete onboarding, select a service, approve a scope, sign an agreement and submit a payment without staff data entry.
2. A finance manager can issue an invoice, reconcile a submitted UPI/bank payment, issue a receipt, and see an audit record.
3. A client can only view their own organisation's records; a contributor cannot manage members or finance controls.
4. A project manager can publish a milestone and receive a client approval/revision decision.
5. The experience works at 360px wide, supports keyboard navigation, and has no critical accessibility contrast failures.

## 12. Launch checklist

- Configure transactional email, e-sign provider and payment gateway secrets in server-side environment variables.
- Apply and verify the database migration and RLS policies in a non-production project first.
- Create service, agreement, invoice and notification templates; train account and finance owners.
- Test each role with separate accounts, including cross-organisation access denial and payment webhook replay protection.
- Publish privacy, terms, refund, payment and support-SLA policies; set operational owners and escalation timings.
