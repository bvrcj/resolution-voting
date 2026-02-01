import type { Results } from "@/lib/types";
import ResultsPanel from "@/components/common/ResultsPanel";

type UserResultsPanelProps = {
  results: Results | null;
};

export default function UserResultsPanel({ results }: UserResultsPanelProps) {
  return (
    <ResultsPanel
      results={results}
      emptyMessage="Results will appear once voting closes."
      titleLabel="Resolution"
      layout="three"
    />
  );
}
