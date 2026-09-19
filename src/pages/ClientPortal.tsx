import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  Eye,
  FileSignature,
  LayoutDashboard,
  Loader2,
  Plus,
  ReceiptText,
  PanelsTopLeft,
  WalletCards,
  X,
  ShieldCheck,
  Clock,
  Landmark,
  TrendingUp,
  FileCheck,
  Lock,
  Settings,
  ExternalLink,
  Globe,
  MapPin,
  Laptop
} from "lucide-react";
import { parseProjectMeta, serializeProjectMeta } from "@/lib/projectLifecycleHelper";
import { parseSubmissionMessage } from "@/lib/parseSubmissionMessage";
import {
  ProjectLifecycleMeta,
  ClientServiceFormData,
  ProjectInvoice,
  DEFAULT_BANK_ACCOUNTS
} from "@/types/projectLifecycle";
import { ServiceRequestModal } from "@/components/client/ServiceRequestModal";
import { ServiceAgreementModal } from "@/components/client/ServiceAgreementModal";
import { ServiceDetailsModal } from "@/components/client/ServiceDetailsModal";
import { PaymentSuccessModal } from "@/components/client/PaymentSuccessModal";
import { OnboardingSuccessModal } from "@/components/client/OnboardingSuccessModal";
import { DirectPaymentModal } from "@/components/payments/DirectPaymentModal";

type Tab = "overview" | "services" | "agreements" | "billing";
type Invoice = {
  id?: string;
  title?: string;
  amount?: string;
  numeric_amount?: number;
  due_date?: string;
  status?: string;
  description?: string;
  verification_status?: "none" | "pending_verification" | "verified" | "rejected";
  transaction_id?: string;
  payment_mode?: any;
};
type Project = {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  designation: string | null;
  inquiry_type: string | null;
  message: string;
  status: string | null;
  progress: number | null;
  bounty_reward: string | null;
  created_at?: string;
};

