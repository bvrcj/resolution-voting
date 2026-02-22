"use client";

import type { Results } from "@/lib/types";
import ResultsChart from "@/components/common/ResultsChart";
import ResultsTable from "@/components/common/ResultsTable";

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

  const handleDownload = () => {
    const rows = [
      ["Resolution", results.resolutionTitle],
      ["Status", results.status],
      ["Total Votes", results.totalVotes],
      ["For", results.forCount],
      ["Against", results.againstCount],
      ["Abstain", results.abstainCount],
      ["Direct Votes", results.directVotes.total],
      ["Direct For", results.directVotes.forCount],
      ["Direct Against", results.directVotes.againstCount],
      ["Direct Abstain", results.directVotes.abstainCount],
      ["Proxy Votes", results.proxyVotes.total],
      ["Proxy For", results.proxyVotes.forCount],
      ["Proxy Against", results.proxyVotes.againstCount],
      ["Proxy Abstain", results.proxyVotes.abstainCount]
    ];

    const csv = rows.map((row) => row.map(String).map((value) => `"${value}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = results.resolutionTitle.replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
    link.href = url;
    link.download = `${safeTitle || "resolution"}-results.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      <div className={`rounded-2xl border border-slate-200 bg-white p-4 ${titleCardClass}`.trim()}>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{titleLabel}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">{results.resolutionTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{results.resolutionDescription}</p>
        <p className="mt-2 text-xs text-slate-500">Room: {results.room?.name}</p>
        <button
          type="button"
          onClick={handleDownload}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Download CSV
        </button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Totals</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{results.totalVotes}</p>
        <p className="mt-2 text-sm text-slate-600">
          For {results.forCount} Against {results.againstCount} Abstain {results.abstainCount}
        </p>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Direct Votes</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{results.directVotes.total}</p>
            <p className="mt-1 text-xs text-slate-600">
              For {results.directVotes.forCount} Against {results.directVotes.againstCount} Abstain{" "}
              {results.directVotes.abstainCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Proxy Votes</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{results.proxyVotes.total}</p>
            <p className="mt-1 text-xs text-slate-600">
              For {results.proxyVotes.forCount} Against {results.proxyVotes.againstCount} Abstain{" "}
              {results.proxyVotes.abstainCount}
            </p>
          </div>
        </div>
      </div>
      <ResultsChart results={results} />
      <ResultsTable results={results} />
    </div>
  );
}
