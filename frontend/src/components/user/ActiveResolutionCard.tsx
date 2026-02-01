import type { Resolution } from "@/lib/types";

type ActiveResolutionCardProps = {
  resolution: Resolution | null;
};

export default function ActiveResolutionCard({ resolution }: ActiveResolutionCardProps) {
  if (!resolution) {
    return <p className="text-sm text-slate-500">No active voting session yet. Check back soon.</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Resolution #{resolution.id}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">{resolution.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
      <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
        Voting Open
      </div>
    </div>
  );
}
