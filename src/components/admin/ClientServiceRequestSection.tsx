import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Layers,
  Send,
  Sparkles,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { requirementsApi, REQUIREMENT_TYPES } from "@/lib/requirements";
import { generateInvoiceId, serializeProjectMeta } from "@/lib/projectLifecycleHelper";
import { ProjectInvoice, DEFAULT_BANK_ACCOUNTS, DEFAULT_BANKING_DETAILS } from "@/types/projectLifecycle";

interface ClientServiceRequestSectionProps {
  adminEmail: string;
  onServiceOrderCreated?: () => void;
}

const SERVICE_TIERS = [
  {
    id: "AI",
    title: "Deep-Tech AI & LLM Systems",
    desc: "Autonomous Agentic Workflows, Custom LLM fine-tuning, RAG pipelines, and high-performance inference.",
    badge: "Most Popular",
    suggestedBudget: 150000
  },
  {
    id: "SaaS",
    title: "Enterprise Cloud & SaaS Architecture",
    desc: "Multi-tenant platforms, Edge Workers, Supabase/PostgreSQL, distributed microservices, and 99.98% SLA.",
    badge: "Scale-Ready",
    suggestedBudget: 200000
  },
  {
    id: "ERP",
    title: "Custom ERP & Operations Suite",
    desc: "End-to-end business operations, inventory, client billing, custom reporting, and automated governance.",
    badge: "Enterprise",
    suggestedBudget: 250000
  },
  {
    id: "Website",
    title: "High-Performance Web & Mobile Apps",
    desc: "Production React/Vite web apps, mobile-ready PWAs, pixel-perfect UX, and lightning-fast edge CDN.",
    badge: "Fast Delivery",
    suggestedBudget: 75000
  },
  {
    id: "Automation",
    title: "Business Process Automation & Bots",
    desc: "Custom webhook connectors, CRM syncing, automated invoice dispatch, and scheduled data extraction.",
    badge: "High ROI",
    suggestedBudget: 60000
  }
];

