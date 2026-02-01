import type { Resolution } from "@/lib/types";

type UserResolutionListProps = {
  resolutions: Resolution[];
  onSelectResults: (id: number) => void;
};

export default function UserResolutionList({ resolutions, onSelectResults }: UserResolutionListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {resolutions.map((resolution) => (
        <div key={resolution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>{resolution.status}</span>
            <span>#{resolution.id}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">{resolution.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
          <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
          <button
            className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            onClick={() => onSelectResults(resolution.id)}
          >
            View Results
          </button>
        </div>
      ))}
    </div>
  );
}
