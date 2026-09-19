import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QrCode, Upload, RefreshCw, Save, Eye, Bank, CreditCard, Banknote } from "lucide-react";

interface PaymentSettings {
  upi_id: string;
  qr_storage_path: string | null;
  qr_public_url: string | null;
  bank_name: string;
  account_holder: string;
  account_no: string;
  ifsc: string;
}

const DEFAULT_SETTINGS: PaymentSettings = {
  upi_id: "siddhidynamics@sbi",
  qr_storage_path: null,
  qr_public_url: null,
  bank_name: "State Bank of India (SBI)",
  account_holder: "SIDDHI DYNAMICS PVT LTD",
  account_no: "45170121323",
  ifsc: "SBIN0020149",
};

export function AdminPaymentSettingsPanel() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const qrInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("admin_payment_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (!error && data) {
        setSettings({
          upi_id: data.upi_id || DEFAULT_SETTINGS.upi_id,
          qr_storage_path: data.qr_storage_path || null,
          qr_public_url: data.qr_public_url || null,
          bank_name: data.bank_name || DEFAULT_SETTINGS.bank_name,
          account_holder: data.account_holder || DEFAULT_SETTINGS.account_holder,
          account_no: data.account_no || DEFAULT_SETTINGS.account_no,
          ifsc: data.ifsc || DEFAULT_SETTINGS.ifsc,
        });
      }
    } catch (err) {
      console.warn("[AdminPaymentSettingsPanel] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleQrUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for the QR code.");
      return;
    }
    setUploadingQr(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `qr/payment-qr-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("admin-assets")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("admin-assets")
        .getPublicUrl(path);

      setSettings(prev => ({
        ...prev,
        qr_storage_path: path,
        qr_public_url: urlData.publicUrl,
      }));
      toast.success("QR code uploaded! Click Save to persist.");
    } catch (err: any) {
      toast.error(err.message || "QR upload failed.");
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("admin_payment_settings")
        .upsert({
          id: 1,
          upi_id: settings.upi_id.trim(),
          qr_storage_path: settings.qr_storage_path,
          qr_public_url: settings.qr_public_url,
          bank_name: settings.bank_name.trim(),
          account_holder: settings.account_holder.trim(),
          account_no: settings.account_no.trim(),
          ifsc: settings.ifsc.trim(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "id" });
      if (error) throw error;
      toast.success("Payment settings saved! Clients will see updated info.");
    } catch (err: any) {
      toast.error(err.message || "Could not save payment settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-xl adm-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* QR Code */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <QrCode className="w-4 h-4 adm-olive-accent" />
            Payment QR Code
          </span>
        </div>

        {settings.qr_public_url ? (
          <div className="mb-4 text-center">
            <img
              src={settings.qr_public_url}
              alt="Payment QR"
              className="mx-auto rounded-xl border"
              style={{
                maxWidth: 200,
                borderColor: "var(--adm-border-light)",
              }}
            />
            <p className="text-xs mt-2" style={{ color: "var(--adm-text-muted)" }}>
              Current QR — Upload new to replace
            </p>
          </div>
        ) : (
          <div
            className="mb-4 rounded-xl flex flex-col items-center justify-center gap-2 py-10 cursor-pointer"
            style={{
              border: "2px dashed var(--adm-border-light)",
              color: "var(--adm-text-muted)",
            }}
            onClick={() => qrInputRef.current?.click()}
          >
            <QrCode className="w-8 h-8 opacity-30" />
            <span className="text-xs">No QR uploaded yet</span>
          </div>
        )}

        <input
          ref={qrInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleQrUpload(e.target.files[0])}
        />

        <button
          className="adm-btn adm-btn-secondary w-full"
          onClick={() => qrInputRef.current?.click()}
          disabled={uploadingQr}
        >
          {uploadingQr ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="w-3.5 h-3.5" /> {settings.qr_public_url ? "Replace QR" : "Upload QR"}</>
          )}
        </button>
      </div>

      {/* UPI + Bank */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <CreditCard className="w-4 h-4 adm-olive-accent" />
            UPI & Bank Details
          </span>
        </div>

        <div className="adm-form-group">
          <label className="adm-label">UPI ID</label>
          <input
            className="adm-input font-mono"
            value={settings.upi_id}
            onChange={e => setSettings(p => ({ ...p, upi_id: e.target.value }))}
            placeholder="yourname@bankname"
          />
        </div>

        <div className="adm-form-group">
          <label className="adm-label">Bank Name</label>
          <input
            className="adm-input"
            value={settings.bank_name}
            onChange={e => setSettings(p => ({ ...p, bank_name: e.target.value }))}
          />
        </div>

        <div className="adm-form-group">
          <label className="adm-label">Account Holder</label>
          <input
            className="adm-input"
            value={settings.account_holder}
            onChange={e => setSettings(p => ({ ...p, account_holder: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="adm-form-group">
            <label className="adm-label">Account No.</label>
            <input
              className="adm-input font-mono"
              value={settings.account_no}
              onChange={e => setSettings(p => ({ ...p, account_no: e.target.value }))}
            />
          </div>
          <div className="adm-form-group">
            <label className="adm-label">IFSC</label>
            <input
              className="adm-input font-mono"
              value={settings.ifsc}
              onChange={e => setSettings(p => ({ ...p, ifsc: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="md:col-span-2 flex justify-end">
        <button
          className="adm-btn adm-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving…</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> Save Payment Settings</>
          )}
        </button>
      </div>
    </div>
  );
}

/** Hook to load payment settings for use in payment modals */
export async function loadPaymentSettings(): Promise<PaymentSettings> {
  try {
    const { data, error } = await (supabase as any)
      .from("admin_payment_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) return data as PaymentSettings;
  } catch (_) {}
  return DEFAULT_SETTINGS;
}

export type { PaymentSettings };
