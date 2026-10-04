import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  FileCheck,
  FileSignature,
  CreditCard,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ReceiptText,
  Globe,
  Laptop,
  MapPin,
  TrendingUp,
  ExternalLink,
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Trash2,
  Link2,
  Download,
  Plus,
  PanelsTopLeft,
  FolderOpen,
  Share2,
  Save,
  Check,
  Video,
  Building,
  AlertCircle,
  Send,
  CalendarCheck,
  RefreshCw,
  Eye,
  Sliders,
  CheckCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseSubmissionMessage } from "@/lib/parseSubmissionMessage";
import { parseProjectMeta, serializeProjectMeta } from "@/lib/projectLifecycleHelper";
import {
  ProjectInvoice,
  ClientChangeRequest,
  MeetingScheduleRequest,
  ProjectLifecycleMeta
} from "@/types/projectLifecycle";
import { toast } from "sonner";

interface Submission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  designation?: string;
  inquiry_type?: string;
  message: string;
  status: string;
  progress: number;
  created_at: string;
  bounty_reward?: string | null;
}

interface UploadedAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

interface SharedLink {
  id: string;
  title: string;
  url: string;
  addedAt: string;
}

interface ServiceDetailsModalProps {
  project: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenServiceRequest: (project: Submission) => void;
  onOpenAgreement: (project: Submission) => void;
  onPayInvoice: (project: Submission, invoice: ProjectInvoice) => void;
  paymentStatuses: Record<string, string>;
  onUpdateProject?: (updated: Submission) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenServiceRequest,
  onOpenAgreement,
  onPayInvoice,
  paymentStatuses,
  onUpdateProject
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "inspection" | "data" | "meetings" | "invoices">("overview");

  // Local Project copy to reflect live updates immediately
  const [currentProject, setCurrentProject] = useState<Submission | null>(project);

  // Client Uploads & Links state
  const [clientAssets, setClientAssets] = useState<UploadedAsset[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [clientNotes, setClientNotes] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  // Change Request Form State
  const [changeTitle, setChangeTitle] = useState("");
  const [changeCategory, setChangeCategory] = useState<ClientChangeRequest["category"]>("UI / Design");
  const [changePriority, setChangePriority] = useState<ClientChangeRequest["priority"]>("Normal");
  const [changeDescription, setChangeDescription] = useState("");
  const [changeAssetUrl, setChangeAssetUrl] = useState("");
  const [submittingChange, setSubmittingChange] = useState(false);

  // Meeting Schedule Form State
  const [meetingMode, setMeetingMode] = useState<MeetingScheduleRequest["meeting_mode"]>("Virtual (Google Meet / Zoom)");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("11:00 AM - 12:00 PM");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetingPhone, setMeetingPhone] = useState("");
  const [submittingMeeting, setSubmittingMeeting] = useState(false);

