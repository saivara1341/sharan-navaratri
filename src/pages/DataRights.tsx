import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ScrollText, UserCheck, Trash2, PencilLine, UserPlus, ShieldOff, MessageSquareWarning } from "lucide-react";
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
      <section>
        <h2 className="text-xl font-bold text-foreground">Rights of a Data Principal</h2>
        <p className="text-muted-foreground leading-relaxed">
          Under Sections 11–14 of the Digital Personal Data Protection Act, 2023, you (the Data Principal) may ask
          Siddhi Dynamics LLP (the Data Fiduciary) to give you a summary of your personal data, correct or erase it,
          nominate another person to act for you, withdraw consent, and have grievances redressed. Use the form below —
          we respond within 30 days.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {REQUEST_TYPES.map(({ value, label, icon: Icon, desc }) => (
          <div key={value} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Icon className="w-4 h-4 text-primary" /> {label}
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section id="request-form">
        <h2 className="text-xl font-bold text-foreground">Submit a request</h2>
        {done ? (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <p className="text-sm text-foreground font-bold">Request recorded.</p>
            <p className="text-xs text-muted-foreground mt-1">
              We may contact you at the email you provided to verify your identity before acting on the request.
            </p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-4 rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-colors"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 not-prose">
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
                id="dr-details" required rows={5} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={4000}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Tell us which data or which purpose your request relates to."
              />
            </div>

            <label htmlFor="dr-declare" className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-muted-foreground cursor-pointer">
              <input
                id="dr-declare" type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary" required
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
              className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground">Manage cookie consent</h2>
        <p className="text-muted-foreground leading-relaxed">
          Current choice: {consent
            ? `preferences ${consent.preferences ? "allowed" : "declined"}, analytics ${consent.analytics ? "allowed" : "declined"} (recorded ${new Date(consent.timestamp).toLocaleDateString()})`
            : "no optional consent recorded"}.
        </p>
        <button
          type="button"
          onClick={() => { withdrawConsent(); toast.success("Consent withdrawn. The consent notice will reappear."); }}
          className="mt-3 rounded-xl border border-white/15 px-4 py-2 text-xs font-bold text-foreground hover:border-primary/40 transition-colors"
        >
          Withdraw / change cookie consent
        </button>
      </section>

      <section className="pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold text-foreground">Grievance Officer</h2>
        <p className="text-muted-foreground leading-relaxed">
          Sarugu Sai Vara Prasad — Founder &amp; Designated Partner, Grievance Officer under Section 13 of the DPDP
          Act, 2023.<br />
          Siddhi Dynamics LLP, 3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India<br />
          Email: <a className="text-primary hover:underline" href="mailto:saivaraprasad@siddhidynamics.in">saivaraprasad@siddhidynamics.in</a><br />
          Phone: <a className="text-primary hover:underline" href="tel:+916303602743">+91 63036 02743</a>
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          If your grievance is not resolved to your satisfaction, you may escalate it to the Data Protection Board of
          India.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default DataRights;
