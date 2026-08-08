import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { GoogleReviewCard } from "@/components/GoogleReviewCard";
import {
  Search, Globe, Bot, MapPin, TrendingUp, CheckCircle, Clock, Calendar,
  ShieldCheck, RefreshCw, MessageCircle, Send, Zap, CreditCard, QrCode,
  Download, Building2, BarChart3, FileText, Users, Copy, Check, LogOut,
  AlertCircle, Plus, X, ChevronRight, ChevronLeft, Phone, Mail, Instagram, Youtube,
  Facebook, Linkedin, Target, Image, Briefcase, Star, Filter, Eye, ArrowUpRight, Lock
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { emailService } from "@/services/emailService";
import OccasionDesignsSection from "@/components/portal/OccasionDesignsSection";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'seo-geo' | 'analytics' | 'clients' | 'billing' | 'chat' | 'occasions';

interface ClientBrand {
  id: string;
  businessName: string;
  brandName: string;
  category: string;
  description: string;
  website: string;
  contactName: string;
  mobile: string;
  email: string;
  address: string;
  goals: string[];
  socialFb?: string;
  socialIg?: string;
  socialLi?: string;
  socialYt?: string;
  addedAt: string;
  geoScore: number;
  seoScore: number;
  gbpScore: number;
  aeoScore: number;
  status: string;
  progress: number;
  tenureMonths?: number;        // Admin-set contract duration in months
  tenureStartDate?: string;     // Admin-set start date (YYYY-MM-DD)
  monthlyImpressions?: string;
  monthlyClicks?: string;
  ctr?: string;
  conversions?: string;
  aiCitations?: string;
  paymentStrategy?: string;
  retainerFee?: string;
}

const BUSINESS_GOALS = [
  "More Calls", "More Leads", "More Website Traffic",
  "More Walk-in Customers", "Better Google Search Visibility",
  "Better Google Maps Visibility", "Better AI Search Visibility"
];

const BASE_TABS: { id: Tab; baseLabel: string; icon: React.ReactNode; desc: string; alwaysVisible?: boolean }[] = [
  { id: 'overview',   baseLabel: 'Executive SLA & Roadmap',      icon: <Calendar className="w-5 h-5" />,      desc: 'Contract & milestone progress' },
  { id: 'clients',    baseLabel: 'Client Portfolio',           icon: <Users className="w-5 h-5" />,         desc: 'Select & manage agency client brands' },
  { id: 'seo-geo',    baseLabel: 'Service Metrics & Scores',    icon: <Search className="w-5 h-5" />,        desc: 'Live KPI & deliverable scores' },
  { id: 'analytics',  baseLabel: 'Service Reports & Analytics',icon: <BarChart3 className="w-5 h-5" />,     desc: 'Traffic, uptime & delivery reports' },
  { id: 'billing',    baseLabel: 'Quotation, Payments & Billing',icon: <CreditCard className="w-5 h-5" />,    desc: 'Confirm quotes & setup payment mode' },
  { id: 'chat',       baseLabel: 'AI Support Coordinator',     icon: <Bot className="w-5 h-5" />,           desc: 'Siddhi AI assistant' },
  { id: 'occasions',  baseLabel: 'Occasion & Festive Designs', icon: <Image className="w-5 h-5" />,         desc: 'Wishes images per client', alwaysVisible: true },
];

const INITIAL_CLIENTS: ClientBrand[] = [];

// ─── ClientList Sub-component: compact list, tap to expand ────────────────────
function ClientList({
  clients,
  selectedBrandId,
  onSelect,
  onToggleLock,
  onDelete,
  onInspectSeo,
  onInspectAnalytics,
}: {
  clients: ClientBrand[];
  selectedBrandId: string;
  onSelect: (id: string) => void;
  onToggleLock: (id: string, name: string) => void;
  onDelete: (id: string, name: string) => void;
  onInspectSeo: (id: string) => void;
  onInspectAnalytics: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {clients.map((c) => {
        const isExpanded = expandedId === c.id;
        const isSelected = selectedBrandId === c.id;
        return (
          <div
            key={c.id}
            className={`glass-card rounded-2xl border transition-all ${
              isSelected
                ? 'border-primary/50 bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            {/* Row — tapping opens client dashboard directly */}
            <div
              onClick={() => onSelect(c.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  c.status === 'Locked (Tenure Expired)' ? 'bg-red-500' : 'bg-emerald-500'
                }`} />
                <span className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{c.businessName}</span>
                {c.category && (
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border hidden sm:inline">
                    {c.category}
                  </span>
                )}
                {isSelected && (
                  <span className="text-[9px] font-extrabold bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                    Selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[10px] text-muted-foreground hidden md:inline">
                  SEO {c.seoScore || 75} · GEO {c.geoScore || 80} · GBP {c.gbpScore || 85} · AEO {c.aeoScore || 78}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : c.id); }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  title="Inspect quick details"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </button>
              </div>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                    {/* Scores row */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-muted/60 rounded-xl border border-border text-center">
                      <div>
                        <div className="text-[9px] font-bold uppercase text-violet-500">GEO</div>
                        <div className="text-sm font-extrabold text-foreground">{c.geoScore || 80}/100</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-cyan-500">SEO</div>
                        <div className="text-sm font-extrabold text-foreground">{c.seoScore || 75}/100</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-rose-500">GBP</div>
                        <div className="text-sm font-extrabold text-foreground">{c.gbpScore || 85}/100</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase text-amber-500">AEO</div>
                        <div className="text-sm font-extrabold text-foreground">{c.aeoScore || 78}/100</div>
                      </div>
                    </div>

                    {/* Description */}
                    {c.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.description}</p>
                    )}

                    {/* Goals */}
                    {c.goals.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {c.goals.map(g => (
                          <span key={g} className="text-[10px] bg-muted px-2.5 py-0.5 rounded-full border border-border text-muted-foreground font-medium">
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact info */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      {c.mobile && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" />{c.mobile}</span>}
                      {c.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" />{c.email}</span>}
                      {c.website && <span className="flex items-center gap-1.5 col-span-2 truncate"><Globe className="w-3.5 h-3.5 text-primary" />{c.website}</span>}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onSelect(c.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl transition-all hover:scale-[1.02]"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Dashboard
                      </button>
                      <button
                        onClick={() => onInspectSeo(c.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl border border-primary/20 transition-all"
                      >
                        <Search className="w-3.5 h-3.5" /> SEO/GEO Analysis
                      </button>
                      <button
                        onClick={() => onInspectAnalytics(c.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-xl border border-border transition-all"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-primary" /> GA Analytics
                      </button>
                      <button
                        onClick={() => onToggleLock(c.id, c.businessName)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl border transition-all ${
                          c.status === 'Locked (Tenure Expired)'
                            ? 'bg-red-600 text-white border-red-500 hover:bg-red-700'
                            : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        {c.status === 'Locked (Tenure Expired)' ? 'Locked' : 'Active'}
                      </button>
                      <button
                        onClick={() => onDelete(c.id, c.businessName)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function VMagneticMindsPortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("23eg510a07@anurag.edu.in");
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── Client Selection State ─────────────────────────────────────────────────
  const [clients, setClients] = useState<ClientBrand[]>(INITIAL_CLIENTS);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("all");
  const selectedBrand = clients.find(c => c.id === selectedBrandId) || null;

  // ── UPI / billing ──────────────────────────────────────────────────────────
  const upiId      = "6303602743@upi";
  const payeeName  = "Siddhi Dynamics LLP";

  // Dynamic Invoices per client (empty by default until generated for real clients)
  const [invoices, setInvoices] = useState<Array<{
    id: string;
    month: string;
    amount: string;
    rawAmount: string;
    status: string;
    date: string;
    desc: string;
  }>>([]);

  const [payModalOpen,   setPayModalOpen]   = useState(false);
  const [selInvoice,     setSelInvoice]     = useState<typeof invoices[0] | null>(null);
  const [utrInput,       setUtrInput]       = useState("");
  const [submittingUtr,  setSubmittingUtr]  = useState(false);

  const buildUpiLink = (app: string) => {
    const amt = selInvoice?.rawAmount || "1000";
    const base = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amt}&cu=INR&tn=${encodeURIComponent(selInvoice?.id || 'SLA')}`;
    const map: Record<string, string> = {
      gpay:    `tez://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amt}&cu=INR`,
      phonepe: `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amt}&cu=INR`,
      paytm:   `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amt}&cu=INR`,
    };
    return map[app] || base;
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (utrInput.trim().length < 8) { toast.error("Enter a valid UTR (min 8 digits)"); return; }
    setSubmittingUtr(true);
    setTimeout(() => {
      // Trigger confirmation email
      emailService.paymentConfirm(
        "ssaivaraprasad51@gmail.com",
        agencyName,
        selInvoice?.amount || "₹1,000",
        selInvoice?.id || "INV-2026-001"
      );
      setSubmittingUtr(false);
      setPayModalOpen(false);
      setUtrInput("");
      toast.success(`UTR for ${selInvoice?.id} submitted. saivaraprasad will verify within 2 hrs.`);
    }, 1200);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ── Partner Agency Profile & Branding Customization ─────────────────────────
  const [agencyName, setAgencyName] = useState("Your Agency");
  const [agencyLogoUrl, setAgencyLogoUrl] = useState("");
  const [agencyContact, setAgencyContact] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [agencyWebsite, setAgencyWebsite] = useState("");
  const [agencyFb, setAgencyFb] = useState("");
  const [agencyIg, setAgencyIg] = useState("");
  const [agencyLi, setAgencyLi] = useState("");
  const [agencyYt, setAgencyYt] = useState("");

  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [editAgencyName, setEditAgencyName] = useState(agencyName);
  const [editAgencyLogo, setEditAgencyLogo] = useState(agencyLogoUrl);
  const [editAgencyContact, setEditAgencyContact] = useState(agencyContact);
  const [editAgencyPhone, setEditAgencyPhone] = useState(agencyPhone);
  const [editAgencyWebsite, setEditAgencyWebsite] = useState(agencyWebsite);
  const [editAgencyFb, setEditAgencyFb] = useState(agencyFb);
  const [editAgencyIg, setEditAgencyIg] = useState(agencyIg);
  const [editAgencyLi, setEditAgencyLi] = useState(agencyLi);
  const [editAgencyYt, setEditAgencyYt] = useState(agencyYt);

  const [customSocials, setCustomSocials] = useState<{ id: string; name: string; url: string }[]>([]);

  const addCustomSocialChannel = () => {
    setCustomSocials(prev => [...prev, { id: 'soc-' + Date.now(), name: '', url: '' }]);
  };

  const removeCustomSocialChannel = (id: string) => {
    setCustomSocials(prev => prev.filter(s => s.id !== id));
  };

  const updateCustomSocialChannel = (id: string, field: 'name' | 'url', val: string) => {
    setCustomSocials(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const logoDataUrl = uploadEvent.target.result as string;
          setEditAgencyLogo(logoDataUrl);
          toast.success(`Selected logo image: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = editAgencyPhone.trim().replace(/[^0-9]/g, "");
    if (editAgencyPhone.trim() && cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile / WhatsApp number.");
      return;
    }
    const newName = editAgencyName.trim() || "Agency Partner";
    const newLogo = editAgencyLogo;

    setAgencyName(newName);
    setAgencyLogoUrl(newLogo);
    setAgencyContact(editAgencyContact.trim());
    setAgencyPhone(editAgencyPhone.trim());
    setAgencyWebsite(editAgencyWebsite.trim());
    setAgencyFb(editAgencyFb.trim());
    setAgencyIg(editAgencyIg.trim());
    setAgencyLi(editAgencyLi.trim());
    setAgencyYt(editAgencyYt.trim());

    try {
      await supabase.auth.updateUser({
        data: {
          agency_name: newName,
          agency_logo: newLogo,
          agency_contact: editAgencyContact.trim(),
          agency_phone: editAgencyPhone.trim(),
          agency_website: editAgencyWebsite.trim(),
          agency_fb: editAgencyFb.trim(),
          agency_ig: editAgencyIg.trim(),
          agency_li: editAgencyLi.trim(),
          agency_yt: editAgencyYt.trim()
        }
      });
    } catch (err) {
      console.error("Failed to update user metadata:", err);
    }

    try {
      if (userEmail) {
        await supabase.from('agency_profiles').upsert({
          user_email: userEmail.toLowerCase(),
          agency_name: newName,
          agency_logo: newLogo,
          contact_person: editAgencyContact.trim(),
          phone: editAgencyPhone.trim(),
          website: editAgencyWebsite.trim(),
          facebook: editAgencyFb.trim(),
          instagram: editAgencyIg.trim(),
          linkedin: editAgencyLi.trim(),
          youtube: editAgencyYt.trim(),
          custom_socials: customSocials,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_email' });

        localStorage.setItem(`sd_agency_profile_${userEmail.toLowerCase()}`, JSON.stringify({
          agencyName: newName,
          agencyLogoUrl: newLogo,
          agencyContact: editAgencyContact.trim(),
          agencyPhone: editAgencyPhone.trim(),
          agencyWebsite: editAgencyWebsite.trim(),
          agencyFb: editAgencyFb.trim(),
          agencyIg: editAgencyIg.trim(),
          agencyLi: editAgencyLi.trim(),
          agencyYt: editAgencyYt.trim(),
          customSocials: customSocials
        }));
      }
    } catch (err) {
      console.error("Failed to save agency profile to Supabase DB:", err);
    }

    setShowBrandingModal(false);
    toast.success(`Agency profile saved for ${newName}!`);
  };

  const handleDeleteClient = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete client brand "${name}"?`)) {
      setClients(prev => prev.filter(c => c.id !== id));
      if (selectedBrandId === id) setSelectedBrandId("all");
      toast.success(`Deleted client brand "${name}"`);
    }
  };

  const handleToggleClientLock = (id: string, name: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        const isLocked = c.status === "Locked (Tenure Expired)";
        const nextStatus = isLocked ? "Active Optimization" : "Locked (Tenure Expired)";
        toast.info(`Updated status for ${name}: ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // ── Add Client Form ───────────────────────────────────────────────────────
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(["SEO, GEO & AEO Programme"]);

  const togglePartnerService = (srv: string) => {
    setSelectedServices(prev =>
      prev.includes(srv)
        ? (prev.length > 1 ? prev.filter(x => x !== srv) : prev)
        : [...prev, srv]
    );
  };
  const [clientForm, setClientForm] = useState({
    businessName: "", brandName: "", category: "", description: "",
    yearEst: "", website: "", services: "", hours: "",
    contactName: "", mobile: "", whatsapp: "", email: "",
    address: "", addrDoorNo: "", addrStreet: "", addrArea: "", addrCity: "", addrState: "", addrPinCode: "",
    mapsLink: "", landmark: "", serviceAreas: "",
    brandColors: "", fbLink: "", igLink: "", liLink: "", ytLink: "",
    testimonials: "", paymentStrategy: "Custom Agreement", retainerFee: "",
  });
  const [clientCustomSocials, setClientCustomSocials] = useState<Array<{ id: string; name: string; url: string }>>([]);
  const [testimonialFiles, setTestimonialFiles] = useState<File[]>([]);


  const addClientCustomSocialChannel = () => {
    setClientCustomSocials(prev => [...prev, { id: Date.now().toString(), name: '', url: '' }]);
  };

  const removeClientCustomSocialChannel = (id: string) => {
    setClientCustomSocials(prev => prev.filter(c => c.id !== id));
  };

  const updateClientCustomSocialChannel = (id: string, field: 'name' | 'url', val: string) => {
    setClientCustomSocials(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const [savingClient, setSavingClient] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const cf = (key: keyof typeof clientForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setClientForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggleGoal = (g: string) =>
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.businessName.trim() || !clientForm.contactName.trim()) {
      toast.error("Business name and contact name are required."); return;
    }
    const cleanMobile = clientForm.mobile.trim().replace(/[^0-9]/g, "");
    if (!cleanMobile || cleanMobile.length !== 10) {
      toast.error("Mobile Number is required and must be exactly 10 digits (e.g. 9876543210). 12-digit numbers are not allowed.");
      return;
    }
    const cleanWhatsapp = clientForm.whatsapp.trim().replace(/[^0-9]/g, "");
    if (clientForm.whatsapp.trim() && cleanWhatsapp.length !== 10) {
      toast.error("WhatsApp Number must be exactly 10 digits.");
      return;
    }
    setSavingClient(true);
    setTimeout(() => {
      const constructedAddr = [
        clientForm.addrDoorNo,
        clientForm.addrStreet,
        clientForm.addrArea,
        clientForm.addrCity,
        clientForm.addrState ? `${clientForm.addrState}${clientForm.addrPinCode ? ' - ' + clientForm.addrPinCode : ''}` : clientForm.addrPinCode
      ].map(s => s?.trim()).filter(Boolean).join(", ");

      const newClient: ClientBrand = {
        id: `client-${Date.now()}`,
        businessName: clientForm.businessName,
        brandName:    clientForm.brandName || clientForm.businessName,
        category:     clientForm.category || "General Business",
        description:  clientForm.description,
        website:      clientForm.website,
        contactName:  clientForm.contactName,
        mobile:       clientForm.mobile,
        email:        clientForm.email,
        address:      clientForm.address,
        goals:        selectedGoals,
        socialFb:     clientForm.fbLink,
        socialIg:     clientForm.igLink,
        socialLi:     clientForm.liLink,
        socialYt:     clientForm.ytLink,
        addedAt:      new Date().toISOString().split('T')[0],
        geoScore: 0,
        seoScore: 0,
        gbpScore: 0,
        aeoScore: 0,
        status: "Onboarding & Audit",
        progress: 0,
        tenureMonths: undefined,
        tenureStartDate: undefined,
        monthlyImpressions: undefined,
        monthlyClicks: undefined,
        ctr: undefined,
        conversions: undefined,
        aiCitations: undefined,
      };
      const clientEmailVal = clientForm.email.trim() ? clientForm.email.trim().toLowerCase() : userEmail.toLowerCase();
      
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      try {
        localStorage.setItem(`sd_agency_clients_${userEmail.toLowerCase()}`, JSON.stringify(updatedClients));
      } catch (e) {}

      supabase.from('agency_clients').upsert({
        id: newClient.id,
        agency_email: userEmail.toLowerCase(),
        business_name: newClient.businessName,
        brand_name: newClient.brandName,
        category: newClient.category,
        description: newClient.description,
        website: newClient.website,
        contact_name: newClient.contactName,
        mobile: newClient.mobile,
        whatsapp: clientForm.whatsapp,
        email: newClient.email,
        address: newClient.address,
        services: selectedServices,
        payment_strategy: clientForm.paymentStrategy,
        retainer_fee: clientForm.retainerFee,
        status: newClient.status,
        progress: newClient.progress
      }).then(() => {});

      setSelectedBrandId(newClient.id);

      // Automatically insert request into contact_submissions with target client email so client can log in & see it!
      supabase.from("contact_submissions").insert({
        name: clientForm.contactName || clientForm.businessName,
        email: clientEmailVal,
        organization: `${clientForm.businessName} (${agencyName} Client)`,
        designation: `Agency Client (via ${agencyName})`,
        inquiry_type: selectedServices.join(", "),
        message: `[Services Availed: ${selectedServices.join(", ")}]\n[Agency Partner: ${agencyName} (${userEmail})]\n[Business Name: ${clientForm.businessName}]\n[Website: ${clientForm.website || 'N/A'}]\n[Category: ${clientForm.category || 'N/A'}]\n${clientForm.description || ''}`,
        status: "New Request",
        progress: 0,
        bounty_reward: JSON.stringify({
          agency_email: userEmail.toLowerCase(),
          agency_name: agencyName,
          website_url: clientForm.website,
          agreement: clientForm.retainerFee || "Pending Admin Review"
        })
      }).then(() => {});

      setSavingClient(false);
      setShowClientForm(false);
      setClientForm({
        businessName: "", brandName: "", category: "", description: "",
        yearEst: "", website: "", services: "", hours: "",
        contactName: "", mobile: "", whatsapp: "", email: "",
        address: "",
        addrDoorNo: "", addrStreet: "", addrArea: "", addrCity: "", addrState: "", addrPinCode: "",
        mapsLink: "", landmark: "", serviceAreas: "",
        brandColors: "", fbLink: "", igLink: "", liLink: "", ytLink: "",
        testimonials: "", paymentStrategy: "Custom Agreement", retainerFee: "",
      });
      setSelectedGoals([]);
      setClientCustomSocials([]);
      setTestimonialFiles([]);
      setSelectedServices(["SEO, GEO & AEO Programme"]);
      toast.success(`${newClient.businessName} added & selected for analysis!`);
    }, 800);
  };

  // ── Quick Select Client Action ─────────────────────────────────────────────
  const selectBrandAndOpenTab = (brandId: string, targetTab: Tab) => {
    setSelectedBrandId(brandId);
    setActiveTab(targetTab);
    const brand = clients.find(c => c.id === brandId);
    if (brand) {
      toast.info(`Viewing analysis for ${brand.businessName}`);
    }
  };

  // ── Chat ───────────────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "Siddhi AI", text: `Welcome ${agencyName}! I'm your dedicated Siddhi AI coordinator for your 12-month SEO, GEO, AEO & GBP programme. Ask me anything about pricing, your clients, scores, invoices, or SLA progress.`, time: "Now", isAdmin: true }
  ]);
  const [chatInput, setChatInput] = useState("");

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    const lower = msg.toLowerCase();
    setChatInput("");
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: agencyName, text: msg, time: now, isAdmin: false }]);

    setTimeout(() => {
      let reply = "";

      // ── Pricing / Cost per client ──────────────────────────────────────
      if (/cost|price|pricing|how much|per client|per month|fee|charge|rate/i.test(lower)) {
        const clientCount = clients.length;
        const totalMonthly = clientCount * 1000;
        reply = clientCount === 0
          ? `Your retainer with Siddhi Dynamics is ₹1,000 per client per month, on a 12-month SLA. You haven't added any clients yet — add your first client brand to get started!`
          : `Your Siddhi Dynamics retainer is ₹1,000 per client per month.\n\nCurrently you have ${clientCount} client${clientCount > 1 ? 's' : ''} — that's ₹${totalMonthly.toLocaleString('en-IN')} / month total (₹${(totalMonthly * 12).toLocaleString('en-IN')} for the full 12-month SLA).\n\nClients managed:\n${clients.map((c, i) => `${i + 1}. ${c.businessName} — ₹1,000/mo`).join('\n')}`;
      }

      // ── Invoice / Billing / Payment ────────────────────────────────────
      else if (/invoice|bill|payment|pay|upi|utr|due|pending/i.test(lower)) {
        const pending = invoices.filter(inv => inv.status === "Pending");
        const upcoming = invoices.filter(inv => inv.status === "Upcoming");
        if (pending.length > 0) {
          reply = `You have ${pending.length} pending invoice${pending.length > 1 ? 's' : ''}:\n\n${pending.map(p => `• ${p.id} — ${p.amount} (${p.month})`).join('\n')}\n\nPay via UPI ID: ${upiId} (${payeeName}). Open the Billing tab and click "Pay Now" on any invoice to submit your UTR after payment.`;
        } else {
          reply = `All invoices are up to date! ${upcoming.length > 0 ? `Next upcoming: ${upcoming[0].id} — ${upcoming[0].amount} due ${upcoming[0].date}.` : ''}\n\nUPI ID: ${upiId} | Payee: ${payeeName}`;
        }
      }

      // ── Selected client specific info ──────────────────────────────────
      else if (/score|seo|geo|gbp|aeo|rank|analysis|performance/i.test(lower)) {
        if (selectedBrand) {
          reply = `Here are the live scores for ${selectedBrand.businessName}:\n\n📍 GEO (AI Visibility): ${selectedBrand.geoScore || 82}/100\n🔍 SEO (Search Engine): ${selectedBrand.seoScore || 78}/100\n🏢 GBP (Google Business): ${selectedBrand.gbpScore || 84}/100\n🎯 AEO (Answer Engine): ${selectedBrand.aeoScore || 76}/100\n\n📊 Monthly Impressions: ${selectedBrand.monthlyImpressions || 'N/A'}\n👆 Clicks: ${selectedBrand.monthlyClicks || 'N/A'} | CTR: ${selectedBrand.ctr || 'N/A'}\n✅ Conversions: ${selectedBrand.conversions || 'N/A'}\n🤖 AI Citations: ${selectedBrand.aiCitations || 'N/A'}\n\nStatus: ${selectedBrand.status || 'Onboarding'}`;
        } else if (clients.length === 0) {
          reply = "No clients added yet. Add your first client brand to start tracking SEO, GEO, AEO & GBP scores.";
        } else {
          reply = `You have ${clients.length} client${clients.length > 1 ? 's' : ''}. Select a client from the dropdown above to view their individual scores:\n\n${clients.map((c, i) => `${i + 1}. ${c.businessName} — SEO: ${c.seoScore || 78} | GEO: ${c.geoScore || 82} | GBP: ${c.gbpScore || 84} | AEO: ${c.aeoScore || 76}`).join('\n')}`;
        }
      }

      // ── Client list / portfolio ────────────────────────────────────────
      else if (/client|portfolio|brand|how many|list/i.test(lower)) {
        if (clients.length === 0) {
          reply = "You haven't added any client brands yet. Go to the Client Portfolio tab and click \"Add Client Brand\" to get started.";
        } else {
          reply = `You're currently managing ${clients.length} client brand${clients.length > 1 ? 's' : ''} under ${agencyName}:\n\n${clients.map((c, i) => `${i + 1}. ${c.businessName}${c.category ? ` (${c.category})` : ''} — Status: ${c.status || 'Active'}`).join('\n')}\n\nSelect any client from the dropdown to drill into their analysis, GA reports, and billing.`;
        }
      }

      // ── SLA / contract / duration ──────────────────────────────────────
      else if (/sla|contract|duration|months|plan|12 month|start/i.test(lower)) {
        reply = `Your SLA with Siddhi Dynamics is a 12-Month Executive Programme.\n\n📅 Contract: Aug 2026 – Aug 2027\n💰 Retainer: ₹1,000 per client per month\n🏢 Clients: ${clients.length} brand${clients.length !== 1 ? 's' : ''} managed\n⚡ Services: SEO, GEO (AI Search), AEO (Answer Engine), GBP Optimisation, GA Monthly Reports\n\nPayment is due on the 1st of each month. Current status: ${invoices[0]?.status === 'Pending' ? '⚠️ Month 1 payment pending' : '✅ Payments up to date'}`;
      }

      // ── Fallback ───────────────────────────────────────────────────────
      else {
        reply = `I'm your Siddhi AI coordinator for ${agencyName}'s 12-month SLA programme. I can help you with:\n\n• 💰 Pricing & cost per client\n• 📋 Invoice & payment status\n• 📊 SEO / GEO / AEO / GBP scores\n• 👥 Client portfolio overview\n• 📅 SLA details & contract info\n\nJust ask me anything specific!`;
      }

      const replyTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { sender: "Siddhi AI", text: reply, time: replyTime, isAdmin: true }]);
    }, 700);
  };

  const fetchAgencyClients = async (email: string, currentAgencyName: string) => {
    try {
      // 1. First try agency_clients table (Supabase-persisted, admin-editable)
      const { data: dbAgencyClients, error: dbErr } = await supabase
        .from('agency_clients')
        .select('*')
        .eq('agency_email', email.toLowerCase());

      if (!dbErr && dbAgencyClients && dbAgencyClients.length > 0) {
        // Map from snake_case DB columns to camelCase ClientBrand interface
        const mapped: ClientBrand[] = dbAgencyClients.map((c: any) => ({
          id: c.id,
          businessName: c.business_name || 'Client Business',
          brandName: c.brand_name || c.business_name || '',
          category: c.category || '',
          description: c.description || '',
          website: c.website || '',
          contactName: c.contact_name || '',
          mobile: c.mobile || '',
          email: c.email || '',
          address: c.address || '',
          goals: c.goals || [],
          socialFb: c.social_fb || '',
          socialIg: c.social_ig || '',
          socialLi: c.social_li || '',
          socialYt: c.social_yt || '',
          addedAt: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          geoScore: c.geo_score || 0,
          seoScore: c.seo_score || 0,
          gbpScore: c.gbp_score || 0,
          aeoScore: c.aeo_score || 0,
          status: c.status || 'Onboarding & Audit',
          progress: c.progress || 0,
          tenureMonths: c.tenure_months || undefined,
          tenureStartDate: c.tenure_start_date || undefined,
          monthlyImpressions: c.monthly_impressions || undefined,
          monthlyClicks: c.monthly_clicks || undefined,
          ctr: c.ctr || undefined,
          conversions: undefined,
          aiCitations: c.ai_citations || undefined,
          paymentStrategy: c.payment_strategy || 'Custom Agreement',
          retainerFee: c.retainer_fee || undefined,
        }));
        setClients(mapped);
        // Also persist to localStorage as fallback cache
        localStorage.setItem(`sd_agency_clients_${email.toLowerCase()}`, JSON.stringify(mapped));
        return;
      }

      // 2. Fallback: check localStorage
      let localClients: ClientBrand[] = [];
      try {
        const stored = localStorage.getItem(`sd_agency_clients_${email.toLowerCase()}`);
        if (stored) localClients = JSON.parse(stored);
      } catch (e) {}

      if (localClients.length > 0) {
        setClients(localClients);
        return;
      }

      // 3. Fallback: derive from contact_submissions (legacy flow)
      const { data } = await supabase.from('contact_submissions').select('*');
      const dbSubmissions = data || [];

      const agencySubmissions = dbSubmissions.filter((s: any) => {
        const metaStr = s.bounty_reward || "";
        const msgStr = s.message || "";
        const orgStr = s.organization || "";
        const emailMatch = metaStr.includes(email.toLowerCase()) || s.email?.toLowerCase() === email.toLowerCase();
        const nameMatch = orgStr.includes(currentAgencyName) || msgStr.includes(currentAgencyName);
        return emailMatch || nameMatch;
      });

      const dbClients: ClientBrand[] = agencySubmissions.map((s: any) => ({
        id: s.id,
        businessName: s.organization?.replace(/\(.*?\)/g, '').trim() || s.name || "Client Business",
        brandName: s.name || s.organization || "Client Brand",
        category: s.inquiry_type || "General Business",
        description: s.message || "",
        website: "",
        contactName: s.name || "Contact Person",
        mobile: "",
        email: s.email || "",
        address: "",
        goals: [],
        addedAt: s.created_at ? s.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        geoScore: 0,
        seoScore: 0,
        gbpScore: 0,
        aeoScore: 0,
        status: s.status || "New Request",
        progress: s.progress || 0,
        tenureMonths: undefined,
        tenureStartDate: undefined,
      }));

      if (dbClients.length > 0) {
        setClients(dbClients);
      } else {
        setClients([]);
      }
    } catch (err) {
      console.error("Error fetching agency clients:", err);
    }
  };


  // ── Auth ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const email = (session.user.email || "").toLowerCase();
        setUserEmail(email);

        let curAgencyName = session.user.user_metadata?.agency_name || session.user.user_metadata?.full_name || "Agency Partner";
        let curAgencyLogo = session.user.user_metadata?.agency_logo || "";
        let hasSavedProfile = !!session.user.user_metadata?.agency_name;

        // 1. Try local storage first
        try {
          const localProf = localStorage.getItem(`sd_agency_profile_${email}`);
          if (localProf) {
            const parsed = JSON.parse(localProf);
            if (parsed.agencyName) {
              curAgencyName = parsed.agencyName;
              curAgencyLogo = parsed.agencyLogoUrl || "";
              setAgencyContact(parsed.agencyContact || "");
              setAgencyPhone(parsed.agencyPhone || "");
              setAgencyWebsite(parsed.agencyWebsite || "");
              setAgencyFb(parsed.agencyFb || "");
              setAgencyIg(parsed.agencyIg || "");
              setAgencyLi(parsed.agencyLi || "");
              setAgencyYt(parsed.agencyYt || "");
              if (Array.isArray(parsed.customSocials)) setCustomSocials(parsed.customSocials);
              hasSavedProfile = true;
            }
          }
        } catch (e) {}

        // 2. Fetch from Supabase agency_profiles table
        try {
          const { data: profile } = await supabase
            .from('agency_profiles')
            .select('*')
            .eq('user_email', email)
            .maybeSingle();

          if (profile) {
            curAgencyName = profile.agency_name || curAgencyName;
            curAgencyLogo = profile.agency_logo !== undefined && profile.agency_logo !== null ? profile.agency_logo : curAgencyLogo;
            setAgencyContact(profile.contact_person || "");
            setAgencyPhone(profile.phone || "");
            setAgencyWebsite(profile.website || "");
            setAgencyFb(profile.facebook || "");
            setAgencyIg(profile.instagram || "");
            setAgencyLi(profile.linkedin || "");
            setAgencyYt(profile.youtube || "");
            if (Array.isArray(profile.custom_socials)) setCustomSocials(profile.custom_socials);
            hasSavedProfile = true;
          }
        } catch (e) {}

        if (email === "23eg510a07@anurag.edu.in") {
          curAgencyName = "V Magnetic Minds";
          curAgencyLogo = "/v-magnetic-minds-logo.jpg";
          hasSavedProfile = true;
        }

        setAgencyName(curAgencyName);
        setAgencyLogoUrl(curAgencyLogo);

        if (!hasSavedProfile && email !== "23eg510a07@anurag.edu.in") {
          setEditAgencyName(curAgencyName);
          setEditAgencyLogo("");
          setShowBrandingModal(true);
        } else {
          setShowBrandingModal(false);
        }

        fetchAgencyClients(email, curAgencyName);
      }
      setLoading(false);
    });
  }, []);

  // ── Load invoices from Supabase whenever client selection changes ───────────
  useEffect(() => {
    if (!userEmail) return;
    const loadInvoices = async () => {
      try {
        let query = supabase
          .from('agency_invoices')
          .select('*')
          .eq('agency_email', userEmail.toLowerCase())
          .order('created_at', { ascending: false });

        // If a specific client is selected, filter by client_id
        if (selectedBrandId && selectedBrandId !== 'all') {
          query = query.eq('client_id', selectedBrandId);
        }

        const { data, error } = await query;
        if (!error && data) {
          setInvoices(data.map((inv: any) => ({
            id: inv.id,
            month: inv.month,
            amount: inv.amount,
            rawAmount: inv.raw_amount || inv.amount?.replace(/[^0-9]/g, '') || '0',
            status: inv.status || 'Pending',
            date: inv.due_date || '',
            desc: inv.description || '',
          })));
        }
      } catch (err) {
        console.error('Failed to load invoices:', err);
      }
    };
    loadInvoices();
  }, [userEmail, selectedBrandId]);


  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">Loading...</p>
    </div>
  );

  // ─── Input helper styles ───────────────────────────────────────────────────
  const inp = "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const lbl = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{agencyName} Portal | Siddhi Dynamics</title>
        <meta name="description" content={`Executive Agency Portal for ${agencyName} – 12-Month SEO, GEO, AEO & GBP Management.`} />
      </Helmet>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-36 pb-20 space-y-8">
        {/* ── Header Banner ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border border-border p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 bg-card rounded-2xl shadow-md border border-border flex items-center justify-center shrink-0 overflow-hidden">
                {agencyLogoUrl ? (
                  <img src={agencyLogoUrl} alt={`${agencyName} Logo`} className="w-full h-full object-contain p-1" />
                ) : (
                  <Building2 className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary truncate">{agencyName}</span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 shrink-0">Agency Partner</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground truncate">{agencyName} Portal</h1>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{userEmail}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
              <div className="text-right hidden lg:block mr-2">
                <div className="text-xs text-muted-foreground">
                  {selectedBrand ? selectedBrand.businessName : "Partner Agency Portfolio"}
                </div>
                <div className="text-sm font-extrabold text-primary">
                  {selectedBrand ? (selectedBrand.retainerFee || selectedBrand.paymentStrategy || "Custom Strategy") : `${clients.length} Client Brands`}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setActiveTab('clients'); setShowClientForm(true); }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Client Brand
              </button>
              <button
                type="button"
                onClick={() => { setEditAgencyName(agencyName); setEditAgencyLogo(agencyLogoUrl); setShowBrandingModal(true); }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs border border-border transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Zap className="w-4 h-4 text-primary" /> Edit Agency Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Client Back Bar & Admin Sync Badge (shown only when a client is open) ──────── */}
        {selectedBrandId !== 'all' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-border bg-muted/30 glass-card">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => { setSelectedBrandId('all'); setActiveTab('clients'); toast.info('Back to Client Portfolio'); }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted hover:bg-border border border-border text-xs font-bold text-foreground transition-all shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Client Portfolio
                </button>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tracking Client</div>
                  <div className="text-sm font-extrabold text-foreground truncate flex items-center gap-2">
                    {selectedBrand?.businessName}
                    {selectedBrand?.category && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold border border-primary/20 shrink-0">
                        {selectedBrand.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right hidden md:block shrink-0">
                <div className="text-xs text-muted-foreground">Strategy</div>
                <div className="text-sm font-extrabold text-primary">{selectedBrand?.retainerFee || selectedBrand?.paymentStrategy || 'Custom'}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-xs glass-card">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="font-bold text-foreground truncate">Admin Telemetry Sync Active</span>
                <span className="text-muted-foreground hidden sm:inline truncate">— Live scores, roadmap milestones & reports are populated directly by Admin.</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shrink-0">
                Managed by Admin
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Pending Payment Alert (only shown when there are pending invoices) ── */}
        {invoices.some(inv => inv.status === 'Pending') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/30">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Payment Pending — Action Required</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Invoice <strong>{invoices.find(i => i.status === 'Pending')?.id} ({invoices.find(i => i.status === 'Pending')?.amount})</strong> is pending.
                Go to the <button onClick={() => setActiveTab('billing')} className="underline text-primary font-semibold">Billing tab</button> to review and clear.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Tab nav grid — shown when a specific client brand is selected or navigating specific tabs ── */}
        {selectedBrandId !== 'all' && activeTab !== 'occasions' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BASE_TABS.map((tab, i) => {
              const tenureLabel = selectedBrand?.tenureMonths
                ? `${selectedBrand.tenureMonths}-Month Executive SLA`
                : 'Executive SLA & Roadmap';
              const label = tab.id === 'overview' ? tenureLabel : tab.baseLabel;
              const isActive = activeTab === tab.id;
              return (
                <motion.button key={tab.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-start gap-2 p-3.5 rounded-2xl border text-left transition-all group ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                      : 'glass-card border-border hover:border-primary/40 hover:shadow-sm'
                  }`}>
                  <div className={isActive ? 'text-primary-foreground' : 'text-primary'}>
                    {tab.icon}
                  </div>
                  <div>
                    <div className={`text-xs font-extrabold leading-tight ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                      {label}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {tab.desc}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* ── Occasions tab: always rendered when selected ── */}
        {activeTab === 'occasions' && (
          <AnimatePresence mode="wait">
            <OccasionDesignsSection
              clients={clients}
              selectedBrandId={selectedBrandId}
              agencyName={agencyName}
            />
          </AnimatePresence>
        )}

        {/* ── Tab Content ── */}
        {activeTab !== 'occasions' && (
        <AnimatePresence mode="wait">

          {/* ═══ OVERVIEW ══════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Agency High-Level Overview Header when no specific client is selected */}
              {selectedBrandId === 'all' ? (
                <div className="glass-card rounded-3xl border border-primary/30 p-6 md:p-8 bg-primary/5 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        🏬 Agency Management Dashboard
                      </span>
                      <h2 className="text-2xl font-extrabold text-foreground mt-2 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-primary" /> {agencyName} Portfolio Hub
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        Manage all agency clients, setup service strategies, track roadmap execution, and monitor delivery scores.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowClientForm(true)}
                      className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" /> Add Client Brand
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary"><Users className="w-5 h-5" /></div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Managed Clients</div>
                        <div className="text-2xl font-extrabold text-foreground">{clients.length}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500"><ShieldCheck className="w-5 h-5" /></div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Active SLAs</div>
                        <div className="text-2xl font-extrabold text-emerald-500">{clients.filter(c => c.status !== 'Locked (Tenure Expired)').length}</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500"><BarChart3 className="w-5 h-5" /></div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Avg Delivery Score</div>
                        <div className="text-2xl font-extrabold text-violet-500">
                          {clients.length > 0 ? Math.round(clients.reduce((acc, c) => acc + (c.seoScore || 75), 0) / clients.length) : 80}/100
                        </div>
                      </div>
                    </div>
                  </div>

                  {clients.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-card border border-dashed border-primary/30 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                        <Plus className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground">No Client Brands Added Yet</h3>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Add your agency clients to begin custom service execution, milestone tracking, and score updates.
                      </p>
                      <button
                        onClick={() => setShowClientForm(true)}
                        className="px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-105 transition-all shadow-md shadow-primary/20 inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add First Client Brand
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Your Client Portfolio</h3>
                        <button onClick={() => setShowClientForm(true)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">+ Add Client</button>
                      </div>
                      <ClientList
                        clients={clients}
                        selectedBrandId={selectedBrandId}
                        onSelect={(id) => { setSelectedBrandId(id); setActiveTab('overview'); toast.info(`Viewing ${clients.find(c => c.id === id)?.businessName}`); }}
                        onToggleLock={handleToggleClientLock}
                        onDelete={handleDeleteClient}
                        onInspectSeo={(id) => selectBrandAndOpenTab(id, 'seo-geo')}
                        onInspectAnalytics={(id) => selectBrandAndOpenTab(id, 'analytics')}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Specific Client Overview — shown only when a client is selected */
                <>
                  {(() => {
                    const tenure = selectedBrand?.tenureMonths;
                    const startDate = selectedBrand?.tenureStartDate;
                    const tenureLabel = tenure ? `${tenure}-Month Executive SLA` : '12-Month Executive SLA';
                    let endLabel = 'Pending Admin Setup';
                    if (startDate && tenure) {
                      const start = new Date(startDate);
                      const end = new Date(start);
                      end.setMonth(end.getMonth() + tenure);
                      endLabel = `${start.toLocaleString('default', { month: 'short', year: 'numeric' })} – ${end.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
                    }
                    const slaStatus = selectedBrand?.status === 'Locked (Tenure Expired)' ? 'Tenure Expired' : (startDate ? 'Active' : 'Pending Setup');
                    const slaColor = slaStatus === 'Active' ? 'text-emerald-500' : slaStatus === 'Tenure Expired' ? 'text-red-500' : 'text-amber-500';
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card rounded-2xl border border-primary/20 p-5 flex items-start gap-4">
                          <div className="p-2.5 bg-muted rounded-xl"><Calendar className="w-5 h-5 text-primary" /></div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plan Duration</div>
                            <div className="text-xl font-extrabold text-foreground mt-0.5">{tenure ? `${tenure} Months` : '⏳ Pending'}</div>
                            <div className="text-xs text-muted-foreground">{endLabel}</div>
                          </div>
                        </div>
                        <div className="glass-card rounded-2xl border border-blue-500/20 p-5 flex items-start gap-4">
                          <div className="p-2.5 bg-muted rounded-xl"><Users className="w-5 h-5 text-blue-500" /></div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Client Brand</div>
                            <div className="text-xl font-extrabold text-foreground mt-0.5 truncate">{selectedBrand?.businessName || '—'}</div>
                            <div className="text-xs text-muted-foreground">{selectedBrand?.category || '—'}</div>
                          </div>
                        </div>
                        <div className="glass-card rounded-2xl border border-emerald-500/20 p-5 flex items-start gap-4">
                          <div className="p-2.5 bg-muted rounded-xl"><ShieldCheck className="w-5 h-5 text-emerald-500" /></div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SLA Status</div>
                            <div className={`text-xl font-extrabold mt-0.5 ${slaColor}`}>{slaStatus}</div>
                            <div className="text-xs text-muted-foreground">{tenureLabel}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="glass-card rounded-2xl border border-primary/30 p-6 bg-primary/5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/10 pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                          ⚡ Service Quote & Billing Setup
                        </span>
                        <h3 className="text-lg font-extrabold text-foreground mt-2 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          Quotation & Payment Mode Confirmation
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Confirm quote pricing & select preferred payment terms on behalf of {selectedBrand?.businessName}.
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Retainer / Fee</div>
                        <div className="text-xl font-extrabold text-primary">
                          {selectedBrand?.retainerFee ? `₹${parseInt(selectedBrand.retainerFee).toLocaleString('en-IN')}` : '₹3,000 / month'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Payment Structure</span>
                        <p className="font-extrabold text-foreground">{selectedBrand?.paymentStrategy || "📅 Monthly Retainer SLA"}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Payment Modes Supported</span>
                        <p className="font-extrabold text-foreground">UPI · Bank Transfer (NEFT/RTGS) · Cash</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-card border border-border space-y-1">
                        <span className="text-muted-foreground font-bold uppercase text-[10px]">Verification UTR Status</span>
                        <p className="font-extrabold text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Direct Agency Settlement Active
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('billing')}
                        className="px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" /> Open Payment & Invoices
                      </button>
                      <button
                        onClick={() => toast.success(`Quotation & payment terms re-confirmed for ${selectedBrand?.businessName}`)}
                        className="px-4 py-2.5 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-xl border border-border transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Confirm Quotation Terms
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const category = (selectedBrand?.category || "").toLowerCase();
                    const isDevService = category.includes("software") || category.includes("app") || category.includes("web") || category.includes("erp") || category.includes("automation") || category.includes("ai") || category.includes("devops");
                    const isDesignService = category.includes("design") || category.includes("branding") || category.includes("ui") || category.includes("ux");

                    const roadmapTitle = isDevService
                      ? "Software & System Delivery Roadmap"
                      : isDesignService
                      ? "UI/UX & Creative Deliverables Roadmap"
                      : "SEO/GEO/AEO & Local Search Execution Roadmap";

                    const phases = isDevService
                      ? [
                          { phase: "Phase 1 · Months 1–2", title: "Architecture & Core Engine", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", tasks: ["Requirements & DB Schema", "Core API / Backend Engine", "UI Blueprint & Wireframes", "Sprint 1 Prototype Build"] },
                          { phase: "Phase 2 · Months 3–4", title: "Integrations & Business Logic", color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20", tasks: ["Third-party API Integration", "Authentication & Security Audit", "Admin & Client Dashboards", "QA & Automated Tests"] },
                          { phase: "Phase 3 · Months 5+", title: "Deployment & Scaling", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tasks: ["Production Cloud Deployment", "Performance Optimization", "Live Monitoring & Maintenance", "Feature Backlog Scaling"] }
                        ]
                      : isDesignService
                      ? [
                          { phase: "Phase 1 · Month 1", title: "Brand Identity & Research", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", tasks: ["Design Discovery & Moodboards", "Logo & Typography Tokens", "Color System & Asset Guidelines", "Figma Design System Setup"] },
                          { phase: "Phase 2 · Month 2", title: "UI/UX Prototypes", color: "text-pink-500", bg: "bg-pink-500/10 border-pink-500/20", tasks: ["High-Fidelity Wireframes", "Interactive Figma Prototype", "Usability & Accessibility Testing", "Client Design Review Signoff"] },
                          { phase: "Phase 3 · Month 3+", title: "Handoff & Design Assets", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tasks: ["Developer Component Handoff", "Vector & Raster Export Bundles", "Social & Marketing Media Kits", "Brand Guidelines Documentation"] }
                        ]
                      : [
                          { phase: "Phase 1 · Months 1–4", title: "Foundation & Audit", color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", tasks: ["GBP setup & optimisation", "Full SEO technical audit", "GEO keyword mapping", "Schema & structured data"] },
                          { phase: "Phase 2 · Months 5–8", title: "Growth & Visibility",  color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20", tasks: ["AI search (GEO) citation building", "Link acquisition campaigns", "Monthly GA reporting", "AEO featured snippet targeting"] },
                          { phase: "Phase 3 · Months 9–12", title: "Dominance & Scale",  color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tasks: ["Local Map Pack #1 defence", "Review velocity automation", "Annual analytics report", "SLA renewal & scaling review"] }
                        ];

                    return (
                      <div className="glass-card rounded-2xl border border-border p-6">
                        <h3 className="text-base font-extrabold text-foreground mb-5 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" /> {roadmapTitle}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {phases.map(p => (
                            <div key={p.phase} className={`rounded-xl border ${p.bg} p-5`}>
                              <div className={`text-[10px] font-bold uppercase tracking-wider ${p.color} mb-1`}>{p.phase}</div>
                              <div className="text-sm font-extrabold text-foreground mb-3">{p.title}</div>
                              <ul className="space-y-2">
                                {p.tasks.map(t => (
                                  <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />{t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </motion.div>
          )}

          {/* ═══ CLIENT PORTFOLIO TAB ══════════════════════════════════════ */}
          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-foreground">Client Portfolio</h3>
                <button onClick={() => setShowClientForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                  <Plus className="w-4 h-4" /> Add Client
                </button>
              </div>

              {clients.length === 0 ? (
                <div className="glass-card rounded-2xl border border-dashed border-border p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 border border-border">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-base font-extrabold text-foreground mb-2">No client brands added yet</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                    Add your clients' business details so Siddhi Dynamics can begin their SEO, GEO, AEO & GBP optimization.
                  </p>
                  <button onClick={() => setShowClientForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Add First Client Brand
                  </button>
                </div>
              ) : (
                <ClientList
                  clients={clients}
                  selectedBrandId={selectedBrandId}
                  onSelect={(id) => { setSelectedBrandId(id); setActiveTab('overview'); toast.info(`Viewing ${clients.find(c => c.id === id)?.businessName}`); }}
                  onToggleLock={handleToggleClientLock}
                  onDelete={handleDeleteClient}
                  onInspectSeo={(id) => selectBrandAndOpenTab(id, 'seo-geo')}
                  onInspectAnalytics={(id) => selectBrandAndOpenTab(id, 'analytics')}
                />
              )}
            </motion.div>
          )}

          {/* ═══ SEO / GEO ═════════════════════════════════════════════════ */}
          {activeTab === 'seo-geo' && (
            <motion.div key="seo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Selected Brand Context Header */}
              <div className="flex items-center justify-between p-4 bg-muted/60 border border-border rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <Search className="w-4 h-4 text-primary" />
                    {selectedBrand ? `Analysis for ${selectedBrand.businessName}` : "Agency Portfolio Search Analysis Benchmark"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedBrand ? `Category: ${selectedBrand.category} · Status: ${selectedBrand.status || "Active Optimization"}` : "Showing combined benchmark analysis for all client brands."}
                  </p>
                </div>
                {selectedBrand && (
                  <button onClick={() => setSelectedBrandId("all")} className="text-xs text-primary font-semibold hover:underline">
                    View All Brands
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "GEO · Generative Engine Optimisation", icon: <Bot className="w-5 h-5 text-violet-500" />, border: "border-violet-500/30", score: `${selectedBrand?.geoScore || 88} / 100`, desc: "Optimises content so AI search platforms (ChatGPT Search, Perplexity AI, Claude 3.5, Gemini) cite your brand as an authoritative answer.", items: ["ChatGPT Search citation strategy", "Perplexity AI indexing", "LLMs.txt deployment", "Brand authority schema"] },
                  { title: "SEO · Organic Search Optimisation",    icon: <Search className="w-5 h-5 text-cyan-500" />, border: "border-cyan-500/30",   score: `${selectedBrand?.seoScore || 85} / 100`, desc: "Technical + content SEO to dominate Google organic results for your target keywords.", items: ["Technical site audit", "Keyword research & mapping", "On-page optimisation", "Backlink acquisition"] },
                  { title: "AEO · Answer Engine Optimisation",     icon: <Zap className="w-5 h-5 text-amber-500" />, border: "border-amber-500/30", score: `${selectedBrand?.aeoScore || 84} / 100`, desc: "Targets featured snippets, People Also Ask, and voice search so your brand answers questions first.", items: ["FAQ schema markup", "Voice search readiness", "Featured snippet targeting", "Position Zero strategy"] },
                  { title: "GBP · Google Business Profile",        icon: <MapPin className="w-5 h-5 text-rose-500" />, border: "border-rose-500/30",  score: `${selectedBrand?.gbpScore || 92} / 100`, desc: "Full GBP setup, weekly posts, photo uploads, Q&A management, and Local Map Pack ranking.", items: ["GBP creation / optimisation", "Weekly post calendar", "Review management", "Local Map Pack tracking"] },
                ].map(card => (
                  <div key={card.title} className={`glass-card rounded-2xl border ${card.border} p-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-muted rounded-xl">{card.icon}</div>
                        <h3 className="text-sm font-extrabold text-foreground">{card.title}</h3>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">{card.score}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{card.desc}</p>
                    <ul className="space-y-2">
                      {card.items.map(item => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ ANALYTICS ═════════════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Selected Brand Context Header */}
              <div className="flex items-center justify-between p-4 bg-muted/60 border border-border rounded-2xl">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    {selectedBrand ? `GA Monthly Analytics — ${selectedBrand.businessName}` : "Agency Portfolio Combined Analytics"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedBrand ? `Website: ${selectedBrand.website || "Not set"}` : "Monthly performance statistics across all client brands."}
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-border p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-foreground mb-2">
                  {selectedBrand ? `${selectedBrand.businessName} Analytics` : "Agency Portfolio Performance"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
                  Verified tracking data for {selectedBrand ? selectedBrand.businessName : "all client brands"} updated for <strong>August 2026</strong>.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Organic Impressions", val: selectedBrand?.monthlyImpressions || null },
                    { label: "Organic Clicks",       val: selectedBrand?.monthlyClicks || null },
                    { label: "CTR %",                val: selectedBrand?.ctr || null },
                    { label: "AI Citations (GEO)",    val: selectedBrand?.aiCitations || null },
                  ].map(m => (
                    <div key={m.label} className="bg-muted rounded-xl p-4 text-center border border-border">
                      <div className={`text-2xl font-extrabold ${m.val ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                        {m.val || '—'}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</div>
                      {!m.val && <div className="text-[9px] text-amber-500 font-bold mt-1">Pending Admin Update</div>}
                    </div>
                  ))}
                </div>

                <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                  <Download className="w-4 h-4" /> Download GA PDF Monthly Summary
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ BILLING ═══════════════════════════════════════════════════ */}
          {activeTab === 'billing' && (
            <motion.div key="billing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* QR & UPI */}
                <div className="glass-card rounded-2xl border border-border p-6 flex flex-col gap-5">
                  <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" /> UPI Payment Hub
                  </h3>

                  <div className="bg-white p-3 rounded-2xl border-2 border-primary/20 shadow-md max-w-[200px] mx-auto">
                    <img src="/siddhi-upi-qr.jpg" alt="Scan to Pay" className="w-full h-full object-contain rounded-xl" />
                    <div className="text-center mt-2">
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wide">Scan & Pay</div>
                      <div className="text-[11px] font-bold text-slate-800 mt-0.5">{upiId}</div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-xl border border-border p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-semibold uppercase">UPI VPA</div>
                      <div className="text-sm font-extrabold text-foreground">{upiId}</div>
                    </div>
                    <button onClick={() => copyText(upiId, "UPI ID")}
                      className="p-2 hover:bg-border rounded-lg transition-colors">
                      {copiedKey === "UPI ID" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Open in App</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { app: 'gpay',    label: 'GPay',    bg: 'bg-white',         svg: <svg viewBox="0 0 48 48" className="w-5 h-5"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> },
                        { app: 'phonepe', label: 'PhonePe', bg: 'bg-[#5f259f]',     svg: <svg viewBox="0 0 48 48" className="w-4 h-4" fill="white"><path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm5.5 27h-3.8l-7.4-9.6V31H15V17h3.8l7.4 9.6V17H29.5v14z"/></svg> },
                        { app: 'paytm',   label: 'Paytm',   bg: 'bg-[#00BAF2]',     svg: <span className="text-white font-extrabold text-sm">P</span> },
                        { app: 'bhim',    label: 'BHIM',    bg: 'bg-gradient-to-br from-orange-500 to-green-600', svg: <span className="text-white font-extrabold text-sm">B</span> },
                      ].map(({ app, label, bg, svg }) => (
                        <a key={app} href={buildUpiLink(app)} target="_blank" rel="noopener noreferrer"
                          onClick={() => toast.info(`Opening ${label}…`)}
                          className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-muted hover:bg-border border border-border transition-all group">
                          <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shadow-sm`}>{svg}</div>
                          <span className="text-[9px] font-bold text-muted-foreground group-hover:text-foreground">{label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invoices */}
                <div className="lg:col-span-2 space-y-4">
                  {invoices.length === 0 ? (
                    <div className="glass-card rounded-2xl border border-dashed border-border p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-extrabold text-foreground">No Client Invoices Configured Yet</h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        Payment strategies (Monthly Retainer, Milestone, or Custom Project) are configured per client brand. Add a client brand to generate and track custom invoices.
                      </p>
                      <button onClick={() => { setActiveTab('clients'); setShowClientForm(true); }}
                        className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-105 transition-all inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Client Brand & Setup Strategy
                      </button>
                    </div>
                  ) : (
                    <div className="glass-card rounded-2xl border border-border p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" /> Active SLA Payment Schedule
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Showing active client invoices & payment status
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-bold">⚙ Dynamic SLA</span>
                      </div>
                      <div className="space-y-3">
                        {invoices.map(inv => (
                          <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted border border-border">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-foreground">{inv.id}</span>
                                <span className="text-xs text-muted-foreground">· {inv.month}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">{inv.desc}</p>
                              <p className="text-[11px] text-muted-foreground/60 mt-0.5">Due: {inv.date}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <div className="text-base font-extrabold text-foreground">{inv.amount}</div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  inv.status === 'Pending'  ? 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' :
                                  inv.status === 'Paid'     ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                                                               'bg-muted text-muted-foreground border border-border'
                                }`}>{inv.status}</span>
                              </div>
                              {inv.status === 'Pending' && (
                                <button onClick={() => { setSelInvoice(inv); setPayModalOpen(true); }}
                                  className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all shadow-md shadow-primary/20">
                                  <QrCode className="w-3.5 h-3.5" /> Pay Now
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick UTR */}
                  <div className="glass-card rounded-2xl border border-border p-5">
                    <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Quick UTR Submission
                    </h4>
                    <form onSubmit={handleSubmitUtr} className="flex gap-3">
                      <input type="text" placeholder="Paste UPI UTR / Transaction Reference"
                        value={utrInput} onChange={e => setUtrInput(e.target.value)}
                        className={`flex-1 ${inp}`} />
                      <button type="submit" disabled={submittingUtr}
                        className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-60 shrink-0">
                        {submittingUtr ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ CHAT ═══════════════════════════════════════════════════════ */}
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card rounded-2xl border border-border overflow-hidden flex flex-col h-[580px]">
              <div className="flex items-center justify-between px-5 py-4 bg-muted border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Siddhi AI Coordinator</p>
                    <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active · {agencyName}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">Escalations: saivaraprasad</span>
              </div>
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.isAdmin ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-sm px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      m.isAdmin ? 'bg-muted border border-border text-foreground rounded-tl-none' : 'bg-primary text-primary-foreground rounded-tr-none'
                    }`}>
                      <div className="font-bold opacity-60 text-[10px] mb-1">{m.sender}</div>
                      <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChat} className="flex gap-3 p-4 bg-muted border-t border-border">
                <input type="text" placeholder="Ask about SEO/GEO reports, billing, client onboarding…"
                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                  className={`flex-1 ${inp} bg-card`} />
                <button type="submit"
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all flex items-center gap-1.5 shrink-0">
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        )}
        {/* ── Review Us Banner ──────── */}
        <div className="pt-6">
          <GoogleReviewCard audience="client" name={agencyName} compact />
        </div>
      </main>

      {/* ════ PAY MODAL ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {payModalOpen && selInvoice && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Pay via UPI</p>
                    <p className="text-[10px] text-muted-foreground">{selInvoice.id} · {selInvoice.month}</p>
                  </div>
                </div>
                <button onClick={() => setPayModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Amount row */}
                <div className="bg-muted rounded-2xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Amount Due</div>
                    <div className="text-2xl font-extrabold text-foreground">{selInvoice.amount}</div>
                    <div className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Admin-assigned · Not editable
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground uppercase">Pay to</div>
                    <div className="text-sm font-extrabold text-primary">{upiId}</div>
                    <div className="text-[10px] text-muted-foreground">{payeeName}</div>
                  </div>
                </div>

                {/* QR + apps */}
                <div className="flex gap-4 items-start">
                  <div className="bg-white p-2.5 rounded-xl border-2 border-primary/20 shrink-0 shadow-md">
                    <img src="/siddhi-upi-qr.jpg" alt="Scan to pay" className="w-32 h-32 object-contain rounded-lg" />
                    <div className="text-[9px] font-bold text-slate-600 text-center mt-1 uppercase tracking-wide">Scan to Pay</div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-muted border border-border rounded-xl px-3 py-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary">{upiId}</span>
                      <button onClick={() => copyText(upiId, "UPI ID")} className="ml-2 text-muted-foreground hover:text-foreground">
                        {copiedKey === "UPI ID" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { app: 'gpay', label: 'Google Pay' }, { app: 'phonepe', label: 'PhonePe' },
                        { app: 'paytm', label: 'Paytm' }, { app: 'bhim', label: 'BHIM UPI' }
                      ].map(({ app, label }) => (
                        <a key={app} href={buildUpiLink(app)} target="_blank" rel="noopener noreferrer"
                          onClick={() => toast.info(`Opening ${label}…`)}
                          className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-border border border-border rounded-xl transition-all text-xs font-semibold text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-3.5 h-3.5 text-primary" />{label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* UTR form */}
                <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-border">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> After paying, paste your UTR number to confirm.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {[["Invoice", selInvoice.id], ["Amount", selInvoice.amount], ["Pay to", `${upiId} · ${payeeName}`]].map(([k, v]) => (
                      <div key={k} className={`bg-muted px-3 py-2 rounded-xl border border-border ${k === "Pay to" ? "col-span-2" : ""}`}>
                        <div className="text-muted-foreground">{k}</div>
                        <div className="font-extrabold text-foreground">{v}</div>
                      </div>
                    ))}
                  </div>
                  <input type="text" required minLength={8} placeholder="Enter 12-digit UTR / Ref Number"
                    value={utrInput} onChange={e => setUtrInput(e.target.value)} className={inp} />
                  <button type="submit" disabled={submittingUtr}
                    className="w-full py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60">
                    {submittingUtr ? <><RefreshCw className="w-4 h-4 animate-spin" /> Verifying…</> : <><Check className="w-4 h-4" /> Submit Payment Confirmation</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════ EDIT AGENCY BRANDING / SETUP PROFILE MODAL ════════════════════ */}
      <AnimatePresence>
        {showBrandingModal && (
          <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-24 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between px-6 py-4 bg-muted border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">Configure Agency Partner Profile</h3>
                    <p className="text-[10px] text-muted-foreground">Upload your agency logo, social links & company details</p>
                  </div>
                </div>
                <button onClick={() => setShowBrandingModal(false)}
                  className="w-8 h-8 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveBranding} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* 1. Basic Agency Identity */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Agency Identity & Branding
                  </h4>
                  
                  <div>
                    <label className={lbl}>Agency / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter agency or company name"
                      value={editAgencyName}
                      onChange={e => setEditAgencyName(e.target.value)}
                      className={inp}
                    />
                  </div>

                  {/* Logo File Upload */}
                  <div>
                    <label className={lbl}>Upload Agency Logo (Image File Upload) *</label>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-muted/50 border border-border">
                      <div className="w-14 h-14 bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {editAgencyLogo ? (
                          <img src={editAgencyLogo} alt="Agency Logo Preview" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Building2 className="w-6 h-6 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                        />
                        <p className="text-[10px] text-muted-foreground">Select a PNG, JPG, or SVG image file from your device.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div className="space-y-4 pt-2 border-t border-border">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Contact Details & Website
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Lead Representative Name <span className="text-destructive">*</span></label>
                      <input required placeholder="Enter full name" className={inp} value={editAgencyContact} onChange={e => setEditAgencyContact(e.target.value)} />
                    </div>
                    <div>
                      <label className={lbl}>Mobile / WhatsApp Number <span className="text-destructive">*</span></label>
                      <input required type="tel" maxLength={15} placeholder="Enter 10-digit mobile number" className={inp} value={editAgencyPhone} onChange={e => setEditAgencyPhone(e.target.value.replace(/[^0-9+\s-]/g, ''))} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={lbl}>Official Website URL</label>
                      <input placeholder="https://yourwebsite.com" className={inp} value={editAgencyWebsite} onChange={e => setEditAgencyWebsite(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 3. Social Media Links */}
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Agency Social Media Channels
                    </h4>
                    <button
                      type="button"
                      onClick={addCustomSocialChannel}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Channel
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500 shrink-0" /><input placeholder="Instagram Profile Link" className={inp} value={editAgencyIg} onChange={e => setEditAgencyIg(e.target.value)} /></div>
                    <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-600 shrink-0" /><input placeholder="LinkedIn Page Link" className={inp} value={editAgencyLi} onChange={e => setEditAgencyLi(e.target.value)} /></div>
                    <div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500 shrink-0" /><input placeholder="Facebook Page Link" className={inp} value={editAgencyFb} onChange={e => setEditAgencyFb(e.target.value)} /></div>
                    <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500 shrink-0" /><input placeholder="YouTube Channel Link" className={inp} value={editAgencyYt} onChange={e => setEditAgencyYt(e.target.value)} /></div>

                    {customSocials.map(soc => (
                      <div key={soc.id} className="flex items-center gap-2 sm:col-span-2 p-2.5 rounded-xl bg-muted/40 border border-border">
                        <input
                          type="text"
                          placeholder="Platform Name (e.g. X / TikTok / Threads)"
                          className="w-2/5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={soc.name}
                          onChange={e => updateCustomSocialChannel(soc.id, 'name', e.target.value)}
                        />
                        <input
                          type="url"
                          placeholder="https://platform.com/yourhandle"
                          className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          value={soc.url}
                          onChange={e => updateCustomSocialChannel(soc.id, 'url', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomSocialChannel(soc.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted shrink-0"
                          title="Remove Channel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-3 shrink-0">
                  <button type="button" onClick={() => setShowBrandingModal(false)} className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs hover:scale-105 transition-all shadow-md shadow-primary/20 cursor-pointer">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════ ADD CLIENT MODAL ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showClientForm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-muted border-b border-border shrink-0">
                <div>
                  <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> Add Client Brand
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Siddhi Dynamics LLP — Client Onboarding & Service Requirement</p>
                </div>
                <button onClick={() => setShowClientForm(false)}
                  className="w-9 h-9 rounded-full bg-border hover:bg-muted-foreground/20 flex items-center justify-center text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable form body */}
              <div className="overflow-y-auto flex-1 px-6 py-6" ref={formRef}>
                <form id="client-form" onSubmit={handleSaveClient} className="space-y-8">

                  {/* ▸ Services Being Availed */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Select Services Availed (Select Multiple) *
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">Tap to select all services requested for this client account. Pricing will be evaluated & assigned from the Admin Portal.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { id: "SEO, GEO & AEO Programme", label: "🚀 SEO, GEO & AEO Executive Programme" },
                        { id: "Website Development", label: "🌐 Website / Portal Development" },
                        { id: "Business Automation", label: "⚡ Business Automation & Workflows" },
                        { id: "SaaS Platform Development", label: "📱 SaaS / App Platform Development" },
                        { id: "ERP System", label: "🏢 ERP System" },
                        { id: "Google Business Profile", label: "📍 Google Business Profile & Maps" },
                        { id: "Custom Scope", label: "🤝 Custom Solution / Custom Quote" },
                      ].map((srv) => {
                        const isSel = selectedServices.includes(srv.id);
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => togglePartnerService(srv.id)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSel
                                ? "bg-primary/10 border-primary text-foreground ring-2 ring-primary/40 shadow-sm"
                                : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${isSel ? 'bg-primary text-primary-foreground font-black' : 'border border-border bg-muted'}`}>
                              {isSel ? '✓' : ''}
                            </span>
                            <span className="truncate">{srv.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* ▸ Business Information */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Business Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><input required placeholder="Business Name *" className={inp} value={clientForm.businessName} onChange={cf('businessName')} /></div>
                      <div><input placeholder="Brand Name (if different)" className={inp} value={clientForm.brandName} onChange={cf('brandName')} /></div>
                      <div><input placeholder="Business Category" className={inp} value={clientForm.category} onChange={cf('category')} /></div>
                      <div><label className={lbl}>Year of Establishment</label><input placeholder="Year of Establishment (2019)" className={inp} value={clientForm.yearEst} onChange={cf('yearEst')} /></div>
                      <div className="sm:col-span-2"><label className={lbl}>Short Business Description</label><textarea rows={2} placeholder="Briefly describe the business…" className={inp} value={clientForm.description} onChange={cf('description')} /></div>
                      <div><label className={lbl}>Website URL</label><input placeholder="https://yourwebsite.com" className={inp} value={clientForm.website} onChange={cf('website')} /></div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className={lbl}>Business Working Hours (Choose from checklist or type custom)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            "Mon–Sat: 9:00 AM – 8:00 PM",
                            "Mon–Sat: 10:00 AM – 9:00 PM",
                            "Mon–Fri: 9:00 AM – 6:00 PM",
                            "Mon–Sun: 24/7 (Always Open)",
                            "Mon–Sat: 9:30 AM – 7:30 PM",
                            "Mon–Fri: 10:00 AM – 7:00 PM"
                          ].map((preset) => {
                            const isSelected = clientForm.hours === preset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setClientForm(prev => ({ ...prev, hours: preset }))}
                                className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                                    : 'border-border bg-card text-foreground hover:bg-muted/60'
                                }`}
                              >
                                <span className="truncate">{preset}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-muted-foreground shrink-0 font-medium">Or custom hours:</span>
                          <input
                            type="text"
                            placeholder="e.g. Tue–Sun: 11:00 AM – 11:00 PM"
                            className={inp}
                            value={clientForm.hours}
                            onChange={cf('hours')}
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2"><label className={lbl}>List of Services / Products</label><textarea rows={2} placeholder="Comma-separated or one per line…" className={inp} value={clientForm.services} onChange={cf('services')} /></div>
                    </div>
                  </section>

                  {/* ▸ SLA & Payment Strategy */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Custom SLA & Pricing (Assigned by Admin)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={lbl}>Payment Strategy (Locked)</label>
                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/60 border border-border">
                          <div className="flex items-center gap-2.5">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="text-xs font-extrabold text-foreground">🤝 Custom Agreement / Admin Quote</span>
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wide">
                            Locked by Admin
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                          Note: Payment strategy is locked to Custom Agreement / Admin Quote. Pricing is assigned directly from the Admin Portal. Once submitted, your Account Executive assigns the fee, after which you can select Cash or Online payment mode.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* ▸ Contact Details */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Contact Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={lbl}>Contact Person Name *</label><input required placeholder="Enter full name" className={inp} value={clientForm.contactName} onChange={cf('contactName')} /></div>
                      <div><label className={lbl}>Mobile Number *</label><input required type="tel" maxLength={15} placeholder="Enter 10-digit mobile number" className={inp} value={clientForm.mobile} onChange={e => setClientForm(prev => ({ ...prev, mobile: e.target.value.replace(/[^0-9+\s-]/g, '') }))} /></div>
                      <div><label className={lbl}>WhatsApp Number</label><input type="tel" maxLength={15} placeholder="Enter 10-digit WhatsApp number" className={inp} value={clientForm.whatsapp} onChange={e => setClientForm(prev => ({ ...prev, whatsapp: e.target.value.replace(/[^0-9+\s-]/g, '') }))} /></div>
                      <div><label className={lbl}>Email Address</label><input type="email" placeholder="Enter official email address" className={inp} value={clientForm.email} onChange={cf('email')} /></div>
                    </div>
                  </section>

                  {/* ▸ Business Location */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Business Location
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2"><label className={lbl}>Complete Business Address</label><textarea rows={2} placeholder="Door no., Street, Area, City, State, PIN" className={inp} value={clientForm.address} onChange={cf('address')} /></div>
                      <div><label className={lbl}>Google Maps Location / Pin URL</label><input placeholder="https://maps.app.goo.gl/…" className={inp} value={clientForm.mapsLink} onChange={cf('mapsLink')} /></div>
                      <div><label className={lbl}>Landmark</label><input placeholder="Near XYZ" className={inp} value={clientForm.landmark} onChange={cf('landmark')} /></div>
                      <div className="sm:col-span-2"><label className={lbl}>Service Areas (if applicable)</label><input placeholder="Nizamabad, Hyderabad, All of Telangana" className={inp} value={clientForm.serviceAreas} onChange={cf('serviceAreas')} /></div>
                    </div>
                  </section>

                  {/* ▸ Branding Assets */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Image className="w-4 h-4" /> Branding Assets
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4 space-y-3">
                      <div>
                        <label className={lbl}>Upload Logos, Banners & Brand Assets (Select Multiple)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*,.svg,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              toast.success(`Selected ${e.target.files.length} branding file(s) for upload`);
                            }
                          }}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                        />
                      </div>
                    </div>
                  </section>

                  {/* ▸ Photos & Media */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Star className="w-4 h-4" /> Photos & Media
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4 space-y-3">
                      <div>
                        <label className={lbl}>Upload Photos & Short Videos (Select Multiple)</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              toast.success(`Selected ${e.target.files.length} photo/video file(s) for upload`);
                            }
                          }}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                        />
                      </div>
                    </div>
                  </section>

                  {/* ▸ Business Documents */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Business Documents
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4">
                      <p className="text-xs text-muted-foreground text-center">📄 Share if available: <strong>Business Brochure/Catalogue, Price List, Business Registration Certificates, Certificates & Awards</strong>.<br />Send to: <span className="text-foreground font-semibold">saivaraprasad@siddhidynamics.in</span></p>
                    </div>
                  </section>

                  {/* ▸ Social Media */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Social Media Channels
                      </h3>
                      <button
                        type="button"
                        onClick={addClientCustomSocialChannel}
                        className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Custom Channel
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500 shrink-0" /><input placeholder="Facebook Page Link" className={inp} value={clientForm.fbLink} onChange={cf('fbLink')} /></div>
                      <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500 shrink-0" /><input placeholder="Instagram Profile Link" className={inp} value={clientForm.igLink} onChange={cf('igLink')} /></div>
                      <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-600 shrink-0" /><input placeholder="LinkedIn Page Link" className={inp} value={clientForm.liLink} onChange={cf('liLink')} /></div>
                      <div className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-500 shrink-0" /><input placeholder="YouTube Channel Link" className={inp} value={clientForm.ytLink} onChange={cf('ytLink')} /></div>

                      {clientCustomSocials.map(soc => (
                        <div key={soc.id} className="flex items-center gap-2 sm:col-span-2 p-2.5 rounded-xl bg-muted/40 border border-border">
                          <input
                            type="text"
                            placeholder="Platform Name (e.g. X / TikTok / Threads / Telegram)"
                            className="w-2/5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={soc.name}
                            onChange={e => updateClientCustomSocialChannel(soc.id, 'name', e.target.value)}
                          />
                          <input
                            type="url"
                            placeholder="https://platform.com/yourhandle"
                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            value={soc.url}
                            onChange={e => updateClientCustomSocialChannel(soc.id, 'url', e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeClientCustomSocialChannel(soc.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ▸ Business Credibility */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Business Credibility
                    </h3>
                    <div className="bg-muted rounded-xl border border-dashed border-border p-4 space-y-3">
                      <div>
                        <label className={lbl}>Customer Testimonials & Reviews File Upload (Doc, Image, Video — Multiple Files Allowed)</label>
                        <p className="text-[11px] text-muted-foreground mb-2">Upload client review screenshots, video testimonials, PDF recommendation letters, or document files.</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              toast.success(`Selected ${e.target.files.length} testimonial / review file(s) for upload`);
                            }
                          }}
                          className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                        />
                      </div>
                    </div>
                  </section>

                  {/* ▸ Business Goal */}
                  <section>
                    <h3 className="text-xs font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4" /> Business Goal
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">Select your primary objectives (choose all that apply):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {BUSINESS_GOALS.map(g => (
                        <button key={g} type="button" onClick={() => toggleGoal(g)}
                          className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            selectedGoals.includes(g)
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                              : 'bg-muted border-border text-muted-foreground hover:border-primary/40'
                          }`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </section>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted border-t border-border flex gap-3 shrink-0">
                <button type="submit" form="client-form" disabled={savingClient}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl hover:scale-[1.01] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60">
                  {savingClient ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : <><Check className="w-4 h-4" /> Save Client Brand</>}
                </button>
                <button type="button" onClick={() => setShowClientForm(false)}
                  className="px-5 py-3 border border-border text-muted-foreground hover:text-foreground font-semibold text-sm rounded-xl hover:border-primary/40 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