export const ClientServiceRequestSection: React.FC<ClientServiceRequestSectionProps> = ({
  adminEmail,
  onServiceOrderCreated
}) => {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [industry, setIndustry] = useState("Technology & Software");
  const [selectedService, setSelectedService] = useState<string>("AI");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [budget, setBudget] = useState<number>(150000);
  const [targetDate, setTargetDate] = useState("");
  const [sharedSpecs, setSharedSpecs] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [generateInitialInvoice, setGenerateInitialInvoice] = useState(true);
  const [advancePercentage, setAdvancePercentage] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !contactEmail.trim()) {
      toast.error("Please enter company name, contact person, and contact email.");
      return;
    }
    if (!projectTitle.trim() || !projectDescription.trim()) {
      toast.error("Please provide a project title and service scope description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const emailNormalized = contactEmail.trim().toLowerCase();

      // 1. Upsert Client in requirements database
      const client = await requirementsApi.upsertClient({
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        contact_email: emailNormalized,
        phone: contactPhone.trim() || null,
        industry: industry || null,
        status: "Active",
        tier: budget >= 200000 ? "Enterprise" : budget >= 100000 ? "Growth" : "Standard",
        owner_email: adminEmail.toLowerCase(),
      });

      // 2. Create Requirement record in database
      const requirement = await requirementsApi.createRequirement({
        client_id: client.id,
        title: projectTitle.trim(),
        description: `${projectDescription.trim()}\n\n---\nShared Data & Specifications:\n${sharedSpecs.trim() || 'None provided'}\nRepository: ${repositoryUrl.trim() || 'None provided'}`,
        req_type: selectedService,
        priority: "High",
        status: "Approved",
        progress: 10,
        budget_range: `₹${budget.toLocaleString('en-IN')}`,
        estimated_value: budget,
        target_date: targetDate || null,
        submitted_by_email: emailNormalized,
        assigned_to_email: adminEmail.toLowerCase(),
      });

      // 3. Prepare initial invoice if toggled
      const invoices: ProjectInvoice[] = [];
      if (generateInitialInvoice && budget > 0) {
        const advanceAmount = Math.round((budget * advancePercentage) / 100);
        invoices.push({
          id: generateInvoiceId(0),
          title: `Milestone 1 Advance: ${projectTitle.trim()}`,
          amount: `₹${advanceAmount.toLocaleString('en-IN')}`,
          numeric_amount: advanceAmount,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'unpaid',
          description: `${advancePercentage}% mobilization advance for initiation of ${projectTitle.trim()}`,
          verification_status: 'none',
          category: selectedService,
          agreed_total_value: budget,
          payment_terms: `${advancePercentage}% Advance, remainder on milestone delivery`
        });
      }

      // 4. Create metadata block
      const lifecycleMeta = {
        package_type: selectedService,
        service_tier: budget >= 200000 ? "Enterprise" : "Standard",
        invoices,
        selectedServices: [selectedService],
        bankingDetails: DEFAULT_BANKING_DETAILS,
        bankAccounts: DEFAULT_BANK_ACCOUNTS,
        shared_materials: {
          specs: sharedSpecs.trim() || null,
          repository: repositoryUrl.trim() || null
        }
      };

      // 5. Insert into contact_submissions for client portal visibility & invoice tracking
      const structuredMessage = `### Service Order: ${projectTitle.trim()}
**Company:** ${companyName.trim()}
**Contact:** ${contactName.trim()} (${contactPhone.trim() || 'N/A'})
**Service Tier:** ${selectedService}
**Agreed Budget:** ₹${budget.toLocaleString('en-IN')}
**Scope & Deliverables:**
${projectDescription.trim()}

**Shared Specifications & Repository:**
- Repo: ${repositoryUrl.trim() || 'N/A'}
- Specs / Docs: ${sharedSpecs.trim() || 'N/A'}`;

      const { error: subError } = await supabase.from('contact_submissions').insert({
        name: contactName.trim(),
        email: emailNormalized,
        organization: companyName.trim(),
        designation: industry || 'Client Partner',
        inquiry_type: 'requirement',
        message: structuredMessage,
        status: 'Approved',
        progress: 15,
        bounty_reward: serializeProjectMeta(lifecycleMeta as any)
      });

      if (subError) throw subError;

      // 6. Ensure client profile is in portal_users
      try {
        await (supabase as any).from('portal_users').upsert({
          email: emailNormalized,
          name: contactName.trim(),
          organization: companyName.trim(),
          designation: industry || 'Client Partner',
          role: 'client',
          confirmed: true,
          updated_at: new Date().toISOString()
        }, { onConflict: 'email' });
      } catch (_) {}

      toast.success(`Service order created for ${companyName}! Project and invoice initialized.`);

      // Reset form
      setCompanyName("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setProjectTitle("");
      setProjectDescription("");
      setSharedSpecs("");
      setRepositoryUrl("");

      if (onServiceOrderCreated) {
        onServiceOrderCreated();
      }
    } catch (err: any) {
      console.error("[ClientServiceRequestSection] Error:", err);
      toast.error(err.message || "Could not create service order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border border-primary/25 relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Service Request & Project Intake
          </span>
          <h2 className="text-2xl lg:text-3xl font-black text-foreground">
            Request Services & Commission New Projects
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Submit service requirements, define project deliverables, configure payment milestones, and immediately issue digitally-authenticated SBI invoices with Section 65B IT Act 2000 verification.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
        {/* Step 1: Client & Organization Details */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">1. Client & Organization Credentials</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Company / Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Innovations Pvt Ltd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Sharma"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                required
                placeholder="rajesh@acme.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Select Service Category */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">2. Select Service Category & Architecture Tier</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICE_TIERS.map((tier) => {
              const isSelected = selectedService === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => {
                    setSelectedService(tier.id);
                    if (budget === 150000 || budget === tier.suggestedBudget) {
                      setBudget(tier.suggestedBudget);
                    }
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all text-left flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/15"
                      : "border-border/80 bg-card/60 hover:bg-muted/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-foreground">{tier.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary">
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tier.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Recommended Tier</span>
                    <span className="font-bold text-emerald-400">₹{tier.suggestedBudget.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Project Scope & Deliverables */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">3. Scope of Deliverables & Requirements</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Real-Time Multi-Agent Customer Support & ERP Integration"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Detailed Scope of Work & Deliverables *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Detail technical requirements, expected features, API integrations, target user journeys, database schemas, and performance criteria..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Commercials, Invoicing & Bank Settlement */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-foreground">4. Commercial Agreement & Invoice Generation</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Total Agreed Project Value (₹ INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={budget || ""}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  autoComplete="off"
                  className="w-full bg-card border border-border text-foreground rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Target Delivery Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Advance Percentage
              </label>
              <select
                value={advancePercentage}
                onChange={(e) => setAdvancePercentage(Number(e.target.value))}
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value={30}>30% Advance Mobilization</option>
                <option value={50}>50% Advance Mobilization (Standard)</option>
                <option value={70}>70% Major Phase Delivery</option>
                <option value={100}>100% Complete Upfront Settlement</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={generateInitialInvoice}
                onChange={(e) => setGenerateInitialInvoice(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/40 bg-card"
              />
              <span className="text-xs font-semibold text-foreground">
                Generate Section 65B digital invoice for Milestone 1 advance (₹{Math.round((budget * advancePercentage) / 100).toLocaleString('en-IN')}) immediately upon creation
              </span>
            </label>
          </div>
        </div>

        {/* Step 5: Shared Technical Assets & Data */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">5. Data Which Client Wants to Share Regarding Availed Services</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Repository / Codebase Access URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/organization/repo"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                Figma / API Docs / Cloud Storage Links
              </label>
              <input
                type="text"
                placeholder="https://figma.com/file/... or Drive URL"
                value={sharedSpecs}
                onChange={(e) => setSharedSpecs(e.target.value)}
                autoComplete="off"
                className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct SBI Settlement Coordinates: A/C 45170121323 · IFSC SBIN0021632</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>Processing Service Order...</>
            ) : (
              <>
                <Send className="w-4 h-4" /> Commission & Submit Service Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
