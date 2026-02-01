import type { Results } from "@/lib/types";
import ResultsPanel from "@/components/common/ResultsPanel";

type AdminResultsPanelProps = {
  results: Results | null;
};

export default function AdminResultsPanel({ results }: AdminResultsPanelProps) {
  return (
    <ResultsPanel
      results={results}
      emptyMessage="Results not available yet."
      titleLabel="Current Resolution"
      layout="two"
    />
  );
}
