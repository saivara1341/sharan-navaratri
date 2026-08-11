# PRD — Client & Requirement Management (on-platform)

## Goal
Run the entire client lifecycle inside Siddhi Dynamics: intake a requirement, qualify it, convert it to a client project, track scope changes, approvals and delivery — with no email/WhatsApp back-and-forth.

## Roles (existing on the site)
| Role | Route | What they do in this module |
| --- | --- | --- |
| Admin | `/admin-hq-nexus` | Full control: all clients, all requirements, assign owners, set status/priority, approve or reject, convert to project |
| Client | `/portal/client` | Submit requirements, track status, respond to clarifications, approve scope, view their project timeline |
| Partner / Agency | `/portal/agency` | Submit and manage requirements on behalf of their own clients only |
| Employee | `/portal/employee` | See requirements assigned to them, post progress updates, mark delivered |
| Investor | `/portal/investor` | Read-only rollup: pipeline count, value, delivery health (no client PII detail) |

## Core objects
1. **Client record** — company, contact, owner, status (Lead → Active → Paused → Churned), tier, notes.
2. **Requirement** — title, description, type (Website / SaaS / ERP / Automation / SEO), priority, budget range, target date, status, assigned employee, client link.
3. **Requirement thread** — timestamped comments/clarifications between client, admin and assigned employee.
4. **Requirement update** — status change log + progress %, visible to the client.
5. **Attachments** — files on a requirement (brief, references), stored in platform storage.

## Requirement lifecycle
`Submitted → In Review → Clarification Needed → Approved → In Progress → Delivered → Closed` (or `Rejected` at review).
Only Admin can move to Approved/Rejected/Closed. Employee can move In Progress → Delivered. Client can respond in the thread and approve scope.

## Pages to build
1. **Admin → Clients & Requirements console** (new tab in Admin Portal)
   - Client table with search, status filter, owner, requirement count, quick add/edit drawer.
   - Requirement board (kanban by status) + list view, filters by priority/type/owner.
   - Requirement detail drawer: full brief, thread, status/priority/assignee controls, progress slider, attachments.
2. **Client Portal → "My Requirements"** tab
   - Submit-requirement form (title, type, description, priority, budget, target date, files).
   - Cards with status pill, progress bar, latest update; detail view with thread reply.
3. **Agency Portal → per-client requirements** panel on the existing client cards (submit + track for their clients).
4. **Employee Portal → "Assigned Work"** tab — list of assigned requirements, status control, progress + update note.
5. **Investor Portal → pipeline stat strip** — counts by status, aggregate value, delivery health chart (no names).

## Data & security
- New tables: `clients`, `requirements`, `requirement_messages`, `requirement_events`; storage bucket `requirement-files`.
- RLS: admin full access via existing `is_portal_admin()`; client sees rows where their email matches the client record; partner sees rows for clients where `agency_email` matches; employee sees rows where `assigned_to_email` matches; investor gets aggregate access via a security-definer summary function only.
- Every table gets explicit GRANTs; no anonymous access.

## Non-goals (v1)
Invoicing/payments (already handled by agency invoices), time tracking, external client logins without an account, MCP/AI automation.

## Success criteria
Admin can go from a new requirement to Delivered without leaving the platform; the client sees every status change in their portal within seconds.

## Build order
1. Migration (tables, RLS, grants, storage bucket)
2. Shared hooks + types
3. Admin console → Client portal → Employee → Agency → Investor rollup
