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
  Check,
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
  Laptop,
  Building2,
  ChevronDown,
  Upload,
  FileText,
  Trash2,
  Paperclip
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
import { supabaseService } from "@/services/supabaseService";

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

  // Office Address Modal

  // New Service Request Form Modal
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceCategories, setNewServiceCategories] = useState<string[]>([
    "🌐 Website / Web App Development"
  ]);
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [customServices, setCustomServices] = useState<string[]>([]);
  const [newServiceOrg, setNewServiceOrg] = useState("");
  const [newServiceMessage, setNewServiceMessage] = useState("");
  const [newServiceBudget, setNewServiceBudget] = useState("₹25,000 - ₹50,000");
  const [customBudgetInput, setCustomBudgetInput] = useState("");
  const [newServiceTimeline, setNewServiceTimeline] = useState("2-4 Weeks");
  const [newServiceFiles, setNewServiceFiles] = useState<Array<{ name: string; size: number; url: string }>>([]);
  const [uploadingServiceFiles, setUploadingServiceFiles] = useState(false);
  const [creatingService, setCreatingService] = useState(false);

  // File size formatting helper
  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes < 1024) return `${bytes || 0} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle uploading multiple files of different formats
  const handleNewServiceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingServiceFiles(true);
    try {
      const newUploads: Array<{ name: string; size: number; url: string }> = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `client_briefs/${Date.now()}_${cleanName}`;
        
        let fileUrl = "";
        try {
          const { error: upErr } = await supabase.storage
            .from("client-documents")
            .upload(path, file, { upsert: true });
          if (!upErr) {
            const { data: pub } = supabase.storage.from("client-documents").getPublicUrl(path);
            fileUrl = pub.publicUrl;
          } else {
            const { error: fallbackErr } = await supabase.storage
              .from("project-attachments")
              .upload(path, file, { upsert: true });
            if (!fallbackErr) {
              const { data: pub2 } = supabase.storage.from("project-attachments").getPublicUrl(path);
              fileUrl = pub2.publicUrl;
            }
          }
        } catch {
          fileUrl = "";
        }

        newUploads.push({
          name: file.name,
          size: file.size,
          url: fileUrl
        });
      }
      setNewServiceFiles(prev => [...prev, ...newUploads]);
    } catch (err: any) {
      toast.error("Upload warning: " + (err.message || "Failed to process file"));
    } finally {
      setUploadingServiceFiles(false);
      e.target.value = "";
    }
  };

  const handleRemoveNewServiceFile = (index: number) => {
    setNewServiceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const [searchParams] = useSearchParams();

  // Listen for query params or custom events to navigate tabs or open profile
  useEffect(() => {
    if (searchParams.get("action") === "profile") {
      setSetup(true);
    }
    const tabParam = searchParams.get("tab");
    if (tabParam === 'services' || tabParam === 'billing' || tabParam === 'overview' || tabParam === 'agreements') {
      setTab(tabParam as Tab);
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
    const handlePortalNavTab = (e: any) => {
      const requestedTab = e.detail?.tab;
      if (requestedTab === 'services' || requestedTab === 'billing' || requestedTab === 'overview' || requestedTab === 'agreements') {
        setTab(requestedTab);
      }
    };

    window.addEventListener("open-client-profile-settings", handleOpenProfile);
    window.addEventListener("portal-nav-tab", handlePortalNavTab);

    return () => {
      window.removeEventListener("open-client-profile-settings", handleOpenProfile);
      window.removeEventListener("portal-nav-tab", handlePortalNavTab);
    };
  }, [searchParams]);

  // Handle adding custom service to the selection
  const handleAddCustomService = () => {
    const trimmed = customServiceInput.trim();
    if (!trimmed) return;
    if (!customServices.includes(trimmed)) {
      setCustomServices(prev => [...prev, trimmed]);
    }
    setCustomServiceInput("");
  };

  // Handle client instant service request creation directly from the portal
  const handleCreateNewService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceMessage.trim()) {
      toast.error("Please describe your project requirements or scope.");
      return;
    }

    // Collect all selected services including custom additions
    const trimmedInput = customServiceInput.trim();
    const finalCustomList = [...customServices];
    if (trimmedInput && !finalCustomList.includes(trimmedInput)) {
      finalCustomList.push(trimmedInput);
    }

    const standardSelected = newServiceCategories.filter(s => s !== "✨ Other" && s !== "Other");
    const allSelectedServices = [
      ...standardSelected,
      ...finalCustomList.map(s => (s.startsWith("✨") || s.startsWith("🌐") || s.startsWith("🚀") || s.startsWith("📍") || s.startsWith("⚡") || s.startsWith("📱") || s.startsWith("📊") || s.startsWith("🛡️")) ? s : `✨ ${s}`)
    ];

    if (allSelectedServices.length === 0) {
      if (newServiceCategories.includes("✨ Other")) {
        toast.error("Please specify your custom service or requirement type.");
      } else {
        toast.error("Please select at least one service category.");
      }
      return;
    }

    if (newServiceBudget === "Other / Custom Budget" && !customBudgetInput.trim()) {
      toast.error("Please enter your custom budget amount.");
      return;
    }

    setCreatingService(true);
    try {
      const orgName = newServiceOrg.trim() || (projects[0]?.organization) || `${name}'s Business`;
      const filesFormatted = newServiceFiles.length > 0
        ? `\n\n[ATTACHED PROJECT ASSETS & FILES (${newServiceFiles.length})]:\n` +
          newServiceFiles.map((f, i) => `${i + 1}. ${f.name} (${formatFileSize(f.size)})${f.url ? ` - ${f.url}` : ''}`).join("\n")
        : "";

      const finalBudget = newServiceBudget === "Other / Custom Budget"
        ? (customBudgetInput.trim().startsWith("₹") ? customBudgetInput.trim() : `₹${customBudgetInput.trim()}`)
        : newServiceBudget;

      const formattedMessage = `[Selected Services: ${allSelectedServices.join(", ")}]\n[SERVICES REQUESTED]: ${allSelectedServices.join(", ")}\n[BUDGET PREFERENCE]: ${finalBudget}\n[ESTIMATED TIMELINE]: ${newServiceTimeline}\n\n[REQUIREMENTS & SCOPE]:\n${newServiceMessage.trim()}${filesFormatted}`;

      // TODO: Remove this localStorage block and restore supabaseService.submitContactForm() once RLS
      //       policy on contact_submissions allows authenticated client inserts.
      const localSubmission: Project = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name || "Valued Client",
        email: email ? email.toLowerCase() : "",
        organization: orgName,
        designation: phone || "Client Partner",
        inquiry_type: "requirement",
        message: formattedMessage,
        status: "Discovery & Scope Review",
        progress: 10,
        bounty_reward: null,
        created_at: new Date().toISOString()
      };
      const LOCAL_KEY = "siddhi_local_service_requests";
      const existing: Project[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      existing.unshift(localSubmission);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(existing));

      // Immediately update projects state so the card appears without waiting for load()
      setProjects(prev => [localSubmission, ...prev]);
      // END TODO block

      toast.success("Service request submitted! We will review your scope and get back to you.");
      setShowNewServiceModal(false);
      setNewServiceMessage("");
      setCustomServiceInput("");
      setCustomServices([]);
      setNewServiceFiles([]);
      setCustomBudgetInput("");
      setNewServiceBudget("₹25,000 - ₹50,000");
      setTab("services");
      // NOTE: No load() call here — the optimistic setProjects above is sufficient.
      //       load() would overwrite projects state and could make the card disappear
      //       if email is empty or Supabase SELECT returns nothing.
    } catch (err: any) {
      toast.error("Failed to submit service request: " + (err.message || "Unknown error"));
    } finally {
      setCreatingService(false);
    }
  };


  const load = async (clientEmail: string, initialMetaName?: string) => {
    // Fetch from Supabase (may be empty due to RLS until DB policy is updated)
    let dbProjects: Project[] = [];
    if (clientEmail) {
      try {
        const { data, error } = await supabase
          .from("contact_submissions")
          .select("*")
          .eq("email", clientEmail.toLowerCase())
          .order("created_at", { ascending: false });
        if (!error) dbProjects = (data || []) as Project[];
      } catch { /* RLS or network error — fall through to local */ }
    }

    // Local storage fallback for pending/recent submissions
    const LOCAL_KEY = "siddhi_local_service_requests";
    const localRaw: Project[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const lowerEmail = clientEmail ? clientEmail.toLowerCase() : "";
    const localProjects = lowerEmail
      ? localRaw.filter((p) => p.email === lowerEmail || p.email === "")
      : localRaw; // If no email session yet, show all submissions made from this browser

    if (lowerEmail) {
      // Patch any entries saved with empty email to now carry the real email
      localProjects.forEach(p => {
        if (p.email === "") {
          p.email = lowerEmail;
        }
      });
      const patchedRaw = localRaw.map(p => p.email === "" ? { ...p, email: lowerEmail } : p);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(patchedRaw));
    }

    // Merge: DB first (authoritative), then local-only records not yet in DB
    const dbIds = new Set(dbProjects.map((p) => p.id));
    const onlyLocal = localProjects.filter((p) => !dbIds.has(p.id));
    const clientProjects: Project[] = [...dbProjects, ...onlyLocal].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    setProjects(clientProjects);

    // Prioritize registered profile name from client project / submission
    const registeredName = clientProjects.find(p => p.name && p.name.trim())?.name?.trim();
    if (registeredName) {
      setName(registeredName);
    } else if (!initialMetaName && clientEmail) {
      setName(clientEmail.split("@")[0]);
    }

    if (!clientProjects.length) return setPaymentStatuses({});

    // Fetch Cashfree payment statuses (only for DB-backed projects with real UUIDs)
    const dbOnlyIds = dbProjects.map(p => p.id);
    if (dbOnlyIds.length > 0) {
      const { data: links } = await (supabase as any)
        .from("cashfree_payment_links")
        .select("submission_id, invoice_id, cashfree_status")
        .in("submission_id", dbOnlyIds);

      const statusMap = Object.fromEntries(
        (links || []).map((link: any) => [`${link.submission_id}:${link.invoice_id}`, link.cashfree_status])
      );
      setPaymentStatuses(statusMap);

      // Check if advance was paid and auto-stamp start date if missing
      for (const p of dbProjects) {
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
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUserEmail = session?.user?.email || "";
      setEmail(currentUserEmail);
      const metadata = session?.user?.user_metadata || {};
      const metaName = metadata.full_name || metadata.name || metadata.profile_name || metadata.username || metadata.display_name || "Client Partner";
      setName(metaName);
      // Load saved phone
      if (metadata.phone) setPhone(metadata.phone);
      setProfileComplete(true);
      try {
        await load(currentUserEmail, metaName);
      } catch {
        // Workspace loaded directly
      } finally {
        setLoading(false);
      }
    });
  }, [navigate]);

  // On mount / email change: merge localStorage submissions into projects state
  useEffect(() => {
    const LOCAL_KEY = "siddhi_local_service_requests";
    const localRaw: Project[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    if (localRaw.length === 0) return;
    const lowerEmail = (email || "").toLowerCase();
    // Accept entries matching email OR all entries if email is not yet set
    const matching = lowerEmail
      ? localRaw.filter(p => p.email === lowerEmail || p.email === "")
      : localRaw;
    if (matching.length === 0) return;
    if (lowerEmail) {
      const patched = localRaw.map(p => p.email === "" ? { ...p, email: lowerEmail } : p);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(patched));
    }
    // Merge into current projects without duplicating by id
    setProjects(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newOnes = matching
        .map(p => (lowerEmail && p.email === "") ? { ...p, email: lowerEmail } : p)
        .filter(p => !existingIds.has(p.id));
      if (newOnes.length === 0) return prev;
      return [...newOnes, ...prev].sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );
    });
  }, [email]);

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
                title="Transform your account to an agency partner"
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
                onClick={() => setShowNewServiceModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 hover:bg-lime-400 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Start Service Request
              </button>
            </div>
          </div>
        </section>

        {/* Swiggy Instamart-Style Single-Row Navigation for Mobile & Desktop */}
        <div className="mt-6 sticky top-[68px] sm:static z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 sm:py-0 bg-[#f7f5ef]/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none transition-all">
          <nav 
            aria-label="Portal Navigation"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 sm:p-1.5 sm:gap-1 sm:rounded-2xl sm:border sm:border-stone-200 sm:bg-white"
            style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
          >
            {tabs.map(([id, label, Icon]) => {
              const isActive = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full sm:rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold sm:font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border select-none active:scale-95 ${
                    isActive
                      ? "bg-stone-900 text-white border-stone-900 shadow-md shadow-stone-900/15 ring-2 ring-stone-900/10 sm:ring-0 sm:shadow-sm"
                      : "bg-white text-stone-700 border-stone-200/90 hover:bg-stone-50 hover:border-stone-300 shadow-xs sm:bg-transparent sm:text-stone-500 sm:border-transparent sm:shadow-none sm:hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-lime-300" : "text-stone-400 sm:text-stone-500"}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===================== TAB: OVERVIEW ===================== */}
        {tab === "overview" && (
          <div className="mt-7 space-y-6">
            {!hasSetup && (
              <div className="flex flex-col gap-3 rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">👤</span>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-stone-100">{t('portal.profileAlert.title', 'Complete your profile to continue')}</p>
                    <p className="mt-1 text-sm text-stone-800 dark:text-stone-200 font-semibold">{t('portal.profileAlert.desc', 'Add your name, business name and mobile number below. These details are needed before we can schedule your service.')}</p>
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
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shrink-0 cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4 text-lime-300" /> Start Service Request Form
                </button>
              </div>
            </div>

            {clientServices.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {clientServices.map(srv => (
                  <article
                    key={srv.id}
                    onClick={() => setDetailsModalProject(srv.project)}
                    className="group relative rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-lime-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Header Row: Status badge & Service Status */}
                      <div className="flex items-center justify-between gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          srv.isAdvPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${srv.isAdvPaid ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                          {srv.isAdvPaid ? "Active Service" : "Pending Onboarding / Advance"}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600">
                          {srv.status}
                        </span>
                      </div>

                      {/* Service Name / Title */}
                      <div>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight group-hover:text-primary transition-colors">
                          {srv.title}
                        </h3>
                        {/* Service tags if multiple */}
                        {srv.serviceList.length > 1 && (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {srv.serviceList.map((s, i) => (
                              <span key={i} className="inline-flex items-center rounded-lg bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-0.5 text-[11px] font-semibold">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3 pt-4 border-t border-stone-100">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                        <span className="text-stone-500 uppercase tracking-wider text-[10px]">Execution Progress</span>
                        <span className="text-primary font-extrabold">
                          Phase {Math.ceil(srv.progress / 20) || 1} ({srv.progress}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 p-0.5 border border-stone-200/50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-lime-500 to-emerald-600 transition-all duration-500"
                          style={{ width: `${Math.max(srv.progress, 5)}%` }}
                        />
                      </div>

                      {/* Open Service Workspace Button */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-stone-400 font-medium">
                          {srv.startDate ? `Started ${srv.startDate}` : "Starts on Advance"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsModalProject(srv.project);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all shadow-sm group-hover:scale-[1.02] cursor-pointer"
                        >
                          <span>Open Service Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 text-lime-300 group-hover:translate-x-0.5 transition-transform" />
                        </button>
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
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                  {[
                    ["🌐 Website / Web App Development", "Website Development"],
                    ["🚀 SEO, GEO & AEO Programme", "SEO & Search Visibility"],
                    ["📍 Google Business Profile (GBP)", "Google Business Profile"],
                    ["⚡ Business Automation & AI", "Business Automation"],
                    ["📱 Custom SaaS Platform", "SaaS Platforms"],
                    ["📊 ERP & CRM Solutions", "ERP Solutions"],
                    ["🛡️ Cybersecurity & Cloud", "Cybersecurity"],
                    ["✨ Other / Custom Service", "Other"]
                  ].map(([label, srvKey]) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (srvKey === "Other") {
                          setNewServiceCategories(["✨ Other"]);
                        } else {
                          setNewServiceCategories([label]);
                        }
                        setShowNewServiceModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-lime-50 border border-stone-200 hover:border-lime-300 text-stone-700 hover:text-primary text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewServiceModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 cursor-pointer hover:scale-105"
                  >
                    <Plus className="h-4 w-4 text-lime-300" /> Start Service Request Form
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
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Agency / Firm Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter agency or firm name"
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
        onUpdateProject={(updated) => {
          setProjects(prev => prev.map(p => p.id === updated.id ? (updated as any) : p));
          setDetailsModalProject(updated as any);
        }}
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

      {/* New Service Request Form Modal */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-[270] grid place-items-center bg-stone-950/75 p-4 pt-20 pb-8 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-left border border-stone-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <PanelsTopLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-[#556B2F] dark:text-[#8cb048]">Start Service Request Form</h3>
                  <p className="text-xs text-stone-500">Pick services, describe requirements, and initiate milestone scoping</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewServiceModal(false)}
                className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewService} className="mt-6 space-y-5">
              {/* Service Selection Pills */}
              <div>
                <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-2">
                  Select Services To Avail (Select multiple if needed) <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "🌐 Website / Web App Development",
                    "🚀 SEO, GEO & AEO Programme",
                    "📍 Google Business Profile (GBP)",
                    "⚡ Business Automation & AI",
                    "📱 Custom SaaS Platform",
                    "📊 ERP & CRM Solutions",
                    "🛡️ Cybersecurity & Cloud",
                    "✨ Other"
                  ].map((srvName) => {
                    const selected = newServiceCategories.includes(srvName);
                    return (
                      <button
                        type="button"
                        key={srvName}
                        onClick={() => {
                          if (selected) {
                            if (newServiceCategories.length > 1 || customServices.length > 0) {
                              setNewServiceCategories(newServiceCategories.filter(s => s !== srvName));
                            }
                          } else {
                            setNewServiceCategories([...newServiceCategories, srvName]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                          selected
                            ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                        }`}
                      >
                        {selected ? <Check className="w-3.5 h-3.5 text-lime-300" /> : null}
                        <span>{srvName}</span>
                      </button>
                    );
                  })}

                  {/* Render any added custom services as removable active tags in the pill list */}
                  {customServices.map((customSrv) => (
                    <span
                      key={customSrv}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/30 shadow-xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span>✨ {customSrv}</span>
                      <button
                        type="button"
                        onClick={() => setCustomServices(customServices.filter(s => s !== customSrv))}
                        className="ml-1 text-primary/70 hover:text-red-500 cursor-pointer"
                        title="Remove custom service"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Custom Service Input when 'Other' is selected */}
                {newServiceCategories.includes("✨ Other") && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <label className="block text-[11px] font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider">
                      Specify Your Own Type or Service <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Flutter Mobile App, Blockchain, Cloud DevOps, UI/UX Redesign..."
                        value={customServiceInput}
                        onChange={(e) => setCustomServiceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomService();
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomService}
                        className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5 text-lime-300" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Render custom service chips if any added */}
                    {customServices.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {customServices.map((cs) => (
                          <span
                            key={cs}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-900 shadow-xs"
                          >
                            <span className="text-lime-600 font-bold">✓</span>
                            <span>{cs}</span>
                            <button
                              type="button"
                              onClick={() => setCustomServices(customServices.filter(s => s !== cs))}
                              className="ml-1 text-stone-400 hover:text-red-500 cursor-pointer p-0.5"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] text-stone-500">
                      💡 Type your custom service and press Enter or click <strong>Add</strong>. You can specify and add multiple custom services.
                    </p>
                  </div>
                )}
              </div>

              {/* Organization / Brand */}
              <div>
                <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-1">
                  Business / Brand / Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Enter business, brand or project name"
                  value={newServiceOrg}
                  onChange={(e) => setNewServiceOrg(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Requirements & Scope Details */}
              <div>
                <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-1">
                  Project Requirements & Deliverables Details <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what you want us to design, engineer, or optimize. Mention any specific features, goals, or references..."
                  value={newServiceMessage}
                  onChange={(e) => setNewServiceMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Project Attachments & Files Upload Module */}
              <div>
                <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" />
                    Project Attachments & Files
                  </span>
                  <span className="text-[10px] font-normal text-stone-500 lowercase">
                    multiple formats supported
                  </span>
                </label>

                <div className="p-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 hover:bg-stone-50 transition-all text-center space-y-2.5">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <label
                      htmlFor="service-file-upload-input"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow-sm"
                    >
                      {uploadingServiceFiles ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-lime-300" />
                          <span>Uploading files...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-lime-300" />
                          <span>Upload Files & Assets</span>
                        </>
                      )}
                      <input
                        id="service-file-upload-input"
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleNewServiceFileUpload}
                        disabled={uploadingServiceFiles}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Attach documents, briefs, wireframes, images, sheets, or archives (PDF, Word, Excel, PNG, JPG, ZIP & all formats)
                    </p>
                  </div>

                  {/* Render Uploaded Files List */}
                  {newServiceFiles.length > 0 && (
                    <div className="pt-3 border-t border-stone-200/80 space-y-2 text-left">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 px-1">
                        <span className="text-[#556B2F] font-bold">Uploaded Files ({newServiceFiles.length})</span>
                        <span className="text-stone-400 font-normal">Ready to submit</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {newServiceFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs text-xs hover:border-[#556B2F]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-[#556B2F]">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate min-w-0">
                                <p className="font-semibold text-stone-900 truncate text-[11px]">{file.name}</p>
                                <p className="text-[10px] text-stone-500">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {file.url && file.url.startsWith("http") && (
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded-md text-stone-400 hover:text-[#556B2F] hover:bg-stone-100 transition-colors"
                                  title="View / Download file"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveNewServiceFile(idx)}
                                className="p-1 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Remove file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget & Timeline Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-1">
                    Budget Preference <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={newServiceBudget}
                    onChange={(e) => setNewServiceBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-primary bg-white"
                  >
                    <option value="₹1,999 - ₹10,000">₹1,999 - ₹10,000 (Micro / Starter)</option>
                    <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000 (Essential Launch)</option>
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (Sprint Starter)</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000 (Growth Production)</option>
                    <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000 (Enterprise Full-Stack)</option>
                    <option value="₹2,50,000+">₹2,50,000+ (Custom Enterprise / Multi-System)</option>
                    <option value="Flexible / Open to Discussion">Flexible / Open to Discussion</option>
                    <option value="Other / Custom Budget">✨ Other / Custom Budget (Enter your own)</option>
                  </select>

                  {newServiceBudget === "Other / Custom Budget" && (
                    <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 animate-in fade-in duration-200">
                      <label className="block text-[11px] font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider">
                        Enter Custom Budget <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold text-xs">₹</span>
                        <input
                          type="text"
                          placeholder="e.g. 1,999 or custom budget amount"
                          value={customBudgetInput}
                          onChange={(e) => setCustomBudgetInput(e.target.value)}
                          className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-primary bg-white font-medium"
                        />
                      </div>
                      <p className="text-[10px] text-stone-500 leading-tight">
                        💡 Budget depends on services selected (Micro / Starter tasks).
                      </p>
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-stone-500">
                    <span>💡 Starts from ₹1,999 (depends on services)</span>
                    {newServiceBudget !== "Other / Custom Budget" && (
                      <button
                        type="button"
                        onClick={() => setNewServiceBudget("Other / Custom Budget")}
                        className="text-[#556B2F] dark:text-[#8cb048] font-bold hover:underline cursor-pointer"
                      >
                        + Enter Custom Amount
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#556B2F] dark:text-[#8cb048] uppercase tracking-wider mb-1">
                    Expected Timeline <span className="text-red-500 font-bold">*</span>
                  </label>
                  <select
                    value={newServiceTimeline}
                    onChange={(e) => setNewServiceTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 outline-none focus:border-primary bg-white"
                  >
                    <option value="Flexible / Open to Discussion">Flexible / Open to Discussion</option>
                    <option value="1-2 Weeks">1-2 Weeks (Urgent Sprint)</option>
                    <option value="2-4 Weeks">2-4 Weeks (Standard Delivery)</option>
                    <option value="1-3 Months">1-3 Months (Complex Architecture)</option>
                    <option value="Ongoing / Retainer">Ongoing / Monthly Retainer</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span />
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewServiceModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingService}
                    className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {creatingService ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting Request…</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-lime-300" />
                        <span>Submit Service Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


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
  email?: string;
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
        <p className="mt-3 text-sm text-stone-800 dark:text-stone-200 font-semibold">{t('clientProfile.desc', 'Add your name, business name and mobile number below. These details are needed before we can schedule your service.')}</p>
        <div className="mt-5 grid gap-4">
          <label className="text-sm font-bold text-[#556B2F] dark:text-[#8cb048]">
            {t('clientProfile.fullName', 'Your Full Name')} <span className="text-red-500 font-bold">*</span>
            <input
              required
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary text-stone-900"
            />
          </label>
          <label className="text-sm font-bold text-[#556B2F] dark:text-[#8cb048]">
            {t('clientProfile.businessName', 'Business / Company Name')} <span className="text-red-500 font-bold">*</span>
            <input
              required
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="Enter business / company name"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary text-stone-900"
            />
          </label>
          <label className="text-sm font-bold text-[#556B2F] dark:text-[#8cb048]">
            {t('clientProfile.mobileNumber', 'Mobile Number')} <span className="text-red-500 font-bold">*</span>
            <input
              required
              type="tel"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary text-stone-900"
            />
          </label>
        </div>
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
