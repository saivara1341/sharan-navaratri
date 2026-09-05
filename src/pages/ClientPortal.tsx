import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
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
  Sparkles
} from "lucide-react";
import { parseProjectMeta, serializeProjectMeta } from "@/lib/projectLifecycleHelper";
import { parseSubmissionMessage } from "@/lib/parseSubmissionMessage";
import {
  ProjectLifecycleMeta,
  ClientServiceFormData,
  ProjectInvoice
} from "@/types/projectLifecycle";
import { ServiceRequestModal } from "@/components/client/ServiceRequestModal";
import { ServiceAgreementModal } from "@/components/client/ServiceAgreementModal";
import { ServiceDetailsModal } from "@/components/client/ServiceDetailsModal";

type Tab = "overview" | "services" | "agreements" | "billing";
type Invoice = { id?: string; title?: string; amount?: string; due_date?: string; status?: string; description?: string };
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
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, string>>({});

  // Lifecycle Modals
  const [detailsModalProject, setDetailsModalProject] = useState<Project | null>(null);
  const [requestModalProject, setRequestModalProject] = useState<Project | null>(null);
  const [agreementModalProject, setAgreementModalProject] = useState<Project | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const load = async (clientEmail: string) => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("email", clientEmail.toLowerCase())
      .order("created_at", { ascending: false });

    if (error) throw error;
    const clientProjects = (data || []) as Project[];
    setProjects(clientProjects);

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
      setName(session.user.user_metadata?.full_name || session.user.email.split("@")[0]);
      setProfileComplete(Boolean(session.user.user_metadata?.organization?.trim() && session.user.user_metadata?.designation?.trim()));
      try {
        await load(session.user.email);
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

  // Aggregate services the client is actively taking across projects
  const clientServices = useMemo(() => {
    return projects.flatMap(project => {
      const m = parseProjectMeta(project.bounty_reward);
      const parsedMsg = parseSubmissionMessage(project.message);
      const serviceList = parsedMsg.selectedServices.length > 0
        ? parsedMsg.selectedServices
        : [project.inquiry_type || "Custom Digital Service"];

      const advInv = m.invoices?.find(i => i.title?.toLowerCase().includes("advance") || i.id === "SD-INV-001");
      const isAdvPaid =
        Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${project.id}:${advInv.id}`] === "PAID")) ||
        Boolean(m.service_start_date);

      return serviceList.map((serviceTitle, idx) => ({
        id: `${project.id}-${idx}`,
        title: serviceTitle,
        project,
        meta: m,
        status: project.status || "Discovery & Scope Review",
        progress: project.progress || 0,
        startDate: m.service_start_date,
        deadline: m.deadline,
        agreement: m.agreement,
        scopeSummary: m.scope_summary || parsedMsg.cleanMessage,
        isAdvPaid
      }));
    });
  }, [projects, paymentStatuses]);

  const outstanding = invoices.filter(({ invoice }) => !["paid", "settled"].includes((invoice.status || "").toLowerCase()));

  // Send payment via Cashfree
  const sendPayment = async () => {
    if (!payment?.invoice.id) return toast.error("This invoice is not ready for online payment.");
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("cashfree-payments", {
      body: { submissionId: payment.project.id, invoiceId: payment.invoice.id }
    });
    setSaving(false);
    if (error || !data?.url) {
      return toast.error(data?.error || error?.message || "Could not create a secure payment link.");
    }
    window.location.assign(data.url);
  };

  // Submit Client Service Request Form & trigger Cashfree for advance
  const handleSubmitServiceRequest = async (formData: ClientServiceFormData, phone: string) => {
    if (!requestModalProject) return;
    setSubmittingRequest(true);
    try {
      // Save verified mobile number in user auth metadata for Cashfree gateway
      await supabase.auth.updateUser({ data: { phone } });

      const m = parseProjectMeta(requestModalProject.bounty_reward);
      let existingInvoices = m.invoices || [];

      // Ensure advance invoice exists
      let advInvoice = existingInvoices.find(i => i.title.toLowerCase().includes("advance") || i.id === "SD-INV-001");
      if (!advInvoice && m.agreement) {
        const advAmount = m.advance_amount || `₹${Math.round(parseInt(m.agreement.replace(/\D/g, "") || "0") * 0.5).toLocaleString("en-IN")}`;
        const num = parseInt(advAmount.replace(/\D/g, "") || "0");
        advInvoice = {
          id: "SD-INV-001",
          title: "Advance Payment (50%)",
          amount: advAmount,
          numeric_amount: num || 12500,
          due_date: new Date().toISOString().split("T")[0],
          status: "pending",
          description: `Advance payment to initiate ${requestModalProject.organization || requestModalProject.name} services.`
        };
        existingInvoices = [advInvoice, ...existingInvoices];
      }

      const updatedMeta: ProjectLifecycleMeta = {
        ...m,
        service_form: formData,
        invoices: existingInvoices
      };

      await supabase
        .from("contact_submissions")
        .update({
          bounty_reward: serializeProjectMeta(updatedMeta)
        })
        .eq("id", requestModalProject.id);

      toast.success("Service onboarding form submitted successfully! Opening payment...");
      const targetProject = requestModalProject;
      setRequestModalProject(null);

      // Trigger payment dialog for the advance invoice
      if (advInvoice) {
        setPayment({ project: targetProject, invoice: advInvoice });
      }

      await load(email);
    } catch (err: any) {
      toast.error("Failed to submit service form: " + (err.message || "Unknown error"));
    } finally {
      setSubmittingRequest(false);
    }
  };

  const completeSetup = async (organization: string, designation: string) => {
    setSetupSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { organization, designation } });
    setSetupSaving(false);
    if (error) return toast.error(error.message);
    setProfileComplete(true);
    toast.success("Profile saved. You can now start your service request.");
    setSetup(false);
    navigate(`/submit?type=requirement&organization=${encodeURIComponent(organization)}`);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f5ef]">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  const hasSetup = profileComplete || projects.some(project => Boolean(project.organization?.trim() && project.designation?.trim()));
  const tabs: [Tab, string, typeof LayoutDashboard][] = [
    ["overview", "Overview", LayoutDashboard],
    ["services", "Services", PanelsTopLeft],
    ["agreements", "Agreements & Banking", FileSignature],
    ["billing", "Billing & Invoices", WalletCards]
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
              <p className="text-xs font-bold uppercase tracking-[.18em] text-lime-300">Siddhi Dynamics · Client workspace</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Good to see you, {name.split(" ")[0]}.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
                Your projects, quotes, service agreements, dates, invoices and updates—all managed in one place.
              </p>
            </div>
            <button
              onClick={() => navigate("/submit?type=requirement")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold text-stone-950 hover:bg-lime-400 transition-colors"
            >
              <Plus className="h-4 w-4" /> Start a request
            </button>
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
                <div>
                  <p className="font-bold">Finish your client profile</p>
                  <p className="mt-1 text-sm text-stone-600">Add your organisation and billing contact before an agreement or invoice is issued.</p>
                </div>
                <button onClick={() => setSetup(true)} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-bold text-white">
                  Complete setup
                </button>
              </div>
            )}

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Active projects", projects.length, "In your workspace", BriefcaseBusiness],
                ["Action needed", outstanding.length, "Open bills / payments", CreditCard],
                [
                  "Delivery progress",
                  projects.length
                    ? `${Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)}%`
                    : "—",
                  "Average across projects",
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
            <Panel title="Your work" subtitle="A focused view of active engagements.">
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
                              <strong className="text-emerald-700">{m.agreement}</strong>
                            </div>
                          )}
                        </div>

                        {/* 1. If Quote is Provided but Advance is Pending -> Show Onboarding Call-to-Action */}
                        {hasQuote && !isAdvPaid && (
                          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-amber-700" /> Price Quote Assigned: {m.agreement}
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
                  title="No active work yet"
                  description="Choose a service and send your goals. We’ll return with a clear scope and proposal."
                  action="Explore services"
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
                eyebrow="Your Subscribed Services"
                title="Services you are actively availing."
                body="Live execution progress, service start dates, and milestones across all your engagements with Siddhi Dynamics."
              />
              <button
                onClick={() => navigate("/submit?type=requirement")}
                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shrink-0 cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <Plus className="h-4 w-4 text-lime-300" /> Request Another Service
              </button>
            </div>

            {clientServices.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {clientServices.map(srv => (
                  <article key={srv.id} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            srv.isAdvPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {srv.isAdvPaid ? "● Active Service" : "○ Pending Onboarding / Advance"}
                          </span>
                          <h3 className="mt-2 text-lg font-bold text-stone-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-primary shrink-0" />
                            {srv.title}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 shrink-0">
                          {srv.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2">
                        {srv.scopeSummary || "Tailored delivery and development as per agreed milestones."}
                      </p>

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

                      <div className="pt-1 flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => setDetailsModalProject(srv.project)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-primary" /> Service Overview
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
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-stone-900">Add or Pick Your Service</h3>
                  <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                    You haven’t enrolled in any services yet. Choose from our engineering, design, and growth programmes to start your next milestone.
                  </p>
                </div>

                {/* Service suggestion pills */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                  {[
                    ["🌐 Website / Portal Development", "Website Development"],
                    ["🚀 SEO, GEO & AEO Programme", "SEO & Search Visibility"],
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
                    <Plus className="h-4 w-4 text-lime-300" /> Pick & Request a Service
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
              eyebrow="Agreements & Official Credentials"
              title="Transparent scope, verified banking and digital contracts."
              body="Official Siddhi Dynamics LLP banking details and service order agreements are securely accessible here once advance payment is completed."
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
                      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <span className="text-stone-500 font-medium">Bank Entity:</span>
                          <p className="font-bold text-stone-900">{m.banking_details?.bank_name || "State Bank of India (SBI)"}</p>
                        </div>
                        <div>
                          <span className="text-stone-500 font-medium">Account Number:</span>
                          <p className="font-mono font-bold text-stone-900">{m.banking_details?.account_number || "62495383611"}</p>
                        </div>
                        <div>
                          <span className="text-stone-500 font-medium">IFSC Code:</span>
                          <p className="font-mono font-bold text-stone-900">{m.banking_details?.ifsc_code || "SBIN0021632"}</p>
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
              eyebrow="Billing"
              title="Secure, traceable milestone payments."
              body="Pay advance and milestone invoices securely via Cashfree gateway (UPI, card, net banking). Tax receipts and paid histories are stored here."
            />
            <div className="space-y-3">
              {invoices.map(({ project, invoice }, i) => {
                const paid = ["paid", "settled"].includes((invoice.status || "").toLowerCase());
                return (
                  <div
                    key={`${project.id}-${i}`}
                    className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                        <ReceiptText className="h-5 w-5" />
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
                          paid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {paid ? "PAID via Cashfree" : "Pending Payment"}
                      </span>
                      {!paid && (
                        <button
                          onClick={() => setPayment({ project, invoice })}
                          className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-bold text-white hover:bg-stone-800 transition-colors cursor-pointer"
                        >
                          Pay now
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
                  title="No bills issued"
                  description="When a quote is approved, your invoice and Cashfree payment schedule will appear here."
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
          onClose={() => setSetup(false)}
          onComplete={completeSetup}
          saving={setupSaving}
        />
      )}

      {/* Cashfree Payment Gateway Modal */}
      {payment && (
        <Payment
          invoice={payment.invoice}
          onClose={() => setPayment(null)}
          onSubmit={sendPayment}
          saving={saving}
        />
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
  onClose,
  onComplete,
  saving
}: {
  name: string;
  email: string;
  onClose: () => void;
  onComplete: (organization: string, designation: string) => void;
  saving: boolean;
}) {
  const [organization, setOrganization] = useState("");
  const [designation, setDesignation] = useState("");

  return (
    <div className="fixed inset-0 z-[250] grid place-items-center bg-stone-950/70 p-4 pt-20 pb-8 backdrop-blur-sm">
      <form
        onSubmit={e => {
          e.preventDefault();
          onComplete(organization, designation);
        }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">One-time setup</p>
            <h2 className="mt-1 text-xl font-semibold">Complete your client profile</h2>
          </div>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-sm text-stone-600">Start with the details we use for your scope, agreement and billing.</p>
        <div className="mt-5 grid gap-4">
          <label className="text-sm font-bold">
            Organisation
            <input
              required
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              placeholder="Company or business name"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm font-bold">
            Your role
            <input
              required
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              placeholder="e.g. Founder, Operations Manager"
              className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-3 font-normal outline-none focus:border-primary"
            />
          </label>
        </div>
        <p className="mt-5 text-xs text-stone-500">{name} · {email}</p>
        <button
          disabled={saving}
          className="mt-5 w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving…" : "Save & start service request"}
        </button>
      </form>
    </div>
  );
}

function Payment({
  invoice,
  onClose,
  onSubmit,
  saving
}: {
  invoice: Invoice;
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[250] grid place-items-center bg-stone-950/70 p-4 pt-20 pb-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Secure online payment</p>
            <h2 className="mt-1 text-xl font-semibold">
              {invoice.title || invoice.id || "Invoice"} · {invoice.amount || ""}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-5 rounded-xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
          You will be taken to Cashfree to pay securely by UPI, card, wallet, or net banking. Your invoice is marked paid and official banking details are unlocked only after Cashfree confirms the payment.
        </p>
        <button
          disabled={saving}
          onClick={onSubmit}
          className="mt-5 flex w-full justify-center rounded-xl bg-stone-900 py-3 text-sm font-bold text-white disabled:opacity-60 hover:bg-stone-800 transition-colors cursor-pointer"
        >
          {saving ? "Creating secure Cashfree link…" : "Continue to secure payment"}
        </button>
      </div>
    </div>
  );
}
