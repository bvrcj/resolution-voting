import type { Results } from "@/lib/types";

type ResultsTableProps = {
  results: Results;
};

export default function ResultsTable({ results }: ResultsTableProps) {
  const rows = [
    { label: "Total Votes", value: results.totalVotes },
    { label: "For", value: results.forCount },
    { label: "Against", value: results.againstCount },
    { label: "Abstain", value: results.abstainCount },
    { label: "Direct Votes", value: results.directVotes.total },
    { label: "Direct For", value: results.directVotes.forCount },
    { label: "Direct Against", value: results.directVotes.againstCount },
    { label: "Direct Abstain", value: results.directVotes.abstainCount },
    { label: "Proxy Votes", value: results.proxyVotes.total },
    { label: "Proxy For", value: results.proxyVotes.forCount },
    { label: "Proxy Against", value: results.proxyVotes.againstCount },
    { label: "Proxy Abstain", value: results.proxyVotes.abstainCount }
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Results Table</p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-4 py-2 font-semibold">Metric</th>
            <th className="px-4 py-2 text-right font-semibold">Count</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-slate-100">
              <td className="px-4 py-2 text-slate-600">{row.label}</td>
              <td className="px-4 py-2 text-right font-semibold text-slate-900">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
