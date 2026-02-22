"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { useRouter } from "next/navigation";
import ApiBaseField from "@/components/common/ApiBaseField";
import LiveClock from "@/components/common/LiveClock";
import SectionCard from "@/components/common/SectionCard";
import SidebarNav from "@/components/layout/SidebarNav";
import UserResolutionList from "@/components/user/UserResolutionList";
import UserResultsPanel from "@/components/user/UserResultsPanel";
import UserVoteCard from "@/components/user/UserVoteCard";
import type { Resolution, Results, User } from "@/lib/types";
import { formatDateTime } from "@/lib/date";

const API_DEFAULT = "http://localhost:8080";

const USER_NAV = [
  { id: "dashboard", label: "Dashboard", description: "Published and active voting first." },
  { id: "active", label: "Active Resolutions", description: "Published or voting now." },
  { id: "inactive", label: "In-Active Resolutions", description: "Draft resolutions." },
  { id: "completed", label: "Completed Resolutions", description: "Closed or published results." },
  { id: "results", label: "Voting Results", description: "Review outcomes." }
];

type VoteForm = {
  resolutionId: string;
  proxyForUserId: string;
  proxyForName: string;
  choice: string;
  latitude: string;
  longitude: string;
};

type ActionStatus = {
  kind: "success" | "error";
  message: string;
} | null;

