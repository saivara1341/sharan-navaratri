import { useEffect, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { requirementsApi, statusTone } from "@/lib/requirements";

interface Row {
  status: string;
  requirement_count: number;
  total_value: number;
  avg_progress: number;
}

export const InvestorPipelineRollup = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requirementsApi
      .pipelineSummary()
      .then((data) => setRows(data as Row[]))
      .catch((err: any) => setError(err.message || "Pipeline data unavailable."))
      .finally(() => setLoading(false));
  }, []);

  const totalCount = rows.reduce((s, r) => s + Number(r.requirement_count || 0), 0);
  const totalValue = rows.reduce((s, r) => s + Number(r.total_value || 0), 0);
  const delivered = rows
    .filter((r) => ["Delivered", "Closed"].includes(r.status))
    .reduce((s, r) => s + Number(r.requirement_count || 0), 0);
  const health = totalCount ? Math.round((delivered / totalCount) * 100) : 0;

  return (
    <div className="space-y-5 text-left">
      <div>
        <h2 className="text-2xl font-extrabold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent" /> Delivery Pipeline
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Aggregate delivery health across all engagements. No client identities exposed.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
      ) : error ? (
        <p className="text-sm text-muted-foreground">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Requirements in pipeline", value: totalCount },
              { label: "Aggregate estimated value", value: `₹${totalValue.toLocaleString("en-IN")}` },
              { label: "Delivery health", value: `${health}%` },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm text-stone-900">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">{s.label}</p>
                <p className="text-2xl font-extrabold mt-2 text-stone-900">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 shadow-sm text-stone-900">
            {rows.length === 0 && <p className="text-sm text-stone-500">No pipeline activity yet.</p>}
            {rows.map((r) => (
              <div key={r.status} className="flex items-center gap-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border w-52 shrink-0 ${statusTone[r.status] || statusTone.Closed}`}>
                  {r.status}
                </span>
                <div className="h-2 flex-1 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-stone-900"
                    style={{ width: `${totalCount ? (Number(r.requirement_count) / totalCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-stone-500 w-24 text-right">{r.requirement_count} · {Math.round(Number(r.avg_progress || 0))}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
