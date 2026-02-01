import type { Resolution } from "@/lib/types";

type ResolutionListProps = {
  resolutions: Resolution[];
  onAction: (id: number, action: string) => void;
};

export default function ResolutionList({ resolutions, onAction }: ResolutionListProps) {
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
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {resolution.status === "DRAFT" && (
              <button
                onClick={() => onAction(resolution.id, "publish")}
                className="rounded-full bg-amber-100 px-3 py-1 text-amber-800"
              >
                Publish
              </button>
            )}
            {resolution.status === "PUBLISHED" && (
              <button
                onClick={() => onAction(resolution.id, "start-voting")}
                className="rounded-full bg-sky-100 px-3 py-1 text-sky-800"
              >
                Start Voting
              </button>
            )}
            {resolution.status === "VOTING" && (
              <>
                <button
                  onClick={() => onAction(resolution.id, "end-direct-voting")}
                  className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800"
                >
                  End Direct
                </button>
                <button
                  onClick={() => onAction(resolution.id, "start-proxy-voting")}
                  className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800"
                >
                  Start Proxy
                </button>
              </>
            )}
            {resolution.status === "PROXY_VOTING" && (
              <button
                onClick={() => onAction(resolution.id, "end-proxy-voting")}
                className="rounded-full bg-rose-100 px-3 py-1 text-rose-800"
              >
                End Proxy
              </button>
            )}
            {resolution.status === "CLOSED" && (
              <button
                onClick={() => onAction(resolution.id, "publish-results")}
                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800"
              >
                Publish Results
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
