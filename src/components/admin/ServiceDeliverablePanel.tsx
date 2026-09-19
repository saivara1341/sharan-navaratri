import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  TrendingUp, FileText, Upload, Plus, Trash2, RefreshCw, Save,
  Link, File, ExternalLink, CheckCircle2, ClipboardList
} from "lucide-react";

interface Deliverable {
  id: string;
  title: string;
  type: "file" | "url" | "note";
  url?: string;
  description?: string;
  added_at: string;
}

interface ServiceDeliverablePanelProps {
  submissionId: string;
  submissionName: string;
  initialProgress?: number;
  initialStatus?: string;
  initialDeliverables?: Deliverable[];
  initialAgreementUrl?: string;
  initialAdminNotes?: string;
  onSave?: (data: { progress: number; status: string; admin_notes: string }) => void;
}

const STATUSES = [
  "New Request",
  "Analyzing",
  "Proposal Sent",
  "Agreement Signed",
  "Onboarding & Audit",
  "In Progress",
  "Review",
  "Delivered",
  "Completed",
  "On Hold",
  "Cancelled",
];

export function ServiceDeliverablePanel({
  submissionId,
  submissionName,
  initialProgress = 0,
  initialStatus = "New Request",
  initialDeliverables = [],
  initialAgreementUrl = "",
  initialAdminNotes = "",
  onSave,
}: ServiceDeliverablePanelProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState(initialStatus);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(initialDeliverables);
  const [agreementUrl, setAgreementUrl] = useState(initialAgreementUrl);
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const agreementInputRef = useRef<HTMLInputElement>(null);

  // Add deliverable state
  const [addType, setAddType] = useState<"file" | "url" | "note">("url");
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addDesc, setAddDesc] = useState("");

  const handleAddDeliverable = async () => {
    if (!addTitle.trim()) { toast.error("Title is required."); return; }
    if (addType === "url" && !addUrl.trim()) { toast.error("URL is required."); return; }

    const newEntry: Deliverable = {
      id: Date.now().toString(),
      title: addTitle.trim(),
      type: addType,
      url: addUrl.trim() || undefined,
      description: addDesc.trim() || undefined,
      added_at: new Date().toISOString(),
    };
    setDeliverables(prev => [...prev, newEntry]);
    setAddTitle(""); setAddUrl(""); setAddDesc("");
    toast.success("Deliverable added — click Save to persist.");
  };

  const handleFileDeliverable = async (file: File) => {
    if (!addTitle.trim()) { toast.error("Enter a title before uploading."); return; }
    setUploadingFile(addTitle);
    try {
      const path = `deliverables/${submissionId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("client-documents")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("client-documents").getPublicUrl(path);
      const newEntry: Deliverable = {
        id: Date.now().toString(),
        title: addTitle.trim(),
        type: "file",
        url: urlData.publicUrl,
        description: addDesc.trim() || undefined,
        added_at: new Date().toISOString(),
      };
      setDeliverables(prev => [...prev, newEntry]);
      setAddTitle(""); setAddDesc("");
      toast.success("File uploaded and added.");
    } catch (err: any) {
      toast.error(err.message || "File upload failed.");
    } finally {
      setUploadingFile(null);
    }
  };

  const handleAgreementUpload = async (file: File) => {
    try {
      const path = `agreements/${submissionId}/service-agreement-${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage
        .from("client-documents")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("client-documents").getPublicUrl(path);
      setAgreementUrl(urlData.publicUrl);
      toast.success("Agreement uploaded! Click Save to persist.");
    } catch (err: any) {
      toast.error(err.message || "Agreement upload failed.");
    }
  };

  const handleRemoveDeliverable = (id: string) => {
    setDeliverables(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("contact_submissions")
        .update({
          service_progress: progress,
          status,
          deliverables,
          service_agreement_url: agreementUrl || null,
          admin_notes: adminNotes || null,
        })
        .eq("id", submissionId);
      if (error) throw error;
      toast.success(`Saved progress & deliverables for ${submissionName}`);
      onSave?.({ progress, status, admin_notes: adminNotes });
    } catch (err: any) {
      toast.error(err.message || "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Progress & Status */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <TrendingUp className="w-4 h-4 adm-olive-accent" /> Service Progress
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="adm-form-group">
            <label className="adm-label">Progress: {progress}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full accent-[var(--adm-olive)]"
            />
            <div className="adm-progress-bar mt-2">
              <div className="adm-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Status</label>
            <select
              className="adm-input adm-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Service Agreement */}
        <div className="adm-form-group">
          <label className="adm-label">Service Agreement URL or File</label>
          <div className="flex gap-2">
            <input
              className="adm-input"
              type="url"
              placeholder="https://… or upload below"
              value={agreementUrl}
              onChange={e => setAgreementUrl(e.target.value)}
            />
            <button
              className="adm-btn adm-btn-secondary"
              onClick={() => agreementInputRef.current?.click()}
              title="Upload agreement file"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            ref={agreementInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleAgreementUpload(e.target.files[0])}
          />
          {agreementUrl && (
            <a href={agreementUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 mt-1" style={{ color: "var(--adm-olive-light)" }}>
              <ExternalLink className="w-3 h-3" /> View Agreement
            </a>
          )}
        </div>

        {/* Admin Notes */}
        <div className="adm-form-group">
          <label className="adm-label">Internal Admin Notes (not visible to client)</label>
          <textarea
            className="adm-input"
            rows={3}
            placeholder="Private notes, internal reminders, blockers…"
            value={adminNotes}
            onChange={e => setAdminNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Deliverables */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <FileText className="w-4 h-4 adm-olive-accent" /> Deliverables & Documents
          </span>
        </div>

        {/* Add form */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)" }}
        >
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(["url", "file", "note"] as const).map(t => (
              <button
                key={t}
                className={`adm-btn adm-btn-sm ${addType === t ? "adm-btn-primary" : "adm-btn-secondary"}`}
                onClick={() => setAddType(t)}
              >
                {t === "url" && <Link className="w-3 h-3" />}
                {t === "file" && <File className="w-3 h-3" />}
                {t === "note" && <ClipboardList className="w-3 h-3" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Title *</label>
            <input className="adm-input" value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="e.g. Wireframe v1, SEO Audit Report…" />
          </div>

          {addType === "url" && (
            <div className="adm-form-group">
              <label className="adm-label">URL *</label>
              <input className="adm-input" type="url" value={addUrl} onChange={e => setAddUrl(e.target.value)} placeholder="https://…" />
            </div>
          )}

          <div className="adm-form-group">
            <label className="adm-label">Description (optional)</label>
            <input className="adm-input" value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="Brief description or version info" />
          </div>

          {addType === "file" ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleFileDeliverable(e.target.files[0])}
              />
              <button
                className="adm-btn adm-btn-secondary w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!uploadingFile}
              >
                {uploadingFile ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading…</> : <><Upload className="w-3.5 h-3.5" /> Choose & Upload File</>}
              </button>
            </>
          ) : (
            <button className="adm-btn adm-btn-primary w-full" onClick={handleAddDeliverable}>
              <Plus className="w-3.5 h-3.5" /> Add Deliverable
            </button>
          )}
        </div>

        {/* List */}
        {deliverables.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📂</div>
            <div className="adm-empty-msg">No deliverables yet.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {deliverables.map(d => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 p-1.5 rounded-lg" style={{ background: "var(--adm-olive-glow)" }}>
                    {d.type === "file" && <File className="w-3.5 h-3.5 adm-olive-accent" />}
                    {d.type === "url" && <Link className="w-3.5 h-3.5 adm-olive-accent" />}
                    {d.type === "note" && <ClipboardList className="w-3.5 h-3.5 adm-olive-accent" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--adm-text-primary)" }}>{d.title}</p>
                    {d.description && <p className="text-xs truncate" style={{ color: "var(--adm-text-muted)" }}>{d.description}</p>}
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1" style={{ color: "var(--adm-olive-light)" }}>
                        <ExternalLink className="w-2.5 h-2.5" /> View
                      </a>
                    )}
                  </div>
                </div>
                <button className="adm-btn adm-btn-danger adm-btn-sm shrink-0" onClick={() => handleRemoveDeliverable(d.id)}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="adm-btn adm-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving…</> : <><Save className="w-3.5 h-3.5" /> Save Progress & Deliverables</>}
        </button>
      </div>
    </div>
  );
}
