import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Building2, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SERVICES = ["SEO, GEO & AEO Programme", "Website Development", "Business Automation", "SaaS Platform Development", "ERP System", "Google Business Profile", "Custom Scope"];

export default function AgencyClientIntake() {
  const { token = "" } = useParams();
  const [state, setState] = useState<"loading" | "ready" | "used" | "invalid" | "success">("loading");
  const [agencyName, setAgencyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ businessName: "", brandName: "", category: "", description: "", website: "", contactName: "", mobile: "", whatsapp: "", email: "", address: "", services: [SERVICES[0]] });

  useEffect(() => {
    supabase.functions.invoke("agency-client-intake", { body: { action: "status", token } }).then(({ data, error }) => {
      if (error || !data) return setState("invalid");
      setAgencyName(data.agencyName || "Agency Partner");
      setState(data.submitted ? "used" : "ready");
    });
  }, [token]);

  const toggleService = (service: string) => setForm(prev => ({ ...prev, services: prev.services.includes(service) ? (prev.services.length > 1 ? prev.services.filter(item => item !== service) : prev.services) : [...prev.services, service] }));
  const field = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("agency-client-intake", { body: { action: "submit", token, payload: form } });
    setSaving(false);
    if (error || data?.error) {
      // A competing browser may have consumed the token immediately before this
      // request. Recheck its state so the visitor sees the final, accurate result.
      const { data: current } = await supabase.functions.invoke("agency-client-intake", { body: { action: "status", token } });
      if (current?.submitted) setState("used");
      else alert(data?.error || "We could not submit the form. Please try again.");
      return;
    }
    setState("success");
  };

  const message = state === "loading" ? "Checking your secure intake link…" : state === "used" ? "This intake link has already been used. Each shared link accepts one response only." : state === "invalid" ? "This intake link is invalid or is no longer available." : "";
  if (state !== "ready") return <main className="min-h-screen bg-muted flex items-center justify-center p-5"><section className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 text-center shadow-xl"><div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">{state === "loading" ? <Loader2 className="animate-spin" /> : <ShieldCheck />}</div><h1 className="text-xl font-extrabold text-foreground mb-2">Siddhi Dynamics Client Intake</h1><p className="text-sm text-muted-foreground leading-relaxed">{state === "success" ? "Thank you — your details have been securely submitted to the agency and Siddhi Dynamics." : message}</p>{state === "success" && <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mt-5" />}</section></main>;

  const input = "w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";
  return <main className="min-h-screen bg-muted py-10 px-4"><section className="max-w-2xl mx-auto bg-card border border-border rounded-3xl shadow-xl overflow-hidden"><header className="p-6 bg-primary text-primary-foreground"><div className="flex gap-3 items-center"><Building2 className="w-6 h-6" /><div><p className="font-extrabold text-lg">Client Onboarding</p><p className="text-sm opacity-85">Shared by {agencyName} · Siddhi Dynamics</p></div></div></header><form onSubmit={submit} className="p-6 sm:p-8 space-y-7"><p className="text-sm text-muted-foreground">Please share your business details below. This secure link accepts one completed response.</p><section className="space-y-3"><h2 className="font-bold text-foreground">Services requested</h2><div className="grid sm:grid-cols-2 gap-2">{SERVICES.map(service => <label key={service} className="flex items-center gap-2.5 p-3 rounded-xl border border-border cursor-pointer text-sm"><input type="checkbox" checked={form.services.includes(service)} onChange={() => toggleService(service)} className="accent-primary" />{service}</label>)}</div></section><section className="grid sm:grid-cols-2 gap-4"><h2 className="sm:col-span-2 font-bold text-foreground">Business details</h2><input required className={input} placeholder="Business name *" value={form.businessName} onChange={e => field("businessName", e.target.value)} /><input className={input} placeholder="Brand name (if different)" value={form.brandName} onChange={e => field("brandName", e.target.value)} /><input className={input} placeholder="Business category" value={form.category} onChange={e => field("category", e.target.value)} /><input className={input} type="url" placeholder="Website URL" value={form.website} onChange={e => field("website", e.target.value)} /><textarea className={`${input} sm:col-span-2`} rows={3} placeholder="Brief business description" value={form.description} onChange={e => field("description", e.target.value)} /></section><section className="grid sm:grid-cols-2 gap-4"><h2 className="sm:col-span-2 font-bold text-foreground">Contact details</h2><input required className={input} placeholder="Contact person name *" value={form.contactName} onChange={e => field("contactName", e.target.value)} /><input required className={input} inputMode="numeric" maxLength={10} placeholder="10-digit mobile number *" value={form.mobile} onChange={e => field("mobile", e.target.value.replace(/\D/g, ""))} /><input className={input} inputMode="numeric" maxLength={10} placeholder="WhatsApp number" value={form.whatsapp} onChange={e => field("whatsapp", e.target.value.replace(/\D/g, ""))} /><input className={input} type="email" placeholder="Email address" value={form.email} onChange={e => field("email", e.target.value)} /><textarea className={`${input} sm:col-span-2`} rows={3} placeholder="Complete business address" value={form.address} onChange={e => field("address", e.target.value)} /></section><button disabled={saving} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm disabled:opacity-60">{saving ? "Submitting securely…" : "Submit business details"}</button><p className="text-center text-xs text-muted-foreground">After submission, this link is permanently closed to further responses.</p></form></section></main>;
}
