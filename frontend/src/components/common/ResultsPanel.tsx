import type { Results } from "@/lib/types";

type ResultsPanelProps = {
  results: Results | null;
  emptyMessage: string;
  titleLabel: string;
  layout?: "two" | "three";
};

export default function ResultsPanel({
  results,
  emptyMessage,
  titleLabel,
  layout = "two"
}: ResultsPanelProps) {
  if (!results) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }

  const gridClass = layout === "three" ? "md:grid-cols-3" : "md:grid-cols-2";
  const titleCardClass = layout === "three" ? "md:col-span-2" : "";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${titleCardClass}`.trim()}>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{titleLabel}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">{results.resolutionTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{results.resolutionDescription}</p>
        <p className="mt-2 text-xs text-slate-500">Room: {results.room?.name}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Totals</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{results.totalVotes}</p>
        <p className="mt-2 text-sm text-slate-600">
          For {results.forCount} Â· Against {results.againstCount} Â· Abstain {results.abstainCount}
        </p>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Direct Votes</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{results.directVotes.total}</p>
            <p className="mt-1 text-xs text-slate-600">
              For {results.directVotes.forCount} Â· Against {results.directVotes.againstCount} Â· Abstain{" "}
              {results.directVotes.abstainCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Proxy Votes</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{results.proxyVotes.total}</p>
            <p className="mt-1 text-xs text-slate-600">
              For {results.proxyVotes.forCount} Â· Against {results.proxyVotes.againstCount} Â· Abstain{" "}
              {results.proxyVotes.abstainCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
