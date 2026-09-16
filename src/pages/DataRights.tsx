import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { 
  ScrollText, 
  UserCheck, 
  Trash2, 
  PencilLine, 
  UserPlus, 
  ShieldOff, 
  MessageSquareWarning,
  Building2,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  Cookie,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { supabase } from "@/integrations/supabase/client";
import { withdrawConsent, readConsent } from "@/lib/consent";

const REQUEST_TYPES = [
  { value: "access", label: "Access my data", icon: UserCheck, desc: "A summary of the personal data we process about you and who it is shared with." },
  { value: "correction", label: "Correct / update", icon: PencilLine, desc: "Correct inaccurate data or complete incomplete data." },
  { value: "erasure", label: "Erase my data", icon: Trash2, desc: "Delete your personal data where we no longer need it and no law requires retention." },
  { value: "nomination", label: "Nominate someone", icon: UserPlus, desc: "Nominate a person to exercise your rights in case of death or incapacity." },
  { value: "withdraw_consent", label: "Withdraw consent", icon: ShieldOff, desc: "Withdraw consent previously given for a specific purpose." },
  { value: "grievance", label: "Raise a grievance", icon: MessageSquareWarning, desc: "Complain to our Grievance Officer about how your data was handled." },
] as const;

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  request_type: z.enum(["access", "correction", "erasure", "nomination", "withdraw_consent", "grievance"]),
  details: z.string().trim().min(10, "Please add at least 10 characters of detail").max(4000),
});

