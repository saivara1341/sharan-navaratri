import React from "react";
import {
  X,
  Calendar,
  Clock,
  FileCheck,
  FileSignature,
  CreditCard,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ReceiptText,
  Globe,
  Laptop,
  MapPin,
  TrendingUp,
  ExternalLink
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
    : [project.inquiry_type || "Custom Digital Service"];

  const displayTitle = project.organization || project.name || "Your Project Engagement";
  const displayDate = new Date(project.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-stone-950/80 p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[85vh] flex flex-col text-stone-900">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 sm:p-7 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isAdvPaid
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : hasQuote
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {isAdvPaid ? "● Active Service" : hasQuote ? "● Quote Ready" : "⏳ Under Process"}
              </span>
              <span className="text-xs text-stone-400">
                Submitted on {displayDate}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white tracking-tight">
              {displayTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          
          {/* Services & Scope / Deliverables Summary Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Scope / Deliverables Summary
              </span>
              <p className="text-xs font-bold text-stone-900 leading-relaxed">
                {m.scope_summary || `Services: ${services.join(", ")}`}
              </p>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Services Requested
              </span>
              <div className="flex flex-wrap gap-2">
                {services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-xl bg-white border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm"
                  >
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Process & Status Section */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Current Process
              </span>
              <span className="text-xs font-bold text-stone-700">
                {isAdvPaid ? "Execution: Active" : hasQuote ? "Action Required" : "Status: Under Review"}
              </span>
            </div>

            {/* If Under Process (No quote yet) */}
            {!hasQuote && !isAdvPaid && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-stone-900">
                  Your project requirements are currently under process.
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our technical team is reviewing your scope to prepare a formal milestone quotation and timeline. Once assigned, you can review terms and confirm your service onboarding right here.
                </p>
              </div>
            )}

            {/* If Quote is Assigned */}
            {hasQuote && !isAdvPaid && (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Quotation Assigned</p>
                  <p className="text-lg font-bold text-stone-900 mt-0.5">{m.agreement}</p>
                  <p className="text-xs text-amber-900 mt-1">
                    Structure: <strong>{m.payment_structure || "50% Advance + 50% on Handover"}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenServiceRequest(project);
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-lime-300" /> Review Onboarding & Pay Advance
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* If Advance is Paid (Active) */}
            {isAdvPaid && (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Service Active</p>
                  <p className="text-xs text-emerald-900 mt-1">
                    Start Date: <strong>{m.service_start_date || "Confirmed"}</strong> · Target Handover: <strong>{m.deadline || "Per Roadmap"}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAgreement(project);
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" /> View Service Agreement & Bank Details
                </button>
              </div>
            )}
          </div>

          {/* Deliverables, Demos & Live Progress Reports Section */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" /> Deliverables, Demos & Live Reports
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Project Progress</span>
            </div>

            {(m.demo_url || m.website_url || m.seo_report_url || m.gbp_url) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Website Demo / Staging */}
                {m.demo_url && (
                  <div className="p-3.5 rounded-xl border border-cyan-200 bg-cyan-50/50 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block">Website Development</span>
                        <h4 className="text-xs font-bold text-stone-900">Demo / Staging Preview</h4>
                      </div>
                      <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
                        <Laptop className="w-4 h-4" />
                      </div>
                    </div>
                    <a
                      href={m.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
                    >
                      Preview Demo Website <ExternalLink className="w-3 h-3 text-cyan-300" />
                    </a>
                  </div>
                )}

                {/* Live Production Website */}
                {m.website_url && (
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Production Website</span>
                        <h4 className="text-xs font-bold text-stone-900">Official Live Domain</h4>
                      </div>
                      <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                        <Globe className="w-4 h-4" />
                      </div>
                    </div>
                    <a
                      href={m.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors shadow-sm"
                    >
                      Visit Live Website <ExternalLink className="w-3 h-3 text-emerald-200" />
                    </a>
                  </div>
                )}

                {/* SEO & AEO Progress Report */}
                {m.seo_report_url && (
                  <div className="p-3.5 rounded-xl border border-lime-200 bg-lime-50/50 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-lime-800 block">SEO & Rankings</span>
                        <h4 className="text-xs font-bold text-stone-900">Live Progress Report</h4>
                      </div>
                      <div className="p-1.5 rounded-lg bg-lime-100 text-lime-900">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <a
                      href={m.seo_report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-sm"
                    >
                      View SEO & Analytics Report <ExternalLink className="w-3 h-3 text-lime-300" />
                    </a>
                  </div>
                )}

                {/* Google Business Profile */}
                {m.gbp_url && (
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Google Business Profile</span>
                        <h4 className="text-xs font-bold text-stone-900">Local Maps Listing</h4>
                      </div>
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                    <a
                      href={m.gbp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      View on Google Maps <ExternalLink className="w-3 h-3 text-amber-200" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-500 leading-relaxed">
                🚀 Deliverables, website demo preview links, and SEO/GBP performance tracking reports will be linked here by our admin team as soon as milestones commence.
              </div>
            )}
          </div>

          {/* Payments & Invoices Section */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Payments & Billing
            </span>

            {m.invoices && m.invoices.length > 0 ? (
              <div className="space-y-2">
                {m.invoices.map((inv) => {
                  const isPaid = inv.status === "paid" || paymentStatuses[`${project.id}:${inv.id}`] === "PAID";
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          <ReceiptText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">{inv.title || inv.id}</p>
                          <p className="text-[11px] text-stone-500">{inv.amount} {inv.due_date ? `· Due: ${inv.due_date}` : ""}</p>
                        </div>
                      </div>

                      <div>
                        {isPaid ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              onPayInvoice(project, inv);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-lime-300" /> Pay via Cashfree
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
                {hasQuote
                  ? "Advance invoice will be created upon onboarding."
                  : "Invoices and Cashfree payment gateway will be issued once the quotation is confirmed."}
              </div>
            )}
          </div>

          {/* Direct Support Section */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-500 font-medium">Need direct assistance with this service?</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/916303602743?text=Hi%20Siddhi%20Dynamics,%20following%20up%20on%20my%20service%20requirement%20for%20${encodeURIComponent(displayTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <a
                href="tel:+916303602743"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> +91 6303602743
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
