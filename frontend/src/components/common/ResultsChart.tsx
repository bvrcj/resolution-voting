import type { Results } from "@/lib/types";

type ResultsChartProps = {
  results: Results;
};

const buildChartRows = (results: Results) => {
  const total = Math.max(results.totalVotes, 1);
  return [
    {
      label: "For",
      value: results.forCount,
      pct: Math.round((results.forCount / total) * 100),
      className: "bg-emerald-500"
    },
    {
      label: "Against",
      value: results.againstCount,
      pct: Math.round((results.againstCount / total) * 100),
      className: "bg-rose-500"
    },
    {
      label: "Abstain",
      value: results.abstainCount,
      pct: Math.round((results.abstainCount / total) * 100),
      className: "bg-slate-500"
    }
  ];
};

export default function ResultsChart({ results }: ResultsChartProps) {
  const rows = buildChartRows(results);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vote Share</p>
      <div className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{row.label}</span>
              <span>
                {row.value} votes - {row.pct}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${row.className}`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
