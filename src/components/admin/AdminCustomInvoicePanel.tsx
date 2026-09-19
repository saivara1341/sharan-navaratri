import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FileText, Plus, Trash2, RefreshCw, Printer, CheckCircle2,
  Clock, AlertCircle, Building2, User, Mail, DollarSign,
  Download, Eye, X, Send, ShieldCheck, Search, Filter,
  Upload, Percent, Landmark
} from "lucide-react";
import { loadPaymentSettings, PaymentSettings } from "./AdminPaymentSettingsPanel";

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface CustomInvoice {
  id: string;
  invoice_no: string;
  invoice_date: string;
  due_date: string;
  recipient_type: "agency" | "client";
  agency_name?: string;
  agency_email?: string;
  billed_to_name: string;
  billed_to_email: string;
  billed_to_org?: string;
  billed_to_address?: string;
  service_client_name?: string;
  service_client_project?: string;
  line_items: LineItem[];
  subtotal: number;
  commission_pct?: number;
  commission_deduction?: number;
  tax_pct: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  invoice_file_url?: string;
  status: "draft" | "sent" | "paid" | "cancelled";
  created_at?: string;
}

const STORAGE_KEY = "siddhi_admin_custom_invoices_backup";

export function AdminCustomInvoicePanel() {
  const [invoices, setInvoices] = useState<CustomInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<CustomInvoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  // Form State
  const [invoiceNo, setInvoiceNo] = useState(`INV-SD-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [recipientType, setRecipientType] = useState<"agency" | "client">("client");
  const [billedToName, setBilledToName] = useState("");
  const [billedToEmail, setBilledToEmail] = useState("");
  const [billedToOrg, setBilledToOrg] = useState("");
  const [billedToAddress, setBilledToAddress] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [agencyEmail, setAgencyEmail] = useState("");
  const [serviceClientName, setServiceClientName] = useState("");
  const [serviceClientProject, setServiceClientProject] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [taxPct, setTaxPct] = useState<number>(18);
  const [commissionPct, setCommissionPct] = useState<number>(0);
  const [notes, setNotes] = useState(
    "Payment due within 14 days of invoice date. Thank you for partnering with Siddhi Dynamics."
  );
  const [fileUrl, setFileUrl] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Custom Deep-Tech / AI Architecture & Implementation",
      qty: 1,
      rate: 75000,
      amount: 75000,
    },
  ]);

  // Load payment settings for invoice footers
  useEffect(() => {
    loadPaymentSettings().then((s) => setPaymentSettings(s));
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("admin_manual_invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: CustomInvoice[] = data.map((d: any) => ({
          id: d.id,
          invoice_no: d.invoice_no,
          invoice_date: d.invoice_date,
          due_date: d.due_date,
          recipient_type: d.billed_to_org?.toLowerCase().includes("agency") ? "agency" : "client",
          billed_to_name: d.billed_to_name,
          billed_to_email: d.billed_to_email,
          billed_to_org: d.billed_to_org,
          billed_to_address: d.billed_to_address,
          line_items: Array.isArray(d.line_items) ? d.line_items : [],
          subtotal: Number(d.subtotal || 0),
          tax_pct: Number(d.tax_pct || 0),
          tax_amount: Number(d.tax_amount || 0),
          total_amount: Number(d.total_amount || 0),
          currency: d.currency || "INR",
          notes: d.notes,
          status: d.status || "draft",
          created_at: d.created_at,
        }));
        setInvoices(mapped);
      } else {
        // LocalStorage fallback cache
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          try {
            setInvoices(JSON.parse(local));
          } catch (_) {}
        }
      }
    } catch (err) {
      console.warn("[AdminCustomInvoicePanel] Failed to fetch invoices from Supabase:", err);
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) setInvoices(JSON.parse(local));
    } finally {
      setLoading(false);
    }
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        description: "",
        qty: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleUpdateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "qty" || field === "rate") {
          const qty = field === "qty" ? Number(value) : item.qty;
          const rate = field === "rate" ? Number(value) : item.rate;
          updated.amount = (qty || 0) * (rate || 0);
        }
        return updated;
      })
    );
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length === 1) {
      toast.error("Invoice must contain at least one line item");
      return;
    }
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const commissionDeduction =
    recipientType === "agency" && commissionPct > 0
      ? (subtotal * commissionPct) / 100
      : 0;
  const taxableBase = Math.max(0, subtotal - commissionDeduction);
  const taxAmount = (taxableBase * (taxPct || 0)) / 100;
  const totalAmount = taxableBase + taxAmount;

  const handleUploadInvoiceDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const ext = file.name.split(".").pop();
      const filename = `manual_invoices/${invoiceNo.replace(/[^a-zA-Z0-9_-]/g, "_")}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("admin-assets")
        .upload(filename, file, { upsert: true });

      if (upErr) {
        // Try client-documents as fallback
        const { error: upErr2 } = await supabase.storage
          .from("client-documents")
          .upload(filename, file, { upsert: true });
        if (upErr2) throw upErr2;
        const { data: pub2 } = supabase.storage
          .from("client-documents")
          .getPublicUrl(filename);
        setFileUrl(pub2.publicUrl);
      } else {
        const { data: pub } = supabase.storage
          .from("admin-assets")
          .getPublicUrl(filename);
        setFileUrl(pub.publicUrl);
      }
      toast.success("Attached external invoice file successfully");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo.trim()) {
      toast.error("Invoice number is required");
      return;
    }
    if (!billedToName.trim() || !billedToEmail.trim()) {
      toast.error("Billed To Name and Email are required");
      return;
    }
    if (lineItems.some((i) => !i.description.trim() || i.rate <= 0)) {
      toast.error("All line items must have a valid description and rate");
      return;
    }

    setSavingInvoice(true);
    const newInvoice: CustomInvoice = {
      id: Math.random().toString(),
      invoice_no: invoiceNo.trim(),
      invoice_date: invoiceDate,
      due_date: dueDate,
      recipient_type: recipientType,
      agency_name: recipientType === "agency" ? agencyName : undefined,
      agency_email: recipientType === "agency" ? agencyEmail : undefined,
      billed_to_name: billedToName.trim(),
      billed_to_email: billedToEmail.trim(),
      billed_to_org:
        recipientType === "agency"
          ? `${agencyName} (POC for Client: ${serviceClientName || "End Client"})`
          : billedToOrg.trim(),
      billed_to_address: billedToAddress.trim(),
      service_client_name: serviceClientName.trim() || undefined,
      service_client_project: serviceClientProject.trim() || undefined,
      line_items: lineItems,
      subtotal,
      commission_pct: commissionPct,
      commission_deduction: commissionDeduction,
      tax_pct: taxPct,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      currency,
      notes: notes.trim(),
      invoice_file_url: fileUrl || undefined,
      status: "sent",
      created_at: new Date().toISOString(),
    };

    try {
      // Try DB insert
      const { data: dbData, error: dbErr } = await (supabase as any)
        .from("admin_manual_invoices")
        .insert({
          invoice_no: newInvoice.invoice_no,
          invoice_date: newInvoice.invoice_date,
          due_date: newInvoice.due_date,
          billed_to_name: newInvoice.billed_to_name,
          billed_to_email: newInvoice.billed_to_email,
          billed_to_org: newInvoice.billed_to_org,
          billed_to_address: newInvoice.billed_to_address,
          line_items: newInvoice.line_items,
          subtotal: newInvoice.subtotal,
          tax_pct: newInvoice.tax_pct,
          tax_amount: newInvoice.tax_amount,
          total_amount: newInvoice.total_amount,
          currency: newInvoice.currency,
          notes: newInvoice.notes,
          status: newInvoice.status,
        })
        .select()
        .single();

      if (!dbErr && dbData) {
        newInvoice.id = dbData.id;
      }
    } catch (err) {
      console.warn("[AdminCustomInvoicePanel] DB insert warning:", err);
    }

    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast.success(`Invoice ${newInvoice.invoice_no} created and recorded!`);
    setShowCreateModal(false);
    resetForm();
    setSavingInvoice(false);
  };

  const resetForm = () => {
    setInvoiceNo(`INV-SD-${Date.now().toString().slice(-6)}`);
    setBilledToName("");
    setBilledToEmail("");
    setBilledToOrg("");
    setBilledToAddress("");
    setAgencyName("");
    setAgencyEmail("");
    setServiceClientName("");
    setServiceClientProject("");
    setCommissionPct(0);
    setTaxPct(18);
    setFileUrl("");
    setLineItems([
      {
        id: "1",
        description: "Deep-Tech Engineering / AI Transformation",
        qty: 1,
        rate: 50000,
        amount: 50000,
      },
    ]);
  };

  const handleUpdateStatus = async (
    inv: CustomInvoice,
    newStatus: "draft" | "sent" | "paid" | "cancelled"
  ) => {
    try {
      await (supabase as any)
        .from("admin_manual_invoices")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("invoice_no", inv.invoice_no);
    } catch (_) {}

    const updated = invoices.map((item) =>
      item.id === inv.id || item.invoice_no === inv.invoice_no
        ? { ...item, status: newStatus }
        : item
    );
    setInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success(`Invoice ${inv.invoice_no} marked as ${newStatus.toUpperCase()}`);
    if (previewInvoice?.id === inv.id) {
      setPreviewInvoice((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteInvoice = async (inv: CustomInvoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${inv.invoice_no}?`)) return;
    try {
      await (supabase as any)
        .from("admin_manual_invoices")
        .delete()
        .eq("invoice_no", inv.invoice_no);
    } catch (_) {}

    const updated = invoices.filter(
      (item) => item.id !== inv.id && item.invoice_no !== inv.invoice_no
    );
    setInvoices(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success(`Invoice ${inv.invoice_no} removed`);
    if (previewInvoice?.id === inv.id) setPreviewInvoice(null);
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      inv.invoice_no.toLowerCase().includes(query) ||
      inv.billed_to_name.toLowerCase().includes(query) ||
      inv.billed_to_email.toLowerCase().includes(query) ||
      (inv.billed_to_org && inv.billed_to_org.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalBilled = invoices.reduce(
    (acc, cur) => (cur.status !== "cancelled" ? acc + cur.total_amount : acc),
    0
  );
  const paidBilled = invoices.reduce(
    (acc, cur) => (cur.status === "paid" ? acc + cur.total_amount : acc),
    0
  );
  const pendingBilled = invoices.reduce(
    (acc, cur) => (cur.status === "sent" ? acc + cur.total_amount : acc),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8fa44e]" />
            Custom & Agency Invoicing Command
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Generate custom manual invoices for Direct Clients and Agencies (where Agency is the
            billing POC and the client is the service receiver).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInvoices}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6b7c3d] hover:bg-[#8fa44e] text-black font-semibold transition flex items-center gap-2 shadow-lg shadow-[#6b7c3d]/20"
          >
            <Plus className="w-4 h-4" />
            Create Manual Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-400">Total Billed Volume</div>
            <div className="text-xl font-bold text-white mt-1">
              ₹{totalBilled.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {invoices.length} invoices generated
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#6b7c3d]/10 border border-[#6b7c3d]/25 flex items-center justify-center text-[#8fa44e]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-400">Verified Paid</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              ₹{paidBilled.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Settled invoices</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-neutral-400">Awaiting Settlement</div>
            <div className="text-xl font-bold text-amber-400 mt-1">
              ₹{pendingBilled.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Pending client/agency UTR</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111111] p-3 rounded-xl border border-[#222]">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-400" />
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["all", "sent", "paid", "draft", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                  statusFilter === st
                    ? "bg-[#6b7c3d] text-black font-semibold"
                    : "text-neutral-400 hover:text-white bg-[#1a1a1a]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search invoice, client, agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#161616] border border-[#2a2a2a] rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#6b7c3d]"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-[#111111] border border-[#222] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#222] bg-[#161616] text-neutral-400">
                <th className="p-3 font-semibold">Invoice #</th>
                <th className="p-3 font-semibold">Date / Due</th>
                <th className="p-3 font-semibold">Billed Party (POC)</th>
                <th className="p-3 font-semibold">Service Receiver</th>
                <th className="p-3 font-semibold text-right">Amount</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e1e]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#8fa44e]" />
                    Loading custom invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-500">
                    No custom invoices found. Click "Create Manual Invoice" above to issue one.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#161616]/60 transition">
                    <td className="p-3 font-mono font-medium text-[#c9b96f]">
                      {inv.invoice_no}
                    </td>
                    <td className="p-3 text-neutral-300">
                      <div>{inv.invoice_date}</div>
                      <div className="text-[10px] text-neutral-500">Due: {inv.due_date || "—"}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        {inv.billed_to_name}
                        {inv.recipient_type === "agency" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            AGENCY POC
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">{inv.billed_to_email}</div>
                      {inv.billed_to_org && (
                        <div className="text-[10px] text-neutral-500">{inv.billed_to_org}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {inv.service_client_name ? (
                        <div>
                          <div className="font-medium text-neutral-200">
                            {inv.service_client_name}
                          </div>
                          {inv.service_client_project && (
                            <div className="text-[10px] text-neutral-400">
                              {inv.service_client_project}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-500">Direct Recipient</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-medium text-white">
                      <div>
                        {inv.currency === "INR" ? "₹" : "$"}
                        {inv.total_amount.toLocaleString("en-IN")}
                      </div>
                      {inv.tax_amount > 0 && (
                        <div className="text-[10px] text-neutral-500">
                          incl. {inv.tax_pct}% GST
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          inv.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : inv.status === "sent"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : inv.status === "cancelled"
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-neutral-700/40 text-neutral-300 border border-neutral-600/40"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        title="View / Print Document"
                        className="p-1.5 rounded bg-neutral-800 hover:bg-[#6b7c3d]/20 text-neutral-300 hover:text-white border border-neutral-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {inv.status !== "paid" ? (
                        <button
                          onClick={() => handleUpdateStatus(inv, "paid")}
                          title="Mark as Paid"
                          className="p-1.5 rounded bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(inv, "sent")}
                          title="Revert to Sent"
                          className="p-1.5 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 border border-blue-800/40 transition"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteInvoice(inv)}
                        title="Delete Invoice"
                        className="p-1.5 rounded bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/30 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#2e2e2e] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#222] bg-[#161616]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#8fa44e]" />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Create Custom / Agency Invoice
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Bill directly or via Agency POC with custom line items, tax and terms
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Recipient Type Selection */}
              <div className="bg-[#161616] p-4 rounded-xl border border-[#2a2a2a] space-y-3">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Billing Hierarchy & Structure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType("client");
                      setBilledToOrg("");
                    }}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      recipientType === "client"
                        ? "border-[#8fa44e] bg-[#6b7c3d]/15 text-white"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <User className="w-5 h-5 text-[#8fa44e] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Direct Client Billing</div>
                      <div className="text-[11px] opacity-75">
                        Client is billed directly and receives the services.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType("agency")}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      recipientType === "agency"
                        ? "border-[#c9b96f] bg-[#c9b96f]/15 text-white"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#c9b96f] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">Agency Point of Contact (POC)</div>
                      <div className="text-[11px] opacity-75">
                        Invoice is billed to Agency, while end-client avails the services.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2a2a2a] rounded-lg text-white font-mono focus:border-[#6b7c3d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-400 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                  />
                </div>
              </div>

              {/* Billed To Information */}
              <div className="bg-[#161616] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
                <div className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
                  {recipientType === "agency" ? (
                    <>
                      <Building2 className="w-4 h-4 text-[#c9b96f]" />
                      Agency Details (Official Billing POC)
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-[#8fa44e]" />
                      Client Details (Direct Recipient)
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      {recipientType === "agency" ? "Agency POC Name *" : "Client Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe / Apex Media Partner"
                      value={billedToName}
                      onChange={(e) => {
                        setBilledToName(e.target.value);
                        if (recipientType === "agency") setAgencyName(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      {recipientType === "agency" ? "Agency Billing Email *" : "Client Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="billing@partneragency.com"
                      value={billedToEmail}
                      onChange={(e) => {
                        setBilledToEmail(e.target.value);
                        if (recipientType === "agency") setAgencyEmail(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      {recipientType === "agency" ? "Agency Registered Name" : "Company / Organization"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Innovations Corp"
                      value={billedToOrg}
                      onChange={(e) => setBilledToOrg(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      Billing Address / GSTIN
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 402 Tech Park, Hyderabad · GSTIN: 36ABCDE1234F1Z5"
                      value={billedToAddress}
                      onChange={(e) => setBilledToAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                    />
                  </div>
                </div>

                {/* If Agency: End Client Receiver Details */}
                {recipientType === "agency" && (
                  <div className="pt-3 border-t border-[#252525] mt-2 space-y-3">
                    <div className="text-[11px] font-semibold text-[#c9b96f] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      End-Service Availing Client (Beneficiary)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-neutral-400 block mb-1">
                          Client Name / Entity
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Beta Robotics Pvt Ltd"
                          value={serviceClientName}
                          onChange={(e) => setServiceClientName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-400 block mb-1">
                          Service Scope / Project Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Industrial IoT Fleet Diagnostics + AEO Optimization"
                          value={serviceClientProject}
                          onChange={(e) => setServiceClientProject(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Line Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white flex items-center gap-2">
                    Line Items & Services
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="px-2.5 py-1 text-xs rounded bg-[#1e1e1e] hover:bg-[#6b7c3d]/20 text-[#8fa44e] border border-[#2a2a2a] transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Service
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 bg-[#161616] p-2.5 rounded-lg border border-[#2a2a2a] items-center text-xs"
                    >
                      <div className="col-span-12 sm:col-span-6">
                        <input
                          type="text"
                          placeholder="Service Description (e.g. SEO, GEO & Google Business Profile)"
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "description", e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-[#111] border border-[#2e2e2e] rounded text-white focus:border-[#6b7c3d] focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "qty", Math.max(1, Number(e.target.value)))
                          }
                          className="w-full px-2.5 py-1.5 bg-[#111] border border-[#2e2e2e] rounded text-white focus:border-[#6b7c3d] focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="500"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) =>
                            handleUpdateLineItem(item.id, "rate", Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 bg-[#111] border border-[#2e2e2e] rounded text-white focus:border-[#6b7c3d] focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-1 text-right font-medium text-white">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Taxes, Commission & Summary Calculation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl border border-[#2a2a2a]">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-400 block mb-1">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-400 block mb-1">
                        GST / Tax (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="28"
                        value={taxPct}
                        onChange={(e) => setTaxPct(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-[#111] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                      />
                    </div>
                  </div>

                  {recipientType === "agency" && (
                    <div>
                      <label className="text-xs font-medium text-[#c9b96f] block mb-1 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" /> Agency Commission / Retention (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={commissionPct}
                        onChange={(e) => setCommissionPct(Number(e.target.value))}
                        placeholder="e.g. 15%"
                        className="w-full px-3 py-2 text-xs bg-[#111] border border-[#c9b96f]/40 rounded-lg text-white focus:border-[#c9b96f] focus:outline-none"
                      />
                      <div className="text-[10px] text-neutral-400 mt-1">
                        Deducted from gross invoice for agency disbursement
                      </div>
                    </div>
                  )}

                  {/* Optional External PDF / Document Attachment */}
                  <div>
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      Upload Ready Invoice PDF/Scan (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 bg-[#1e1e1e] hover:bg-[#252525] border border-[#333] rounded-lg text-xs text-neutral-300 hover:text-white cursor-pointer transition flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingFile ? "Uploading..." : "Attach File"}
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          className="hidden"
                          onChange={handleUploadInvoiceDoc}
                          disabled={uploadingFile}
                        />
                      </label>
                      {fileUrl && (
                        <span className="text-[11px] text-[#8fa44e] truncate max-w-[200px]">
                          Attached ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Totals Summary */}
                <div className="bg-[#111] p-4 rounded-xl border border-[#252525] flex flex-col justify-between space-y-2 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {commissionDeduction > 0 && (
                      <div className="flex justify-between text-[#c9b96f]">
                        <span>Agency Commission ({commissionPct}%):</span>
                        <span className="font-mono">
                          -₹{commissionDeduction.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-400">
                      <span>Tax / GST ({taxPct}%):</span>
                      <span className="font-mono text-white">
                        +₹{taxAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#252525] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Final Net Payable:</span>
                    <span className="text-lg font-extrabold text-[#8fa44e] font-mono">
                      {currency === "INR" ? "₹" : "$"}
                      {totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div>
                <label className="text-xs font-medium text-neutral-400 block mb-1">
                  Notes & Settlement Terms
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#161616] border border-[#2a2a2a] rounded-lg text-white focus:border-[#6b7c3d] focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInvoice}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#6b7c3d] hover:bg-[#8fa44e] text-black transition flex items-center gap-1.5 shadow-lg shadow-[#6b7c3d]/25"
                >
                  {savingInvoice ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Save & Issue Invoice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW & PRINT INVOICE MODAL */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-3xl overflow-hidden my-auto shadow-2xl flex flex-col max-h-[95vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-[#222] bg-[#161616]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8fa44e]" />
                <span className="text-sm font-semibold text-white">
                  Invoice {previewInvoice.invoice_no}
                </span>
                <span
                  className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                    previewInvoice.status === "paid"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {previewInvoice.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setPreviewInvoice(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Document Body */}
            <div
              id="printable-invoice-body"
              className="p-8 bg-[#0d0d0d] text-neutral-100 overflow-y-auto space-y-8 font-sans"
            >
              {/* Header: Siddhi Dynamics */}
              <div className="flex justify-between items-start border-b border-[#2a2a2a] pb-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-wider flex items-center gap-2">
                    SIDDHI DYNAMICS
                  </h1>
                  <p className="text-xs text-[#8fa44e] font-medium tracking-wide uppercase mt-0.5">
                    Deep-Tech Innovation · AI Systems · Web Excellence
                  </p>
                  <p className="text-xs text-neutral-400 mt-2">
                    Hyderabad, Telangana, India
                    <br />
                    Email: operations@siddhidynamics.com
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-[#c9b96f]">
                    TAX INVOICE
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-1">
                    Invoice #: <span className="text-white">{previewInvoice.invoice_no}</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Date: <span className="text-white">{previewInvoice.invoice_date}</span>
                  </div>
                  {previewInvoice.due_date && (
                    <div className="text-xs text-neutral-400 mt-0.5">
                      Due Date: <span className="text-white">{previewInvoice.due_date}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Billed To vs Beneficiary */}
              <div className="grid grid-cols-2 gap-8 text-xs">
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    {previewInvoice.recipient_type === "agency"
                      ? "BILLED TO (AGENCY POC):"
                      : "BILLED TO:"}
                  </div>
                  <div className="text-sm font-bold text-white">
                    {previewInvoice.billed_to_name}
                  </div>
                  <div className="text-neutral-300">{previewInvoice.billed_to_email}</div>
                  {previewInvoice.billed_to_org && (
                    <div className="text-neutral-400">{previewInvoice.billed_to_org}</div>
                  )}
                  {previewInvoice.billed_to_address && (
                    <div className="text-neutral-400 mt-1">{previewInvoice.billed_to_address}</div>
                  )}
                </div>

                {previewInvoice.service_client_name ? (
                  <div>
                    <div className="text-[10px] font-bold text-[#c9b96f] uppercase tracking-wider mb-1.5">
                      END CLIENT (SERVICE BENEFICIARY):
                    </div>
                    <div className="text-sm font-bold text-white">
                      {previewInvoice.service_client_name}
                    </div>
                    {previewInvoice.service_client_project && (
                      <div className="text-neutral-300 mt-1">
                        Project: {previewInvoice.service_client_project}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                      SERVICE PROVIDER:
                    </div>
                    <div className="text-white font-medium">Siddhi Dynamics Engineering Division</div>
                    <div className="text-neutral-400">Verified Direct Corporate Engagement</div>
                  </div>
                )}
              </div>

              {/* Line Items Table */}
              <div className="border border-[#2a2a2a] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#181818] text-neutral-400 border-b border-[#2a2a2a]">
                      <th className="p-3">#</th>
                      <th className="p-3">Service Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {previewInvoice.line_items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#141414]">
                        <td className="p-3 text-neutral-500">{idx + 1}</td>
                        <td className="p-3 font-medium text-white">{item.description}</td>
                        <td className="p-3 text-center text-neutral-300">{item.qty}</td>
                        <td className="p-3 text-right font-mono text-neutral-300">
                          ₹{item.rate.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-right font-mono text-white">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end text-xs">
                <div className="w-72 space-y-2 bg-[#141414] p-4 rounded-xl border border-[#2a2a2a]">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white">
                      ₹{previewInvoice.subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {previewInvoice.commission_deduction && previewInvoice.commission_deduction > 0 ? (
                    <div className="flex justify-between text-[#c9b96f]">
                      <span>Agency Commission:</span>
                      <span className="font-mono">
                        -₹{previewInvoice.commission_deduction.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-neutral-400">
                    <span>Tax / GST ({previewInvoice.tax_pct}%):</span>
                    <span className="font-mono text-white">
                      +₹{previewInvoice.tax_amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#2a2a2a] flex justify-between items-baseline">
                    <span className="font-bold text-white text-sm">Total Due:</span>
                    <span className="text-base font-bold font-mono text-[#8fa44e]">
                      {previewInvoice.currency === "INR" ? "₹" : "$"}
                      {previewInvoice.total_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions & Official Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#141414] p-4 rounded-xl border border-[#2a2a2a] text-xs">
                <div>
                  <div className="text-[10px] font-bold text-[#8fa44e] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5" /> Official Settlement Channels
                  </div>
                  <div className="space-y-1 text-neutral-300">
                    <div>
                      <span className="text-neutral-500">Bank: </span>
                      {paymentSettings?.bank_name || "State Bank of India (SBI)"}
                    </div>
                    <div>
                      <span className="text-neutral-500">Account: </span>
                      <span className="font-mono">
                        {paymentSettings?.account_no || "45170121323"}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">IFSC: </span>
                      <span className="font-mono">{paymentSettings?.ifsc || "SBIN0020149"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">UPI ID: </span>
                      <span className="font-mono text-[#c9b96f]">
                        {paymentSettings?.upi_id || "siddhidynamics@sbi"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    Terms & Instructions
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    {previewInvoice.notes ||
                      "Please share the UTR reference number or payment transaction slip upon settlement to complete automated verification."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
