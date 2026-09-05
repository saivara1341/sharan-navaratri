import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ConsentCheckbox } from "@/components/legal/ConsentCheckbox";
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
    ArrowRight,
    CheckCircle2,
    Loader2,
    FilePen,
    Mic,
    Paperclip,
    Square,
    X,
    Calendar,
    Coins,
    ShieldCheck,
} from "lucide-react";

import { emailService } from "@/services/emailService";

const SERVICE_OPTIONS = [
    { value: "seo-geo",      label: "🚀 SEO, GEO & AEO Programme", desc: "Search & AI score optimization",       price: "Quote on review" },
    { value: "website",      label: "🌐 Website / Portal Development", desc: "Custom Web App / Landing Page",     price: "Quote on review" },
    { value: "automation",   label: "⚡ Business Automation",      desc: "Workflow / RPA / AI Agent Automation",price: "Quote on review" },
    { value: "saas",         label: "📱 SaaS / App Platform",      desc: "Full-stack MVP Development",          price: "Quote on review" },
    { value: "erp",          label: "🏢 ERP System",              desc: "Enterprise Resource Planning",        price: "Quote on review" },
    { value: "gbp",          label: "📍 Google Business Profile",  desc: "Local GMB & Map Optimisation",        price: "Quote on review" },
    { value: "custom",       label: "🤝 Custom Solution",         desc: "Tailored enterprise scope & quote",   price: "Quote on review" },
];

const resolveDefaultService = (value: string | null) => {
    const normalized = value?.toLowerCase() || "";
    if (SERVICE_OPTIONS.some((service) => service.value === normalized)) return normalized;
    if (normalized.includes("automation")) return "automation";
    if (normalized.includes("saas") || normalized.includes("app platform")) return "saas";
    if (normalized.includes("erp")) return "erp";
    if (normalized.includes("seo") || normalized.includes("geo") || normalized.includes("aeo")) return "seo-geo";
    if (normalized.includes("google business") || normalized.includes("gbp")) return "gbp";
    if (normalized.includes("custom")) return "custom";
    return "website";
};

const WIZARD_STEPS = [
    { id: 1, title: "Profile Details", short: "Profile", icon: User },
    { id: 2, title: "Services & Budget", short: "Services", icon: Briefcase },
    { id: 3, title: "Requirement & Scope", short: "Requirement", icon: FileText },
    { id: 4, title: "Review & Submit", short: "Submit", icon: ShieldCheck },
];