export default function UserPage() {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [apiBase, setApiBase] = useState(API_DEFAULT);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [resultsResolutionId, setResultsResolutionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<ActionStatus>(null);
  const [voteForm, setVoteForm] = useState<VoteForm>({
    resolutionId: "",
    proxyForUserId: "",
    proxyForName: "",
    choice: "FOR",
    latitude: "",
    longitude: ""
  });

  const publishedResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "PUBLISHED"),
    [resolutions]
  );
  const votingResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "VOTING" || item.status === "PROXY_VOTING"),
    [resolutions]
  );
  const activeResolutions = useMemo(
    () => resolutions.filter((item) => ["PUBLISHED", "VOTING", "PROXY_VOTING"].includes(item.status)),
    [resolutions]
  );
  const inactiveResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "DRAFT"),
    [resolutions]
  );
  const completedResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "CLOSED" || item.status === "RESULTS_PUBLISHED"),
    [resolutions]
  );

  const voteResolutions = activeResolutions.length > 0 ? activeResolutions : resolutions;
  const handleResultsSelect = (id: number) => {
    setResultsResolutionId(String(id));
    setActivePanel("results");
  };

  const refreshData = async () => {
    setError(null);
    setActionStatus(null);
    try {
      const [resolutionsRes, usersRes] = await Promise.all([
        fetch(`${apiBase}/api/resolutions`),
        fetch(`${apiBase}/api/users`)
      ]);
      if (!resolutionsRes.ok || !usersRes.ok) {
        throw new Error("Failed to load resolutions");
      }
      setResolutions(await resolutionsRes.json());
      setUsers(await usersRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  useEffect(() => {
    refreshData();
  }, [apiBase]);

  useEffect(() => {
    const stored = localStorage.getItem("rv_current_user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(stored) as User;
    if (parsed.role !== "USER") {
      router.push("/login");
      return;
    }
    setCurrentUser(parsed);
  }, [router]);

  useEffect(() => {
    if (!voteForm.resolutionId && voteResolutions.length > 0) {
      setVoteForm((prev) => ({ ...prev, resolutionId: String(voteResolutions[0].id) }));
    }
  }, [voteForm.resolutionId, voteResolutions]);

  const selectedVoteResolution = useMemo(
    () => resolutions.find((item) => item.id === Number(voteForm.resolutionId)),
    [resolutions, voteForm.resolutionId]
  );

  useEffect(() => {
    if (selectedVoteResolution?.status !== "PROXY_VOTING") {
      setVoteForm((prev) => ({ ...prev, proxyForUserId: "", proxyForName: "" }));
    }
  }, [selectedVoteResolution]);

  useEffect(() => {
    if (!resultsResolutionId) {
      const defaultResolution = completedResolutions[0] ?? resolutions[0];
      if (defaultResolution) {
        setResultsResolutionId(String(defaultResolution.id));
      }
    }
  }, [completedResolutions, resolutions, resultsResolutionId]);

  useEffect(() => {
    const loadResults = async () => {
      if (!resultsResolutionId) {
        setResults(null);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/resolutions/${resultsResolutionId}/results`);
        if (!res.ok) {
          setResults(null);
          return;
        }
        setResults(await res.json());
      } catch {
        setResults(null);
      }
    };

    loadResults();
  }, [apiBase, resultsResolutionId]);

  const submitVote = async () => {
    setError(null);
    setActionStatus(null);
    try {
      if (!currentUser) {
        throw new Error("Please login before voting.");
      }
      if (!voteForm.resolutionId) {
        throw new Error("Select a resolution before voting.");
      }
      if (
        selectedVoteResolution?.status === "PROXY_VOTING" &&
        voteForm.proxyForUserId &&
        Number(voteForm.proxyForUserId) === currentUser.id
      ) {
        throw new Error("Proxy voter must be different from the voter.");
      }
      if (voteForm.proxyForUserId && currentUser.role === "USER") {
        const proxyUser = users.find((user) => user.id === Number(voteForm.proxyForUserId));
        if (proxyUser?.role === "ADMIN") {
          throw new Error("Proxy voting for admins is not allowed.");
        }
      }
      if (!selectedVoteResolution) {
        throw new Error("Select a resolution before voting.");
      }
      if (!["VOTING", "PROXY_VOTING"].includes(selectedVoteResolution.status)) {
        throw new Error("Voting is not active for this resolution.");
      }
      if (selectedVoteResolution.status === "VOTING" && voteForm.proxyForUserId) {
        throw new Error("Proxy voting is not active for this resolution.");
      }
      if (selectedVoteResolution.status === "PROXY_VOTING" && !voteForm.proxyForUserId) {
        throw new Error("Proxy voter is required during proxy voting.");
      }
      const roomLatitude = selectedVoteResolution.room?.latitude;
      const roomLongitude = selectedVoteResolution.room?.longitude;
      if (typeof roomLatitude !== "number" || typeof roomLongitude !== "number") {
        throw new Error("Resolution room location is missing.");
      }
      const response = await fetch(`${apiBase}/api/resolutions/${voteForm.resolutionId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: currentUser.id,
          proxyForUserId: voteForm.proxyForUserId ? Number(voteForm.proxyForUserId) : null,
          proxyForName: voteForm.proxyForName || null,
          choice: voteForm.choice,
          latitude: roomLatitude,
          longitude: roomLongitude
        })
      });
      if (!response.ok) {
        let errorMessage = "Failed to cast vote";
        try {
          const raw = await response.text();
          if (raw) {
            const parsed = JSON.parse(raw) as { message?: string; error?: string };
            errorMessage = parsed.message || parsed.error || raw;
          }
        } catch {
          // Keep default message when response isn't JSON.
        }
        if (errorMessage.includes("Voting location does not match")) {
          errorMessage =
            "Vote rejected: your location must exactly match the resolution room coordinates.";
        }
        throw new Error(errorMessage);
      }
      await refreshData();
      setVoteForm((prev) => ({
        ...prev,
        proxyForUserId: "",
        proxyForName: "",
        latitude: "",
        longitude: ""
      }));
      setActionStatus({ kind: "success", message: "Vote submitted." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
    setTimeout(() => setIsSidebarVisible(true), 10);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
    setTimeout(() => setIsSidebarOpen(false), 240);
  };

  const swipeStartX = useRef<number | null>(null);
  const handleSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };
  const handleSwipeMove = (event: TouchEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) {
      return;
    }
    const deltaX = event.touches[0]?.clientX - swipeStartX.current;
    if (deltaX < -80) {
      swipeStartX.current = null;
      closeSidebar();
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <SidebarNav
              title="User Dashboard"
              subtitle="Review resolutions and cast your vote."
              items={USER_NAV}
              activeId={activePanel}
              onSelect={setActivePanel}
            >
              {currentUser && (
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-amber-100">
                  Signed in as <span className="font-semibold text-white">{currentUser.name}</span>
                </div>
              )}
              <ApiBaseField value={apiBase} onChange={setApiBase} />
            </SidebarNav>
          </div>

          {isSidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
                  isSidebarVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeSidebar}
                aria-label="Close menu"
              />
              <div
                className={`absolute left-4 top-4 w-[calc(100%-2rem)] max-w-sm transform transition-all duration-300 ease-out will-change-transform ${
                  isSidebarVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                }`}
                onTouchStart={handleSwipeStart}
                onTouchMove={handleSwipeMove}
              >
                <SidebarNav
                  title="User Dashboard"
                  subtitle="Review resolutions and cast your vote."
                  items={USER_NAV}
                  activeId={activePanel}
                  onSelect={(id) => {
                    setActivePanel(id);
                    closeSidebar();
                  }}
                  onClose={closeSidebar}
                >
                  {currentUser && (
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-amber-100">
                      Signed in as <span className="font-semibold text-white">{currentUser.name}</span>
                    </div>
                  )}
                  <ApiBaseField value={apiBase} onChange={setApiBase} />
                </SidebarNav>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="flex items-center justify-between">
              <LiveClock label="User Live" />
            </div>
            <div className="flex items-center justify-between lg:hidden">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">User</p>
              <button
                type="button"
                onClick={openSidebar}
                className="rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm"
              >
                Menu
              </button>
            </div>
            {activePanel === "dashboard" && (
              <div className="space-y-6">
                <SectionCard title="Published to Vote">
                  {publishedResolutions.length === 0 ? (
                    <p className="text-sm text-slate-500">No published resolutions yet.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {publishedResolutions.map((resolution) => (
                        <div key={resolution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Published</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">
                            {resolution.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
                          <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                            <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Active Voting">
                  {votingResolutions.length === 0 ? (
                    <p className="text-sm text-slate-500">No active voting sessions.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {votingResolutions.map((resolution) => (
                        <div key={resolution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{resolution.status}</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">
                            {resolution.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
                          <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                            <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Cast Vote">
                  {actionStatus && (
                    <p
                      className={`mb-4 rounded-xl px-4 py-2 text-sm ${
                        actionStatus.kind === "success"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {actionStatus.message}
                    </p>
                  )}
                  <UserVoteCard
                    voteForm={voteForm}
                    onChange={setVoteForm}
                    onSubmit={submitVote}
                    resolutions={voteResolutions}
                    users={users}
                    isProxyVoting={selectedVoteResolution?.status === "PROXY_VOTING"}
                    currentUserId={currentUser?.id ?? null}
                    currentUserRole={currentUser?.role ?? null}
                  />
                </SectionCard>

                <SectionCard title="Voting Results">
                  <div className="space-y-4">
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      value={resultsResolutionId}
                      onChange={(event) => setResultsResolutionId(event.target.value)}
                    >
                      <option value="">Select resolution</option>
                      {resolutions.map((resolution) => (
                        <option key={resolution.id} value={resolution.id}>
                          {resolution.title}
                        </option>
                      ))}
                    </select>
                    <UserResultsPanel results={results} />
                  </div>
                </SectionCard>
              </div>
            )}

            {activePanel === "active" && (
              <SectionCard title="Active Resolutions">
                {activeResolutions.length === 0 ? (
                  <p className="text-sm text-slate-500">No active resolutions right now.</p>
                ) : (
                  <UserResolutionList
                    resolutions={activeResolutions}
                    onSelectResults={handleResultsSelect}
                  />
                )}
              </SectionCard>
            )}

            {activePanel === "inactive" && (
              <SectionCard title="In-Active Resolutions">
                {inactiveResolutions.length === 0 ? (
                  <p className="text-sm text-slate-500">No inactive resolutions.</p>
                ) : (
                  <UserResolutionList
                    resolutions={inactiveResolutions}
                    onSelectResults={handleResultsSelect}
                  />
                )}
              </SectionCard>
            )}

            {activePanel === "completed" && (
              <SectionCard title="Completed Resolutions">
                {completedResolutions.length === 0 ? (
                  <p className="text-sm text-slate-500">No completed resolutions.</p>
                ) : (
                  <UserResolutionList
                    resolutions={completedResolutions}
                    onSelectResults={handleResultsSelect}
                  />
                )}
              </SectionCard>
            )}

            {activePanel === "results" && (
              <SectionCard title="Voting Results">
                <div className="space-y-4">
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={resultsResolutionId}
                    onChange={(event) => setResultsResolutionId(event.target.value)}
                  >
                    <option value="">Select resolution</option>
                    {resolutions.map((resolution) => (
                      <option key={resolution.id} value={resolution.id}>
                        {resolution.title}
                      </option>
                    ))}
                  </select>
                  <UserResultsPanel results={results} />
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
