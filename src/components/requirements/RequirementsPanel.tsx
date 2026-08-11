import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ClipboardList } from "lucide-react";
import { requirementsApi, type ClientRecord, type RequirementRecord } from "@/lib/requirements";
import { RequirementCard } from "./RequirementCard";
import { RequirementDetail, type RequirementRole } from "./RequirementDetail";
import { RequirementForm } from "./RequirementForm";

interface Props {
  viewerEmail: string;
  role: RequirementRole;
  agencyEmail?: string;
  title?: string;
  subtitle?: string;
  canSubmit?: boolean;
}

export const RequirementsPanel = ({
  viewerEmail,
  role,
  agencyEmail,
  title = "My Requirements",
  subtitle = "Everything you have asked us to build, tracked end to end.",
  canSubmit = true,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<RequirementRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [open, setOpen] = useState<RequirementRecord | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [reqs, cls] = await Promise.all([
        requirementsApi.listRequirements(),
        agencyEmail ? requirementsApi.listClients({ agencyEmail }) : Promise.resolve([] as ClientRecord[]),
      ]);
      setRequirements(reqs);
      setClients(cls);
    } catch (err: any) {
      toast.error(err.message || "Could not load requirements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [viewerEmail]);

  const visible = role === "employee"
    ? requirements.filter((r) => (r.assigned_to_email || "").toLowerCase() === viewerEmail.toLowerCase())
    : requirements;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><ClipboardList className="w-6 h-6 text-primary" /> {title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {canSubmit && (
          <RequirementForm submitterEmail={viewerEmail} agencyEmail={agencyEmail} clients={clients} onCreated={load} />
        )}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : visible.length === 0 ? (
        <div className="glass-card p-10 rounded-3xl bg-white/5 border border-white/10 text-center">
          <p className="text-muted-foreground text-sm">
            {role === "employee" ? "No work has been assigned to you yet." : "No requirements yet — submit your first one above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((r) => (
            <RequirementCard
              key={r.id}
              requirement={r}
              clientName={clients.find((c) => c.id === r.client_id)?.company_name}
              onOpen={setOpen}
            />
          ))}
        </div>
      )}

      {open && (
        <RequirementDetail
          requirement={open}
          role={role}
          viewerEmail={viewerEmail}
          clientName={clients.find((c) => c.id === open.client_id)?.company_name}
          onClose={() => setOpen(null)}
          onChanged={load}
        />
      )}
    </div>
  );
};
