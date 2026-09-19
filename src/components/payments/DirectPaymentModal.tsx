import React, { useState } from "react";
import {
  X,
  QrCode,
  Landmark,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  FileCheck2,
  Sparkles,
  Building2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { ProjectInvoice, DEFAULT_BANKING_DETAILS, DEFAULT_BANK_ACCOUNTS } from "@/types/projectLifecycle";

interface DirectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: ProjectInvoice;
  projectName?: string;
  clientName?: string;
  clientEmail?: string;
  onSubmitProof: (proofData: {
    transactionId: string;
    paymentMode: "UPI" | "IMPS" | "NEFT" | "Net Banking" | "Bank Transfer";
    payerName: string;
    payerPhone: string;
    proofNotes?: string;
  }) => Promise<void>;
  loading?: boolean;
}

export const DirectPaymentModal: React.FC<DirectPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  projectName = "Siddhi Dynamics Project",
  clientName = "",
  clientEmail = "",
  onSubmitProof,
  loading = false,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"qr" | "bank">("qr");

  // Form states for transaction verification
  const [transactionId, setTransactionId] = useState(invoice.transaction_id || "");
  const [paymentMode, setPaymentMode] = useState<"UPI" | "IMPS" | "NEFT" | "Net Banking" | "Bank Transfer">(
    invoice.payment_mode || "UPI"
  );
  const [payerName, setPayerName] = useState(invoice.paid_by_name || clientName);
  const [payerPhone, setPayerPhone] = useState(invoice.paid_by_phone || "");
  const [proofNotes, setProofNotes] = useState(invoice.admin_notes || "");
  const [submittedSuccess, setSubmittedSuccess] = useState(
    invoice.verification_status === "pending_verification"
  );

  if (!isOpen) return null;

  const numericAmount = invoice.numeric_amount || parseInt(invoice.amount.replace(/\D/g, "") || "0", 10);
  const formattedAmount = numericAmount > 0 ? `₹${numericAmount.toLocaleString("en-IN")}` : invoice.amount;

  const upiId = DEFAULT_BANKING_DETAILS.upi_id || "6303602743@sbi";
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Siddhi Dynamics LLP")}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(invoice.title || "Project Invoice")}`;
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiPayUrl)}`;

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Please enter the UTR / Transaction Reference ID from your payment receipt.");
      return;
    }
    if (!payerName.trim()) {
      toast.error("Please enter the payer account name.");
      return;
    }

    try {
      await onSubmitProof({
        transactionId: transactionId.trim(),
        paymentMode,
        payerName: payerName.trim(),
        payerPhone: payerPhone.trim(),
        proofNotes: proofNotes.trim(),
      });
      setSubmittedSuccess(true);
      toast.success("Payment proof submitted! Admin will verify and mark received.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit verification details.");
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 pt-20 pb-8 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl text-stone-100 flex flex-col overflow-hidden my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-950/60 flex items-start justify-between">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Direct UPI & Bank Transfer
              </span>
              <span className="text-xs text-stone-400">Zero Gateway Fees</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{invoice.title || "Project Invoice Payment"}</h2>
            <p className="text-xs text-stone-400">
              Project: <span className="text-stone-200 font-semibold">{projectName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-left">
          {/* Amount Ribbon */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">Payable Amount</p>
              <p className="text-3xl font-extrabold text-emerald-400 mt-0.5">{formattedAmount}</p>
            </div>
            <div className="text-right text-xs text-stone-300 space-y-0.5">
              <p className="font-semibold text-white">Siddhi Dynamics LLP</p>
              <p className="text-[11px] text-emerald-400/90 font-mono">PAN: {DEFAULT_BANKING_DETAILS.pan}</p>
            </div>
          </div>

          {/* Pending Verification Banner if already submitted */}
          {(submittedSuccess || invoice.verification_status === "pending_verification") && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-sm text-amber-300">Payment Verification in Progress</p>
                <p>
                  UTR reference <strong className="font-mono text-white">{transactionId || invoice.transaction_id}</strong> is currently being verified against our bank ledger. Once verified, your service agreement & milestones unlock automatically.
                </p>
              </div>
            </div>
          )}

          {/* Payment Method Switcher */}
          <div className="flex border-b border-stone-800 gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "qr"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <QrCode className="w-4 h-4" /> Scan UPI QR Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
                activeTab === "bank"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Landmark className="w-4 h-4" /> Bank Account / IMPS / NEFT
            </button>
          </div>

          {/* TAB 1: QR CODE & UPI */}
          {activeTab === "qr" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-stone-950 rounded-2xl border border-stone-800">
                <div className="bg-white p-2.5 rounded-xl shadow-lg">
                  <img
                    src={qrCodeImgUrl}
                    alt="Siddhi Dynamics UPI QR"
                    className="w-48 h-48 rounded-lg object-contain"
                    onError={(e) => {
                      // Fallback if image fails
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-2 font-mono">GPay · PhonePe · Paytm · BHIM</span>
              </div>

              <div className="md:col-span-7 space-y-4">
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400">Official UPI ID</span>
                    <p className="font-mono text-emerald-400 font-bold text-sm mt-0.5">{upiId}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(upiId, "upi", "UPI ID")}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === "upi" ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="text-xs text-stone-300 space-y-2">
                  <p className="font-semibold text-white">How to pay via QR / UPI:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-stone-400 text-[11px] leading-relaxed">
                    <li>Open Google Pay, PhonePe, Paytm or any UPI app.</li>
                    <li>Scan the QR code above or pay directly to UPI ID <strong className="text-stone-200 font-mono">{upiId}</strong>.</li>
                    <li>Ensure beneficiary name is <strong className="text-emerald-400">Siddhi Dynamics LLP</strong>.</li>
                    <li>Complete payment and copy the 12-digit <strong className="text-white">UTR / Transaction Reference Number</strong>.</li>
                    <li>Paste the UTR number in the form below to initiate instant verification.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANK ACCOUNT DETAILS */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              {DEFAULT_BANK_ACCOUNTS.map((acc, i) => (
                <div key={acc.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                      <Landmark className="w-4 h-4" /> {acc.bank_name} ({acc.account_type || "Account"})
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded">
                      {i === 0 ? "Primary Current A/C" : "Partner A/C"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/60">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Account Holder</span>
                      <p className="font-bold text-white mt-0.5">{acc.account_holder}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold">Account Number</span>
                        <p className="font-mono font-bold text-emerald-400 mt-0.5">{acc.account_number}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.account_number, `acc_${acc.id}`, "Account Number")}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                        title="Copy Account Number"
                      >
                        {copiedKey === `acc_${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold">IFSC Code</span>
                        <p className="font-mono font-bold text-emerald-400 mt-0.5">{acc.ifsc_code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.ifsc_code, `ifsc_${acc.id}`, "IFSC Code")}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                        title="Copy IFSC Code"
                      >
                        {copiedKey === `ifsc_${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800/60">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">Branch</span>
                      <p className="font-medium text-stone-200 mt-0.5">Khaleelwadi, Nizamabad</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: VERIFICATION FORM */}
          <div className="pt-4 border-t border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Submit Payment Details for Verification</h3>
            </div>
            <p className="text-xs text-stone-400 mb-4">
              Enter your transfer reference number below. Once received, our finance admin confirms receipt directly against our bank statement.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    UTR / Transaction Reference ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 425689123014 or UPI ref ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-stone-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                    <option value="IMPS">IMPS Immediate Transfer</option>
                    <option value="NEFT">NEFT / RTGS</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Bank Transfer">Direct Bank Counter Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Payer Account Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name on bank / UPI account"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Payer Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="10-digit mobile"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Optional Note / Screenshot Link
                </label>
                <input
                  type="text"
                  placeholder="Optional drive link, remarks or transaction notes"
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-300 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    "Submitting…"
                  ) : submittedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Update Submitted Verification
                    </>
                  ) : (
                    <>
                      Submit for Admin Verification <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
