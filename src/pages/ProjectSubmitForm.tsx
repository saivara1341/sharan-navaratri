import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
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
    Sparkles,
} from "lucide-react";

const INQUIRY_TYPES = [
    { value: "requirement",  label: "Project Requirement",      desc: "Share what you want to build" },
    { value: "seo-geo",      label: "SEO / GEO / AEO Services", desc: "Search & AI visibility optimisation" },
    { value: "website",      label: "Website Development",      desc: "Custom website or landing page" },
    { value: "automation",   label: "Business Automation",      desc: "Workflow / RPA / AI automation" },
    { value: "saas",         label: "SaaS / App Platform",      desc: "Full-stack product development" },
    { value: "erp",          label: "ERP / Management System",  desc: "Enterprise resource planning" },
    { value: "gbp",          label: "Google Business Profile",  desc: "Local SEO & GMB optimisation" },
    { value: "other",        label: "Other / General Query",    desc: "Anything else on your mind" },
];

export default function ProjectSubmitForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultType = searchParams.get("type") || "requirement";

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
    const [inquiryType, setInquiryType] = useState(defaultType);
    const [message, setMessage] = useState("");

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
            const { error } = await supabase.from("contact_submissions").insert({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                designation: designation.trim() || null,
                organization: organization.trim() || null,
                inquiry_type: inquiryType,
                message: message.trim(),
                status: "New",
                progress: 0,
            });

            if (error) throw error;

            setStep("success");
            toast.success("Requirement submitted! Siddhi Dynamics team will reach out within 24 hours.");
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

            <main className="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
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
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-foreground">Submit a Project Requirement</h1>
                                <p className="text-xs text-muted-foreground">Siddhi Dynamics · Authorized Client Portal</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Tell us what you need. We'll create a custom roadmap, timeline, and assign a dedicated project manager within <strong>24 hours</strong>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Inquiry Type Selection */}
                        <div>
                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                <Briefcase className="inline w-3.5 h-3.5 mr-1" />
                                What are you looking for? <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {INQUIRY_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setInquiryType(type.value)}
                                        className={`text-left p-3.5 rounded-xl border transition-all ${
                                            inquiryType === type.value
                                                ? "bg-primary/10 border-primary text-foreground ring-1 ring-primary/30"
                                                : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <div className="text-sm font-bold">{type.label}</div>
                                        <div className="text-xs mt-0.5 opacity-70">{type.desc}</div>
                                    </button>
                                ))}
                            </div>
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
                                    placeholder="Your full name"
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
                                    placeholder="your@email.com"
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
                                    placeholder="e.g. Co-Founder, Marketing Head"
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
                                    placeholder="e.g. V Magnetic Minds"
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
                            Responses are typically delivered within 24 hours on business days.
                        </p>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