type SpeechRecognitionEvent = Event & { results: SpeechRecognitionResultList };
type SpeechRecognitionInstance = EventTarget & {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: Event) => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export default function ProjectSubmitForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const defaultType = resolveDefaultService(searchParams.get("service") || searchParams.get("type"));
    const requestedOrganization = searchParams.get("organization")?.trim() || "";

    // Wizard Step state: 1 | 2 | 3 | 4
    const [wizardStep, setWizardStep] = useState<number>(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
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
    const [preferredBudget, setPreferredBudget] = useState("flexible");
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [requestedStartDate, setRequestedStartDate] = useState("");
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [outreachOptIn, setOutreachOptIn] = useState(false);
    const [consentGiven, setConsentGiven] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    const addAttachments = (files: FileList | null) => {
        if (!files) return;
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const incoming = Array.from(files);
        const invalid = incoming.find((file) => !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024);
        if (invalid) return toast.error("Please attach only PDFs, Word files, or images up to 10 MB each.");
        setAttachments((current) => [...current, ...incoming].slice(0, 5));
        if (attachments.length + incoming.length > 5) toast.error("You can attach up to 5 files.");
    };

    const toggleVoiceInput = () => {
        if (isListening) return recognitionRef.current?.stop();
        const browser = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
        const SpeechRecognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
        if (!SpeechRecognition) return toast.error("Voice input is not supported by this browser. Try Chrome or Edge.");
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = navigator.language || "en-IN";
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1]?.[0]?.transcript.trim();
            if (transcript) setMessage((current) => `${current}${current ? " " : ""}${transcript}`);
        };
        recognition.onerror = () => toast.error("Voice input could not start. Please check microphone permission.");
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    useEffect(() => () => recognitionRef.current?.stop(), []);

    const toggleService = (val: string) => {
        setSelectedServices(prev =>
            prev.includes(val)
                ? (prev.length > 1 ? prev.filter(s => s !== val) : prev)
                : [...prev, val]
        );
    };

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const em = session.user.email || "";
                const nm = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
                const metadata = session.user.user_metadata || {};
                setSessionEmail(em);
                setSessionName(nm);
                setEmail(em);
                setName(nm);
                setOrganization(metadata.organization || requestedOrganization);
                setDesignation(metadata.designation || "");
                setPhone(metadata.phone || "");

                const { data: profile } = await supabase
                    .from("portal_users")
                    .select("name, organization, designation, phone")
                    .eq("auth_user_id", session.user.id)
                    .maybeSingle();
                if (profile) {
                    setName(profile.name?.trim() || nm);
                    setOrganization(profile.organization?.trim() || metadata.organization || requestedOrganization);
                    setDesignation(profile.designation?.trim() || metadata.designation || "");
                    setPhone(profile.phone?.trim() || metadata.phone || "");
                }

                if (em === "23eg510a07@anurag.edu.in") {
                    setPortalPath("/portal/v-magnetic-minds");
                } else {
                    const role = session.user.user_metadata?.role;
                    if (role === "employee") setPortalPath("/portal/employee");
                    else if (role === "investor") setPortalPath("/portal/investor");
                    else setPortalPath("/portal/client");
                }
            }
            setProfileLoaded(true);
        });
    }, [requestedOrganization]);

    // Validation for stepping forward
    const validateAndNext = () => {
        if (wizardStep === 1) {
            if (!name.trim()) {
                toast.error("Please enter your full name.");
                return;
            }
            const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
            if (cleanPhone.length !== 10) {
                toast.error("Please enter a valid 10-digit mobile number.");
                return;
            }
            if (!organization.trim()) {
                toast.error("Please enter your business or brand name.");
                return;
            }
            if (!email.trim() || !email.includes("@")) {
                toast.error("Please enter a valid email address.");
                return;
            }
            setWizardStep(2);
            window.scrollTo({ top: 180, behavior: "smooth" });
        } else if (wizardStep === 2) {
            if (selectedServices.length === 0) {
                toast.error("Please select at least one required service.");
                return;
            }
            setWizardStep(3);
            window.scrollTo({ top: 180, behavior: "smooth" });
        } else if (wizardStep === 3) {
            if (!requestedStartDate) {
                toast.error("Please select your requested service start date.");
                return;
            }
            if (!message.trim() || message.trim().length < 20) {
                toast.error("Please describe your requirement in at least 20 characters.");
                return;
            }
            setWizardStep(4);
            window.scrollTo({ top: 180, behavior: "smooth" });
        }
    };

    const handleBack = () => {
        if (wizardStep > 1) {
            setWizardStep(wizardStep - 1);
            window.scrollTo({ top: 180, behavior: "smooth" });
        } else {
            navigate(portalPath);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !organization.trim() || !phone.trim() || !requestedStartDate || !message.trim()) {
            toast.error("Please complete all required fields before submitting.");
            setWizardStep(1);
            return;
        }

        const cleanPhone = phone.trim().replace(/[^0-9]/g, "");
        if (cleanPhone.length !== 10) {
            toast.error("Mobile Number must be exactly 10 digits.");
            setWizardStep(1);
            return;
        }

        if (message.trim().length < 20) {
            toast.error("Please describe your requirement in at least 20 characters.");
            setWizardStep(3);
            return;
        }

        if (!consentGiven) {
            toast.error("Please give consent to process your details before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            if (sessionEmail) {
                const { error: profileError } = await supabase.auth.updateUser({
                    data: {
                        full_name: name.trim(),
                        name: name.trim(),
                        organization: organization.trim(),
                        designation: designation.trim(),
                        phone: phone.trim(),
                    },
                });
                if (profileError) throw profileError;
            }

            const servicesString = selectedServices.map(s => {
                const item = SERVICE_OPTIONS.find(o => o.value === s);
                return item ? item.label : s;
            }).join(", ");

            const outreachNote = outreachOptIn
                ? " [Outreach: Open to sharing project milestones and experience on social media]"
                : "";
            const formattedMessage = `[Selected Services: ${servicesString}] [Requested Service Start: ${requestedStartDate}] [Budget Preference: ${preferredBudget.toUpperCase()}] [Consent: granted at ${new Date().toISOString()}]${outreachNote}\n\n${message.trim()}`;

            const submissionId = crypto.randomUUID();
            const uploadedAttachments: { name: string; path: string; type: string; size: number }[] = [];

            for (const file of attachments) {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const path = `${submissionId}/${crypto.randomUUID()}-${safeName}`;
                const { error: uploadError } = await supabase.storage.from("project-attachments").upload(path, file, { contentType: file.type, upsert: false });
                if (uploadError) throw uploadError;
                uploadedAttachments.push({ name: file.name, path, type: file.type, size: file.size });
            }

            const submissionMessage = uploadedAttachments.length
                ? `${formattedMessage}\n\n[Attachments: ${uploadedAttachments.map((file) => `${file.name} (${file.path})`).join(", ")}]`
                : formattedMessage;

            const { error } = await supabase.from("contact_submissions").insert({
                id: submissionId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                designation: designation.trim() || null,
                organization: organization.trim() || null,
                inquiry_type: "requirement",
                message: submissionMessage,
            });

            if (error) throw error;

            // Trigger automated email confirmation to client
            emailService.projectStart(
                email.trim().toLowerCase(),
                name.trim(),
                servicesString,
                "Pending Review (Price Quote Assigned from Admin Portal)"
            );

            setIsSubmitted(true);
            toast.success("Project requirement submitted successfully!");
        } catch (err: any) {
            console.error("Submit error:", err);
            toast.error(err.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isSubmitted) {
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
                        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <motion.div
                                className="absolute inset-0 rounded-full bg-emerald-500/25 pointer-events-none"
                                initial={{ scale: 0.9, opacity: 0.8 }}
                                animate={{ scale: [0.9, 1.45, 1.6], opacity: [0.8, 0.25, 0] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                            />
                            <motion.div
                                initial={{ scale: 0, rotate: -25 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                                className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-b from-emerald-50 via-emerald-100 to-green-100 border-2 border-emerald-500 shadow-[0_12px_35px_rgba(16,185,129,0.35)] flex items-center justify-center"
                            >
                                <svg className="w-14 h-14" viewBox="0 0 52 52">
                                    <motion.circle
                                        cx="26"
                                        cy="26"
                                        r="23"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.55, ease: "easeInOut" }}
                                    />
                                    <motion.path
                                        d="M14 27l8 8 16-16"
                                        fill="none"
                                        stroke="#15803d"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ delay: 0.35, duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                                    />
                                </svg>
                            </motion.div>
                        </div>
                        <h1 className="text-2xl font-extrabold text-foreground mb-2">Requirement Submitted!</h1>
                        <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                            Your project requirement has been logged. The Siddhi Dynamics team will review your scope and reach out within <strong>24 hours</strong>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate(portalPath)}
                                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all text-sm shadow-md cursor-pointer"
                            >
                                Back to My Portal
                            </button>
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setWizardStep(1);
                                    setMessage("");
                                    setAttachments([]);
                                    setSelectedServices([defaultType]);
                                    setRequestedStartDate("");
                                }}
                                className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:opacity-80 transition text-sm border border-border cursor-pointer"
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
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col font-inter">
            <Helmet>
                <title>Submit Project Requirement | Siddhi Dynamics</title>
                <meta
                    name="description"
                    content="Submit your project requirement to Siddhi Dynamics step-by-step. Get a roadmap, timeline, and dedicated project manager."
                />
                <link rel="canonical" href="https://siddhidynamics.in/submit" />
            </Helmet>

            <Navbar />

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-primary/5 blur-[140px] pointer-events-none -z-10" />

            <main className="pt-28 md:pt-32 pb-20 px-4 sm:px-6 max-w-3xl mx-auto flex-grow w-full">
                {/* Back to Portal Link */}
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors group cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>{wizardStep === 1 ? "Back to Portal" : "Previous Step"}</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl border border-border bg-card/75 p-5 sm:p-7 md:p-9 shadow-xl shadow-black/5 backdrop-blur-md"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <FilePen className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Submit a Project Requirement</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">Step {wizardStep} of 4: {WIZARD_STEPS[wizardStep - 1].title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Step Progress Bar & Indicators */}
                    <div className="mb-8">
                        <div className="grid grid-cols-4 gap-2 mb-2.5">
                            {WIZARD_STEPS.map((s) => {
                                const isCurrent = wizardStep === s.id;
                                const isPassed = wizardStep > s.id;
                                const Icon = s.icon;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        disabled={!isPassed && !isCurrent}
                                        onClick={() => {
                                            if (isPassed) setWizardStep(s.id);
                                        }}
                                        className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                                            isCurrent
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : isPassed
                                                ? "bg-primary/15 text-primary hover:bg-primary/20 cursor-pointer"
                                                : "bg-muted/40 text-muted-foreground opacity-60 cursor-not-allowed"
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5 shrink-0" />
                                        <span className="hidden sm:inline">{s.title}</span>
                                        <span className="sm:hidden text-[10px]">{s.short}</span>
                                        {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto hidden sm:block" />}
                                    </button>
                                );
                            })}
                        </div>
                        {/* Smooth Line Progress */}
                        <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                className="bg-primary h-full rounded-full"
                                initial={false}
                                animate={{ width: `${(wizardStep / 4) * 100}%` }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {/* ================= STEP 1: Profile & Contact Details ================= */}
                            {wizardStep === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-5"
                                >
                                    {/* Notice Banner */}
                                    <div className={`rounded-2xl border p-4 text-sm transition-all ${profileLoaded && name.trim() && organization.trim() && phone.trim() ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/40 bg-amber-500/10 text-amber-200"}`}>
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl mt-0.5">{profileLoaded && name.trim() && organization.trim() && phone.trim() ? "✅" : "👤"}</span>
                                            <div>
                                                <p className="font-bold text-foreground">
                                                    {profileLoaded && name.trim() && organization.trim() && phone.trim() ? "Profile details are ready" : "Complete your profile to continue"}
                                                </p>
                                                <p className="mt-1 text-xs leading-relaxed opacity-85">
                                                    {profileLoaded && name.trim() && organization.trim() && phone.trim()
                                                        ? "Your contact and business details are loaded below. You can review or edit them before proceeding to service selection."
                                                        : "Add your name, business name and mobile number below. These details are needed before we can schedule your service."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border space-y-4">
                                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-border/60">
                                            <User className="w-3.5 h-3.5 text-primary" />
                                            Primary Contact &amp; Business Information
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1.5">
                                                    Full Name <span className="text-destructive">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Ravi Kumar"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1.5">
                                                    Mobile Number <span className="text-destructive">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="Enter 10-digit mobile number"
                                                    inputMode="numeric"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1.5">
                                                    Business / Brand Name <span className="text-destructive">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={organization}
                                                    required
                                                    onChange={(e) => setOrganization(e.target.value)}
                                                    placeholder="e.g. Indhur Farms, PrintFlow"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1.5">
                                                    Email Address <span className="text-destructive">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="e.g. name@company.com"
                                                    readOnly={!!sessionEmail}
                                                    className={`w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                                                />
                                                {sessionEmail && (
                                                    <p className="text-[10px] text-muted-foreground mt-1">Auto-filled from your signed-in session</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground mb-1.5">
                                                Designation / Role (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                                placeholder="e.g. Founder, CEO, CTO, Operations Head"
                                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                                        <button
                                            type="button"
                                            onClick={() => navigate(portalPath)}
                                            className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={validateAndNext}
                                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                        >
                                            Next: Select Services <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ================= STEP 2: Services & Budget ================= */}
                            {wizardStep === 2 && (
                                <motion.div
                                    key="step-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    {/* Service Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                <Briefcase className="inline w-3.5 h-3.5 mr-1 text-primary" />
                                                Select Services Required <span className="text-destructive">*</span>
                                            </label>
                                            <span className="text-[11px] text-primary font-mono">{selectedServices.length} Selected</span>
                                        </div>
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
                                                                <span className="shrink-0 whitespace-nowrap text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{type.price}</span>
                                                            </div>
                                                            <div className="text-[11px] opacity-75 pl-5 text-muted-foreground">{type.desc}</div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Budget Preference Selector */}
                                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-2">
                                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Coins className="w-3.5 h-3.5 text-primary" />
                                            Estimated Budget Preference
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
                                                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                                                        preferredBudget === b.value
                                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                                                    }`}
                                                >
                                                    {b.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="pt-1 text-[11px] text-muted-foreground">
                                            💡 Unsure? Select <strong>Custom / Discuss</strong>; we will tailor a package to your exact scope on our strategy call.
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back to Profile
                                        </button>
                                        <button
                                            type="button"
                                            onClick={validateAndNext}
                                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                        >
                                            Next: Project Scope <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ================= STEP 3: Requirement & Timeline ================= */}
                            {wizardStep === 3 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-5"
                                >
                                    {/* Requested Service Start Date */}
                                    <div className="p-4 rounded-2xl bg-muted/20 border border-border">
                                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            Requested Service Start Date <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={requestedStartDate}
                                            onChange={(e) => setRequestedStartDate(e.target.value)}
                                            min={new Date().toISOString().slice(0, 10)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                                        />
                                        <p className="mt-1 text-[11px] text-muted-foreground">
                                            We review and confirm the exact milestone timeline once requirements are discussed.
                                        </p>
                                    </div>

                                    {/* Message / Requirement Description */}
                                    <div>
                                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                            Describe Your Requirement <span className="text-destructive">*</span>
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                required
                                                rows={6}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Tell us about your project goals, features needed, target audience, preferred integrations, and desired outcomes..."
                                                className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 pr-14 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleVoiceInput}
                                                aria-pressed={isListening}
                                                aria-label={isListening ? "Stop voice input" : "Start voice input"}
                                                className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                                                    isListening
                                                        ? "animate-pulse border-red-500 bg-red-500 text-white"
                                                        : "border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                                                }`}
                                            >
                                                {isListening ? <Square className="h-3.5 w-3.5 fill-current" /> : <Mic className="h-4 w-4" />}
                                            </button>
                                        </div>

                                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                                                <Paperclip className="h-3.5 w-3.5 text-primary" /> Add PDFs, documents or images
                                                <input
                                                    className="sr-only"
                                                    type="file"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp,image/gif"
                                                    onChange={(event) => {
                                                        addAttachments(event.target.files);
                                                        event.currentTarget.value = "";
                                                    }}
                                                />
                                            </label>
                                            <div className="text-[11px] text-muted-foreground">
                                                {message.length} characters {message.length < 20 ? <span className="text-amber-400 font-semibold">(minimum 20)</span> : <span className="text-emerald-400">✓</span>}
                                            </div>
                                        </div>

                                        {attachments.length > 0 && (
                                            <ul className="mt-3 flex flex-wrap gap-2">
                                                {attachments.map((file, index) => (
                                                    <li key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs text-foreground border border-border">
                                                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                                                        <span className="max-w-40 truncate">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            aria-label={`Remove ${file.name}`}
                                                            onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                                                            className="ml-1 rounded-full p-0.5 hover:bg-background hover:text-destructive cursor-pointer"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Social Media Milestone Sharing Opt-In */}
                                    <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/15 border border-border text-xs text-muted-foreground cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={outreachOptIn}
                                            onChange={(e) => setOutreachOptIn(e.target.checked)}
                                            className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        />
                                        <span>
                                            <strong>Optional:</strong> I’m open to sharing project milestones and my experience on social media—from kick-off to completion.
                                        </span>
                                    </label>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border/60">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Back to Services
                                        </button>
                                        <button
                                            type="button"
                                            onClick={validateAndNext}
                                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                        >
                                            Next: Review &amp; Submit <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ================= STEP 4: Review & Final Submission ================= */}
                            {wizardStep === 4 && (
                                <motion.div
                                    key="step-4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    {/* Summary Review Card */}
                                    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-primary/15">
                                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-primary" /> Requirement Summary Review
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setWizardStep(1)}
                                                className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                                            >
                                                Edit Details ✎
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div className="p-3 rounded-xl bg-card border border-border">
                                                <span className="text-muted-foreground block text-[11px]">Contact &amp; Business:</span>
                                                <strong className="text-foreground text-sm block mt-0.5">{name}</strong>
                                                <span className="text-slate-300 block">{organization} {designation ? `(${designation})` : ""}</span>
                                                <span className="text-slate-400 block text-[11px] mt-1">{phone} • {email}</span>
                                            </div>

                                            <div className="p-3 rounded-xl bg-card border border-border">
                                                <span className="text-muted-foreground block text-[11px]">Selected Services &amp; Start Date:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {selectedServices.map(s => {
                                                        const item = SERVICE_OPTIONS.find(o => o.value === s);
                                                        return (
                                                            <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] border border-primary/20">
                                                                {item ? item.label : s}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-muted-foreground block text-[11px] mt-2">
                                                    Target Start Date: <strong className="text-foreground">{requestedStartDate}</strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-3 rounded-xl bg-card border border-border text-xs">
                                            <span className="text-muted-foreground block text-[11px] mb-1">Requirement Overview:</span>
                                            <p className="text-slate-200 line-clamp-3 leading-relaxed">{message}</p>
                                            {attachments.length > 0 && (
                                                <span className="inline-block text-[11px] text-primary mt-2">
                                                    📎 {attachments.length} attachment(s) included
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Consent Checkbox */}
                                    <ConsentCheckbox
                                        checked={consentGiven}
                                        onChange={setConsentGiven}
                                        purpose="reviewing my project requirement, preparing a quote and contacting me about it"
                                    />

                                    {/* Legal Disclaimer */}
                                    <p className="text-[11px] text-muted-foreground text-center pt-2">
                                        By submitting you agree to our{" "}
                                        <a href="/privacy" target="_blank" rel="noreferrer" className="text-primary hover:underline">Privacy Policy</a> and{" "}
                                        <a href="/terms-of-service" target="_blank" rel="noreferrer" className="text-primary hover:underline">Terms of Service</a>.
                                    </p>

                                    {/* Submit Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                                        <button
                                            type="submit"
                                            disabled={submitting || !consentGiven}
                                            className="w-full sm:flex-1 py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {submitting ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Requirement...</>
                                            ) : (
                                                <><Send className="w-4 h-4" /> Submit Project Requirement</>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="w-full sm:w-auto px-5 py-3.5 border border-border text-muted-foreground hover:text-foreground font-semibold text-sm rounded-xl hover:border-primary/40 transition-all cursor-pointer"
                                        >
                                            Back
                                        </button>
                                    </div>

                                    {/* Trust Strip */}
                                    <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
