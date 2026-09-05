import React from "react";
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  FileCheck,
  FileSignature,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ReceiptText
} from "lucide-react";
import { parseSubmissionMessage } from "@/lib/parseSubmissionMessage";
import { parseProjectMeta } from "@/lib/projectLifecycleHelper";
import { ProjectInvoice } from "@/types/projectLifecycle";

interface Submission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  designation?: string;
  inquiry_type?: string;
  message: string;
  status: string;
  progress: number;
  created_at: string;
  bounty_reward?: string | null;
}

interface ServiceDetailsModalProps {
  project: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenServiceRequest: (project: Submission) => void;
  onOpenAgreement: (project: Submission) => void;
  onPayInvoice: (project: Submission, invoice: ProjectInvoice) => void;
  paymentStatuses: Record<string, string>;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenServiceRequest,
  onOpenAgreement,
  onPayInvoice,
  paymentStatuses
}) => {
  if (!isOpen || !project) return null;

  const m = parseProjectMeta(project.bounty_reward);
  const parsedMsg = parseSubmissionMessage(project.message);
  const hasQuote = Boolean(m.agreement);

  const advInv = m.invoices?.find(
    i => i.title.toLowerCase().includes("advance") || i.id === "SD-INV-001"
  );
  const isAdvPaid =
    Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${project.id}:${advInv.id}`] === "PAID")) ||
    Boolean(m.service_start_date);

  const services = parsedMsg.selectedServices.length > 0
    ? parsedMsg.selectedServices
    : [project.inquiry_type || "Tailored Engineering Service"];

  const displayTitle = project.organization || project.name || "Your Project Engagement";
  const displayDate = new Date(project.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // Determine stage in pipeline
  const currentStage = isAdvPaid
    ? "active"
    : hasQuote
    ? "quote_ready"
    : "discovery";

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-stone-950/80 p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 md:p-10 md:pt-24 md:pb-12 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-6 sm:px-8 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-[.18em] text-lime-300">
                Service Engagement Details
              </span>
              <span className="rounded-full bg-stone-800 text-stone-300 px-2.5 py-0.5 text-[11px] font-semibold border border-stone-700">
                Ref: #{project.id.slice(0, 8)}
              </span>
            </div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {displayTitle}
            </h2>
            <p className="mt-1 text-xs text-stone-400">
              Submitted on {displayDate} · Client: {project.name} ({project.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Status & Lifecycle Timeline Bar */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  isAdvPaid
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : hasQuote
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}>
                  ● {isAdvPaid ? "Service Active & In Execution" : hasQuote ? "Price Quote Ready for Onboarding" : "Under Scope & Quotation Review"}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Status: <strong className="text-stone-800">{project.status || "Discovery"}</strong>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-stone-700">Milestone Progress: {project.progress || 0}%</span>
              </div>
            </div>

            {/* Step Pipeline */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-200/60">
              <div className="space-y-1">
                <div className="mx-auto w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  ✓
                </div>
                <p className="text-[11px] font-bold text-stone-900">1. Requirement</p>
                <p className="text-[10px] text-stone-400">Captured & logged</p>
              </div>

              <div className="space-y-1">
                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  hasQuote ? "bg-emerald-600 text-white" : "bg-blue-600 text-white animate-pulse"
                }`}>
                  {hasQuote ? "✓" : "2"}
                </div>
                <p className="text-[11px] font-bold text-stone-900">2. Scope & Quote</p>
                <p className="text-[10px] text-stone-400">{hasQuote ? "Assigned by Admin" : "Reviewing"}</p>
              </div>

              <div className="space-y-1">
                <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                  isAdvPaid ? "bg-emerald-600 text-white" : hasQuote ? "bg-amber-500 text-white" : "bg-stone-200 text-stone-500"
                }`}>
                  {isAdvPaid ? "✓" : "3"}
                </div>
                <p className="text-[11px] font-bold text-stone-900">3. Onboarding & Start</p>
                <p className="text-[10px] text-stone-400">{isAdvPaid ? "Active Service" : "Form & Advance"}</p>
              </div>
            </div>
          </div>

          {/* Key Dates & Financial Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1 shadow-sm">
              <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Service Start Date
              </span>
              <p className="text-sm font-bold text-stone-900">
                {m.service_start_date ? m.service_start_date : "Starts on Advance"}
              </p>
              <p className="text-[10px] text-stone-500">
                {m.service_start_date ? "Official date stamped" : "Triggered upon Cashfree payment"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1 shadow-sm">
              <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Target Handover
              </span>
              <p className="text-sm font-bold text-stone-900">
                {m.deadline || "Per Roadmap"}
              </p>
              <p className="text-[10px] text-stone-500">Estimated delivery window</p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-1 shadow-sm">
              <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Agreed Quote
              </span>
              <p className="text-sm font-bold text-emerald-700">
                {m.agreement || parsedMsg.budgetPreference || "Flexible / In Review"}
              </p>
              <p className="text-[10px] text-stone-500">
                {m.payment_structure || "Milestone-based delivery"}
              </p>
            </div>
          </div>

          {/* Selected Services & Scope */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Selected Services & Scope
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((srv, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-lime-100/70 border border-lime-300 px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                  {srv}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-2">
              <p className="text-xs font-semibold text-stone-600">Requirement Summary:</p>
              <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                {m.scope_summary || parsedMsg.cleanMessage || "Requirements logged for review."}
              </p>
              {parsedMsg.outreach && (
                <p className="text-xs text-stone-500 pt-2 border-t border-stone-200/60">
                  <strong className="text-stone-700">Outreach Preference:</strong> {parsedMsg.outreach}
                </p>
              )}
            </div>
          </div>

          {/* ACTION CENTER (Context-Aware) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Action Center
            </h3>

            {/* Stage 1: Discovery (No quote yet) */}
            {currentStage === "discovery" && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-700" /> Discovery & Scope Assessment in Progress
                  </p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Our lead architect is assessing your requirements for <strong>{services.join(", ")}</strong> and preparing a clear timeline and milestone quotation. You will receive an email and this portal will update immediately once the quote is ready.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://wa.me/916303602743?text=Hi%20Siddhi%20Dynamics,%20following%20up%20on%20my%20service%20requirement%20for%20we%20magnetics"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-lime-300" /> Chat with Engineering Lead
                  </a>
                  <a
                    href="tel:+916303602743"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-600" /> Call +91 6303602743
                  </a>
                  <a
                    href="mailto:contact@siddhidynamics.com?subject=Project%20Scope%20Query"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-600" /> Email Support
                  </a>
                </div>
              </div>
            )}

            {/* Stage 2: Quote Ready (Advance Pending) */}
            {currentStage === "quote_ready" && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-700" /> Price Quote & Scope Approved by Siddhi Dynamics
                    </p>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Assigned Quote: <strong className="text-base text-stone-900">{m.agreement}</strong> · Payment structure: <strong>{m.payment_structure || "50% Advance + 50% on Delivery"}</strong>.
                    </p>
                    <p className="text-xs text-amber-800">
                      To lock in your start date and officially initiate the service, complete the short Service Request Form and confirm the advance via Cashfree.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenServiceRequest(project);
                    }}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <FileCheck className="w-4 h-4 text-lime-300" /> Complete Service Request & Start Service
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Stage 3: Service Active (Advance Paid) */}
            {currentStage === "active" && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" /> Service Active & Verified
                    </p>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Advance payment confirmed via Cashfree. Official Service Agreement, tax invoice, and verified SBI corporate credentials are fully unlocked.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAgreement(project);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <FileSignature className="w-4 h-4 text-lime-300" /> View & Print Service Agreement
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Invoices & Financials */}
          {m.invoices && m.invoices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Invoices & Payment Schedule
              </h3>
              <div className="space-y-2">
                {m.invoices.map((inv) => {
                  const isPaid = inv.status === "paid" || paymentStatuses[`${project.id}:${inv.id}`] === "PAID";
                  return (
                    <div
                      key={inv.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-stone-200 bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <ReceiptText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{inv.id} · {inv.title}</p>
                          <p className="text-[11px] text-stone-500">{inv.description || "Milestone payment"} {inv.due_date ? `· Due: ${inv.due_date}` : ""}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-sm font-extrabold text-stone-900">{inv.amount}</span>
                        {isPaid ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              onPayInvoice(project, inv);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-lime-300" /> Pay via Cashfree
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline Updates */}
          {m.updates && m.updates.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Execution Updates & Milestones
              </h3>
              <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 bg-white p-4">
                {m.updates.filter(u => u.client_visible !== false).map((u) => (
                  <div key={u.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{u.title}</span>
                      <span className="text-stone-400">{u.date}</span>
                    </div>
                    <p className="text-xs text-stone-600">{u.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance & Consent Record */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Compliance & Consent Verification
            </p>
            <p>
              Client consent logged under Digital Personal Data Protection (DPDP) guidelines on{" "}
              <strong>{parsedMsg.consentTimestamp ? new Date(parsedMsg.consentTimestamp).toLocaleString("en-IN") : displayDate}</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 sm:px-8 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
