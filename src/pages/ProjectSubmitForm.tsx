import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Send,
    FileText,
    User,
    Mail,
    Building2,
    Briefcase,
    MessageSquare,
    ArrowLeft,
    CheckCircle,
    Loader2,
    FilePen,
    ChevronDown,
} from "lucide-react";

import { emailService } from "@/services/emailService";

const SERVICE_OPTIONS = [
    { value: "seo-geo",      label: "🚀 SEO, GEO & AEO Programme", desc: "Search & AI score optimization",       price: "Price Assigned by Admin" },
    { value: "website",      label: "🌐 Website / Portal Development", desc: "Custom Web App / Landing Page",     price: "Price Assigned by Admin" },
    { value: "automation",   label: "⚡ Business Automation",      desc: "Workflow / RPA / AI Agent Automation",price: "Price Assigned by Admin" },
    { value: "saas",         label: "📱 SaaS / App Platform",      desc: "Full-stack MVP Development",          price: "Price Assigned by Admin" },
    { value: "erp",          label: "🏢 ERP System",              desc: "Enterprise Resource Planning",        price: "Price Assigned by Admin" },
    { value: "gbp",          label: "📍 Google Business Profile",  desc: "Local GMB & Map Optimisation",        price: "Price Assigned by Admin" },
    { value: "custom",       label: "🤝 Custom Solution",         desc: "Tailored enterprise scope & quote",   price: "Price Assigned by Admin" },
];

