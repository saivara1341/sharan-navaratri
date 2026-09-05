import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2, Building, Landmark, Download, FileText } from "lucide-react";
import { ProjectLifecycleMeta, DEFAULT_BANKING_DETAILS, DEFAULT_BANK_ACCOUNTS } from "@/types/projectLifecycle";

interface ServiceAgreementModalProps {
  projectName: string;
  clientName: string;
  clientEmail: string;
  meta: ProjectLifecycleMeta;
  onClose: () => void;
}

export const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({
  projectName,
  clientName,
  clientEmail,
  meta,
  onClose
}) => {
  const bank = meta.banking_details || DEFAULT_BANKING_DETAILS;
  const advanceInv = meta.invoices?.find(i => i.title.toLowerCase().includes("advance") || i.id === "SD-INV-001");
  const isPaid = advanceInv?.status === "paid" || Boolean(meta.service_start_date);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 bg-stone-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-stone-900 text-left print:max-h-none print:shadow-none print:border-none print:w-full my-auto">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Verified Agreement
            </span>
            <span className="text-xs text-stone-500 font-medium">Unlocked after advance payment</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-7 text-xs leading-relaxed print:p-6 print:overflow-visible">
          {/* Official Letterhead */}
          <div className="border-b-2 border-stone-900 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-stone-950 uppercase">Siddhi Dynamics LLP</h1>
                <p className="text-xs text-stone-600 mt-1">3-5-260/2, Shivaji Nagar Rd, Kotagally, near Veterinary Hospital, Nizamabad, Telangana 503001</p>
                <p className="text-[11px] text-stone-500 mt-0.5">LLPIN: {bank.llpin || "ACX-6222"} &nbsp;|&nbsp; PAN: {bank.pan || "AFXFS7312H"} &nbsp;|&nbsp; Phone: +91 6303602743 &nbsp;|&nbsp; siddhidynamics.in</p>
              </div>
              <div className="text-right sm:shrink-0">
                <div className="inline-block bg-stone-900 text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md">
                  Official Service Agreement
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Date: {meta.service_start_date || new Date().toISOString().split("T")[0]}</p>
                <p className="text-[11px] text-stone-500">Ref: {advanceInv?.id || "SD-AGR-001"}</p>
              </div>
            </div>
          </div>

          {/* Client & Service Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Client / Business Name</p>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{clientName}</p>
              <p className="text-stone-600 mt-0.5">{clientEmail}</p>
              {projectName && <p className="text-stone-500 text-[11px] mt-0.5">Org: {projectName}</p>}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Service Engagement</p>
              <p className="text-sm font-bold text-stone-900 mt-0.5">{meta.scope_summary || "Digital Development & Growth Services"}</p>
              <p className="text-stone-600 mt-0.5">
                Official Start Date: <strong>{meta.service_start_date || "Active upon Advance Payment"}</strong>
              </p>
              {meta.deadline && <p className="text-stone-500 text-[11px] mt-0.5">Target Handover: {meta.deadline}</p>}
            </div>
          </div>

          {/* 1. Agreed Commercials & Payment Structure */}
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-1.5 flex items-center gap-2">
              <span>1. Commercial Agreement & Payment Terms</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-stone-200 bg-white">
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold">Total Agreed Amount</span>
                <p className="text-base font-extrabold text-stone-950 mt-0.5">{meta.agreement || "₹25,000"}</p>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold">Payment Structure</span>
                <p className="font-bold text-stone-900 mt-0.5">{meta.payment_structure || "50% Advance + 50% on Delivery"}</p>
              </div>
              <div>
                <span className="text-stone-500 text-[10px] uppercase font-bold">Advance Payment Status</span>
                <p className={`font-bold mt-0.5 flex items-center gap-1 ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {isPaid ? "PAID via Cashfree" : "Pending Payment"}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Official Banking Details (Unlocked) */}
          <div className="space-y-2.5">
            <div className="border-b border-stone-200 pb-1.5 flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950">
                2. Mode of Payment & Official Banking Credentials
              </h2>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified Official Banking
              </span>
            </div>

            {/* Both Bank Accounts Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(bank.accounts && bank.accounts.length > 0
                ? bank.accounts.filter(a => a.is_selected !== false)
                : DEFAULT_BANK_ACCOUNTS
              ).map((acc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/90 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-200/70 pb-1">
                    <span className="font-extrabold text-stone-900">{acc.account_holder}</span>
                    <span className="text-[10px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {acc.account_type || "Official Account"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">Bank Name:</span>
                    <p className="font-bold text-stone-900">{acc.bank_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div>
                      <span className="text-stone-500 text-[10px] block">A/C Number:</span>
                      <p className="font-bold text-stone-900 tracking-wider">{acc.account_number}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 text-[10px] block">IFSC Code:</span>
                      <p className="font-bold text-stone-900 uppercase tracking-wider">{acc.ifsc_code}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* UPI & LLP Contact Info */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {bank.upi_id && (
                <div>
                  <span className="text-stone-500 font-medium">Official UPI ID:</span>
                  <p className="font-mono font-bold text-stone-900 mt-0.5">{bank.upi_id}</p>
                </div>
              )}
              <div>
                <span className="text-stone-500 font-medium">Point of Contact / Phone:</span>
                <p className="font-bold text-stone-900 mt-0.5">{bank.poc_name || "Sarugu Sai Vara Prasad"} — {bank.poc_phone || "+91 6303602743"}</p>
              </div>
            </div>
            <p className="text-[10px] text-stone-500 italic mt-1">
              Note: Advance payment is non-refundable once work has commenced. Balance payment is due before final delivery / handover / go-live.
            </p>
          </div>

          {/* 3. Client Onboarding Checklist / Form inputs */}
          {meta.service_form && (
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-950 border-b border-stone-200 pb-1.5">
                3. Client Onboarding Specification & Scope Confirmation
              </h2>
              <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                {meta.service_form.business_goal && (
                  <p><strong>Primary Goal:</strong> {meta.service_form.business_goal}</p>
                )}
                {meta.service_form.target_audience && (
                  <p><strong>Target Audience:</strong> {meta.service_form.target_audience}</p>
                )}
                {meta.service_form.materials_provided && meta.service_form.materials_provided.length > 0 && (
                  <div>
                    <strong>Materials / Access to Provide:</strong>{" "}
                    <span>{meta.service_form.materials_provided.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Signatures Block */}
          <div className="pt-6 border-t border-stone-300">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">For Siddhi Dynamics LLP</p>
                <div className="h-14 flex items-end">
                  <div className="font-serif italic text-base text-stone-800 border-b border-stone-400 pb-1 w-44">
                    Sarugu Sai Vara Prasad
                  </div>
                </div>
                <p className="font-bold text-stone-900 text-[11px]">Sarugu Sai Vara Prasad</p>
                <p className="text-stone-500 text-[10px]">Founder & Designated Partner</p>
                <p className="text-stone-500 text-[10px]">Place: Nizamabad, Telangana</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">For the Client</p>
                <div className="h-14 flex items-end">
                  <div className="font-serif italic text-base text-stone-800 border-b border-stone-400 pb-1 w-44">
                    {clientName}
                  </div>
                </div>
                <p className="font-bold text-stone-900 text-[11px]">{clientName}</p>
                <p className="text-stone-500 text-[10px]">Confirmed Digitally via Workspace</p>
                <p className="text-stone-500 text-[10px]">Verified: {meta.service_start_date || new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
