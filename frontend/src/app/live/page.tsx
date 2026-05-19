"use client";

import { useEffect, useMemo, useState } from "react";
import ApiBaseField from "@/components/common/ApiBaseField";
import LiveClock from "@/components/common/LiveClock";
import SectionCard from "@/components/common/SectionCard";
import type { LiveResolution, Resolution } from "@/lib/types";
import { formatDateTime } from "@/lib/date";

const API_DEFAULT = "http://localhost:8080";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PUBLISHED: "bg-amber-100 text-amber-800",
  VOTING: "bg-emerald-100 text-emerald-800",
  PROXY_VOTING: "bg-indigo-100 text-indigo-800",
  CLOSED: "bg-slate-200 text-slate-700",
  RESULTS_PUBLISHED: "bg-sky-100 text-sky-800"
};

export default function LiveStatusPage() {
  const [apiBase, setApiBase] = useState(API_DEFAULT);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [liveItems, setLiveItems] = useState<LiveResolution[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const activeResolutions = useMemo(
    () => resolutions.filter((item) => ["VOTING", "PROXY_VOTING"].includes(item.status)),
    [resolutions]
  );

  const publishedResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "PUBLISHED"),
    [resolutions]
  );

  const refresh = async () => {
    setError(null);
    try {
      const response = await fetch(`${apiBase}/api/resolutions/live-dashboard`);
      if (!response.ok) {
        throw new Error("Failed to load live status");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const resolutionList = data.map((item) => item.resolution).filter(Boolean);
        setLiveItems(data);
        setResolutions(resolutionList);
      } else {
        setResolutions([]);
        setLiveItems([]);
        throw new Error("Unexpected response format for live dashboard");
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  useEffect(() => {
    refresh();
    if (process.env.NODE_ENV === "test") {
      return undefined;
    }
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [apiBase]);

  const liveResultsById = useMemo(() => {
    const map = new Map<number, LiveResolution["liveResults"]>();
    liveItems.forEach((item) => {
      map.set(item.resolution?.id, item.liveResults ?? null);
    });
    return map;
  }, [liveItems]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.25),_transparent_45%),linear-gradient(120deg,_#020617,_#0f172a_40%,_#1e1b4b)] px-6 py-12 text-white md:px-12">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Live Status</p>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl font-display">
                Resolution Voting Now
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Automatic refresh every 10 seconds. Share this view with attendees for live status.
              </p>
            </div>
            <div className="space-y-3 text-right">
              <LiveClock label="Live Feed" />
              {lastUpdated && (
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Updated {lastUpdated.toLocaleTimeString("en-US")}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <ApiBaseField value={apiBase} onChange={setApiBase} />
          </div>
          {error && (
            <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard
            title="Active Voting"
            className="border-white/10 bg-blue-500/50 text-white"
            titleClassName="text-white"
          >
            {activeResolutions.length === 0 ? (
              <p className="text-sm text-white/70">No active voting sessions right now.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeResolutions.map((resolution) => (
                  <div
                    key={resolution.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.5)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
                    {liveResultsById.get(resolution.id) && (
                      <div className="relative mb-3 flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
                        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                          Live Votes
                        </span>
                        <span className="text-sm font-semibold">
                          {liveResultsById.get(resolution.id)?.totalVotes ?? 0} total
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[resolution.status] ?? "bg-white/20 text-white"
                        }`}
                      >
                        {resolution.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-white/60">#{resolution.id}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white font-display">
                      {resolution.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{resolution.description}</p>
                    <p className="mt-3 text-xs text-white/60">Room: {resolution.room?.name}</p>
                    {liveResultsById.get(resolution.id) ? (
                      <div className="mt-4 grid gap-4 text-xs text-white/70">
                        <div className="flex flex-wrap gap-3">
                          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-100">
                            For {liveResultsById.get(resolution.id)?.forCount ?? 0}
                          </span>
                          <span className="rounded-full bg-rose-400/20 px-3 py-1 text-rose-100">
                            Against {liveResultsById.get(resolution.id)?.againstCount ?? 0}
                          </span>
                          <span className="rounded-full bg-slate-400/20 px-3 py-1 text-slate-100">
                            Abstain {liveResultsById.get(resolution.id)?.abstainCount ?? 0}
                          </span>
                        </div>
                        <div className="grid gap-2 text-[11px] text-white/60 md:grid-cols-2">
                          <span>Direct: {liveResultsById.get(resolution.id)?.directVotes.total ?? 0}</span>
                          <span>Proxy: {liveResultsById.get(resolution.id)?.proxyVotes.total ?? 0}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                        Live vote counts are loading...
                      </div>
                    )}
                    <div className="mt-3 grid gap-1 text-[11px] text-white/60">
                      <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                      <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                      <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <div className="space-y-6">
            <SectionCard
              title="Published (Waiting to Open)"
              className="border-white/10 bg-blue-500/50 text-white"
              titleClassName="text-white"
            >
              {publishedResolutions.length === 0 ? (
                <p className="text-sm text-white/70">No published resolutions waiting.</p>
              ) : (
                <div className="space-y-3">
                  {publishedResolutions.map((resolution) => (
                    <div key={resolution.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                        <span>Published</span>
                        <span>#{resolution.id}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-white font-display">
                        {resolution.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70">{resolution.description}</p>
                      <p className="mt-2 text-xs text-white/60">Room: {resolution.room?.name}</p>
                      <p className="mt-2 text-[11px] text-white/60">
                        Created: {formatDateTime(resolution.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Status Overview"
              className="border-white/10 bg-blue-500/50 text-white"
              titleClassName="text-white"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {["DRAFT", "PUBLISHED", "VOTING", "PROXY_VOTING", "CLOSED", "RESULTS_PUBLISHED"].map((status) => {
                  const count = resolutions.filter((item) => item.status === status).length;
                  return (
                    <div key={status} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">{status.replace("_", " ")}</p>
                      <p className="mt-3 text-2xl font-semibold text-white">{count}</p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
