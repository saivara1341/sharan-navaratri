import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Loader2, X } from "lucide-react";
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

  const field =
    "w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-xs sm:placeholder:text-sm placeholder:text-muted-foreground transition-all";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all"
      >
        <Plus className="w-4 h-4" /> New Requirement
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-20 sm:pt-24 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onSubmit={submit}
              className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card shrink-0">
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Submit a Requirement
                </h3>
                <button
                  type="button"
                  onClick={() => { reset(); setOpen(false); }}
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">
                    Requirement Title *
                  </label>
                  <input
                    className={field}
                    placeholder="Requirement title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">
                    Description * (min 20 chars)
                  </label>
                  <textarea
                    className={`${field} min-h-[120px]`}
                    placeholder="Describe the scope, goals and any constraints..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Type</label>
                    <select className={field} value={reqType} onChange={(e) => setReqType(e.target.value)}>
                      {REQUIREMENT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Priority</label>
                    <select className={field} value={priority} onChange={(e) => setPriority(e.target.value)}>
                      {REQUIREMENT_PRIORITIES.map((p) => (
                        <option key={p} value={p} className="bg-card text-foreground">{p} priority</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Budget Range</label>
                    <input
                      className={field}
                      placeholder="Budget range (optional)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Estimated Value (₹)</label>
                    <input
                      className={field}
                      type="number"
                      placeholder="Estimated value (optional)"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Target Date</label>
                    <input
                      className={field}
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                  {!fixedClientId && clients && clients.length > 0 && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold tracking-wide text-foreground mb-1.5">Link to Client</label>
                      <select className={field} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                        <option value="" className="bg-card text-foreground">No client linked</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id} className="bg-card text-foreground">{c.company_name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-border bg-card shrink-0">
                <button
                  type="button"
                  onClick={() => { reset(); setOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors border border-border text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-[2] py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Submit Requirement
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
