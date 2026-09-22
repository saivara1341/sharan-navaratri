import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  UserPlus, 
  Trash2, 
  RefreshCw, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  Handshake, 
  Users, 
  Check, 
  X,
  Landmark,
  ShieldCheck,
  CreditCard,
  DollarSign
} from "lucide-react";
import { assignRoleToEmail, deleteAssignedRole, getAssignedRoles, PortalRole } from "@/lib/roleResolver";
import { internshipService } from "@/services/internshipService";
import { employeeSalaryService, EmployeeBankingDetails } from "@/services/employeeSalaryService";

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
  agencyEmails?: string[];
}

export function AdminUserInvitePanel({ agencyEmails = [] }: AdminUserInvitePanelProps) {
  const [entries, setEntries] = useState<PreassignedEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<PortalRole>("client");
  const [linkedAgency, setLinkedAgency] = useState("");
  const [commissionPct, setCommissionPct] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Employee Banking state
  const [bankingRecords, setBankingRecords] = useState<EmployeeBankingDetails[]>([]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      // 1. Get from unified role resolver (persisted locally & in Supabase)
      const localRoles = getAssignedRoles();
      const mappedLocal: PreassignedEntry[] = localRoles.map(r => ({
        id: r.id,
        email: r.email,
        role: r.role,
        notes: r.notes || null,
        linked_agency_email: null,
        commission_pct: null,
        added_by: 'admin',
        added_at: r.assigned_at,
        applied_at: r.status === 'active' ? r.assigned_at : null
      }));

      // 2. Try fetching from Supabase admin_preassigned_roles
      try {
        const { data } = await (supabase as any)
          .from("admin_preassigned_roles")
          .select("*")
          .order("added_at", { ascending: false });

        if (data && data.length > 0) {
          // Merge unique emails
          const seen = new Set(data.map((d: any) => d.email.toLowerCase()));
          const combined = [...data, ...mappedLocal.filter(l => !seen.has(l.email.toLowerCase()))];
          setEntries(combined);
        } else {
          setEntries(mappedLocal);
        }
      } catch {
        setEntries(mappedLocal);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadBanking = () => {
    setBankingRecords(employeeSalaryService.getAllBankingDetails());
  };

  useEffect(() => { 
    fetchEntries();
    loadBanking();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !role) {
      toast.error("Email and role are required.");
      return;
    }
    setSaving(true);
    try {
      // 1. Assign in local role resolver (syncs immediately for Google OAuth auto-login)
      assignRoleToEmail(cleanEmail, role, cleanEmail.split('@')[0], notes.trim() || undefined);

      // 2. If intern or employee, add to whitelist
      if (role === 'intern' || role === 'employee') {
        internshipService.addWhitelistedEmail(cleanEmail, cleanEmail.split('@')[0], role, notes.trim() || undefined);
      }

      // 3. Persist to Supabase admin_preassigned_roles
      try {
        await (supabase as any)
          .from("admin_preassigned_roles")
          .upsert({
            email: cleanEmail,
            role,
            notes: notes.trim() || null,
            added_by: "admin",
            linked_agency_email: (role === "client" && linkedAgency) ? linkedAgency.trim().toLowerCase() : null,
            commission_pct: (role === "agency" && commissionPct) ? parseFloat(commissionPct) : null,
            added_at: new Date().toISOString()
          }, { onConflict: "email" });
      } catch (_) {}

      toast.success(`Role '${role}' assigned to ${cleanEmail}. When they click "Continue with Google", they will be identified automatically!`);
      setEmail(""); 
      setRole("client"); 
      setNotes(""); 
      setLinkedAgency(""); 
      setCommissionPct("");
      fetchEntries();
    } catch (err: any) {
      toast.error(err.message || "Could not save role assignment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, entryEmail: string) => {
    if (!window.confirm(`Remove role assignment for ${entryEmail}?`)) return;
    try {
      deleteAssignedRole(id);
      try {
        await (supabase as any).from("admin_preassigned_roles").delete().eq("email", entryEmail.toLowerCase());
      } catch (_) {}
      setEntries(prev => prev.filter(e => e.id !== id && e.email.toLowerCase() !== entryEmail.toLowerCase()));
      toast.success("Role assignment removed.");
    } catch (err: any) {
      toast.error(err.message || "Could not delete.");
    }
  };

  const handleVerifyBanking = (id: string, empName: string) => {
    employeeSalaryService.updateBankingStatus(id, 'Verified for Salary');
    loadBanking();
    toast.success(`Bank details verified for ${empName}! Ready for salary disbursement.`);
  };

  const handleDisburseSalary = (b: EmployeeBankingDetails) => {
    const amountStr = prompt(`Enter salary amount to disburse to ${b.employee_name} (${b.bank_name} - ${b.account_number}):`, "45000");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount.");
      return;
    }

    const ref = prompt("Enter bank transaction reference number (UTR/NEFT/IMPS):", `TXN-${Date.now()}`);
    if (!ref) return;

    employeeSalaryService.recordPayout({
      employee_email: b.employee_email,
      employee_name: b.employee_name,
      amount,
      pay_period: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      transaction_ref: ref,
      payment_method: 'NEFT/RTGS',
      disbursed_by: 'Founder & CEO Sai Vara Prasad',
      notes: 'Monthly engineering compensation'
    });

    toast.success(`Salary payout of ₹${amount.toLocaleString()} logged for ${b.employee_name}!`);
    loadBanking();
  };

  return (
    <div className="space-y-8">
      {/* ── 1. ROLE ASSIGNMENT FORM (GOOGLE OAUTH IDENTIFICATION) ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <UserPlus className="w-4 h-4 adm-olive-accent" />
            Assign Role to Email (Auto Google Login Identification)
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--adm-text-secondary)" }}>
          When this person clicks <strong>"Continue with Google"</strong>, their role will be automatically grasped and they will be routed directly to their designated portal.
        </p>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="adm-form-group">
            <label className="adm-label">Email Address *</label>
            <input
              className="adm-input"
              type="email"
              placeholder="user@example.com or user@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="adm-form-group">
            <label className="adm-label">Designated Portal Role *</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {ROLES.map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id as PortalRole)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    role === r.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {role === "client" && agencyEmails.length > 0 && (
            <div className="adm-form-group">
              <label className="adm-label">Link to Agency (Optional)</label>
              <select
                className="adm-input"
                value={linkedAgency}
                onChange={e => setLinkedAgency(e.target.value)}
              >
                <option value="">None (Independent Client)</option>
                {agencyEmails.map(ae => (
                  <option key={ae} value={ae}>{ae}</option>
                ))}
              </select>
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
            <label className="adm-label">Remarks / Internal Notes (Optional)</label>
            <input
              className="adm-input"
              type="text"
              placeholder="e.g. Business Development intern joining 6-month cohort"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : "Assign & Whitelist Role"}
            </button>
          </div>
        </form>
      </div>

      {/* ── 2. PREASSIGNED ROLES TABLE ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <Users className="w-4 h-4 adm-olive-accent" /> Assigned Portal Users ({entries.length})
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
            <div className="adm-empty-msg">No assigned roles yet. Add an email above.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email Address</th>
                  <th>Grasped Role</th>
                  <th>Google Login Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-xs font-bold text-foreground">{e.email}</td>
                    <td>
                      <span className={`adm-badge-role ${e.role}`}>{e.role}</span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5" /> Auto-Identified
                      </span>
                    </td>
                    <td className="text-xs" style={{ color: "var(--adm-text-muted)" }}>
                      {e.notes || "—"}
                    </td>
                    <td>
                      <button
                        className="adm-btn adm-btn-danger adm-btn-sm"
                        onClick={() => handleDelete(e.id, e.email)}
                        title="Remove role"
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

      {/* ── 3. EMPLOYEE SALARY & BANKING CREDENTIALS REGISTRY ── */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" /> Employee Banking & Salary Disbursement
          </span>
          <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={loadBanking}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--adm-text-secondary)" }}>
          Bank account and payment details submitted by employees for monthly payroll disbursement by Siddhi Dynamics LLP.
        </p>

        {bankingRecords.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">🏦</div>
            <div className="adm-empty-msg">No employee banking records submitted yet.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Bank Name & Branch</th>
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>UPI / PAN</th>
                  <th>Status</th>
                  <th>Salary Actions</th>
                </tr>
              </thead>
              <tbody>
                {bankingRecords.map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong className="text-foreground block text-xs">{b.account_holder_name || b.employee_name}</strong>
                      <span className="text-[11px] text-muted-foreground">{b.employee_email}</span>
                    </td>
                    <td className="text-xs text-foreground">
                      <strong>{b.bank_name}</strong>
                      {b.branch_name && <span className="block text-[11px] text-muted-foreground">{b.branch_name}</span>}
                    </td>
                    <td className="font-mono text-xs text-foreground font-bold">{b.account_number}</td>
                    <td className="font-mono text-xs text-primary font-bold">{b.ifsc_code}</td>
                    <td className="text-xs">
                      {b.upi_id && <span className="block text-emerald-400 font-mono text-[11px]">{b.upi_id}</span>}
                      {b.pan_number && <span className="block text-muted-foreground font-mono text-[11px]">PAN: {b.pan_number}</span>}
                      {!b.upi_id && !b.pan_number && "—"}
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Verified for Salary' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {b.status !== 'Verified for Salary' && (
                          <button
                            className="adm-btn adm-btn-secondary adm-btn-sm text-xs"
                            onClick={() => handleVerifyBanking(b.id, b.employee_name)}
                            title="Verify bank details"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verify
                          </button>
                        )}
                        <button
                          className="adm-btn adm-btn-primary adm-btn-sm text-xs"
                          onClick={() => handleDisburseSalary(b)}
                          title="Record salary payout"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Disburse Salary
                        </button>
                      </div>
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