export default function ProjectSubmitForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultType = searchParams.get("type") || "website";

    const [step, setStep] = useState<"form" | "success">("form");
    const [submitting, setSubmitting] = useState(false);
    const [sessionEmail, setSessionEmail] = useState("");
    const [sessionName, setSessionName] = useState("");
    const [portalPath, setPortalPath] = useState("/portal");

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");
    const [organization, setOrganization] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([defaultType]);
    const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
    const [preferredBudget, setPreferredBudget] = useState("flexible");
    const [message, setMessage] = useState("");

    const toggleService = (val: string) => {
        setSelectedServices(prev =>
            prev.includes(val)
                ? (prev.length > 1 ? prev.filter(s => s !== val) : prev)
                : [...prev, val]
        );
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const em = session.user.email || "";
                const nm = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
                setSessionEmail(em);
                setSessionName(nm);
                setEmail(em);
                setName(nm);

                // Detect portal path
                if (em === "23eg510a07@anurag.edu.in") {
                    setPortalPath("/portal/v-magnetic-minds");
                } else {
                    const role = session.user.user_metadata?.role;
                    if (role === "employee") setPortalPath("/portal/employee");
                    else if (role === "investor") setPortalPath("/portal/investor");
                    else setPortalPath("/portal/client");
                }
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (message.trim().length < 20) {
            toast.error("Please describe your requirement in at least 20 characters.");
            return;
        }

        setSubmitting(true);
        try {
            const servicesString = selectedServices.map(s => {
                const item = SERVICE_OPTIONS.find(o => o.value === s);
                return item ? item.label : s;
            }).join(", ");

            const formattedMessage = `[Selected Services: ${servicesString}] [Budget Preference: ${preferredBudget.toUpperCase()}]\n\n${message.trim()}`;

            const { error } = await supabase.from("contact_submissions").insert({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                designation: designation.trim() || null,
                organization: organization.trim() || null,
                inquiry_type: servicesString,
                message: formattedMessage,
                status: "New Request",
                progress: 0,
            });

            if (error) throw error;

            // Trigger automated email confirmation to client
            emailService.projectStart(
                email.trim().toLowerCase(),
                name.trim(),
                servicesString,
                "Pending Review (Price Quote Assigned from Admin Portal)"
            );

            setStep("success");
            toast.success("Project requirement submitted successfully!");
        } catch (err: any) {
            console.error("Submit error:", err);
            toast.error(err.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (step === "success") {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="text-center max-w-md"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-foreground mb-2">Requirement Submitted!</h1>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Your project requirement has been logged. The Siddhi Dynamics team will review and reach out within <strong>24 hours</strong>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate(portalPath)}
                                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all text-sm"
                            >
                                Back to My Portal
                            </button>
                            <button
                                onClick={() => { setStep("form"); setMessage(""); setInquiryType("requirement"); }}
                                className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:opacity-80 transition text-sm"
                            >
                                Submit Another
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Submit Project Requirement | Siddhi Dynamics</title>
                <meta name="description" content="Submit your project requirement to Siddhi Dynamics. Get a roadmap, timeline, and dedicated project manager." />
            </Helmet>

            <Navbar />

            <main className="pt-32 md:pt-36 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate(portalPath)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portal
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <FilePen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-foreground">Submit a Project Requirement</h1>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Selection */}
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                                <Briefcase className="inline w-3.5 h-3.5 mr-1" />
                                Select Services Required <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {SERVICE_OPTIONS.map((type) => {
                                    const isSelected = selectedServices.includes(type.value);
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => toggleService(type.value)}
                                            className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                                                isSelected
                                                    ? "bg-primary/10 border-primary text-foreground ring-2 ring-primary/40 shadow-sm"
                                                    : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-1 mb-1">
                                                    <span className="text-xs font-extrabold flex items-center gap-1.5 text-foreground">
                                                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${isSelected ? 'bg-primary text-primary-foreground font-black' : 'border border-border bg-muted'}`}>
                                                            {isSelected ? '✓' : ''}
                                                        </span>
                                                        {type.label}
                                                    </span>
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{type.price}</span>
                                                </div>
                                                <div className="text-[11px] opacity-75 pl-5 text-muted-foreground">{type.desc}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Budget Preference Selector */}
                        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                💰 Estimated Budget Preference
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                {[
                                    { value: "below10k", label: "Below ₹10k" },
                                    { value: "flexible", label: "🤝 Custom / Discuss" },
                                    { value: "starter", label: "₹10k - ₹30k" },
                                    { value: "growth", label: "₹30k - ₹1 Lakh" },
                                    { value: "enterprise", label: "₹1 Lakh+" },
                                ].map((b) => (
                                    <button
                                        key={b.value}
                                        type="button"
                                        onClick={() => setPreferredBudget(b.value)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                                            preferredBudget === b.value
                                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {b.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground pt-1">
                                💡 Don't worry if you're not sure! Select <strong>Custom / Discuss</strong> and we will tailor a package to your budget on a 1-on-1 call.
                            </p>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                    <User className="inline w-3.5 h-3.5 mr-1" />
                                    Full Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                    <Mail className="inline w-3.5 h-3.5 mr-1" />
                                    Email Address <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    readOnly={!!sessionEmail}
                                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                                />
                                {sessionEmail && (
                                    <p className="text-[10px] text-muted-foreground mt-1">Auto-filled from your session</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                    <Briefcase className="inline w-3.5 h-3.5 mr-1" />
                                    Designation / Role
                                </label>
                                <input
                                    type="text"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    placeholder="Enter designation or role"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                    <Building2 className="inline w-3.5 h-3.5 mr-1" />
                                    Organisation / Brand
                                </label>
                                <input
                                    type="text"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                    placeholder="Enter organization or brand name"
                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                                <MessageSquare className="inline w-3.5 h-3.5 mr-1" />
                                Describe Your Requirement <span className="text-destructive">*</span>
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell us about your project goals, target audience, timeline, budget, and any specific features or outcomes you need..."
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                            />
                            <div className="text-right text-[11px] text-muted-foreground mt-1">
                                {message.length} chars {message.length < 20 && <span className="text-yellow-500">(min 20)</span>}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {submitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                                ) : (
                                    <><Send className="w-4 h-4" /> Submit Requirement</>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(portalPath)}
                                className="px-5 py-3.5 border border-border text-muted-foreground hover:text-foreground font-semibold text-sm rounded-xl hover:border-primary/40 transition-all"
                            >
                                Cancel
                            </button>
                        </div>

                        <p className="text-[11px] text-muted-foreground text-center">
                            By submitting you agree to our{" "}
                            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{" "}
                            <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>.
                        </p>

                        {/* Trust strip placed after form */}
                        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                            {[
                                { icon: '✅', text: 'Free 30-min consultation' },
                                { icon: '🔒', text: 'Your information stays private' },
                                { icon: '⚡', text: 'Reply within 24 hours' },
                            ].map(({ icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5 font-medium">
                                    <span>{icon}</span>
                                    <span>{text}</span>
                                </span>
                            ))}
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
