import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  FileText,
  Clock,
  Copy,
  BadgeCheck,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export interface InvoiceModalData {
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  status: 'paid' | 'pending' | 'cancelled';
  amount: string;
  numeric_amount: number;
  payment_structure?: string;
  transaction_id?: string;
  payment_mode?: string;
  paid_at?: string;
  paid_by?: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_organization?: string;
  client_address?: string;
  client_gstin?: string;
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
  const isCancelled = data.status === 'cancelled';

  const statusConfig = isPaid
    ? { label: 'PAID & VERIFIED', bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700', dot: 'bg-white' }
    : isCancelled
    ? { label: 'CANCELLED', bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-700', dot: 'bg-white' }
    : { label: 'PAYMENT PENDING', bg: 'bg-amber-500', text: 'text-stone-950', border: 'border-amber-600', dot: 'bg-stone-950' };

  const handlePrint = () => window.print();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const formattedDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-start justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl my-4 flex flex-col bg-white text-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-300"
        >
          {/* ── Toolbar (excluded from print) ── */}
          <div className="flex items-center justify-between px-5 py-3 bg-stone-100 border-b border-stone-200 print:hidden shrink-0">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-500" />
              <span className="font-bold text-sm text-stone-700">
                {data.is_agency_invoice ? 'Agency Settlement Invoice' : 'Official Tax & Service Invoice'}
              </span>
              <span className="font-mono text-xs text-stone-400 ml-1">#{data.invoice_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Printable Canvas ── */}
          <div
            ref={printRef}
            id="printable-digital-invoice"
            className="bg-white text-stone-900"
          >
            {/* ══ DARK HEADER BAND ══ */}
            <div className="bg-stone-950 px-8 pt-8 pb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                {/* Brand */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-xl shrink-0 shadow-lg">
                    SD
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                      Siddhi Dynamics LLP
                    </h1>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 mt-0.5">
                      Enterprise Cloud, SaaS & ERP Architecture
                    </p>
                    <div className="mt-2 space-y-0.5 text-xs text-stone-400 font-medium">
                      <p><span className="text-stone-300 font-bold">LLPIN:</span> ACX-6222 &nbsp;·&nbsp; <span className="text-stone-300 font-bold">PAN:</span> AFXFS7312H</p>
                      <p>3-5-260/2, Shivaji Nagar Rd, Kotagally, Nizamabad, Telangana 503001</p>
                      <p>
                        <span className="text-stone-300 font-semibold">billing@siddhidynamics.in</span>
                        &nbsp;·&nbsp;
                        <span className="text-stone-300 font-semibold">+91 6303602743</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="text-left sm:text-right shrink-0 space-y-2">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${!isPaid && !isCancelled ? 'animate-pulse' : ''}`} />
                    {statusConfig.label}
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">Invoice No.</p>
                    <p className="font-mono font-black text-white text-base">{data.invoice_number}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left">
                    <div>
                      <p className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Issue Date</p>
                      <p className="text-xs text-stone-200 font-bold">{formattedDate(data.issue_date)}</p>
                    </div>
                    {data.due_date && (
                      <div>
                        <p className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Due Date</p>
                        <p className="text-xs text-amber-400 font-bold">{formattedDate(data.due_date)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ══ INVOICE BODY ══ */}
            <div className="px-8 py-6 space-y-6">

              {/* ── Parties Block ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-stone-200 rounded-xl overflow-hidden text-xs">
                {data.is_agency_invoice ? (
                  <>
                    {/* Agency */}
                    <div className="p-5 bg-stone-50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-2">Agency Partner (Point of Contact)</p>
                      <p className="font-black text-sm text-stone-950 mb-1">{data.agency_name || 'Partner Agency'}</p>
                      <p className="text-stone-700"><span className="font-bold text-stone-900">POC:</span> {data.agency_poc_name || 'Authorized Rep'}</p>
                      <p className="text-stone-600">{data.agency_email}</p>
                      {data.agency_phone && <p className="text-stone-600">{data.agency_phone}</p>}
                      {data.agency_address && <p className="text-stone-600 mt-1">{data.agency_address}</p>}
                      <p className="font-bold text-stone-800 mt-1">
                        {data.agency_id_type || 'ID'}: <span className="font-mono">{data.agency_id_number || '—'}</span>
                      </p>
                    </div>
                    {/* End Client */}
                    <div className="p-5 border-t sm:border-t-0 sm:border-l border-stone-200">
                      <p className="text-[9px] font-black uppercase tracking-widest text-cyan-700 mb-2">Service Provided To (End Client)</p>
                      <p className="font-black text-sm text-stone-950 mb-1">{data.client_organization || data.client_name}</p>
                      <p className="text-stone-700"><span className="font-bold text-stone-900">Attn:</span> {data.client_name}</p>
                      <p className="text-stone-600 font-mono">{data.client_email}</p>
                      {data.client_phone && <p className="text-stone-600">{data.client_phone}</p>}
                      {data.client_address && <p className="text-stone-600 mt-1">{data.client_address}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Billed By */}
                    <div className="p-5 bg-stone-50">
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Billed By (Service Provider)</p>
                      <p className="font-black text-sm text-stone-950 mb-1">Siddhi Dynamics LLP</p>
                      <p className="text-stone-700 font-semibold">Sarugu Sai Vara Prasad</p>
                      <p className="text-stone-500 text-[11px]">Designated Partner</p>
                      <p className="text-stone-600 mt-1">LLPIN: <span className="font-mono font-bold text-stone-900">ACX-6222</span></p>
                      <p className="text-stone-600">PAN: <span className="font-mono font-bold text-stone-900">AFXFS7312H</span></p>
                      <p className="text-stone-600">State: Telangana (Code 36), India</p>
                    </div>
                    {/* Billed To */}
                    <div className="p-5 border-t sm:border-t-0 sm:border-l border-stone-200">
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">Billed To (Client Details)</p>
                      <p className="font-black text-sm text-stone-950 mb-1">{data.client_organization || data.client_name}</p>
                      <p className="text-stone-700"><span className="font-bold">Attn:</span> {data.client_name}</p>
                      <p className="text-stone-600 font-mono mt-0.5">{data.client_email}</p>
                      {data.client_phone && <p className="text-stone-600">{data.client_phone}</p>}
                      {data.client_address && <p className="text-stone-600 mt-1 leading-relaxed">{data.client_address}</p>}
                      {data.client_gstin && (
                        <p className="text-stone-800 font-bold mt-1">GSTIN: <span className="font-mono">{data.client_gstin}</span></p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ── Itemized Service Table ── */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-950 text-white">
                      <th className="px-4 py-3 font-black uppercase tracking-wider text-[10px] w-[55%]">Service Item & Scope Deliverable</th>
                      <th className="px-4 py-3 font-black uppercase tracking-wider text-[10px] w-[20%]">Category / Tier</th>
                      <th className="px-4 py-3 font-black uppercase tracking-wider text-[10px] text-right w-[25%]">Agreed Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-stone-100">
                      <td className="px-4 py-4 align-top">
                        <p className="font-extrabold text-stone-950 text-sm leading-snug">{data.project_title}</p>
                        <p className="text-stone-500 mt-1 leading-relaxed text-[11px]">
                          {data.service_scope || 'Enterprise software development, architecture setup, and digital platform delivery.'}
                        </p>
                        {data.payment_structure && (
                          <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px] border border-stone-200">
                            Payment Structure: {data.payment_structure}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 font-extrabold text-stone-800 text-[11px]">
                          {data.complexity_tier || 'Standard'}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-right font-black text-stone-950 text-base">
                        {data.amount}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-stone-50 border-t-2 border-stone-300">
                      <td colSpan={2} className="px-4 py-3 text-right font-extrabold uppercase text-[11px] tracking-wider text-stone-700">
                        Total Agreed Project Value
                      </td>
                      <td className="px-4 py-3 text-right font-black text-stone-950 text-lg">
                        {data.amount}
                      </td>
                    </tr>
                    {data.is_agency_invoice && data.commission_amount ? (
                      <>
                        <tr className="bg-emerald-50/60 border-t border-stone-200">
                          <td colSpan={2} className="px-4 py-2.5 text-right font-bold text-emerald-800 text-[11px]">
                            Agency Referral Commission ({data.commission_rate || 15}%)
                          </td>
                          <td className="px-4 py-2.5 text-right font-black text-emerald-700">
                            − ₹{data.commission_amount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                        <tr className="bg-stone-100 border-t border-stone-300">
                          <td colSpan={2} className="px-4 py-3 text-right font-black uppercase text-[11px] tracking-wider text-stone-800">
                            Net Inflow Retained by Siddhi Dynamics
                          </td>
                          <td className="px-4 py-3 text-right font-black text-emerald-700 text-base">
                            ₹{(data.numeric_amount - data.commission_amount).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </>
                    ) : null}
                  </tfoot>
                </table>
              </div>

              {/* ── Banking & UPI Block ── */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-950 px-5 py-3 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Direct Bank & UPI Settlement Coordinates
                  </span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row items-start justify-between gap-5 bg-stone-50">
                  <div className="space-y-2 text-xs font-medium text-stone-600">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-black uppercase tracking-wider text-stone-400">Bank Name</span>
                      <span className="font-bold text-stone-900 text-sm">State Bank of India (SBI)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Account Number</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-extrabold text-stone-900">45170121323</span>
                          <button
                            onClick={() => copy('45170121323', 'Account number')}
                            className="p-0.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer print:hidden"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">Account Type</span>
                        <span className="font-bold text-stone-900 mt-0.5 block">Current Account</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">IFSC Code</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-extrabold text-stone-900">SBIN0021632</span>
                          <button
                            onClick={() => copy('SBIN0021632', 'IFSC code')}
                            className="p-0.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer print:hidden"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">UPI ID</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-extrabold text-stone-900">6303602743@sbi</span>
                          <button
                            onClick={() => copy('6303602743@sbi', 'UPI ID')}
                            className="p-0.5 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer print:hidden"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Verification Box */}
                  {isPaid ? (
                    <div className="shrink-0 rounded-xl bg-emerald-600 text-white p-4 text-center min-w-[150px] shadow-md">
                      <CheckCircle2 className="w-7 h-7 mx-auto mb-1.5" />
                      <p className="font-black text-xs uppercase tracking-wider">Payment Verified</p>
                      {data.transaction_id && (
                        <p className="font-mono text-[10px] mt-1 text-emerald-100 break-all">
                          UTR: {data.transaction_id}
                        </p>
                      )}
                      {data.paid_at && (
                        <p className="text-[10px] text-emerald-200 mt-0.5">
                          {formattedDate(data.paid_at)}
                        </p>
                      )}
                      {data.payment_mode && (
                        <p className="text-[10px] text-emerald-100 mt-0.5">{data.payment_mode}</p>
                      )}
                    </div>
                  ) : (
                    <div className="shrink-0 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 p-4 text-center min-w-[140px]">
                      <Clock className="w-6 h-6 mx-auto mb-1.5 text-amber-600" />
                      <p className="font-black text-xs uppercase tracking-wider text-amber-800">Awaiting Payment</p>
                      <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                        Transfer to the coordinates on the left to settle this invoice.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Digital Authentication Footer ── */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-950 px-5 py-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Digital Authentication & Legal Certification
                  </span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row items-start justify-between gap-6">
                  {/* Seal + Legal Text */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-20 h-20 rounded-full border-[3px] border-dashed border-emerald-500 flex flex-col items-center justify-center bg-emerald-50 text-emerald-800">
                      <BadgeCheck className="w-6 h-6 text-emerald-600" />
                      <span className="text-[7px] font-black uppercase tracking-tighter leading-tight text-center mt-0.5 px-1">
                        DIGITALLY AUTH.
                      </span>
                      <span className="text-[6px] font-mono text-emerald-600 text-center">SIDDHI DYNAMICS</span>
                    </div>
                    <div className="text-xs text-stone-600 leading-relaxed space-y-1 max-w-sm">
                      <p className="font-bold text-stone-900 text-sm">Digitally Authorized & Online Verified Invoice</p>
                      <p className="text-[11px]">
                        This document is legally valid under the{' '}
                        <span className="font-semibold text-stone-800">Information Technology Act, 2000</span>.
                        Generated electronically and authenticated from the Siddhi Dynamics enterprise ledger.
                        No physical wet signature or stamp required.
                      </p>
                    </div>
                  </div>

                  {/* Signatory */}
                  <div className="shrink-0 text-left sm:text-right space-y-1 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="font-serif italic text-stone-900 text-lg font-bold leading-tight">
                      Sarugu Sai Vara Prasad
                    </div>
                    <div className="text-[10px] font-black text-stone-700 uppercase tracking-wider">
                      Designated Partner / Technical Director
                    </div>
                    <div className="text-[10px] text-stone-500">
                      For Siddhi Dynamics LLP
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      LLPIN: ACX-6222
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold justify-start sm:justify-end mt-1">
                      <Zap className="w-3 h-3" />
                      siddhidynamics.in
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Footer Note ── */}
              <p className="text-center text-[10px] text-stone-400 font-medium pt-2 pb-1">
                This invoice was generated by the Siddhi Dynamics enterprise billing system · billing@siddhidynamics.in · LLPIN: ACX-6222
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
