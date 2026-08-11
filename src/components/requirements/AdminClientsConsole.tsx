import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Loader2, Plus, Building2, Trash2, Pencil, LayoutGrid, List } from "lucide-react";
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

  const field = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm outline-none focus:border-primary/40";

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
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className={`${field} pl-9 min-w-[220px]`} placeholder="Search clients or requirements" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className={field} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all" className="bg-background">All statuses</option>
            {REQUIREMENT_STATUSES.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
          </select>
          <button onClick={() => setView(view === "board" ? "list" : "board")} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold inline-flex items-center gap-2">
            {view === "board" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />} {view === "board" ? "List" : "Board"}
          </button>
          <button onClick={() => setEditing({ ...emptyClient })} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Client
          </button>
          <RequirementForm submitterEmail={adminEmail} clients={clients} onCreated={load} />
        </div>
      </div>

      {/* Clients table */}
      <div className="glass-card rounded-3xl bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest text-muted-foreground border-b border-white/10">
              <th className="p-4">Company</th><th className="p-4">Contact</th><th className="p-4">Status</th>
              <th className="p-4">Tier</th><th className="p-4">Requirements</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-muted-foreground">No clients yet. Add the first one.</td></tr>
            )}
            {filteredClients.map((c) => (
              <tr key={c.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-bold">{c.company_name}<div className="text-xs text-muted-foreground font-normal">{c.industry || "—"}</div></td>
                <td className="p-4">{c.contact_name}<div className="text-xs text-muted-foreground">{c.contact_email}</div></td>
                <td className="p-4"><span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10 bg-white/5">{c.status}</span></td>
                <td className="p-4 text-muted-foreground">{c.tier}</td>
                <td className="p-4">{requirements.filter((r) => r.client_id === c.id).length}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button aria-label="Edit client" onClick={() => setEditing(c)} className="p-2 rounded-lg bg-white/5 border border-white/10"><Pencil className="w-3.5 h-3.5" /></button>
                    <button aria-label="Delete client" onClick={() => removeClient(c.id)} className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl glass-card rounded-3xl bg-background/95 border border-white/10 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold">{editing.id ? "Edit client" : "New client"}</h3>
            <input className={field} placeholder="Company name" value={editing.company_name || ""} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} />
            <input className={field} placeholder="Contact name" value={editing.contact_name || ""} onChange={(e) => setEditing({ ...editing, contact_name: e.target.value })} />
            <input className={field} placeholder="Contact email" value={editing.contact_email || ""} onChange={(e) => setEditing({ ...editing, contact_email: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <input className={field} placeholder="Phone" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              <input className={field} placeholder="Industry" value={editing.industry || ""} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} />
              <select className={field} value={editing.status || "Lead"} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {CLIENT_STATUSES.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
              </select>
              <select className={field} value={editing.tier || "Standard"} onChange={(e) => setEditing({ ...editing, tier: e.target.value })}>
                {CLIENT_TIERS.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
              </select>
            </div>
            <textarea className={`${field} min-h-[100px]`} placeholder="Internal notes" value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={saveClient} disabled={savingClient} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm inline-flex items-center gap-2 disabled:opacity-60">
                {savingClient && <Loader2 className="w-4 h-4 animate-spin" />} Save
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold text-sm">Cancel</button>
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
