import { statusTone, priorityTone, type RequirementRecord } from "@/lib/requirements";
import { format } from "date-fns";
import { CalendarDays, ChevronRight, UserCog } from "lucide-react";

interface Props {
  requirement: RequirementRecord;
  clientName?: string;
  onOpen: (requirement: RequirementRecord) => void;
}

export const RequirementCard = ({ requirement, clientName, onOpen }: Props) => (
  <button
    onClick={() => onOpen(requirement)}
    className="w-full text-left glass-card p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all group"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{requirement.title}</h4>
        {clientName && <p className="text-xs text-muted-foreground mt-1">{clientName}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
    </div>

    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{requirement.description}</p>

    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statusTone[requirement.status] || statusTone.Closed}`}>
        {requirement.status}
      </span>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${priorityTone[requirement.priority] || priorityTone.Low}`}>
        {requirement.priority}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-muted-foreground">
        {requirement.req_type}
      </span>
    </div>

    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-3">
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${requirement.progress}%` }} />
    </div>

    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
      <span>{requirement.progress}% complete</span>
      {requirement.target_date && (
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="w-3 h-3" /> {format(new Date(requirement.target_date), "dd MMM yyyy")}
        </span>
      )}
      {requirement.assigned_to_email && (
        <span className="inline-flex items-center gap-1 truncate">
          <UserCog className="w-3 h-3" /> {requirement.assigned_to_email}
        </span>
      )}
    </div>
  </button>
);
