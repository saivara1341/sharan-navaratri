import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Download, 
  Building2, 
  ShieldCheck, 
  Landmark, 
  QrCode, 
  Copy, 
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export interface InvoiceModalData {
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  status: 'paid' | 'pending' | 'cancelled';
  // Financial amounts
  amount: string; // e.g. "₹25,000"
  numeric_amount: number;
  payment_structure?: string;
  // Verification details
  transaction_id?: string; // UTR
  payment_mode?: string;
  paid_at?: string;
  paid_by?: string;
  // Client details
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_organization?: string;
  client_address?: string;
  client_gstin?: string;
  // Agency specific details (if referred / managed by agency)
  is_agency_invoice?: boolean;
  agency_name?: string;
  agency_poc_name?: string;
  agency_email?: string;
  agency_phone?: string;
  agency_address?: string;
  agency_id_type?: 'LLPIN' | 'CIN' | 'GSTIN' | 'Not Applicable';
  agency_id_number?: string;
  commission_rate?: number;
  commission_amount?: number;
  // Project / Service scope
  project_title: string;
  service_scope?: string;
  complexity_tier?: string;
}

interface DigitalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceModalData | null;
}

export const DigitalInvoiceModal: React.FC<DigitalInvoiceModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const isPaid = data.status === 'paid' || !!data.transaction_id;

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white text-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200"
        >
          {/* ── Top Modal Control Bar (Excluded from Print) ────────────────────── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 print:hidden shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  {data.is_agency_invoice ? 'Agency Settlement & Service Invoice' : 'Official Tax & Service Invoice'}
                </h3>
                <span className="font-mono text-xs text-stone-500 font-semibold">{data.invoice_number}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Printable Invoice Document Canvas ──────────────────────────────── */}
          <div
            ref={printRef}
            id="printable-digital-invoice"
            className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-left bg-white text-stone-900"
          >
            {/* Header: Company & Invoice Metadata */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-stone-800 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-black text-lg">
                    SD
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight uppercase">
                      Siddhi Dynamics LLP
                    </h1>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                      Enterprise Cloud, SaaS & ERP Architecture
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-stone-600 space-y-0.5 font-medium leading-relaxed">
                  <p><span className="font-bold text-stone-900">LLPIN:</span> ACX-6222 · <span className="font-bold text-stone-900">PAN:</span> AFXFS7312H</p>
                  <p>3-5-260/2, Shivaji Nagar Rd, Kotagally, Nizamabad, Telangana 503001, India</p>
                  <p>Email: <span className="text-stone-900 font-semibold">billing@siddhidynamics.in</span> · Phone: <span className="text-stone-900 font-semibold">+91 6303602743</span></p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block border bg-emerald-50 text-emerald-800 border-emerald-300">
                  {isPaid ? 'PAID & VERIFIED' : 'PENDING PAYMENT'}
                </span>
                <h2 className="text-lg font-mono font-black text-stone-950 mt-1">{data.invoice_number}</h2>
                <p className="text-xs text-stone-500 font-medium">Issue Date: <span className="text-stone-900 font-bold">{data.issue_date}</span></p>
                {data.due_date && (
                  <p className="text-xs text-stone-500 font-medium">Due Date: <span className="text-stone-900 font-bold">{data.due_date}</span></p>
                )}
              </div>
            </div>

            {/* Parties: Billed By vs Billed To / Agency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              {/* If Agency Invoice: Display Agency Point of Contact */}
              {data.is_agency_invoice ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-700 block">
                      Agency Partner (Point of Contact)
                    </span>
                    <h4 className="font-black text-sm text-stone-950">{data.agency_name || 'Partner Agency'}</h4>
                    <p className="text-stone-700 font-semibold">POC: {data.agency_poc_name || 'Authorized Agency Rep'}</p>
                    <p className="text-stone-600">Email: {data.agency_email || 'partner@agency.com'}</p>
                    {data.agency_phone && <p className="text-stone-600">Phone: {data.agency_phone}</p>}
                    <p className="text-stone-600">Address: {data.agency_address || 'Regional Partner Operations'}</p>
                    <p className="text-stone-800 font-bold mt-1">
                      {data.agency_id_type || 'ID'}: {data.agency_id_number || 'Registered Partner'}
                    </p>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-200 sm:pl-6 pt-3 sm:pt-0">
                    <span className="text-[10px] uppercase font-black tracking-wider text-cyan-700 block">
                      Service Provided To (End Client)
                    </span>
                    <h4 className="font-black text-sm text-stone-950">{data.client_organization || data.client_name}</h4>
                    <p className="text-stone-700 font-semibold">Client POC: {data.client_name}</p>
                    <p className="text-stone-600">Client Email: {data.client_email}</p>
                    {data.client_address && <p className="text-stone-600">Client Address: {data.client_address}</p>}
                    <p className="text-stone-600 mt-1">
                      <span className="font-bold text-stone-900">Project:</span> {data.project_title}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block">
                      Billed By (Service Provider)
                    </span>
                    <h4 className="font-black text-sm text-stone-950">Siddhi Dynamics LLP</h4>
                    <p className="text-stone-700 font-semibold">Authorized: Sarugu Sai Vara Prasad (Designated Partner)</p>
                    <p className="text-stone-600">LLPIN: ACX-6222 · PAN: AFXFS7312H</p>
                    <p className="text-stone-600">State: Telangana (Code 36), India</p>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-200 sm:pl-6 pt-3 sm:pt-0">
                    <span className="text-[10px] uppercase font-black tracking-wider text-stone-500 block">
                      Billed To (Client Details)
                    </span>
                    <h4 className="font-black text-sm text-stone-950">{data.client_organization || data.client_name}</h4>
                    <p className="text-stone-700 font-semibold">Attn: {data.client_name}</p>
                    <p className="text-stone-600 font-mono">{data.client_email}</p>
                    {data.client_phone && <p className="text-stone-600">Phone: {data.client_phone}</p>}
                    {data.client_address && <p className="text-stone-600">Address: {data.client_address}</p>}
                    {data.client_gstin && <p className="text-stone-800 font-bold">GSTIN: {data.client_gstin}</p>}
                  </div>
                </>
              )}
            </div>

            {/* Scope / Deliverables Itemized Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-800 font-black uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Service Item & Scope Deliverable</th>
                    <th className="p-3.5">Category / Tier</th>
                    <th className="p-3.5 text-right">Agreed Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  <tr>
                    <td className="p-3.5">
                      <div className="font-extrabold text-stone-950 text-sm">{data.project_title}</div>
                      <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                        {data.service_scope || 'Enterprise software development, architecture setup, and digital platform delivery.'}
                      </p>
                      {data.payment_structure && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-bold text-[10px]">
                          Structure: {data.payment_structure}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 align-top">
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 font-bold text-stone-800">
                        {data.complexity_tier || 'Standard'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-stone-950 text-sm align-top">
                      {data.amount}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-xs text-stone-800">
                  <tr>
                    <td colSpan={2} className="p-3.5 text-right font-extrabold uppercase">Total Agreed Project Value</td>
                    <td className="p-3.5 text-right font-black text-stone-950 text-base">{data.amount}</td>
                  </tr>
                  {data.is_agency_invoice && data.commission_amount ? (
                    <>
                      <tr className="text-emerald-700 bg-emerald-50/50">
                        <td colSpan={2} className="p-2.5 text-right font-bold">
                          Agency Referral Commission ({data.commission_rate || 15}%)
                        </td>
                        <td className="p-2.5 text-right font-black">
                          - ₹{data.commission_amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr className="text-stone-950 bg-stone-100 font-black">
                        <td colSpan={2} className="p-3 text-right uppercase">Net Inflow Retained by Siddhi Dynamics</td>
                        <td className="p-3 text-right text-emerald-700 text-base">
                          ₹{(data.numeric_amount - data.commission_amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </>
                  ) : null}
                </tfoot>
              </table>
            </div>

            {/* Direct Banking & Verification Stamp Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-emerald-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-700" /> Direct Bank & UPI Settlement Coordinates
                </span>
                <p className="text-stone-700 font-medium">
                  Bank: <span className="font-bold text-stone-900">State Bank of India (SBI)</span> · Current A/C: <span className="font-mono font-bold text-stone-900">45170121323</span>
                </p>
                <p className="text-stone-700 font-medium">
                  IFSC: <span className="font-mono font-bold text-stone-900">SBIN0021632</span> · UPI ID: <span className="font-mono font-bold text-stone-900">6303602743@sbi</span>
                </p>
              </div>

              {isPaid && (
                <div className="p-3 rounded-xl bg-white border border-emerald-300 shadow-sm space-y-1 text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    ✓ Verified Inflow Received
                  </span>
                  <div className="font-mono font-extrabold text-stone-900 text-xs">
                    UTR: {data.transaction_id || 'BANK-DIRECT-VERIFIED'}
                  </div>
                  <span className="text-[10px] text-stone-500 block">
                    Mode: {data.payment_mode || 'Direct Wire / UPI'} · {data.paid_at ? new Date(data.paid_at).toLocaleDateString('en-IN') : 'Verified'}
                  </span>
                </div>
              )}
            </div>

            {/* Self-Authenticating Digital Stamp & Legal Sign-off */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-stone-200">
              {/* Digital Seal Emblem */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center p-1 text-center text-emerald-800 bg-emerald-50/40 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    DIGITALLY AUTHENTICATED
                  </span>
                  <span className="text-[6px] font-mono text-emerald-700">SIDDHI DYNAMICS</span>
                </div>
                <div className="text-xs text-stone-600 space-y-0.5">
                  <p className="font-bold text-stone-900">Digitally Authorized & Online Verified Invoice</p>
                  <p className="text-[11px] leading-relaxed">
                    This document is legally valid under the Information Technology Act, 2000. Generated electronically and authenticated directly from the Siddhi Dynamics enterprise ledger without requiring a physical wet signature or rubber stamp.
                  </p>
                </div>
              </div>

              {/* Signatory Representation */}
              <div className="text-left sm:text-right shrink-0 space-y-0.5 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="font-serif italic font-bold text-stone-800 text-base">Sarugu Sai Vara Prasad</div>
                <div className="text-[11px] font-bold text-stone-900 uppercase">Designated Partner / Technical Director</div>
                <div className="text-[10px] text-stone-500">For Siddhi Dynamics LLP (LLPIN: ACX-6222)</div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