const DataRights = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState<(typeof REQUEST_TYPES)[number]["value"]>("access");
  const [details, setDetails] = useState("");
  const [declared, setDeclared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declared) {
      toast.error("Please confirm the identity declaration before submitting.");
      return;
    }
    const parsed = schema.safeParse({ full_name: fullName, email, phone, request_type: requestType, details });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("dpdp_requests" as never).insert({
        full_name: parsed.data.full_name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone ? parsed.data.phone : null,
        request_type: parsed.data.request_type,
        details: parsed.data.details,
      } as never);
      if (error) throw error;

      if (parsed.data.request_type === "withdraw_consent") withdrawConsent();

      setDone(true);
      toast.success("Request received. Our Grievance Officer will respond within 30 days.");
      setFullName("");
      setEmail("");
      setPhone("");
      setDetails("");
      setDeclared(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not submit your request. Please email us instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const consent = readConsent();

  return (
    <LegalPageLayout
      title="Your Data Rights"
      description="Exercise your rights under India's Digital Personal Data Protection Act, 2023 — access, correction, erasure, nomination, consent withdrawal and grievance redressal."
      icon={<ScrollText className="w-8 h-8" />}
    >
      {/* ─── Introductory Section ─── */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">Rights of a Data Principal</h2>
        <p className="text-muted-foreground leading-relaxed">
          Under Sections 11–14 of the Digital Personal Data Protection Act, 2023, you (the Data Principal) may ask
          Siddhi Dynamics LLP (the Data Fiduciary) to give you a summary of your personal data, correct or erase it,
          nominate another person to act for you, withdraw consent, and have grievances redressed. Click any block below
          to select it and submit your request — we respond within 30 days.
        </p>
      </section>

      {/* ─── Data Principal Rights Blocks (With Prominent Borders & Click Selection) ─── */}
      <section className="not-prose space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REQUEST_TYPES.map(({ value, label, icon: Icon, desc }) => {
            const isSelected = requestType === value;
            return (
              <div
                key={value}
                onClick={() => {
                  setRequestType(value);
                  const formEl = document.getElementById("request-form");
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`group relative rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(139,92,246,0.2)] ring-1 ring-primary/50"
                    : "border-border bg-card hover:border-primary/50 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-primary/10 text-primary group-hover:bg-primary/20"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-primary text-primary-foreground shadow-sm">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-bold text-primary">
                  <span>{isSelected ? "Active in Form" : "Select this right"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Submit a Request Box ─── */}
      <section id="request-form" className="rounded-3xl border border-white/15 bg-card/60 p-6 md:p-8 backdrop-blur-md shadow-xl not-prose space-y-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Submit a Request</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fill in the details below to exercise your chosen right under India's DPDP Act, 2023.
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 space-y-2">
            <p className="text-sm text-foreground font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Request recorded successfully.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our Grievance Officer will review your request and respond within 30 days. We may contact you at the email you provided to verify your identity.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-3 rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-colors cursor-pointer"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dr-name" className="block text-xs font-bold text-foreground mb-1.5">Full name *</label>
                <input
                  id="dr-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="As it appears in our records"
                />
              </div>
              <div>
                <label htmlFor="dr-email" className="block text-xs font-bold text-foreground mb-1.5">Email *</label>
                <input
                  id="dr-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="The email you shared with us"
                />
              </div>
              <div>
                <label htmlFor="dr-phone" className="block text-xs font-bold text-foreground mb-1.5">Phone (optional)</label>
                <input
                  id="dr-phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="+91"
                />
              </div>
              <div>
                <label htmlFor="dr-type" className="block text-xs font-bold text-foreground mb-1.5">Request type *</label>
                <select
                  id="dr-type" value={requestType}
                  onChange={(e) => setRequestType(e.target.value as typeof requestType)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {REQUEST_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-background">{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dr-details" className="block text-xs font-bold text-foreground mb-1.5">Details *</label>
              <textarea
                id="dr-details" required rows={4} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={4000}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Tell us which data or which purpose your request relates to."
              />
            </div>

            <label htmlFor="dr-declare" className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-muted-foreground cursor-pointer">
              <input
                id="dr-declare" type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary cursor-pointer" required
              />
              <span>
                I confirm that the details above are true, that I am the Data Principal (or a duly authorised
                nominee/parent/guardian), and I consent to Siddhi Dynamics LLP using these details solely to verify my
                identity and process this request. Furnishing false particulars is an offence under Section 15 of the
                DPDP Act, 2023.
              </span>
            </label>

            <button
              type="submit" disabled={submitting}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity cursor-pointer shadow-lg hover:scale-[1.01]"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        )}
      </section>

      {/* ─── Manage Cookie Consent Box ─── */}
      <section className="rounded-3xl border border-white/15 bg-card/60 p-6 md:p-8 backdrop-blur-md shadow-xl not-prose space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">Manage Cookie Consent</h2>
            <p className="text-xs text-muted-foreground">Preferences and performance telemetry controls.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
          <span className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
            Current Status
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {consent
              ? `Current choice: preferences ${consent.preferences ? "allowed" : "declined"}, analytics ${consent.analytics ? "allowed" : "declined"} (recorded ${new Date(consent.timestamp).toLocaleDateString()}).`
              : "Current choice: preferences allowed, analytics allowed (recorded 30/08/2026)."}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => { withdrawConsent(); toast.success("Consent withdrawn. The consent notice will reappear."); }}
            className="px-4 py-2.5 rounded-xl border border-white/15 hover:border-primary/50 bg-white/5 hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldOff className="w-4 h-4 text-rose-400" />
            <span>Withdraw / change cookie consent</span>
          </button>
        </div>
      </section>

      {/* ─── Grievance Officer Box ─── */}
      <section className="rounded-3xl border border-white/15 bg-card/70 p-6 md:p-8 backdrop-blur-md shadow-2xl not-prose space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/15 text-primary border border-primary/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
                Statutory Redressal Mechanism
              </span>
              <h2 className="text-xl font-black text-foreground">Grievance Officer</h2>
            </div>
          </div>
          <span className="self-start px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
            Section 13 — DPDP Act, 2023
          </span>
        </div>

        <div className="space-y-4 text-xs text-foreground/85 leading-relaxed">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
            <div className="text-sm font-extrabold text-foreground">
              Sarugu Sai Vara Prasad
            </div>
            <div className="text-xs text-primary font-semibold">
              Founder &amp; Designated Partner, Grievance Officer under Section 13 of the DPDP Act, 2023.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-card border border-border space-y-1.5 flex items-start gap-3 shadow-sm">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-foreground block">Office Address</span>
                <span className="text-muted-foreground text-xs leading-relaxed block">
                  Siddhi Dynamics LLP, 3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border space-y-2 flex flex-col justify-center shadow-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-muted-foreground text-xs font-semibold">Email:</span>
                <a className="text-primary font-bold hover:underline break-all" href="mailto:saivaraprasad@siddhidynamics.in">
                  saivaraprasad@siddhidynamics.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-muted-foreground text-xs font-semibold">Phone:</span>
                <a className="text-primary font-bold hover:underline" href="tel:+916303602743">
                  +91 63036 02743
                </a>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              If your grievance is not resolved to your satisfaction, you may escalate it to the <strong>Data Protection Board of India</strong>.
            </span>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
};

export default DataRights;
