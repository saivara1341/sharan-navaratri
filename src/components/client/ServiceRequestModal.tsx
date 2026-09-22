import React, { useState } from "react";
import {
  X,
  Check,
  ClipboardCheck,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Target,
  Palette,
  Layers,
  Sparkles,
  QrCode,
  FileCode2,
  Upload,
  File,
  Trash2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProjectLifecycleMeta, ClientServiceFormData } from "@/types/projectLifecycle";

interface ServiceRequestModalProps {

  projectName?: string;
  clientName: string;
  clientEmail: string;
  meta: ProjectLifecycleMeta;
  onClose: () => void;
  onSubmit: (
    formData: ClientServiceFormData,
    phone: string,
    paymentStructure: string,
    advanceAmount: string
  ) => Promise<void>;
  saving: boolean;
}

const MATERIAL_OPTIONS = [
  "Existing codebase / repository access",
  "Domain & DNS credentials (or purchase needed)",
  "Existing database / API documentation",
  "High-resolution product images / illustrations",
  "Social media handles & business profiles",
  "Content copy & service catalog text",
  "Competitor & design inspiration references"
];

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  projectName,
  clientName,
  clientEmail,
  meta,
  onClose,
  onSubmit,
  saving
}) => {
  const [contactName, setContactName] = useState(clientName);
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(clientEmail);
  const [preferredTime, setPreferredTime] = useState("Morning (10:00 AM – 1:00 PM)");
  const [requestedStartDate, setRequestedStartDate] = useState(new Date().toISOString().split("T")[0]);

  // Project Category & Complexity Tier
  const [projectCategory, setProjectCategory] = useState<string>('Website');
  const [complexityTier, setComplexityTier] = useState<'Simple' | 'Standard' | 'Premium'>('Standard');

  // Brand & Logo assets
  const [logoStatus, setLogoStatus] = useState<'have_logo' | 'need_design'>('have_logo');
  const [brandColors, setBrandColors] = useState('');
  const [competitorRefs, setCompetitorRefs] = useState('');

  const [businessGoal, setBusinessGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyRequirements, setKeyRequirements] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [pendingMaterialsDate, setPendingMaterialsDate] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: number; url: string }>>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [paymentStructure, setPaymentStructure] = useState<string>(
    meta.payment_structure || "50% Advance + 50% on Delivery"
  );

  const quoteTotalNum = parseInt((meta.agreement || "").replace(/\D/g, "") || "0");
  const isFullAdvance = paymentStructure.includes("100%");
  const advanceNum = isFullAdvance
    ? quoteTotalNum
    : Math.round(quoteTotalNum * 0.5);
  const currentAdvanceString = advanceNum > 0 ? `₹${advanceNum.toLocaleString("en-IN")}` : (meta.advance_amount || "50% Advance");

  const toggleMaterial = (item: string) => {
    setMaterials(prev => prev.includes(item) ? prev.filter(m => m !== item) : [...prev, item]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    try {
      const newUploads: Array<{ name: string; size: number; url: string }> = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `client_briefs/${Date.now()}_${cleanName}`;
        const { error: upErr } = await supabase.storage
          .from("client-documents")
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("client-documents").getPublicUrl(path);
        newUploads.push({ name: file.name, size: file.size, url: pub.publicUrl });
      }
      setUploadedFiles(prev => [...prev, ...newUploads]);
      toast.success(`Uploaded ${newUploads.length} client data file(s)!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload file(s)");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = contactPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number for WhatsApp updates & payment confirmation.");
      return;
    }
    if (!confirmed) {
      setErrorMsg("Please confirm the service start condition agreement below.");
      return;
    }
    setErrorMsg("");

    const combinedMaterials = [
      ...materials,
      ...uploadedFiles.map(f => `Attached File: ${f.name} (${f.url})`)
    ];

    const formData: ClientServiceFormData = {
      contact_name: contactName.trim() || clientName,
      contact_phone: cleanPhone,
      contact_email: contactEmail.trim() || clientEmail,
      preferred_contact_time: preferredTime,
      business_goal: businessGoal.trim(),
      target_audience: targetAudience.trim(),
      key_requirements: keyRequirements.trim(),
      materials_provided: combinedMaterials,
      pending_materials_date: pendingMaterialsDate || undefined,
      confirmed_at: new Date().toISOString(),
      project_category: projectCategory as any,
      complexity_tier: complexityTier,
      logo_status: logoStatus,
      brand_colors: brandColors.trim(),
      competitor_references: competitorRefs.trim(),
    };


    await onSubmit(formData, cleanPhone, paymentStructure, currentAdvanceString);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-12 sm:p-6 sm:pt-24 sm:pb-12 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-stone-900 text-left my-auto">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Siddhi Dynamics LLP · Client Requirements & Onboarding</span>
            <h2 className="text-xl font-bold mt-0.5">Project Scope & Requirements Specification</h2>
            <p className="text-xs text-stone-500 mt-1">
              Submit your assets and specifications. Admin will evaluate your requirements, finalize the exact quote, and provide QR / bank transfer credentials.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agreed Quote Summary Banner */}
        <div className="px-6 py-3.5 bg-emerald-50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-stone-500 font-medium">Estimated / Quoted Budget:</span>{" "}
            <strong className="text-stone-900 font-bold text-sm">{meta.agreement || "Custom Quote on Review"}</strong>
            <span className="ml-2 text-stone-600 font-semibold text-[11px] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {paymentStructure}
            </span>
          </div>
          <div className="bg-emerald-600 text-white px-3.5 py-1 rounded-full font-bold text-xs shadow-sm flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5" /> Advance via Direct UPI / Bank
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section: Project Category & Complexity Tier */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> 1. Project Type & Complexity Tier
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Project Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Website', label: 'Website / Landing Page' },
                  { id: 'SEO', label: 'SEO Optimization' },
                  { id: 'GEO', label: 'GEO (AI Search Engines)' },
                  { id: 'AEO', label: 'AEO (Answer Engines)' },
                  { id: 'GBP', label: 'Google Business Profile' },
                  { id: 'SaaS Platform', label: 'SaaS Web Application' },
                  { id: 'ERP Solution', label: 'Custom ERP & Operations' },
                  { id: 'Business Automation', label: 'Workflow Automation' },
                  { id: 'Mobile App', label: 'Mobile Application' },
                  { id: 'Other', label: 'Custom Deep-Tech Solution' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProjectCategory(cat.id as any)}
                    className={`px-3 py-2 rounded-xl text-left border text-xs font-semibold transition-all ${
                      projectCategory === cat.id
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-primary/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Development Complexity Tier</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Simple',
                    title: 'Simple / Starter',
                    desc: 'Clean essential UI, high performance, rapid 7-14 days turnaround.'
                  },
                  {
                    id: 'Standard',
                    title: 'Standard / Growth',
                    desc: 'Dynamic database, authentication, API integrations, custom UI/UX.'
                  },
                  {
                    id: 'Premium',
                    title: 'Premium / Enterprise',
                    desc: 'High-scalability SaaS/ERP, micro-animations, multi-tenant, SLA.'
                  }
                ].map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setComplexityTier(tier.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      complexityTier === tier.id
                        ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs">{tier.title}</span>
                      {complexityTier === tier.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Brand & Logo Assets */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-primary" /> 2. Brand Identity & Logo Assets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setLogoStatus('have_logo')}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  logoStatus === 'have_logo'
                    ? 'bg-white border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'bg-white/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="logoStatus"
                  checked={logoStatus === 'have_logo'}
                  onChange={() => setLogoStatus('have_logo')}
                  className="mt-0.5 text-primary focus:ring-primary h-4 w-4 shrink-0"
                />
                <div>
                  <span className="font-bold text-stone-900 text-xs">We Have an Existing Logo</span>
                  <p className="text-[10px] text-stone-500 mt-0.5">High-resolution PNG, SVG, or vector assets available.</p>
                </div>
              </label>

              <label
                onClick={() => setLogoStatus('need_design')}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  logoStatus === 'need_design'
                    ? 'bg-white border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'bg-white/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="logoStatus"
                  checked={logoStatus === 'need_design'}
                  onChange={() => setLogoStatus('need_design')}
                  className="mt-0.5 text-primary focus:ring-primary h-4 w-4 shrink-0"
                />
                <div>
                  <span className="font-bold text-stone-900 text-xs">Need Siddhi Dynamics to Design Logo</span>
                  <p className="text-[10px] text-stone-500 mt-0.5">Custom branding & identity creation from scratch.</p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">Preferred Color Palette / Theme</span>
                <input
                  type="text"
                  value={brandColors}
                  onChange={e => setBrandColors(e.target.value)}
                  placeholder="e.g. Navy Blue & Emerald, Dark Mode, Minimalist Monochrome"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>

              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">Design & Competitor Inspiration</span>
                <input
                  type="text"
                  value={competitorRefs}
                  onChange={e => setCompetitorRefs(e.target.value)}
                  placeholder="e.g. stripe.com, linear.app, competitors URL"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
            </div>
          </div>

          {/* Section: Contact Details */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> 3. Contact & Service Window
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">Contact Person Name</span>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">10-Digit Mobile Number (For UPI / WhatsApp)</span>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">Requested Start Date</span>
                <input
                  type="date"
                  required
                  value={requestedStartDate}
                  onChange={e => setRequestedStartDate(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">Preferred Contact Window</span>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                >
                  <option>Morning (10:00 AM – 1:00 PM)</option>
                  <option>Afternoon (2:00 PM – 5:00 PM)</option>
                  <option>Evening (5:00 PM – 8:00 PM)</option>
                  <option>Anytime via WhatsApp / Email</option>
                </select>
              </label>
            </div>
          </div>

          {/* Section: Project Requirements & Business Goal */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" /> 4. Business Goal & Specific Functional Needs
            </h3>
            <div className="space-y-3">
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">What specific business goal or problem does this project solve?</span>
                <textarea
                  rows={2}
                  value={businessGoal}
                  onChange={e => setBusinessGoal(e.target.value)}
                  placeholder="e.g. Build an automated SaaS platform for multi-vendor inventory with role-based access control."
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1 block">
                  <span className="font-semibold text-stone-700">Target Audience</span>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    placeholder="e.g. B2B enterprise clients, retail customers"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="font-semibold text-stone-700">Key Features / Integrations Needed</span>
                  <input
                    type="text"
                    value={keyRequirements}
                    onChange={e => setKeyRequirements(e.target.value)}
                    placeholder="e.g. Auth, WhatsApp alerts, QR verification, export to Excel"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section: Materials, Data & Technical Assets */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-primary" /> 5. Upload Requirements Data & Technical Assets
            </h3>

            {/* Direct Data Upload Box */}
            <div className="p-3.5 rounded-xl border border-dashed border-stone-300 bg-white space-y-2.5 text-center">
              <div className="text-[11px] text-stone-600 font-medium">
                Upload your requirement documents, datasets, catalogs, CSVs, or design briefs directly:
              </div>
              <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-primary" />
                {uploadingFiles ? "Uploading Data Files..." : "Upload Requirements Files"}
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingFiles}
                />
              </label>

              {uploadedFiles.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-1.5 text-left">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <File className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate font-medium text-stone-800">{f.name}</span>
                        <span className="text-[10px] text-stone-400 shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="p-1 text-stone-500 hover:text-stone-900">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button type="button" onClick={() => handleRemoveFile(i)} className="p-1 text-stone-500 hover:text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {MATERIAL_OPTIONS.map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-stone-200 hover:border-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={materials.includes(item)}
                    onChange={() => toggleMaterial(item)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-stone-700 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Payment Method Notice & Confirmation */}
          <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/60 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 6. Direct Payment & Service Kickoff Terms
            </h3>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              <strong>Direct QR & Bank Verification:</strong> SIDDHI DYNAMICS PVT LTD processes payments via direct official UPI QR code (<strong className="font-mono text-emerald-800">siddhidynamics@sbi</strong>) and State Bank of India Current Account. Zero intermediate gateway delays.
            </p>
            <p className="text-[11px] text-stone-700 leading-relaxed">
              <strong>Admin Quote Review:</strong> Our tech lead and admin evaluate your specifications (Tier: <strong>{complexityTier}</strong>) and assign exact milestone pricing before advance is due.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4 mt-0.5 shrink-0"
              />
              <span className="font-semibold text-stone-900 text-xs">
                I confirm the specifications above are accurate and understand that service begins upon direct advance payment and admin verification.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-xl shadow-stone-900/10 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Submitting Specifications…" : "Submit Requirements & Confirm Scope"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