  // Sync current project prop
  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  // Load saved assets for this project from local storage
  useEffect(() => {
    if (!currentProject?.id) return;
    try {
      const stored = localStorage.getItem(`sd_client_assets_${currentProject.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setClientAssets(parsed.clientAssets || []);
        setSharedLinks(parsed.sharedLinks || []);
        setClientNotes(parsed.clientNotes || "");
      } else {
        setClientAssets([]);
        setSharedLinks([]);
        setClientNotes("");
      }
    } catch {
      setClientAssets([]);
      setSharedLinks([]);
      setClientNotes("");
    }
  }, [currentProject?.id]);

  if (!isOpen || !currentProject) return null;

  const m = parseProjectMeta(currentProject.bounty_reward);
  const parsedMsg = parseSubmissionMessage(currentProject.message);
  const hasQuote = Boolean(m.agreement);

  const advInv = m.invoices?.find(
    i => i.title?.toLowerCase().includes("advance") || i.id === "SD-INV-001"
  );
  const isAdvPaid =
    Boolean(advInv && (advInv.status === "paid" || paymentStatuses[`${currentProject.id}:${advInv.id}`] === "PAID")) ||
    Boolean(m.service_start_date);

  const services = parsedMsg.selectedServices.length > 0
    ? parsedMsg.selectedServices
    : [currentProject.inquiry_type || "Custom Digital Service"];

  const displayTitle = currentProject.organization || currentProject.name || "Your Project Engagement";
  const displayDate = new Date(currentProject.created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const saveStorage = (assets: UploadedAsset[], links: SharedLink[], notes: string) => {
    try {
      localStorage.setItem(
        `sd_client_assets_${currentProject.id}`,
        JSON.stringify({ clientAssets: assets, sharedLinks: links, clientNotes: notes })
      );
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  };

  // Helper to persist meta updates to Supabase and LocalStorage
  const persistMetaUpdate = async (updatedMeta: ProjectLifecycleMeta, successToast?: string) => {
    const serialized = serializeProjectMeta(updatedMeta);
    const updatedSub: Submission = {
      ...currentProject,
      bounty_reward: serialized
    };

    setCurrentProject(updatedSub);
    if (onUpdateProject) {
      onUpdateProject(updatedSub);
    }

    // 1. Update in local storage
    try {
      const LOCAL_KEY = "siddhi_local_service_requests";
      const localRaw: Submission[] = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      const updatedList = localRaw.map(p => p.id === currentProject.id ? updatedSub : p);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Local storage update warning:", e);
    }

    // 2. Update in Supabase if not a mock local id
    try {
      if (!currentProject.id.startsWith("local-")) {
        await supabase
          .from("contact_submissions")
          .update({ bounty_reward: serialized })
          .eq("id", currentProject.id);
      }
    } catch (e) {
      console.warn("Supabase meta update failed:", e);
    }

    if (successToast) {
      toast.success(successToast);
    }
  };

  // Multiple File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets: UploadedAsset[] = [];
    const count = files.length;
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        newAssets.push({
          id: `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type || "file",
          dataUrl: reader.result as string,
          uploadedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        });
        processed++;
        if (processed === count) {
          setClientAssets(prev => {
            const updated = [...prev, ...newAssets];
            saveStorage(updated, sharedLinks, clientNotes);
            return updated;
          });
          toast.success(`Uploaded ${count} asset(s) to project hub.`);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleDownloadAsset = (asset: UploadedAsset) => {
    if (!asset.dataUrl) return;
    const a = document.createElement("a");
    a.href = asset.dataUrl;
    a.download = asset.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRemoveAsset = (id: string) => {
    setClientAssets(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveStorage(updated, sharedLinks, clientNotes);
      return updated;
    });
    toast.info("Asset removed from project.");
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    const formattedUrl = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    const newLink: SharedLink = {
      id: `link_${Date.now()}`,
      title: linkTitle.trim() || "Shared Asset Resource",
      url: formattedUrl,
      addedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    };
    const updated = [...sharedLinks, newLink];
    setSharedLinks(updated);
    saveStorage(clientAssets, updated, clientNotes);
    setLinkTitle("");
    setLinkUrl("");
    toast.success("External cloud resource link added.");
  };

  const handleRemoveLink = (id: string) => {
    const updated = sharedLinks.filter(l => l.id !== id);
    setSharedLinks(updated);
    saveStorage(clientAssets, updated, clientNotes);
    toast.info("Link removed.");
  };

  const handleSaveNotes = () => {
    saveStorage(clientAssets, sharedLinks, clientNotes);
    setNotesSaved(true);
    toast.success("Client specifications and notes saved for engineering team.");
    setTimeout(() => setNotesSaved(false), 2500);
  };

  // Submit Revision / Change Request directly from portal
  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeTitle.trim() || !changeDescription.trim()) {
      toast.error("Please enter a title and description for the change request.");
      return;
    }

    setSubmittingChange(true);
    try {
      const newRequest: ClientChangeRequest = {
        id: `cr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: changeTitle.trim(),
        category: changeCategory,
        priority: changePriority,
        description: changeDescription.trim(),
        status: "pending_review",
        submitted_at: new Date().toISOString(),
        asset_url: changeAssetUrl.trim() || undefined
      };

      const existingRequests = m.change_requests || [];
      const updatedMeta: ProjectLifecycleMeta = {
        ...m,
        change_requests: [newRequest, ...existingRequests]
      };

      await persistMetaUpdate(updatedMeta, "Change request logged! Reported directly to engineering leads.");
      setChangeTitle("");
      setChangeDescription("");
      setChangeAssetUrl("");
    } catch (err: any) {
      toast.error("Failed to submit change request: " + err.message);
    } finally {
      setSubmittingChange(false);
    }
  };

  // Submit Meeting Schedule Request
  const handleSubmitMeetingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate || !meetingAgenda.trim()) {
      toast.error("Please select a date and enter the meeting agenda.");
      return;
    }

    setSubmittingMeeting(true);
    try {
      const newMeeting: MeetingScheduleRequest = {
        id: `meet_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        meeting_mode: meetingMode,
        preferred_date: meetingDate,
        preferred_time: meetingTime,
        agenda: meetingAgenda.trim(),
        client_phone: meetingPhone.trim() || currentProject.designation || undefined,
        client_name: currentProject.name,
        status: "requested",
        created_at: new Date().toISOString()
      };

      const existingMeetings = m.meeting_requests || [];
      const updatedMeta: ProjectLifecycleMeta = {
        ...m,
        meeting_requests: [newMeeting, ...existingMeetings]
      };

      await persistMetaUpdate(updatedMeta, "Meeting session requested! Team will confirm the calendar slot.");
      setMeetingAgenda("");
      setMeetingDate("");
    } catch (err: any) {
      toast.error("Failed to request meeting: " + err.message);
    } finally {
      setSubmittingMeeting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-stone-950/80 p-3 pt-20 pb-12 sm:p-6 sm:pt-20 sm:pb-12 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col text-stone-900">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 sm:p-7 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isAdvPaid
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : hasQuote
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {isAdvPaid ? "● Active Service" : hasQuote ? "● Quote Ready" : "⏳ Scope Review"}
              </span>
              <span className="text-xs text-stone-400">
                Created on {displayDate}
              </span>
              {m.deadline && (
                <span className="text-xs text-lime-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Target Handover: {m.deadline}
                </span>
              )}
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {displayTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 overflow-x-auto gap-2 shrink-0">
          {[
            { id: "overview", label: "Overview & Scope", icon: PanelsTopLeft },
            { id: "inspection", label: "Live Inspection & Revisions", icon: Eye },
            { id: "data", label: "Data & Project Assets", icon: FolderOpen },
            { id: "meetings", label: "Schedule Meeting", icon: CalendarCheck },
            { id: "invoices", label: "Invoices & Payments", icon: CreditCard },
          ].map(tabItem => {
            const Icon = tabItem.icon;
            const active = activeSubTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setActiveSubTab(tabItem.id as any)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                  active
                    ? "border-stone-900 text-stone-900 bg-white"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tabItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & SCOPE */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Service Start Date</span>
                  <p className="text-lg font-bold text-stone-900 mt-1">
                    {m.service_start_date ? m.service_start_date : isAdvPaid ? "Sprint Initiated" : "Starts on Advance"}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">Official milestone kick-off</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Estimated Handover</span>
                  <p className="text-lg font-bold text-stone-900 mt-1">{m.deadline || "Per Roadmap Timeline"}</p>
                  <p className="text-xs text-stone-500 mt-0.5">Target production delivery</p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Agreed Valuation / Quote</span>
                  <p className="text-lg font-bold text-stone-900 mt-1">{m.agreement || "Quotation under review"}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{m.payment_structure || "Standard milestone model"}</p>
                </div>
              </div>

              {/* Scope & Deliverables */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Scope & Deliverables Summary
                </span>
                <p className="text-sm font-bold text-stone-900 leading-relaxed">
                  {m.scope_summary || `Services: ${services.join(", ")}`}
                </p>
                <div className="pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Services You Are Taking
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-xl bg-stone-900 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Milestone Progression
                  </span>
                  <span className="text-xs font-extrabold text-stone-900">
                    Phase {Math.ceil((currentProject.progress || 0) / 20) || 1} ({currentProject.progress || 0}%)
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100 p-0.5 border border-stone-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-lime-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.max(currentProject.progress || 0, 5)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-stone-600">
                  <div>1. Discovery & Quote</div>
                  <div>2. Advance Onboarding</div>
                  <div>3. Core Sprint & Alpha</div>
                  <div>4. Review & Final Handover</div>
                </div>
              </div>

              {/* Client Requirements Message */}
              {parsedMsg.cleanMessage && (
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Client Requirements Specification
                  </span>
                  <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                    {parsedMsg.cleanMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE INSPECTION & CHANGE REQUESTS */}
          {activeSubTab === "inspection" && (
            <div className="space-y-6">
              {/* Notice Banner */}
              <div className="p-4 rounded-2xl bg-lime-50 border border-lime-200 text-xs text-lime-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-stone-900">Live Service Inspection & Direct Revision Desk</h4>
                  <p className="text-stone-700 mt-0.5">
                    Instead of fragmented WhatsApp messages, submit all revisions, feedback, and scope changes directly through this portal. Every request is tracked with status history and directly reviewed by engineering leads.
                  </p>
                </div>
              </div>

              {/* Live Project Deliverables / URLs */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Live Service Links & Inspection URLs
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500">Live Deliverables</span>
                </div>

                {(m.demo_url || m.website_url || m.seo_report_url || m.gbp_url || m.analytics_url) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {m.demo_url && (
                      <div className="p-3.5 rounded-xl border border-cyan-200 bg-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900">Demo / Staging Preview</p>
                          <p className="text-[11px] text-stone-500 truncate max-w-[180px]">{m.demo_url}</p>
                        </div>
                        <a
                          href={m.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Laptop className="w-3.5 h-3.5" /> Open Demo ↗
                        </a>
                      </div>
                    )}

                    {m.website_url && (
                      <div className="p-3.5 rounded-xl border border-emerald-200 bg-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900">Live Production Domain</p>
                          <p className="text-[11px] text-stone-500 truncate max-w-[180px]">{m.website_url}</p>
                        </div>
                        <a
                          href={m.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <Globe className="w-3.5 h-3.5" /> Live Site ↗
                        </a>
                      </div>
                    )}

                    {m.seo_report_url && (
                      <div className="p-3.5 rounded-xl border border-lime-200 bg-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900">SEO & Growth Dashboard</p>
                          <p className="text-[11px] text-stone-500 truncate max-w-[180px]">{m.seo_report_url}</p>
                        </div>
                        <a
                          href={m.seo_report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <TrendingUp className="w-3.5 h-3.5 text-lime-300" /> View Report ↗
                        </a>
                      </div>
                    )}

                    {m.gbp_url && (
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-white flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-stone-900">Google Business Profile</p>
                          <p className="text-[11px] text-stone-500 truncate max-w-[180px]">{m.gbp_url}</p>
                        </div>
                        <a
                          href={m.gbp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          <MapPin className="w-3.5 h-3.5" /> Maps Profile ↗
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">
                    Admin team has not linked public staging or production URLs for this service yet. As development milestones reach Alpha preview, links will appear here for your live inspection.
                  </p>
                )}
              </div>

              {/* Submit Change Request Form */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" /> Submit Revision or Change Request
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Need text updates, design changes, new feature additions, or bug fixes? Submit here and our engineering team will review.
                  </p>
                </div>

                <form onSubmit={handleSubmitChangeRequest} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Change Request Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Update pricing table & add testimonial logos"
                        value={changeTitle}
                        onChange={(e) => setChangeTitle(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={changeCategory}
                        onChange={(e) => setChangeCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900 bg-white"
                      >
                        <option value="UI / Design">UI / Design</option>
                        <option value="Content / Copy">Content / Copy</option>
                        <option value="Feature / Logic">Feature / Logic</option>
                        <option value="Bug / Fix">Bug / Fix</option>
                        <option value="General Change">General Change</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Priority
                      </label>
                      <select
                        value={changePriority}
                        onChange={(e) => setChangePriority(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900 bg-white"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Reference Link / Screenshot URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/... or Figma link"
                        value={changeAssetUrl}
                        onChange={(e) => setChangeAssetUrl(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Detailed Instructions & Scope of Change *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Please specify exact changes required, pages impacted, new copy, or desired behavior..."
                      value={changeDescription}
                      onChange={(e) => setChangeDescription(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900 leading-relaxed text-stone-800"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingChange}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-lime-300" />
                      <span>{submittingChange ? "Submitting..." : "Submit Change Request"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Logged Change Requests List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Reported Change Requests & Status History ({m.change_requests?.length || 0})
                </span>

                {m.change_requests && m.change_requests.length > 0 ? (
                  <div className="space-y-3">
                    {m.change_requests.map((cr) => {
                      const statusColor =
                        cr.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : cr.status === "in_progress"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : cr.status === "declined"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200";

                      const statusLabel =
                        cr.status === "completed"
                          ? "Completed ✓"
                          : cr.status === "in_progress"
                          ? "In Progress"
                          : cr.status === "declined"
                          ? "Declined / Out of Scope"
                          : "Pending Admin Review";

                      return (
                        <div key={cr.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-bold text-sm text-stone-900">{cr.title}</h5>
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                                {cr.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                cr.priority === "Urgent" ? "bg-red-50 text-red-700 border border-red-200" : "bg-stone-100 text-stone-600"
                              }`}>
                                {cr.priority} Priority
                              </span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>

                          <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                            {cr.description}
                          </p>

                          {cr.asset_url && (
                            <div>
                              <a
                                href={cr.asset_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                              >
                                <ExternalLink className="w-3 h-3" /> Attached Reference Resource
                              </a>
                            </div>
                          )}

                          {cr.admin_response && (
                            <div className="p-3 rounded-xl bg-lime-50/70 border border-lime-200/80 text-xs text-stone-800">
                              <strong className="text-primary font-bold block mb-0.5">Admin Response & Resolution:</strong>
                              {cr.admin_response}
                            </div>
                          )}

                          <span className="text-[10px] text-stone-400 block pt-1 border-t border-stone-100">
                            Logged on {new Date(cr.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                    No change requests submitted yet. Use the form above whenever you need any adjustments or revisions.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DATA & SHARED ASSETS HUB */}
          {activeSubTab === "data" && (
            <div className="space-y-6">
              {/* 1. Client File Uploads */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-primary" /> Upload Project Files & Assets (Multiple Allowed)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload brand logos, design documents, requirement briefs, images, or PDFs to share with the engineering team.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm shrink-0">
                    <Plus className="w-4 h-4 text-lime-300" />
                    <span>Select Files</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {/* Uploaded Files List */}
                {clientAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {clientAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 shrink-0">
                            {asset.type.includes("image") ? (
                              <ImageIcon className="w-4 h-4 text-purple-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate" title={asset.name}>
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              {formatFileSize(asset.size)} · {asset.uploadedAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadAsset(asset)}
                            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset(asset.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                    No files uploaded yet. Click "Select Files" above to upload multiple documents or images.
                  </div>
                )}
              </div>

              {/* 2. External Links & Cloud Resources */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" /> Share Cloud Links (Figma, Google Drive, GitHub)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Share links to design folders, cloud storage, credentials docs, or repository references.
                  </p>
                </div>

                <form onSubmit={handleAddLink} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Link Title (e.g. Brand Kit Drive)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                  />
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Add Link
                  </button>
                </form>

                {sharedLinks.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {sharedLinks.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Link2 className="w-4 h-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900">{item.title}</p>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline truncate block"
                            >
                              {item.url}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(item.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* 3. Notes & Instructions for Engineering Team */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Additional Instructions / Notes for Engineering Team
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {notesSaved ? <Check className="w-3.5 h-3.5 text-lime-300" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{notesSaved ? "Saved" : "Save Notes"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Add any specific guidelines, preferred color palettes, reference websites, or access instructions here..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs outline-none focus:border-stone-900 leading-relaxed text-stone-800"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SCHEDULE MEETING (VIRTUAL & DIRECT) */}
          {activeSubTab === "meetings" && (
            <div className="space-y-6">
              {/* Meeting Booking Form */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-primary" /> Schedule Direct or Virtual Consultation
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Connect with our technical architects and partners. Select either a virtual video call or an in-person meeting at our office.
                  </p>
                </div>

                <form onSubmit={handleSubmitMeetingRequest} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Meeting Format / Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMeetingMode("Virtual (Google Meet / Zoom)")}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            meetingMode.includes("Virtual")
                              ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-lime-300" /> Virtual (Meet)
                        </button>
                        <button
                          type="button"
                          onClick={() => setMeetingMode("Direct / In-Person (Nizamabad / Hyderabad Office)")}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            meetingMode.includes("Direct")
                              ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                              : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          <Building className="w-3.5 h-3.5 text-lime-300" /> Direct (Office)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Contact Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={meetingPhone}
                        onChange={(e) => setMeetingPhone(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900 bg-white"
                      >
                        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning)</option>
                        <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM (Mid-day)</option>
                        <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM (Afternoon)</option>
                        <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Evening)</option>
                        <option value="06:30 PM - 07:30 PM">06:30 PM - 07:30 PM (Late Slot)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Meeting Agenda & Discussion Topics *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Scope walk-through, architecture review, launch timeline discussion..."
                      value={meetingAgenda}
                      onChange={(e) => setMeetingAgenda(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border border-stone-200 outline-none focus:border-stone-900 leading-relaxed text-stone-800"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingMeeting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-lime-300" />
                      <span>{submittingMeeting ? "Requesting..." : "Confirm Meeting Request"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Booked / Requested Meetings List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Scheduled Meetings & Consultations ({m.meeting_requests?.length || 0})
                </span>

                {m.meeting_requests && m.meeting_requests.length > 0 ? (
                  <div className="space-y-3">
                    {m.meeting_requests.map((mr) => {
                      const isConfirmed = mr.status === "confirmed";
                      return (
                        <div key={mr.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-stone-900">{mr.preferred_date} · {mr.preferred_time}</span>
                              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                                {mr.meeting_mode}
                              </span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${
                              isConfirmed
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {isConfirmed ? "Confirmed Slot ✓" : "Slot Requested"}
                            </span>
                          </div>

                          <p className="text-xs text-stone-700 leading-relaxed">
                            <strong>Agenda:</strong> {mr.agenda}
                          </p>

                          {mr.meeting_link && (
                            <div className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 flex items-center justify-between">
                              <span><strong>Meeting Link:</strong> {mr.meeting_link}</span>
                              <a
                                href={mr.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition-colors inline-flex items-center gap-1"
                              >
                                Join Video Call ↗
                              </a>
                            </div>
                          )}

                          {mr.meeting_mode.includes("Direct") && (
                            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                              <strong>Office Venue:</strong> Siddhi Dynamics LLP, 3-5-260/2, Shivaji Nagar Rd, Kotagally, Nizamabad, Telangana 503001
                            </div>
                          )}

                          {mr.admin_notes && (
                            <div className="p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 text-xs text-stone-800">
                              <strong>Admin Notes:</strong> {mr.admin_notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                    No meetings requested yet. Choose your preferred slot above to connect directly with the team.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INVOICES & PAYMENTS */}
          {activeSubTab === "invoices" && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-500 font-medium">Agreed Quote / Valuation:</span>{" "}
                  <strong className="text-stone-900 text-sm font-bold">{m.agreement || "Quotation under review"}</strong>
                </div>
                <div>
                  <span className="text-stone-500 font-medium">Payment Model:</span>{" "}
                  <strong className="text-stone-800">{m.payment_structure || "50% Advance + 50% on Handover"}</strong>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Associated Project Invoices
                </span>
                {m.invoices && m.invoices.length > 0 ? (
                  <div className="space-y-2.5">
                    {m.invoices.map((inv) => {
                      const isPaid = inv.status === "paid" || paymentStatuses[`${currentProject.id}:${inv.id}`] === "PAID";
                      return (
                        <div
                          key={inv.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-stone-200 bg-white gap-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                              <ReceiptText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-stone-900">{inv.title || inv.id}</p>
                              <p className="text-xs text-stone-500">{inv.amount} {inv.due_date ? `· Due: ${inv.due_date}` : ""}</p>
                            </div>
                          </div>

                          <div>
                            {isPaid ? (
                              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Paid & Settled
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  onClose();
                                  onPayInvoice(currentProject, inv);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                              >
                                <CreditCard className="w-4 h-4 text-lime-300" /> Pay via Cashfree / UPI
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
                    No individual invoices generated yet. Invoices will be generated upon onboarding approval.
                  </div>
                )}
              </div>

              {/* Direct UPI / Bank Transfer Reference */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-900 uppercase tracking-wider block text-[11px]">
                  Official Banking Details (SIDDHI DYNAMICS PVT LTD)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div><strong>Beneficiary:</strong> SIDDHI DYNAMICS PVT LTD</div>
                  <div><strong>Account Number:</strong> 45170121323</div>
                  <div><strong>Bank:</strong> State Bank of India (SBI)</div>
                  <div><strong>IFSC:</strong> SBIN0020149</div>
                  <div><strong>UPI ID:</strong> siddhidynamics@sbi</div>
                </div>
              </div>
            </div>
          )}

          {/* Direct Support Section */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-stone-500 font-medium">Need instant assistance with this service?</span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/916303602743?text=Hi%20Siddhi%20Dynamics,%20following%20up%20on%20my%20service%20requirement%20for%20${encodeURIComponent(displayTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Desk
              </a>
              <a
                href="tel:+916303602743"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> +91 6303602743
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close Service View
          </button>
        </div>

      </div>
    </div>
  );
};
