import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { X, Send, Loader2, History, MessageCircle } from "lucide-react";
import {
  REQUIREMENT_PRIORITIES,
  REQUIREMENT_STATUSES,
  priorityTone,
  requirementsApi,
  statusTone,
  type RequirementEvent,
  type RequirementMessage,
  type RequirementRecord,
} from "@/lib/requirements";

export type RequirementRole = "admin" | "client" | "partner" | "employee";

interface Props {
  requirement: RequirementRecord;
  role: RequirementRole;
  viewerEmail: string;
  clientName?: string;
  onClose: () => void;
  onChanged: () => void;
}

const allowedStatuses = (role: RequirementRole): string[] => {
  if (role === "admin") return [...REQUIREMENT_STATUSES];
  if (role === "employee") return ["In Progress", "Delivered"];
  return [];
};

export const RequirementDetail = ({ requirement, role, viewerEmail, clientName, onClose, onChanged }: Props) => {
  const [messages, setMessages] = useState<RequirementMessage[]>([]);
  const [events, setEvents] = useState<RequirementEvent[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(requirement.status);
  const [priority, setPriority] = useState(requirement.priority);
  const [progress, setProgress] = useState(requirement.progress);
  const [assignee, setAssignee] = useState(requirement.assigned_to_email || "");

  const load = async () => {
    try {
      const [msgs, evts] = await Promise.all([
        requirementsApi.listMessages(requirement.id),
        requirementsApi.listEvents(requirement.id),
      ]);
      setMessages(msgs);
      setEvents(evts);
    } catch (err: any) {
      toast.error(err.message || "Could not load the requirement thread.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirement.id]);

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await requirementsApi.sendMessage({
        requirement_id: requirement.id,
        sender_email: viewerEmail.toLowerCase(),
        sender_role: role,
        message: reply.trim(),
      });
      setReply("");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const saveControls = async () => {
    setSaving(true);
    try {
      await requirementsApi.updateRequirement(requirement.id, {
        status,
        priority,
        progress,
        assigned_to_email: assignee.trim() ? assignee.trim().toLowerCase() : null,
      });
      if (status !== requirement.status) {
        await requirementsApi.logEvent({
          requirement_id: requirement.id,
          actor_email: viewerEmail.toLowerCase(),
          event_type: "status",
          from_value: requirement.status,
          to_value: status,
        });
      }
      if (progress !== requirement.progress) {
        await requirementsApi.logEvent({
          requirement_id: requirement.id,
          actor_email: viewerEmail.toLowerCase(),
          event_type: "progress",
          from_value: String(requirement.progress),
          to_value: String(progress),
        });
      }
      toast.success("Requirement updated.");
      onChanged();
      await load();
    } catch (err: any) {
      toast.error(err.message || "Could not update the requirement.");
    } finally {
      setSaving(false);
    }
  };

  const canControl = role === "admin" || role === "employee";
  const field = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm outline-none focus:border-primary/40";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-6" role="dialog" aria-modal="true">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-card rounded-t-3xl sm:rounded-3xl bg-background/95 border border-white/10 p-6 space-y-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">{requirement.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {clientName ? `${clientName} · ` : ""}{requirement.req_type} · raised {format(new Date(requirement.created_at), "dd MMM yyyy")}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-xl bg-white/5 border border-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statusTone[requirement.status] || statusTone.Closed}`}>{requirement.status}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${priorityTone[requirement.priority] || priorityTone.Low}`}>{requirement.priority}</span>
          {requirement.budget_range && <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-muted-foreground">{requirement.budget_range}</span>}
        </div>

        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{requirement.description}</p>

        {canControl && (
          <div className="glass-card p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Delivery controls</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
                {allowedStatuses(role).map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
                {!allowedStatuses(role).includes(status) && <option value={status} className="bg-background">{status}</option>}
              </select>
              <select className={field} value={priority} onChange={(e) => setPriority(e.target.value)} disabled={role !== "admin"}>
                {REQUIREMENT_PRIORITIES.map((p) => <option key={p} value={p} className="bg-background">{p} priority</option>)}
              </select>
              {role === "admin" && (
                <input className={field} placeholder="Assign to employee email" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
              )}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-bold">Progress: {progress}%</label>
                <input type="range" min={0} max={100} step={5} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
            <button onClick={saveControls} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-60">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save changes
            </button>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <MessageCircle className="w-4 h-4" /> Conversation
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet — start the conversation below.</p>}
            {messages.map((m) => (
              <div key={m.id} className={`p-3 rounded-2xl border text-sm ${m.sender_email.toLowerCase() === viewerEmail.toLowerCase() ? "bg-primary/10 border-primary/20 ml-6" : "bg-white/5 border-white/10 mr-6"}`}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                  {m.sender_role} · {format(new Date(m.created_at), "dd MMM, HH:mm")}
                </p>
                <p className="text-foreground whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={field} placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button onClick={send} disabled={sending} aria-label="Send message" className="px-4 rounded-xl bg-primary text-primary-foreground disabled:opacity-60">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <History className="w-4 h-4" /> Activity
          </h4>
          {events.length === 0 && <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
          {events.map((e) => (
            <p key={e.id} className="text-xs text-muted-foreground">
              {format(new Date(e.created_at), "dd MMM, HH:mm")} — {e.event_type}
              {e.from_value ? ` from ${e.from_value}` : ""}{e.to_value ? ` to ${e.to_value}` : ""} · {e.actor_email}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
