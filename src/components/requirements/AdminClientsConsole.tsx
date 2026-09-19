import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Loader2, Plus, Building2, Trash2, Pencil, LayoutGrid, List, X } from "lucide-react";
import {
  CLIENT_STATUSES,
  CLIENT_TIERS,
  REQUIREMENT_STATUSES,
  requirementsApi,
  statusTone,
  type ClientRecord,
  type RequirementRecord,
} from "@/lib/requirements";
import { RequirementCard } from "./RequirementCard";
import { RequirementDetail } from "./RequirementDetail";
import { RequirementForm } from "./RequirementForm";

const emptyClient: Partial<ClientRecord> = {
  company_name: "", contact_name: "", contact_email: "", phone: "", industry: "",
  website: "", status: "Lead", tier: "Standard", notes: "",
};

export const AdminClientsConsole = ({ adminEmail }: { adminEmail: string }) => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [requirements, setRequirements] = useState<RequirementRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"board" | "list">("board");
  const [editing, setEditing] = useState<Partial<ClientRecord> | null>(null);
  const [savingClient, setSavingClient] = useState(false);
  const [openRequirement, setOpenRequirement] = useState<RequirementRecord | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, r] = await Promise.all([requirementsApi.listClients(), requirementsApi.listRequirements()]);
      setClients(c);
      setRequirements(r);
    } catch (err: any) {
      toast.error(err.message || "Could not load clients and requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.company_name;

  const filteredRequirements = useMemo(() => {
    const term = search.trim().toLowerCase();
    return requirements.filter((r) => {
      const matchesTerm = !term
        || r.title.toLowerCase().includes(term)
        || r.description.toLowerCase().includes(term)
        || (clientName(r.client_id) || "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirements, search, statusFilter, clients]);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      c.company_name.toLowerCase().includes(term)
      || c.contact_name.toLowerCase().includes(term)
      || c.contact_email.toLowerCase().includes(term));
  }, [clients, search]);

  const saveClient = async () => {
    if (!editing?.company_name?.trim() || !editing?.contact_email?.trim() || !editing?.contact_name?.trim()) {
      toast.error("Company, contact name and email are required.");
      return;
    }
    setSavingClient(true);
    try {
      await requirementsApi.upsertClient({
        ...editing,
        contact_email: editing.contact_email.trim().toLowerCase(),
        owner_email: editing.owner_email || adminEmail.toLowerCase(),
      });
      toast.success("Client saved.");
      setEditing(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Could not save the client.");
    } finally {
      setSavingClient(false);
    }
  };

  const removeClient = async (id: string) => {
    try {
      await requirementsApi.deleteClient(id);
      toast.success("Client removed.");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Could not remove the client.");
    }
  };

  const toolbarField = "px-3.5 py-2.5 rounded-xl bg-card border border-border text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all";
  const modalField = "w-full px-3.5 py-2.5 rounded-xl bg-muted/60 border border-border text-foreground text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground transition-all";

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><Building2 className="w-6 h-6 text-primary" /> Clients & Requirements</h2>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} clients · {requirements.length} requirements in the pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className={`${toolbarField} pl-9 min-w-[220px]`} placeholder="Search clients or requirements" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={toolbarField} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all" className="bg-card text-foreground">All statuses</option>
            {REQUIREMENT_STATUSES.map((s) => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
          </select>
          <button onClick={() => setView(view === "board" ? "list" : "board")} className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-bold inline-flex items-center gap-2 hover:bg-muted transition-colors">
            {view === "board" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />} {view === "board" ? "List" : "Board"}
          </button>
          <button onClick={() => setEditing({ ...emptyClient })} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-2 shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus className="w-4 h-4" /> Client
          </button>
          <RequirementForm submitterEmail={adminEmail} clients={clients} onCreated={load} />
        </div>
      </div>

      {/* Clients table */}
      <div className="glass-card rounded-3xl bg-card border border-border overflow-x-auto shadow-sm">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/40">
              <th className="p-4">Company</th><th className="p-4">Contact</th><th className="p-4">Status</th>
              <th className="p-4">Tier</th><th className="p-4">Requirements</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-muted-foreground">No clients yet. Add the first one.</td></tr>
            )}
            {filteredClients.map((c) => (
              <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4 font-bold">{c.company_name}<div className="text-xs text-muted-foreground font-normal">{c.industry || "—"}</div></td>
                <td className="p-4">{c.contact_name}<div className="text-xs text-muted-foreground">{c.contact_email}</div></td>
                <td className="p-4"><span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-border bg-muted/60">{c.status}</span></td>
                <td className="p-4 text-muted-foreground">{c.tier}</td>
                <td className="p-4 font-semibold">{requirements.filter((r) => r.client_id === c.id).length}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button aria-label="Edit client" onClick={() => setEditing(c)} className="p-2 rounded-lg bg-card border border-border hover:border-primary/40 text-foreground transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                    <button aria-label="Delete client" onClick={() => removeClient(c.id)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Requirements */}
      {view === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {REQUIREMENT_STATUSES.filter((s) => statusFilter === "all" || s === statusFilter).map((s) => (
            <div key={s} className="space-y-3">
              <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl border ${statusTone[s]}`}>
                {s} · {filteredRequirements.filter((r) => r.status === s).length}
              </div>
              {filteredRequirements.filter((r) => r.status === s).map((r) => (
                <RequirementCard key={r.id} requirement={r} clientName={clientName(r.client_id)} onOpen={setOpenRequirement} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRequirements.map((r) => (
            <RequirementCard key={r.id} requirement={r} clientName={clientName(r.client_id)} onOpen={setOpenRequirement} />
          ))}
          {filteredRequirements.length === 0 && <p className="text-muted-foreground text-sm">No requirements match these filters.</p>}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-[250] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-20 sm:pt-24 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <div className="w-full max-w-xl flex flex-col bg-card border border-border rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden my-auto text-left"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card shrink-0">
              <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                {editing.id ? "Edit Client" : "New Client"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Company Name *</label>
                <input autoComplete="off" className={modalField} placeholder="e.g. Acme Corp" value={editing.company_name || ""} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Contact Name *</label>
                  <input autoComplete="off" className={modalField} placeholder="e.g. Jane Doe" value={editing.contact_name || ""} onChange={(e) => setEditing({ ...editing, contact_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Contact Email *</label>
                  <input autoComplete="new-password" className={modalField} placeholder="e.g. jane@acme.com" value={editing.contact_email || ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Phone</label>
                  <input autoComplete="off" className={modalField} placeholder="+91 98765 43210" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Industry</label>
                  <input autoComplete="off" className={modalField} placeholder="e.g. Healthcare, Retail" value={editing.industry || ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Status</label>
                  <select className={modalField} value={editing.status || "Lead"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    {CLIENT_STATUSES.map((s) => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Tier</label>
                  <select className={modalField} value={editing.tier || "Standard"} onChange={(e) => setEditing({ ...editing, tier: e.target.value })}>
                    {CLIENT_TIERS.map((t) => <option key={t} value={t} className="bg-card text-foreground">{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Internal Notes</label>
                <textarea className={`${modalField} min-h-[100px]`} placeholder="Private internal client notes, background or scope..." value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-card shrink-0 shadow-lg">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors border border-border text-sm">Cancel</button>
              <button onClick={saveClient} disabled={savingClient} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {savingClient ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Client
              </button>
            </div>
          </div>
        </div>
      )}

      {openRequirement && (
        <RequirementDetail
          requirement={openRequirement}
          role="admin"
          viewerEmail={adminEmail}
          clientName={clientName(openRequirement.client_id)}
          onClose={() => setOpenRequirement(null)}
          onChanged={load}
        />
      )}
    </div>
  );
};
