import React from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  FileSignature,
  ArrowRight,
  Briefcase
} from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAgreement?: () => void;
  onGoToActiveWork?: () => void;
  amount?: string;
  invoiceTitle?: string;
  projectName?: string;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewAgreement,
  onGoToActiveWork,
  amount,
  invoiceTitle,
  projectName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col text-stone-900 text-center my-auto">
        
        {/* Top Celebration Header with Close Button */}
        <div className="relative bg-gradient-to-b from-emerald-50/80 via-lime-50/40 to-white pt-6 pb-2 px-6 flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Lottie Animation Container */}
          <div className="w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden">
            <iframe
              src="https://lottie.host/embed/b5b5dc0d-b1d0-4c21-8487-4fb63da17ce3/Hxqzo22T6c.lottie"
              className="w-full h-full border-0 pointer-events-none scale-110"
              title="Payment Success Animation"
              loading="eager"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold mt-1 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Payment Verified & Received</span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Payment Successful!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
            Thank you! Your transaction has been processed securely. Your service engagement is now officially active.
          </p>
        </div>

        {/* Transaction & Unlocked Perks Card */}
        <div className="p-6 space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Status</span>
              <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Confirmed via Cashfree
              </span>
            </div>

            {amount && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Amount Paid</span>
                <span className="font-extrabold text-stone-900 text-sm">{amount}</span>
              </div>
            )}

            {invoiceTitle && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Invoice / Description</span>
                <span className="font-semibold text-stone-800 truncate max-w-[200px]">{invoiceTitle}</span>
              </div>
            )}

            {projectName && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Project</span>
                <span className="font-semibold text-stone-800 truncate max-w-[200px]">{projectName}</span>
              </div>
            )}

            <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Service Agreement</span>
              <span className="text-xs font-bold text-emerald-700 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Fully Unlocked
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-lime-50/70 border border-lime-200 text-xs text-lime-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-lime-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Official <strong>Siddhi Dynamics LLP</strong> banking credentials (SBI Account, IFSC, LLPIN, PAN) and contractual agreement are unlocked in your portal for accounting & GST filings.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {onViewAgreement && (
              <button
                onClick={() => {
                  onClose();
                  onViewAgreement();
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSignature className="w-4 h-4" /> View / Print Service Agreement & Bank Records
              </button>
            )}

            {onGoToActiveWork && (
              <button
                onClick={() => {
                  onClose();
                  onGoToActiveWork();
                }}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-lime-300" /> Go to Active Engagements & Roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Continue to Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
