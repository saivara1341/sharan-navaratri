import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Trash2, RefreshCw, Building2, GraduationCap, Briefcase, TrendingUp, Handshake, Users, Pencil, Check, X } from "lucide-react";

const ROLES = [
  { id: "client",   label: "Client",   icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: "agency",   label: "Agency",   icon: <Handshake className="w-3.5 h-3.5" /> },
  { id: "employee", label: "Employee", icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: "intern",   label: "Intern",   icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { id: "investor", label: "Investor", icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

interface PreassignedEntry {
  id: string;
  email: string;
  role: string;
  notes: string | null;
  linked_agency_email: string | null;
  commission_pct: number | null;
  added_by: string;
  added_at: string;
  applied_at: string | null;
}

interface AdminUserInvitePanelProps {
  /** List of agency emails already in the system for the "link to agency" dropdown */
  agencyEmails?: string[];
}

export function AdminUserInvitePanel({ agencyEmails = [] }: AdminUserInvitePanelProps) {
  const [entries, setEntries] = useState<PreassignedEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [linkedAgency, setLinkedAgency] = useState("");
  const [commissionPct, setCommissionPct] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // Must call via Edge Function / service_role because the table is restricted
      const { data, error } = await supabase.functions.invoke("admin-user-management", {
        body: { action: "list_preassigned_roles" },
      });
      if (error) throw error;
      setEntries((data as any)?.roles || []);
    } catch (err: any) {
      // Fallback: try direct select (only works if admin JWT has service_role)
      console.warn("[AdminUserInvitePanel] Edge fn fallback:", err.message);
      try {
        const { data, error: dbErr } = await (supabase as any)
          .from("admin_preassigned_roles")
          .select("*")
          .order("added_at", { ascending: false });
        if (!dbErr) setEntries(data || []);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !role) {
      toast.error("Email and role are required.");
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        email: cleanEmail,
        role,
        notes: notes.trim() || null,
        added_by: "admin",
      };
      if (role === "client" && linkedAgency) payload.linked_agency_email = linkedAgency.trim().toLowerCase();
      if (role === "agency" && commissionPct) payload.commission_pct = parseFloat(commissionPct);

      const { error } = await supabase.functions.invoke("admin-user-management", {
        body: { action: "upsert_preassigned_role", ...payload },
      });
      if (error) throw error;
      toast.success(`Preassigned ${role} role for ${cleanEmail}`);
      setEmail(""); setRole("client"); setNotes(""); setLinkedAgency(""); setCommissionPct("");
      fetchEntries();
    } catch (err: any) {
      // Fallback direct insert (admin session)
      try {
        const payload: any = {
          email: email.trim().toLowerCase(),
          role,
          notes: notes.trim() || null,
          added_by: "admin",
          linked_agency_email: (role === "client" && linkedAgency) ? linkedAgency.trim().toLowerCase() : null,
          commission_pct: (role === "agency" && commissionPct) ? parseFloat(commissionPct) : null,
        };
        const { error: dbErr } = await (supabase as any)
          .from("admin_preassigned_roles")
          .upsert(payload, { onConflict: "email" });
        if (dbErr) throw dbErr;
        toast.success(`Preassigned ${role} role for ${email.trim()}`);
        setEmail(""); setRole("client"); setNotes(""); setLinkedAgency(""); setCommissionPct("");
        fetchEntries();
      } catch (fbErr: any) {
        toast.error(fbErr.message || "Could not save preassigned role.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, entryEmail: string) => {
    if (!window.confirm(`Remove preassigned role for ${entryEmail}?`)) return;
    try {
      const { error } = await (supabase as any)
        .from("admin_preassigned_roles")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== id));
      toast.success("Removed.");
    } catch (err: any) {
      toast.error(err.message || "Could not delete.");
    }
  };

  return (
    <div>
      {/* Add Form */}
      <div className="adm-card mb-6">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <UserPlus className="w-4 h-4 adm-olive-accent" />
            Pre-Register a User by Email
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--adm-text-secondary)" }}>
          When this person signs in via Google OAuth for the first time, they will be automatically
          assigned the selected role — no role-selection screen shown.
        </p>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="adm-form-group">
            <label className="adm-label">Email Address *</label>
            <input
              className="adm-input"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Assign Role *</label>
            <select
              className="adm-input adm-select"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {role === "client" && (
            <div className="adm-form-group">
              <label className="adm-label">Link to Agency (Billing POC, optional)</label>
              {agencyEmails.length > 0 ? (
                <select
                  className="adm-input adm-select"
                  value={linkedAgency}
                  onChange={e => setLinkedAgency(e.target.value)}
                >
                  <option value="">— Direct Client (no agency) —</option>
                  {agencyEmails.map(ae => (
                    <option key={ae} value={ae}>{ae}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="adm-input"
                  type="email"
                  placeholder="agency@example.com (optional)"
                  value={linkedAgency}
                  onChange={e => setLinkedAgency(e.target.value)}
                />
              )}
            </div>
          )}

          {role === "agency" && (
            <div className="adm-form-group">
              <label className="adm-label">Commission % (0–100)</label>
              <input
                className="adm-input"
                type="number"
                min={0}
                max={100}
                step={0.5}
                placeholder="e.g. 15"
                value={commissionPct}
                onChange={e => setCommissionPct(e.target.value)}
              />
            </div>
          )}

          <div className="adm-form-group md:col-span-2">
            <label className="adm-label">Notes (internal, optional)</label>
            <input
              className="adm-input"
              type="text"
              placeholder="e.g. Referred by XYZ Agency, Nellore client"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : "Add Preassigned Role"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <Users className="w-4 h-4 adm-olive-accent" /> Preassigned Roles
          </span>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={fetchEntries} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg adm-shimmer" />)}
          </div>
        ) : entries.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📋</div>
            <div className="adm-empty-msg">No preassigned roles yet. Add one above.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Linked Agency</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-xs">{e.email}</td>
                    <td>
                      <span className={`adm-badge-role ${e.role}`}>{e.role}</span>
                    </td>
                    <td className="text-xs" style={{ color: "var(--adm-text-secondary)" }}>
                      {e.linked_agency_email || "—"}
                    </td>
                    <td className="text-xs" style={{ color: "var(--adm-gold)" }}>
                      {e.commission_pct != null ? `${e.commission_pct}%` : "—"}
                    </td>
                    <td>
                      {e.applied_at ? (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--adm-olive-light)" }}>
                          <Check className="w-3 h-3" /> Applied
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--adm-gold)" }}>Pending sign-in</span>
                      )}
                    </td>
                    <td className="text-xs" style={{ color: "var(--adm-text-muted)" }}>
                      {e.notes || "—"}
                    </td>
                    <td>
                      <button
                        className="adm-btn adm-btn-danger adm-btn-sm"
                        onClick={() => handleDelete(e.id, e.email)}
                        title="Remove preassigned role"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
