import React, { useState } from "react";
import { X, Check, ClipboardCheck, Sparkles, Building, Phone, Mail, Calendar, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { ProjectLifecycleMeta, ClientServiceFormData } from "@/types/projectLifecycle";

interface ServiceRequestModalProps {
  projectName: string;
  clientName: string;
  clientEmail: string;
  meta: ProjectLifecycleMeta;
  onClose: () => void;
  onSubmit: (formData: ClientServiceFormData, phone: string) => Promise<void>;
  saving: boolean;
}

const MATERIAL_OPTIONS = [
  "Logo & brand guidelines",
  "Domain / DNS / hosting credentials",
  "Content, images & product catalog",
  "Social media & ad accounts access",
  "Existing codebase / database details",
  "Analytics / CRM / WhatsApp API access",
  "Competitor & design references"
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
  const [businessGoal, setBusinessGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyRequirements, setKeyRequirements] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [pendingMaterialsDate, setPendingMaterialsDate] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleMaterial = (item: string) => {
    setMaterials(prev => prev.includes(item) ? prev.filter(m => m !== item) : [...prev, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = contactPhone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number for Cashfree payment verification & WhatsApp updates.");
      return;
    }
    if (!confirmed) {
      setErrorMsg("Please confirm the service start condition agreement below.");
      return;
    }
    setErrorMsg("");

    const formData: ClientServiceFormData = {
      contact_name: contactName.trim() || clientName,
      contact_phone: cleanPhone,
      contact_email: contactEmail.trim() || clientEmail,
      preferred_contact_time: preferredTime,
      business_goal: businessGoal.trim(),
      target_audience: targetAudience.trim(),
      key_requirements: keyRequirements.trim(),
      materials_provided: materials,
      pending_materials_date: pendingMaterialsDate || undefined,
      confirmed_at: new Date().toISOString()
    };

    await onSubmit(formData, cleanPhone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-stone-900 text-left">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Siddhi Dynamics LLP · Service Onboarding</span>
            <h2 className="text-xl font-bold mt-0.5">Service Request & Onboarding Form</h2>
            <p className="text-xs text-stone-500 mt-1">
              Confirm your project scope & requirements. Service officially begins upon completing the agreed advance payment.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agreed Quote Summary Banner */}
        <div className="px-6 py-3.5 bg-lime-50 border-b border-lime-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-stone-500 font-medium">Assigned Quote:</span>{" "}
            <strong className="text-stone-900 font-bold text-sm">{meta.agreement || "Quoted Price"}</strong>
            {meta.payment_structure && <span className="ml-2 text-stone-600">({meta.payment_structure})</span>}
          </div>
          <div className="bg-white px-3 py-1 rounded-full border border-lime-200 font-bold text-primary text-xs">
            Advance Due: {meta.advance_amount || "50% Advance"}
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

          {/* Section 1: Contact Details */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" /> 1. Primary Contact & Desired Start
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
                <span className="font-semibold text-stone-700">10-Digit Mobile Number (Cashfree verified)</span>
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
                <span className="font-semibold text-stone-700">Requested Service Start Date</span>
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

          {/* Section 2: Project Requirements & Business Goal */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> 2. Business Goal & Expected Outcome
            </h3>
            <div className="space-y-3">
              <label className="space-y-1 block">
                <span className="font-semibold text-stone-700">What specific result or growth do you need from this project?</span>
                <textarea
                  rows={2}
                  value={businessGoal}
                  onChange={e => setBusinessGoal(e.target.value)}
                  placeholder="e.g. Launch a high-converting website to attract 50+ qualified inbound leads per month."
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1 block">
                  <span className="font-semibold text-stone-700">Target Audience / Core Customers</span>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    placeholder="e.g. B2B founders, Indian retail customers, etc."
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-1 block">
                  <span className="font-semibold text-stone-700">Key Features / Preferences</span>
                  <input
                    type="text"
                    value={keyRequirements}
                    onChange={e => setKeyRequirements(e.target.value)}
                    placeholder="e.g. Fast loading, WhatsApp chat widget, UPI checkout"
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Materials & Access Checklist */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-primary" /> 3. Materials & Access Readiness
            </h3>
            <p className="text-[11px] text-stone-500">
              Tick what you are ready to provide. Never write passwords directly here; access can be securely shared via invite or WhatsApp.
            </p>
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

          {/* Section 4: Start Condition & Confirmation */}
          <div className="p-4 rounded-2xl border border-lime-200 bg-lime-50/60 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 4. Service Start Condition & Security Policy
            </h3>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Service Start Condition:</strong> Siddhi Dynamics LLP will begin work immediately after scope confirmation and receipt of the agreed advance payment through the Cashfree payment gateway.
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Banking Details Unlock:</strong> Upon successful Cashfree transaction, the signed Service Order Agreement and official Siddhi Dynamics LLP banking details (SBI A/C, IFSC, UPI, LLPIN, PAN) will be unlocked in your portal for accounting & tax records.
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
                I confirm the information above is accurate and agree to proceed to Cashfree secure payment to start the service.
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
              {saving ? "Submitting & Preparing Cashfree Link…" : `Confirm & Pay Advance (${meta.advance_amount || "Proceed via Cashfree"})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
