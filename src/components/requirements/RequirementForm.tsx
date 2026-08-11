import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import {
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_TYPES,
  requirementsApi,
  type ClientRecord,
} from "@/lib/requirements";

interface Props {
  submitterEmail: string;
  agencyEmail?: string;
  clients?: ClientRecord[];
  fixedClientId?: string;
  onCreated: () => void;
}

export const RequirementForm = ({ submitterEmail, agencyEmail, clients, fixedClientId, onCreated }: Props) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reqType, setReqType] = useState<string>("Website");
  const [priority, setPriority] = useState<string>("Medium");
  const [budget, setBudget] = useState("");
  const [value, setValue] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [clientId, setClientId] = useState(fixedClientId || "");

  const reset = () => {
    setTitle(""); setDescription(""); setReqType("Website"); setPriority("Medium");
    setBudget(""); setValue(""); setTargetDate(""); setClientId(fixedClientId || "");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || description.trim().length < 20) {
      toast.error("Add a title and at least 20 characters of detail.");
      return;
    }
    setSaving(true);
    try {
      const created = await requirementsApi.createRequirement({
        title: title.trim(),
        description: description.trim(),
        req_type: reqType,
        priority,
        budget_range: budget.trim() || null,
        estimated_value: value ? Number(value) : null,
        target_date: targetDate || null,
        client_id: clientId || null,
        submitted_by_email: submitterEmail.toLowerCase(),
        agency_email: agencyEmail ? agencyEmail.toLowerCase() : null,
      });
      await requirementsApi.logEvent({
        requirement_id: created.id,
        actor_email: submitterEmail.toLowerCase(),
        event_type: "created",
        to_value: "Submitted",
      });
      toast.success("Requirement submitted.");
      reset();
      setOpen(false);
      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Could not submit the requirement.");
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-primary/40 outline-none";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
      >
        <Plus className="w-4 h-4" /> New Requirement
      </button>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="glass-card p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4"
    >
      <h3 className="text-lg font-bold">Submit a requirement</h3>
      <input className={field} placeholder="Requirement title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={`${field} min-h-[120px]`} placeholder="Describe the scope, goals and any constraints (min 20 characters)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select className={field} value={reqType} onChange={(e) => setReqType(e.target.value)}>
          {REQUIREMENT_TYPES.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
        </select>
        <select className={field} value={priority} onChange={(e) => setPriority(e.target.value)}>
          {REQUIREMENT_PRIORITIES.map((p) => <option key={p} value={p} className="bg-background">{p} priority</option>)}
        </select>
        <input className={field} placeholder="Budget range (optional)" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <input className={field} type="number" placeholder="Estimated value (optional)" value={value} onChange={(e) => setValue(e.target.value)} />
        <input className={field} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        {!fixedClientId && clients && clients.length > 0 && (
          <select className={field} value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="" className="bg-background">No client linked</option>
            {clients.map((c) => <option key={c.id} value={c.id} className="bg-background">{c.company_name}</option>)}
          </select>
        )}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Submit
        </button>
        <button type="button" onClick={() => { reset(); setOpen(false); }} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm">
          Cancel
        </button>
      </div>
    </motion.form>
  );
};
