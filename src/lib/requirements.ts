import { supabase } from "@/integrations/supabase/client";

export const REQUIREMENT_STATUSES = [
  "Submitted",
  "In Review",
  "Clarification Needed",
  "Approved",
  "In Progress",
  "Delivered",
  "Closed",
  "Rejected",
] as const;

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const REQUIREMENT_TYPES = ["Website", "SaaS", "ERP", "Automation", "SEO", "Other"] as const;
export const REQUIREMENT_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export const CLIENT_STATUSES = ["Lead", "Active", "Paused", "Churned"] as const;
export const CLIENT_TIERS = ["Standard", "Growth", "Enterprise"] as const;

export interface ClientRecord {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  phone: string | null;
  industry: string | null;
  website: string | null;
  status: string;
  tier: string;
  owner_email: string | null;
  agency_email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequirementRecord {
  id: string;
  client_id: string | null;
  title: string;
  description: string;
  req_type: string;
  priority: string;
  status: string;
  progress: number;
  budget_range: string | null;
  estimated_value: number | null;
  target_date: string | null;
  submitted_by_email: string;
  assigned_to_email: string | null;
  agency_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequirementMessage {
  id: string;
  requirement_id: string;
  sender_email: string;
  sender_role: string;
  message: string;
  created_at: string;
}

export interface RequirementEvent {
  id: string;
  requirement_id: string;
  actor_email: string;
  event_type: string;
  from_value: string | null;
  to_value: string | null;
  note: string | null;
  created_at: string;
}

export const statusTone: Record<string, string> = {
  Submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "In Review": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Clarification Needed": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Approved: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "In Progress": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Closed: "bg-white/5 text-muted-foreground border-white/10",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const priorityTone: Record<string, string> = {
  Low: "bg-white/5 text-muted-foreground border-white/10",
  Medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const db = supabase as any;

export const requirementsApi = {
  async listClients(filter?: { agencyEmail?: string }) {
    let query = db.from("clients").select("*").order("created_at", { ascending: false });
    if (filter?.agencyEmail) query = query.ilike("agency_email", filter.agencyEmail);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ClientRecord[];
  },

  async upsertClient(payload: Partial<ClientRecord>) {
    const { data, error } = payload.id
      ? await db.from("clients").update(payload).eq("id", payload.id).select().maybeSingle()
      : await db.from("clients").insert(payload).select().maybeSingle();
    if (error) throw error;
    return data as ClientRecord;
  },

  async deleteClient(id: string) {
    const { error } = await db.from("clients").delete().eq("id", id);
    if (error) throw error;
  },

  async listRequirements() {
    const { data, error } = await db
      .from("requirements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as RequirementRecord[];
  },

  async createRequirement(payload: Partial<RequirementRecord>) {
    const { data, error } = await db.from("requirements").insert(payload).select().maybeSingle();
    if (error) throw error;
    return data as RequirementRecord;
  },

  async updateRequirement(id: string, payload: Partial<RequirementRecord>) {
    const { data, error } = await db.from("requirements").update(payload).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data as RequirementRecord;
  },

  async listMessages(requirementId: string) {
    const { data, error } = await db
      .from("requirement_messages")
      .select("*")
      .eq("requirement_id", requirementId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []) as RequirementMessage[];
  },

  async sendMessage(payload: { requirement_id: string; sender_email: string; sender_role: string; message: string }) {
    const { error } = await db.from("requirement_messages").insert(payload);
    if (error) throw error;
  },

  async listEvents(requirementId: string) {
    const { data, error } = await db
      .from("requirement_events")
      .select("*")
      .eq("requirement_id", requirementId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as RequirementEvent[];
  },

  async logEvent(payload: {
    requirement_id: string;
    actor_email: string;
    event_type: string;
    from_value?: string | null;
    to_value?: string | null;
    note?: string | null;
  }) {
    const { error } = await db.from("requirement_events").insert(payload);
    if (error) console.warn("Requirement event log skipped:", error.message);
  },

  async pipelineSummary() {
    const { data, error } = await db.rpc("requirement_pipeline_summary");
    if (error) throw error;
    return (data || []) as { status: string; requirement_count: number; total_value: number; avg_progress: number }[];
  },
};
