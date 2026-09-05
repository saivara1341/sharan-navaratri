import React from "react";
import {
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Building,
  ShieldCheck
} from "lucide-react";

interface OnboardingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment?: () => void;
  onGoToPortal?: () => void;
  projectName?: string;
  advanceAmount?: string;
}

export const OnboardingSuccessModal: React.FC<OnboardingSuccessModalProps> = ({
  isOpen,
  onClose,
  onProceedToPayment,
  onGoToPortal,
  projectName,
  advanceAmount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col text-stone-900 text-center my-auto">
        
        {/* Top Celebration Header */}
        <div className="relative bg-gradient-to-b from-lime-50/80 via-emerald-50/40 to-white pt-6 pb-2 px-6 flex flex-col items-center">
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
              src="https://lottie.host/embed/2f6474da-7fc2-441a-9d22-25c7e7789bb4/XPGlnH6Wo3.lottie"
              className="w-full h-full border-0 pointer-events-none scale-110"
              title="Client Onboarding Finished Animation"
              loading="eager"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-900 border border-lime-300 text-xs font-bold mt-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-lime-700" />
            <span>Onboarding Completed Successfully</span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            You're All Set!
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
            Your project requirements, timeline preferences, and scope specifications have been captured and verified.
          </p>
        </div>

        {/* Details & Next Steps Card */}
        <div className="p-6 space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Onboarding Status</span>
              <span className="font-bold text-emerald-700 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Scope Confirmed
              </span>
            </div>

            {projectName && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Project</span>
                <span className="font-semibold text-stone-800 truncate max-w-[220px]">{projectName}</span>
              </div>
            )}

            {advanceAmount && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Advance Payment Required</span>
                <span className="font-extrabold text-stone-900 text-sm text-emerald-700">{advanceAmount}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/60">
              <span className="text-stone-500 font-medium">Service Activation</span>
              <span className="font-semibold text-stone-700">Starts upon advance confirmation</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Once advance is confirmed via Cashfree, the signed Service Order Agreement and verified Siddhi Dynamics LLP credentials unlock automatically.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {onProceedToPayment ? (
              <button
                onClick={() => {
                  onClose();
                  onProceedToPayment();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-lime-300" /> Proceed to Cashfree Secure Payment
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {onGoToPortal && (
              <button
                onClick={() => {
                  onClose();
                  onGoToPortal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Go to Workspace Overview
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