export default function ClientPortal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [setup, setSetup] = useState(false);
  const [payment, setPayment] = useState<{ project: Project; invoice: Invoice } | null>(null);
  const [saving, setSaving] = useState(false);
  const [setupSaving, setSetupSaving] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [phone, setPhone] = useState("");
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, string>>({});

  // Agency Partner Transformation
  const [showAgencyTransformModal, setShowAgencyTransformModal] = useState(false);
  const [agencyCompanyName, setAgencyCompanyName] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [transforming, setTransforming] = useState(false);

  // Lifecycle Modals
  const [detailsModalProject, setDetailsModalProject] = useState<Project | null>(null);
  const [requestModalProject, setRequestModalProject] = useState<Project | null>(null);
  const [agreementModalProject, setAgreementModalProject] = useState<Project | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    amount?: string;
    invoiceTitle?: string;
    projectName?: string;
    project?: Project;
  }>({ isOpen: false });
  const [onboardingSuccessData, setOnboardingSuccessData] = useState<{
    isOpen: boolean;
    projectName?: string;
    advanceAmount?: string;
    onProceed?: () => void;
  }>({ isOpen: false });

  const [searchParams] = useSearchParams();

  // Listen for query params or custom event to open profile settings or payment success
  useEffect(() => {
    if (searchParams.get("action") === "profile") {
      setSetup(true);
    }
    const paymentParam = searchParams.get("payment");
    const orderId = searchParams.get("order_id");
    const linkId = searchParams.get("link_id");
    const txStatus = searchParams.get("txStatus");

    if (paymentParam === "success" || orderId || linkId || txStatus === "SUCCESS") {
      setSuccessModalData({
        isOpen: true,
        invoiceTitle: "Service Advance / Milestone Invoice",
        projectName: "Siddhi Dynamics Engagement"
      });
      toast.success("Payment confirmed! Your service agreement and bank details are now unlocked.");
    }

    const handleOpenProfile = () => setSetup(true);
    window.addEventListener("open-client-profile-settings", handleOpenProfile);
    return () => window.removeEventListener("open-client-profile-settings", handleOpenProfile);
  }, [searchParams]);

  const load = async (clientEmail: string, initialMetaName?: string) => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("email", clientEmail.toLowerCase())
      .order("created_at", { ascending: false });

    if (error) throw error;
    const clientProjects = (data || []) as Project[];
    setProjects(clientProjects);

    // Prioritize registered profile name from client project / submission (e.g. lie_detection)
    const registeredName = clientProjects.find(p => p.name && p.name.trim())?.name?.trim();
    if (registeredName) {
      setName(registeredName);
    } else if (!initialMetaName) {
      setName(clientEmail.split("@")[0]);
    }

    if (!clientProjects.length) return setPaymentStatuses({});

    // Fetch Cashfree payment statuses
    const { data: links } = await (supabase as any)
      .from("cashfree_payment_links")
      .select("submission_id, invoice_id, cashfree_status")
      .in("submission_id", clientProjects.map(p => p.id));

    const statusMap = Object.fromEntries(
      (links || []).map((link: any) => [`${link.submission_id}:${link.invoice_id}`, link.cashfree_status])
    );
    setPaymentStatuses(statusMap);

    // Check if advance was paid and auto-stamp start date if missing
    for (const p of clientProjects) {
      const m = parseProjectMeta(p.bounty_reward);
      const advInv = m.invoices?.find(i => i.title?.toLowerCase().includes("advance") || i.id === "SD-INV-001");
      const isAdvPaid = advInv && (advInv.status === "paid" || statusMap[`${p.id}:${advInv.id}`] === "PAID");

      if (isAdvPaid && !m.service_start_date) {
        const today = new Date().toISOString().split("T")[0];
        const updatedMeta: ProjectLifecycleMeta = {
          ...m,
          service_start_date: today
        };
        await supabase
          .from("contact_submissions")
          .update({
            status: "In Progress (Service Started)",
            progress: Math.max(p.progress || 0, 25),
            bounty_reward: serializeProjectMeta(updatedMeta)
          })
          .eq("id", p.id);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user.email) return navigate("/auth");
      if (!session.user.user_metadata?.role) return navigate("/portal");
      setEmail(session.user.email);
      const metadata = session.user.user_metadata || {};
      const metaName = metadata.full_name || metadata.name || metadata.profile_name || metadata.username || metadata.display_name;
      if (metaName) {
        setName(metaName);
      } else {
        setName(session.user.email.split("@")[0]);
      }
      // Load saved phone
      if (metadata.phone) setPhone(metadata.phone);
      setProfileComplete(
        Boolean(metaName?.trim() && metadata.organization?.trim() && (metadata.phone || metadata.designation)?.toString().trim())
      );
      try {
        await load(session.user.email, metaName);
      } catch {
        toast.error("Your workspace could not be loaded.");
      } finally {
        setLoading(false);
      }
    });
  }, [navigate]);

  // Aggregate invoices across projects
  const invoices = useMemo(() => {
    return projects.flatMap(project => {
      const m = parseProjectMeta(project.bounty_reward);
      const invs = m.invoices || [];
      return invs.map(invoice => {
        const gatewayStatus = paymentStatuses[`${project.id}:${invoice.id}`];
        return {
          project,
          invoice: gatewayStatus === "PAID" ? { ...invoice, status: "paid" } : invoice
        };
      });
    });
  }, [projects, paymentStatuses]);

  // Aggregate services the client is actively taking across projects — ONE card per project
  const clientServices = useMemo(() => {
    return projects.map(project => {
      const m = parseProjectMeta(project.bounty_reward);
      const parsedMsg = parseSubmissionMessage(project.message);
      const serviceList = parsedMsg.selectedServices.length > 0
        ? parsedMsg.selectedServices
        : [project.inquiry_type || "Custom Digital Service"];

      const advInv = m.invoices?.find(i => i.title?.toLowerCase().includes("advance") || i.id === "SD-INV-001");
      const isAdvPaid =
        Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${project.id}:${advInv.id}`] === "PAID")) ||
        Boolean(m.service_start_date);

      // Build a clean scope summary: strip emoji rockets from service names for the summary line
      const cleanServiceNames = serviceList.map(s => s.replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\s]+/u, "").trim());
      const scopeSummary = m.scope_summary ||
        (serviceList.length > 0 ? `Services: ${serviceList.join(", ")}` : parsedMsg.cleanMessage);

      // Card title: if single service use it, if multiple list them comma-separated (clean)
      const cardTitle = serviceList.length === 1
        ? serviceList[0]
        : cleanServiceNames.join(" + ");

      return {
        id: project.id,
        title: cardTitle,
        serviceList,
        project,
        meta: m,
        status: project.status || "Discovery & Scope Review",
        progress: project.progress || 0,
        startDate: m.service_start_date,
        deadline: m.deadline,
        agreement: m.agreement,
        scopeSummary,
        isAdvPaid
      };
    });
  }, [projects, paymentStatuses]);

  const outstanding = invoices.filter(({ invoice }) => !["paid", "settled"].includes((invoice.status || "").toLowerCase()));

  // Submit Direct Payment Proof (UTR / Txn ID) for Admin Verification
  const handleDirectPaymentProofSubmit = async (proofData: {
    transactionId: string;
    paymentMode: "UPI" | "IMPS" | "NEFT" | "Net Banking" | "Bank Transfer";
    payerName: string;
    payerPhone: string;
    proofNotes?: string;
  }) => {
    if (!payment?.invoice?.id || !payment?.project?.id) return;
    setSaving(true);
    try {
      const proj = payment.project;
      const inv = payment.invoice;
      const m = parseProjectMeta(proj.bounty_reward);
      const existingInvoices: ProjectInvoice[] = m.invoices || [];

      const updatedInvoices: ProjectInvoice[] = existingInvoices.map((i) => {
        if (i.id === inv.id || i.title === inv.title) {
          return {
            ...i,
            verification_status: "pending_verification" as const,
            transaction_id: proofData.transactionId,
            payment_mode: proofData.paymentMode,
            paid_by_name: proofData.payerName,
            paid_by_phone: proofData.payerPhone,
            submitted_at: new Date().toISOString(),
            admin_notes: proofData.proofNotes,
          };
        }
        return i;
      });

      const updatedMeta: ProjectLifecycleMeta = {
        ...m,
        invoices: updatedInvoices,
      };

      const { error: updErr } = await supabase
        .from("contact_submissions")
        .update({
          bounty_reward: serializeProjectMeta(updatedMeta),
        })
        .eq("id", proj.id);

      if (updErr) throw updErr;

      // Also record an audit chat message so admin sees it in real-time
      await supabase.from("chat_messages").insert({
        submission_id: proj.id,
        sender_email: email,
        message: `[PAYMENT PROOF SUBMITTED] Client submitted transfer for ${inv.title || inv.id} (${inv.amount}). UTR / Ref: ${proofData.transactionId}, Mode: ${proofData.paymentMode}, Payer: ${proofData.payerName}. Awaiting finance confirmation.`,
        is_admin: false,
      });

      toast.success("Payment proof submitted! Finance admin will verify against bank ledger.");
      setPayment(null);
      await load(email);
    } catch (err: any) {
      toast.error("Failed to submit payment details: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Handle Client Transformation to Agency Partner
  const handleTransformToAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransforming(true);
    try {
      const agencyName = agencyCompanyName.trim() || name + " Partners";
      const { error: authErr } = await supabase.auth.updateUser({
        data: {
          role: "partner",
          agency_name: agencyName,
          agency_phone: agencyPhone.trim(),
          transformed_from_client: true,
          transformed_at: new Date().toISOString(),
        },
      });
      if (authErr) throw authErr;

      toast.success("Account successfully upgraded to Agency Partner! Welcome to the Partner Workspace.");
      setShowAgencyTransformModal(false);
      navigate("/portal/agency");
    } catch (err: any) {
      toast.error("Failed to upgrade account: " + (err.message || "Unknown"));
    } finally {
      setTransforming(false);
    }
  };

  // Submit Client Service Request Form & trigger Cashfree for advance
  const handleSubmitServiceRequest = async (
    formData: ClientServiceFormData,
    phone: string,
    paymentStructure?: string,
    advanceAmount?: string
  ) => {
    if (!requestModalProject) return;
    setSubmittingRequest(true);
    try {
      // Save verified mobile number in user auth metadata for Cashfree gateway
      await supabase.auth.updateUser({ data: { phone } });

      const m = parseProjectMeta(requestModalProject.bounty_reward);
      const chosenStructure = paymentStructure || m.payment_structure || "50% Advance + 50% on Delivery";
      const quoteTotal = parseInt((m.agreement || "").replace(/\D/g, "") || "0");
      const is100Pct = chosenStructure.includes("100%");
      const is3Way = chosenStructure.includes("25%");

      let existingInvoices = m.invoices || [];

      // Generate invoice schedule based on chosen payment structure
      let advInvoice: ProjectInvoice;
      let newInvoices: ProjectInvoice[] = [];

      if (is100Pct) {
        const fullAmount = quoteTotal > 0 ? `₹${quoteTotal.toLocaleString("en-IN")}` : (m.agreement || "₹25,000");
        const fullNum = quoteTotal > 0 ? quoteTotal : 25000;
        advInvoice = {
          id: "SD-INV-001",
          title: "Full Project Payment (100% Advance)",
          amount: fullAmount,
          numeric_amount: fullNum,
          due_date: new Date().toISOString().split("T")[0],
          status: "pending",
          description: `Full 100% advance payment to initiate expedited delivery for ${requestModalProject.organization || requestModalProject.name}.`
        };
        newInvoices = [advInvoice];
      } else if (is3Way) {
        const advNum = quoteTotal > 0 ? Math.round(quoteTotal * 0.5) : 12500;
        const midNum = quoteTotal > 0 ? Math.round(quoteTotal * 0.25) : 6250;
        const delNum = quoteTotal > 0 ? (quoteTotal - advNum - midNum) : 6250;
        advInvoice = {
          id: "SD-INV-001",
          title: "Advance Payment (50%)",
          amount: `₹${advNum.toLocaleString("en-IN")}`,
          numeric_amount: advNum,
          due_date: new Date().toISOString().split("T")[0],
          status: "pending",
          description: `50% advance payment to initiate engineering for ${requestModalProject.organization || requestModalProject.name}.`
        };
        newInvoices = [
          advInvoice,
          {
            id: "SD-INV-002",
            title: "Midway Milestone (25%)",
            amount: `₹${midNum.toLocaleString("en-IN")}`,
            numeric_amount: midNum,
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: `25% midway prototype review milestone.`
          },
          {
            id: "SD-INV-003",
            title: "Final Delivery (25%)",
            amount: `₹${delNum.toLocaleString("en-IN")}`,
            numeric_amount: delNum,
            due_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: `Final 25% delivery handover payment.`
          }
        ];
      } else {
        // Standard 50% + 50%
        const advNum = quoteTotal > 0 ? Math.round(quoteTotal * 0.5) : 12500;
        const delNum = quoteTotal > 0 ? (quoteTotal - advNum) : 12500;
        advInvoice = {
          id: "SD-INV-001",
          title: "Advance Payment (50%)",
          amount: `₹${advNum.toLocaleString("en-IN")}`,
          numeric_amount: advNum,
          due_date: new Date().toISOString().split("T")[0],
          status: "pending",
          description: `50% advance payment to initiate engineering for ${requestModalProject.organization || requestModalProject.name}.`
        };
        newInvoices = [
          advInvoice,
          {
            id: "SD-INV-002",
            title: "Final Delivery Balance (50%)",
            amount: `₹${delNum.toLocaleString("en-IN")}`,
            numeric_amount: delNum,
            due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            status: "pending",
            description: `Final 50% delivery handover payment.`
          }
        ];
      }

      // Keep any already paid invoices if any
      const paidInvoices = existingInvoices.filter(i => i.status === "paid");
      const finalInvoices = paidInvoices.length > 0
        ? [...paidInvoices, ...newInvoices.filter(n => !paidInvoices.some(p => p.id === n.id))]
        : newInvoices;

      const updatedMeta: ProjectLifecycleMeta = {
        ...m,
        payment_structure: chosenStructure,
        advance_amount: advanceAmount || advInvoice.amount,
        service_form: formData,
        invoices: finalInvoices
      };

      await supabase
        .from("contact_submissions")
        .update({
          bounty_reward: serializeProjectMeta(updatedMeta)
        })
        .eq("id", requestModalProject.id);

      toast.success("Service onboarding completed successfully!");
      const targetProject = requestModalProject;
      setRequestModalProject(null);

      // Trigger Onboarding Completed Celebration Modal
      setOnboardingSuccessData({
        isOpen: true,
        projectName: targetProject.organization || targetProject.name,
        advanceAmount: advanceAmount || advInvoice.amount,
        onProceed: () => {
          setOnboardingSuccessData({ isOpen: false });
          setPayment({ project: targetProject, invoice: advInvoice });
        }
      });

      await load(email);
    } catch (err: any) {
      toast.error("Failed to submit service form: " + (err.message || "Unknown error"));
    } finally {
      setSubmittingRequest(false);
    }
  };

  const completeSetup = async (updatedName: string, organization: string, mobileNumber: string) => {
    setSetupSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updatedName,
        name: updatedName,
        profile_name: updatedName,
        organization,
        designation: mobileNumber, // stored in designation for backward compat
        phone: mobileNumber
      }
    });
    setSetupSaving(false);
    if (error) return toast.error(error.message);
    if (updatedName) setName(updatedName);
    if (mobileNumber) setPhone(mobileNumber);
    setProfileComplete(true);
    toast.success("Profile saved successfully.");
    setSetup(false);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f5ef]">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const hasSetup = profileComplete || projects.some(project => Boolean(project.name?.trim() && project.organization?.trim()));
  const tabs: [Tab, string, typeof LayoutDashboard][] = [
    ["overview", t('portal.tabs.overview', "Overview"), LayoutDashboard],
    ["services", t('portal.tabs.services', "Services"), PanelsTopLeft],
    ["agreements", t('portal.tabs.agreements', "Agreements & Banking"), FileSignature],
    ["billing", t('portal.tabs.billing', "Billing & Invoices"), WalletCards]
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#29251d]">
      <Helmet>
        <title>Client Workspace | Siddhi Dynamics</title>
      </Helmet>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        {/* Workspace Banner */}
        <section className="rounded-[28px] bg-[#292a22] px-6 py-8 text-white shadow-xl shadow-stone-900/10 sm:px-9">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-lime-300">{t('portal.workspace', 'Siddhi Dynamics · Client workspace')}</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{t('portal.goodToSeeYou', 'Good to see you, {{name}}.', { name: name || "Client" })}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
                {t('portal.subtitle', 'Your projects, quotes, service agreements, dates, invoices and updates—all managed in one place.')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAgencyTransformModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-purple-500/20 px-4 py-3 text-sm font-bold text-purple-200 hover:bg-purple-500/30 transition-colors cursor-pointer"
                title="Transform your account to an agency partner and earn project commissions"
              >
                <Building2 className="h-4 w-4 text-purple-300" /> Transform to Agency Partner
              </button>
              <button
                onClick={() => setSetup(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Settings className="h-4 w-4" /> {t('portal.profileSettings', 'Profile Settings')}
              </button>
              <button
                onClick={() => navigate("/submit?type=requirement")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 hover:bg-lime-400 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> {t('portal.startRequest', 'Start a request')}
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-1.5">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === id ? "bg-stone-900 text-white shadow-sm" : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* ===================== TAB: OVERVIEW ===================== */}
        {tab === "overview" && (
          <div className="mt-7 space-y-6">
            {!hasSetup && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">👤</span>
                  <div>
                    <p className="font-bold text-stone-900">{t('portal.profileAlert.title', 'Complete your profile to continue')}</p>
                    <p className="mt-1 text-sm text-stone-600">{t('portal.profileAlert.desc', 'Add your name, business name and mobile number below. These details are needed before we can schedule your service.')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSetup(true)}
                  className="shrink-0 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-stone-700 transition-colors cursor-pointer"
                >
                  {t('portal.profileAlert.btn', 'Complete Profile →')}
                </button>
              </div>
            )}

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [t('portal.metrics.activeProjects', "Active projects"), projects.length, t('portal.metrics.inWorkspace', "In your workspace"), BriefcaseBusiness],
                [t('portal.metrics.actionNeeded', "Action needed"), outstanding.length, t('portal.metrics.openBills', "Open bills / payments"), CreditCard],
                [
                  t('portal.metrics.deliveryProgress', "Delivery progress"),
                  projects.length
                    ? `${Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)}%`
                    : "—",
                  t('portal.metrics.avgAcrossProjects', "Average across projects"),
                  CheckCircle2
                ]
              ].map(([label, value, hint, Icon]: any) => (
                <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-6 text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm font-semibold">{label}</p>
                  <p className="mt-1 text-xs text-stone-500">{hint}</p>
                </div>
              ))}
            </div>

            {/* Active Engagements List with Quote & Service Order Actions */}
            <Panel title={t('portal.work.title', "Your work")} subtitle={t('portal.work.subtitle', "A focused view of active engagements.")}>
              {projects.length ? (
                <div className="divide-y divide-stone-100">
                  {projects.map(project => {
                    const m = parseProjectMeta(project.bounty_reward);
                    const parsedMsg = parseSubmissionMessage(project.message);
                    const hasQuote = Boolean(m.agreement);
                    const advInv = m.invoices?.find(i => i.title.toLowerCase().includes("advance") || i.id === "SD-INV-001");
                    const isAdvPaid =
                      Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${project.id}:${advInv.id}`] === "PAID")) ||
                      Boolean(m.service_start_date);

                    return (
                      <div
                        key={project.id}
                        onClick={() => setDetailsModalProject(project)}
                        className="p-6 space-y-4 hover:bg-stone-50/70 transition-all cursor-pointer rounded-2xl group"
                      >
                        {/* Project Header */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-primary transition-colors">
                                {project.organization || project.name || "Custom Engagement"}
                              </p>
                              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-600">
                                {project.status || "Discovery"}
                              </span>
                              {parsedMsg.budgetPreference && (
                                <span className="rounded-full bg-stone-100 text-stone-700 px-2.5 py-0.5 text-[11px] font-semibold border border-stone-200">
                                  Budget: {parsedMsg.budgetPreference}
                                </span>
                              )}
                              {m.service_start_date && (
                                <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Service Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{parsedMsg.cleanMessage}</p>
                            {parsedMsg.selectedServices.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {parsedMsg.selectedServices.map((s, i) => (
                                  <span key={i} className="text-[11px] font-semibold bg-lime-50 text-primary px-2.5 py-0.5 rounded-md border border-lime-200">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                            <Progress value={project.progress || 0} />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailsModalProject(project);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
                            >
                              View Service Details <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
                            </button>
                          </div>
                        </div>

                        {/* Dates & Milestones Bar */}
                        <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                          <div>
                            <span className="text-stone-500 font-medium">Service Start Date:</span>{" "}
                            <strong className="text-stone-800">
                              {m.service_start_date ? m.service_start_date : "Begins upon Advance Payment"}
                            </strong>
                          </div>
                          {m.deadline && (
                            <div>
                              <span className="text-stone-500 font-medium">Estimated Handover:</span>{" "}
                              <strong className="text-stone-800">{m.deadline}</strong>
                            </div>
                          )}
                          {hasQuote && (
                            <div>
                              <span className="text-stone-500 font-medium">Agreed Quote:</span>{" "}
                              <strong className="text-stone-900 font-bold">{m.agreement}</strong>
                            </div>
                          )}
                        </div>

                        {/* 1. If Quote is Provided but Advance is Pending -> Show Onboarding Call-to-Action */}
                        {hasQuote && !isAdvPaid && (
                          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-amber-700" /> Price Quote Assigned: {m.agreement}
                              </p>
                              <p className="text-xs text-amber-800">
                                Payment structure: <strong>{m.payment_structure || "50% Advance + 50% on Delivery"}</strong>. Complete the Service Request Form to confirm requirements and initiate service via Cashfree.
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRequestModalProject(project);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileCheck className="w-4 h-4 text-lime-300" /> Review & Start Service Form
                            </button>
                          </div>
                        )}

                        {/* 2. If Advance is Paid -> Show Unlocked Official Agreement & Bank Details Action */}
                        {isAdvPaid && (
                          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Service Agreement & Bank Details Unlocked
                              </p>
                              <p className="text-xs text-emerald-800">
                                Advance payment verified via Cashfree. Official Siddhi Dynamics LLP credentials and verified agreement are unlocked for accounting & tax records.
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAgreementModalProject(project);
                              }}
                              className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                              <FileSignature className="w-4 h-4" /> View / Print Agreement
                            </button>
                          </div>
                        )}

                        {/* Live Deliverables, Demos & Progress Tracking */}
                        {(m.demo_url || m.website_url || m.seo_report_url || m.gbp_url) && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 via-lime-50/20 to-emerald-50/30 border border-stone-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-primary" /> Live Deliverables & Progress Tracking
                              </span>
                              <span className="text-[10px] font-semibold text-stone-500">Live Links from Siddhi Dynamics</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                              {/* Demo Preview */}
                              {m.demo_url && (
                                <a
                                  href={m.demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 hover:border-cyan-500 hover:shadow-sm transition-all group cursor-pointer"
                                >
                                  <div className="min-w-0 pr-2">
                                    <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wider block">Website Staging</span>
                                    <span className="text-xs font-bold text-stone-900 truncate block group-hover:text-cyan-700">Preview Demo Site</span>
                                  </div>
                                  <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                    <Laptop className="w-4 h-4" />
                                  </div>
                                </a>
                              )}

                              {/* Live Website */}
                              {m.website_url && (
                                <a
                                  href={m.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-sm transition-all group cursor-pointer"
                                >
                                  <div className="min-w-0 pr-2">
                                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Live Production</span>
                                    <span className="text-xs font-bold text-stone-900 truncate block group-hover:text-emerald-700">Visit Live Website</span>
                                  </div>
                                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Globe className="w-4 h-4" />
                                  </div>
                                </a>
                              )}

                              {/* SEO & AEO Report */}
                              {m.seo_report_url && (
                                <a
                                  href={m.seo_report_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 hover:border-lime-500 hover:shadow-sm transition-all group cursor-pointer"
                                >
                                  <div className="min-w-0 pr-2">
                                    <span className="text-[10px] font-bold text-lime-800 uppercase tracking-wider block">Rankings & Growth</span>
                                    <span className="text-xs font-bold text-stone-900 truncate block group-hover:text-lime-800">SEO Progress Report</span>
                                  </div>
                                  <div className="w-7 h-7 rounded-lg bg-lime-100 text-lime-900 flex items-center justify-center shrink-0 group-hover:bg-stone-900 group-hover:text-lime-300 transition-colors">
                                    <TrendingUp className="w-4 h-4" />
                                  </div>
                                </a>
                              )}

                              {/* Google Business Profile */}
                              {m.gbp_url && (
                                <a
                                  href={m.gbp_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 hover:border-amber-500 hover:shadow-sm transition-all group cursor-pointer"
                                >
                                  <div className="min-w-0 pr-2">
                                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Google Maps & GBP</span>
                                    <span className="text-xs font-bold text-stone-900 truncate block group-hover:text-amber-800">Business Profile</span>
                                  </div>
                                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 3. Project Updates Timeline Feed */}
                        {m.updates && m.updates.filter(u => u.visible_to_client).length > 0 && (
                          <div className="pt-2">
                            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-primary" /> Recent Progress Updates
                            </h4>
                            <div className="space-y-2">
                              {m.updates
                                .filter(u => u.visible_to_client)
                                .map(u => (
                                  <div key={u.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-stone-900">{u.title}</span>
                                      <span className="text-[10px] text-stone-500 font-medium">{u.date}</span>
                                    </div>
                                    <p className="mt-1 text-stone-600 leading-relaxed">{u.description}</p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  icon={BriefcaseBusiness}
                  title={t('portal.empty.title', "No active work yet")}
                  description={t('portal.empty.desc', "Choose a service and send your goals. We’ll return with a clear scope and proposal.")}
                  action={t('portal.empty.action', "Explore services")}
                  onClick={() => setTab("services")}
                />
              )}
            </Panel>
          </div>
        )}

        {/* ===================== TAB: SERVICES ===================== */}
        {tab === "services" && (
          <section className="mt-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <Heading
                eyebrow={t('portal.services.eyebrow', "Your Subscribed Services")}
                title={t('portal.services.title', "Services you are actively availing.")}
                body={t('portal.services.body', "Live execution progress, service start dates, and milestones across all your engagements with Siddhi Dynamics.")}
              />
              <button
                onClick={() => navigate("/submit?type=requirement")}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shrink-0 cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Plus className="h-4 w-4 text-lime-300" /> {t('portal.services.requestAnother', 'Request Another Service')}
              </button>
            </div>

            {clientServices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {clientServices.map(srv => (
                  <article key={srv.id} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            srv.isAdvPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {srv.isAdvPaid ? "● Active Service" : "○ Pending Onboarding / Advance"}
                          </span>
                          {/* Service tags — one pill per service */}
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {srv.serviceList.map((s, i) => (
                              <span key={i} className="inline-flex items-center rounded-lg bg-stone-900 text-white px-2.5 py-1 text-xs font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 shrink-0">
                          {srv.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Scope / Deliverables Summary</span>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {srv.scopeSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                        <div>
                          <span className="text-stone-400 font-medium">Service Start:</span>
                          <p className="font-bold text-stone-800 mt-0.5">
                            {srv.startDate ? srv.startDate : "Starts on Advance"}
                          </p>
                        </div>
                        <div>
                          <span className="text-stone-400 font-medium">Target Handover:</span>
                          <p className="font-bold text-stone-800 mt-0.5">
                            {srv.deadline || "Per Roadmap"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span>Delivery Milestone</span>
                        <span>Phase {Math.ceil(srv.progress / 20) || 1} ({srv.progress}%)</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${srv.progress}%` }} />
                      </div>

                      {/* Deliverables / Live Tracking Quick Badges */}
                      {(srv.meta.demo_url || srv.meta.website_url || srv.meta.seo_report_url || srv.meta.gbp_url) && (
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                            Deliverables & Live Progress
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {srv.meta.demo_url && (
                              <a
                                href={srv.meta.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold hover:bg-cyan-100 transition-colors"
                              >
                                <Laptop className="w-3 h-3 text-cyan-600" /> Website Demo <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-cyan-500" />
                              </a>
                            )}
                            {srv.meta.website_url && (
                              <a
                                href={srv.meta.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                <Globe className="w-3 h-3 text-emerald-600" /> Live Website <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-emerald-500" />
                              </a>
                            )}
                            {srv.meta.seo_report_url && (
                              <a
                                href={srv.meta.seo_report_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-lime-50 border border-lime-200 text-lime-900 text-[11px] font-bold hover:bg-lime-100 transition-colors"
                              >
                                <TrendingUp className="w-3 h-3 text-lime-700" /> SEO Report <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-lime-600" />
                              </a>
                            )}
                            {srv.meta.gbp_url && (
                              <a
                                href={srv.meta.gbp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                              >
                                <MapPin className="w-3 h-3 text-amber-600" /> Google Business <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-amber-500" />
                              </a>
                            )}
                            {srv.meta.analytics_url && (
                              <a
                                href={srv.meta.analytics_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-900 text-[11px] font-bold hover:bg-violet-100 transition-colors"
                              >
                                <TrendingUp className="w-3 h-3 text-violet-600" /> GBP Insights <ExternalLink className="w-2.5 h-2.5 ml-0.5 text-violet-500" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-1 flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => setDetailsModalProject(srv.project)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" /> Service Overview
                        </button>
                        {srv.isAdvPaid ? (
                          <button
                            onClick={() => setAgreementModalProject(srv.project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <FileSignature className="w-3.5 h-3.5 text-primary" /> Service Agreement
                          </button>
                        ) : (
                          <button
                            onClick={() => setRequestModalProject(srv.project)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-lime-300" /> Complete Service Form
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* No services taken yet: Add or Pick Your Service illustration & empty state */
              <div className="rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
                {/* Visual Illustration */}
                <div className="mx-auto w-24 h-24 rounded-3xl bg-lime-100/70 border border-lime-200 flex items-center justify-center text-primary relative shadow-inner">
                  <PanelsTopLeft className="w-12 h-12 stroke-[1.6]" />
                  <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-stone-900 text-lime-300 flex items-center justify-center text-xs shadow-md">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-stone-900">{t('portal.services.pickTitle', 'Add or Pick Your Service')}</h3>
                  <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                    {t('portal.services.pickDesc', 'You haven’t enrolled in any services yet. Choose from our engineering, design, and growth programmes to start your next milestone.')}
                  </p>
                </div>

                {/* Service suggestion pills */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {[
                    ["🌐 Website / Portal Development", "Website Development"],
                    ["🚀 SEO, GEO & AEO Programme", "SEO & Search Visibility"],
                    ["📍 GBP Optimization", "Google Business Profile"],
                    ["⚡ Business Automation & AI", "Business Automation"],
                    ["📱 Custom SaaS Platforms", "SaaS Platforms"]
                  ].map(([label, srvKey]) => (
                    <button
                      key={label}
                      onClick={() => navigate(`/submit?type=requirement&service=${encodeURIComponent(srvKey)}`)}
                      className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-lime-50 border border-stone-200 hover:border-lime-300 text-stone-700 hover:text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate("/submit?type=requirement")}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 cursor-pointer hover:scale-105"
                  >
                    <Plus className="h-4 w-4 text-lime-300" /> {t('portal.services.pickBtn', 'Pick & Request a Service')}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===================== TAB: AGREEMENTS & BANKING ===================== */}
        {tab === "agreements" && (
          <section className="mt-7">
            <Heading
              eyebrow={t('portal.agreements.eyebrow', "Agreements & Official Credentials")}
              title={t('portal.agreements.title', "Transparent scope, verified banking and digital contracts.")}
              body={t('portal.agreements.body', "Official Siddhi Dynamics LLP banking details and service order agreements are securely accessible here once advance payment is completed.")}
            />
            <div className="space-y-4">
              {projects.map(project => {
                const m = parseProjectMeta(project.bounty_reward);
                const hasQuote = Boolean(m.agreement);
                const advInv = m.invoices?.find(i => i.title.toLowerCase().includes("advance") || i.id === "SD-INV-001");
                const isAdvPaid =
                  Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${project.id}:${advInv.id}`] === "PAID")) ||
                  Boolean(m.service_start_date);

                if (!hasQuote) return null;

                return (
                  <div key={project.id} className="p-6 rounded-2xl border border-stone-200 bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-2xl bg-violet-50 text-violet-700">
                          <FileSignature className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-stone-900 text-base">Service Order & Payment Agreement</h3>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isAdvPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                              {isAdvPaid ? "Verified & Active" : "Pending Advance Payment"}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            {project.organization || project.name} · Assigned Quote: <strong>{m.agreement}</strong> ({m.payment_structure || "50% Advance"})
                          </p>
                        </div>
                      </div>
                      <div>
                        {isAdvPaid ? (
                          <button
                            onClick={() => setAgreementModalProject(project)}
                            className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileSignature className="w-4 h-4 text-lime-300" /> View / Print Agreement
                          </button>
                        ) : (
                          <button
                            onClick={() => setRequestModalProject(project)}
                            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Lock className="w-4 h-4" /> Pay Advance to Unlock
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Unlocked Bank Preview if Paid */}
                    {isAdvPaid ? (
                      <div className="space-y-2.5">
                        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                          Verified Official Bank Accounts
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {(m.banking_details?.accounts && m.banking_details.accounts.length > 0
                            ? m.banking_details.accounts.filter(a => a.is_selected !== false)
                            : DEFAULT_BANK_ACCOUNTS
                          ).map((acc, accIdx) => (
                            <div key={accIdx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-stone-900">{acc.account_holder}</span>
                                {acc.account_type && (
                                  <span className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded font-semibold text-stone-600">
                                    {acc.account_type}
                                  </span>
                                )}
                              </div>
                              <p className="text-stone-600">{acc.bank_name}</p>
                              <div className="pt-1 border-t border-stone-200/60 flex items-center justify-between font-mono text-[11px]">
                                <span>A/C: <strong>{acc.account_number}</strong></span>
                                <span>IFSC: <strong>{acc.ifsc_code}</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-stone-400 shrink-0" />
                        <span>Official Siddhi Dynamics LLP bank credentials will unlock here as soon as advance payment is completed on Cashfree.</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {!projects.some(p => parseProjectMeta(p.bounty_reward).agreement) && (
                <Panel>
                  <Empty
                    icon={FileSignature}
                    title="No agreement ready yet"
                    description="Once your requirements are reviewed and quote accepted, your Service Order Agreement will appear here."
                  />
                </Panel>
              )}
            </div>
          </section>
        )}

        {/* ===================== TAB: BILLING & INVOICES ===================== */}
        {tab === "billing" && (
          <section className="mt-7">
            <Heading
              eyebrow={t('portal.billing.eyebrow', "Billing")}
              title={t('portal.billing.title', "Secure, traceable milestone payments.")}
              body={t('portal.billing.body', "Pay advance and milestone invoices securely via direct UPI QR code or SBI bank transfer with zero gateway deductions. Tax receipts and verified payment histories are stored here.")}
            />
            <div className="space-y-3">
              {invoices.map(({ project, invoice }, i) => {
                const paid = ["paid", "settled"].includes((invoice.status || "").toLowerCase());
                const isVerifying = invoice.verification_status === "pending_verification";
                const key = `${project.id}-${invoice.id || i}`;
                return (
                  <div
                    key={key}
                    className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl border border-stone-200 bg-stone-50 p-2.5">
                        <ReceiptText className="h-5 w-5 text-stone-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">
                          {invoice.title || invoice.id || "Project invoice"} ·{" "}
                          <span className="text-primary font-bold">{invoice.amount || "Amount pending"}</span>
                        </p>
                        <p className="mt-1 text-sm text-stone-500">
                          {invoice.description || project.organization || "Siddhi Dynamics LLP service"}
                          {invoice.due_date ? ` · Due ${invoice.due_date}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              paid
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isVerifying
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-stone-100 text-stone-700 border border-stone-200"
                            }`}
                          >
                            {paid
                              ? "Verified & Paid"
                              : isVerifying
                              ? `Verification Pending (UTR: ${invoice.transaction_id || "Submitted"})`
                              : "Pending Payment"}
                          </span>
                          {paid ? (
                            <button
                              onClick={() => {
                                setSuccessModalData({
                                  isOpen: true,
                                  amount: invoice.amount,
                                  invoiceTitle: invoice.title || invoice.id,
                                  projectName: project.organization || project.name,
                                  project
                                });
                              }}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Receipt & Status
                            </button>
                          ) : (
                            <button
                              onClick={() => setPayment({ project, invoice })}
                              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                                isVerifying
                                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                                  : "bg-stone-900 hover:bg-stone-800 text-white"
                              }`}
                            >
                              {isVerifying ? "Update UTR / Receipt" : "Pay via UPI / QR / Bank"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!invoices.length && (
                  <Panel>
                    <Empty
                      icon={CreditCard}
                      title={t('portal.billing.emptyTitle', "No bills issued")}
                      description={t('portal.billing.emptyDesc', "When a quote is approved, your invoice and direct UPI / bank transfer schedule will appear here.")}
                    />
                  </Panel>
                )}
              </section>
            )}
          </main>

          {/* Profile Setup Modal */}
          {setup && (
            <Setup
              name={name}
              email={email}
              phone={phone}
              onClose={() => setSetup(false)}
              onComplete={completeSetup}
              saving={setupSaving}
            />
          )}

          {/* Direct UPI / QR / Bank Payment Modal */}
          {payment && (
            <DirectPaymentModal
              isOpen={Boolean(payment)}
              onClose={() => setPayment(null)}
              invoice={payment.invoice as any}
              projectName={payment.project.organization || payment.project.name}
              clientName={name}
              clientEmail={email}
              onSubmitProof={handleDirectPaymentProofSubmit}
              loading={saving}
            />
          )}

          {/* Agency Partner Transformation Modal */}
          {showAgencyTransformModal && (
            <div className="fixed inset-0 z-[260] grid place-items-center bg-stone-950/70 p-4 pt-20 pb-8 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-left">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">Transform to Agency Partner</h3>
                      <p className="text-xs text-stone-500">Upgrade your account to partner with Siddhi Dynamics</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAgencyTransformModal(false)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form autoComplete="off" onSubmit={handleTransformToAgency} className="mt-4 space-y-4">
                  <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                    <strong>Agency Partnership Benefits:</strong>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-purple-800">
                      <li>Refer client projects and earn <strong>15%-20% commission</strong> upon project closure.</li>
                      <li>Access multi-brand client portfolio, live SEO/GEO scores, and white-label SLA delivery.</li>
                      <li>Your existing client projects and history remain preserved.</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Agency / Firm Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Growth Digital or your brand name"
                      value={agencyCompanyName}
                      onChange={(e) => setAgencyCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Partner Contact Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit phone for executive coordination"
                      value={agencyPhone}
                      onChange={(e) => setAgencyPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAgencyTransformModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={transforming}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      {transforming ? "Upgrading Account…" : "Confirm & Enter Agency Portal →"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


      {/* Client Service Request & Onboarding Modal */}
      {requestModalProject && (
        <ServiceRequestModal
          projectName={requestModalProject.organization || requestModalProject.name}
          clientName={name}
          clientEmail={email}
          meta={parseProjectMeta(requestModalProject.bounty_reward)}
          onClose={() => setRequestModalProject(null)}
          onSubmit={handleSubmitServiceRequest}
          saving={submittingRequest}
        />
      )}

      {/* Unlocked Official Service Agreement & Banking Modal */}
      {agreementModalProject && (
        <ServiceAgreementModal
          projectName={agreementModalProject.organization || agreementModalProject.name}
          clientName={name}
          clientEmail={email}
          meta={parseProjectMeta(agreementModalProject.bounty_reward)}
          onClose={() => setAgreementModalProject(null)}
        />
      )}

      {/* Actionable Service Details & Overview Modal */}
      <ServiceDetailsModal
        project={detailsModalProject as any}
        isOpen={Boolean(detailsModalProject)}
        onClose={() => setDetailsModalProject(null)}
        onOpenServiceRequest={(p) => setRequestModalProject(p as any)}
        onOpenAgreement={(p) => setAgreementModalProject(p as any)}
        onPayInvoice={(p, inv) => {
          setPayment({ project: p as any, invoice: inv });
        }}
        paymentStatuses={paymentStatuses}
      />

      {/* Payment Success Celebration Modal */}
      <PaymentSuccessModal
        isOpen={successModalData.isOpen}
        amount={successModalData.amount}
        invoiceTitle={successModalData.invoiceTitle}
        projectName={successModalData.projectName}
        onClose={() => setSuccessModalData({ isOpen: false })}
        onViewAgreement={() => {
          setSuccessModalData({ isOpen: false });
          const targetProj = successModalData.project || projects.find(p => {
            const m = parseProjectMeta(p.bounty_reward);
            return Boolean(m.service_start_date || m.agreement);
          }) || projects[0];
          if (targetProj) setAgreementModalProject(targetProj);
        }}
        onGoToActiveWork={() => {
          setSuccessModalData({ isOpen: false });
          setTab("overview");
        }}
      />

      {/* Client Onboarding Completed Celebration Modal */}
      <OnboardingSuccessModal
        isOpen={onboardingSuccessData.isOpen}
        projectName={onboardingSuccessData.projectName}
        advanceAmount={onboardingSuccessData.advanceAmount}
        onClose={() => setOnboardingSuccessData({ isOpen: false })}
        onProceedToPayment={onboardingSuccessData.onProceed}
        onGoToPortal={() => {
          setOnboardingSuccessData({ isOpen: false });
          setTab("overview");
        }}
      />

      <FooterSection />
    </div>
  );
}

function Heading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">{body}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title?: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      {title && (
        <div className="border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-stone-500">{subtitle}</p>
        </div>
      )}
      {children}
    </section>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div className="w-full sm:w-40">
      <div className="flex justify-between text-xs font-bold">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Empty({
  icon: Icon,
  title,
  description,
  action,
  onClick
}: {
  icon: any;
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-500">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">{description}</p>
      {action && (
        <button onClick={onClick} className="mt-5 text-sm font-bold text-primary hover:underline cursor-pointer">
          {action}
        </button>
      )}
    </div>
  );
}

function Setup({
  name,
  email,
  phone: initialPhone,
  onClose,
  onComplete,
  saving
}: {
  name: string;
  email: string;
  phone?: string;
  onClose: () => void;
  onComplete: (updatedName: string, businessName: string, mobile: string) => void;
  saving: boolean;
}) {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState(name || "");
  const [businessName, setBusinessName] = useState("");
  const [mobile, setMobile] = useState(initialPhone || "");

  return (
    <div className="fixed inset-0 z-[250] grid place-items-center bg-stone-950/70 p-4 pt-20 pb-8 backdrop-blur-sm">
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          onComplete(profileName, businessName, mobile);
        }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{t('clientProfile.badge', 'Client Profile')}</p>
            <h2 className="mt-1 text-xl font-semibold">{t('clientProfile.title', 'Complete your profile to continue')}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-sm text-stone-600">{t('clientProfile.desc', 'Add your name, business name and mobile number below. These details are needed before we can schedule your service.')}</p>
        <div className="mt-5 grid gap-4">
          <label className="text-sm font-bold">
            {t('clientProfile.fullName', 'Your Full Name')}
            <input
              required
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              placeholder="e.g. Ravi Kumar"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm font-bold">
            {t('clientProfile.businessName', 'Business / Company Name')}
            <input
              required
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="e.g. Acme Technologies Pvt Ltd"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm font-bold">
            {t('clientProfile.mobileNumber', 'Mobile Number')}
            <input
              required
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary"
            />
          </label>
        </div>
        <p className="mt-5 text-xs text-stone-500">{email}</p>
        <button
          disabled={saving}
          className="mt-5 w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white disabled:opacity-60 cursor-pointer hover:bg-stone-800 transition-colors"
        >
          {saving ? t('clientProfile.saving', 'Saving…') : t('clientProfile.saveAndContinue', 'Save & Continue')}
        </button>
      </form>
    </div>
  );
}
