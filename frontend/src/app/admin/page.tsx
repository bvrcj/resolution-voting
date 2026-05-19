"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { useRouter } from "next/navigation";
import ApiBaseField from "@/components/common/ApiBaseField";
import LiveClock from "@/components/common/LiveClock";
import SectionCard from "@/components/common/SectionCard";
import AdminResultsPanel from "@/components/admin/AdminResultsPanel";
import AdminVoteCard from "@/components/admin/AdminVoteCard";
import SidebarNav from "@/components/layout/SidebarNav";
import type { Resolution, Results, Room, User } from "@/lib/types";
import { formatDateTime } from "@/lib/date";

const API_DEFAULT = "http://localhost:8080";
const ROOM_PAGE_SIZE = 5;
const RESOLUTION_PAGE_SIZE = 5;
const USER_PAGE_SIZE = 6;

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", description: "Draft, published, and live voting." },
  { id: "rooms", label: "Rooms", description: "Create, edit, and delete rooms." },
  { id: "resolutions", label: "Resolutions", description: "Manage drafts and voting states." },
  { id: "users", label: "Users", description: "Create, edit, and delete voters." },
  { id: "voting", label: "Voting & Results", description: "Cast votes and review results." }
];

type RoomForm = {
  name: string;
  latitude: string;
  longitude: string;
};

type ResolutionForm = {
  title: string;
  description: string;
  roomId: string;
  publishAt: string;
  votingStartAt: string;
  votingEndAt: string;
  primaryPurposePersonId: string;
  secondaryPurposePersonId: string;
};

type VoteForm = {
  resolutionId: string;
  proxyForUserId: string;
  proxyForName: string;
  choice: string;
  latitude: string;
  longitude: string;
};

type UserForm = {
  name: string;
  email: string;
  role: string;
};

type ActionStatus = {
  kind: "success" | "error";
  message: string;
} | null;

type PagerProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

function Pager({ page, totalPages, onPrev, onNext }: PagerProps) {
  return (
    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-full border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-full border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [apiBase, setApiBase] = useState(API_DEFAULT);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [resultsResolutionId, setResultsResolutionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<ActionStatus>(null);
  const [actionScope, setActionScope] = useState<string | null>(null);
  const [roomForm, setRoomForm] = useState<RoomForm>({ name: "", latitude: "", longitude: "" });
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [roomPage, setRoomPage] = useState(1);
  const [resolutionForm, setResolutionForm] = useState<ResolutionForm>({
    title: "",
    description: "",
    roomId: "",
    publishAt: "",
    votingStartAt: "",
    votingEndAt: "",
    primaryPurposePersonId: "",
    secondaryPurposePersonId: ""
  });
  const [editingResolutionId, setEditingResolutionId] = useState<number | null>(null);
  const [resolutionPage, setResolutionPage] = useState(1);
  const [userForm, setUserForm] = useState<UserForm>({ name: "", email: "", role: "USER" });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userPage, setUserPage] = useState(1);
  const [voteForm, setVoteForm] = useState<VoteForm>({
    resolutionId: "",
    proxyForUserId: "",
    proxyForName: "",
    choice: "FOR",
    latitude: "",
    longitude: ""
  });

  const draftResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "DRAFT"),
    [resolutions]
  );
  const publishedResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "PUBLISHED"),
    [resolutions]
  );
  const votingResolutions = useMemo(
    () => resolutions.filter((item) => item.status === "VOTING" || item.status === "PROXY_VOTING"),
    [resolutions]
  );

  const roomTotalPages = Math.max(1, Math.ceil(rooms.length / ROOM_PAGE_SIZE));
  const resolutionTotalPages = Math.max(1, Math.ceil(resolutions.length / RESOLUTION_PAGE_SIZE));
  const userTotalPages = Math.max(1, Math.ceil(users.length / USER_PAGE_SIZE));

  const pagedRooms = useMemo(() => {
    const start = (roomPage - 1) * ROOM_PAGE_SIZE;
    return rooms.slice(start, start + ROOM_PAGE_SIZE);
  }, [rooms, roomPage]);

  const pagedResolutions = useMemo(() => {
    const start = (resolutionPage - 1) * RESOLUTION_PAGE_SIZE;
    return resolutions.slice(start, start + RESOLUTION_PAGE_SIZE);
  }, [resolutions, resolutionPage]);

  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * USER_PAGE_SIZE;
    return users.slice(start, start + USER_PAGE_SIZE);
  }, [users, userPage]);

  const refreshData = async () => {
    setError(null);
    setActionStatus(null);
    setActionScope(null);
    try {
      const [roomRes, resolutionRes, userRes] = await Promise.all([
        fetch(`${apiBase}/api/rooms`),
        fetch(`${apiBase}/api/resolutions`),
        fetch(`${apiBase}/api/users`)
      ]);
      if (!roomRes.ok || !resolutionRes.ok || !userRes.ok) {
        throw new Error("Failed to load admin data");
      }
      setRooms(await roomRes.json());
      setResolutions(await resolutionRes.json());
      setUsers(await userRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    }
  };

  const renderActionStatus = (scope: string) => {
    if (!actionStatus || actionScope !== scope) {
      return null;
    }
    return (
      <p
        className={`rounded-xl px-4 py-2 text-sm ${
          actionStatus.kind === "success"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {actionStatus.message}
      </p>
    );
  };

  useEffect(() => {
    refreshData();
  }, [apiBase]);

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem("rv_current_user");
      const token = localStorage.getItem("rv_auth_token");
      const expiry = localStorage.getItem("rv_token_expiry");

      if (!stored || !token) {
        router.push("/login");
        return;
      }

      // Check token expiry
      if (expiry && Date.now() > Number(expiry)) {
        localStorage.clear();
        router.push("/login");
        return;
      }

      const parsed = JSON.parse(stored) as User;
      if (parsed.role !== "ADMIN") {
        router.push("/login");
        return;
      }
      setCurrentUser(parsed);
    };

    checkAuth();

    // Check session every minute
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    if (!resultsResolutionId && resolutions.length > 0) {
      setResultsResolutionId(String(resolutions[0].id));
    }
  }, [resolutions, resultsResolutionId]);

  useEffect(() => {
    const loadResults = async () => {
      if (!resultsResolutionId) {
        setResults(null);
        return;
      }
      try {
        const res = await fetch(`${apiBase}/api/resolutions/${resultsResolutionId}/results`);
        if (res.ok) {
          setResults(await res.json());
        } else {
          setResults(null);
        }
      } catch {
        setResults(null);
      }
    };

    loadResults();
  }, [apiBase, resultsResolutionId]);

  useEffect(() => {
    if (roomPage > roomTotalPages) {
      setRoomPage(roomTotalPages);
    }
  }, [roomPage, roomTotalPages]);

  useEffect(() => {
    if (resolutionPage > resolutionTotalPages) {
      setResolutionPage(resolutionTotalPages);
    }
  }, [resolutionPage, resolutionTotalPages]);

  useEffect(() => {
    if (userPage > userTotalPages) {
      setUserPage(userTotalPages);
    }
  }, [userPage, userTotalPages]);

  useEffect(() => {
    if (!voteForm.resolutionId && resolutions.length > 0) {
      setVoteForm((prev) => ({ ...prev, resolutionId: String(resolutions[0].id) }));
    }
  }, [resolutions, voteForm.resolutionId]);

  const selectedVoteResolution = useMemo(
    () => resolutions.find((item) => item.id === Number(voteForm.resolutionId)),
    [resolutions, voteForm.resolutionId]
  );

  useEffect(() => {
    if (selectedVoteResolution?.status !== "PROXY_VOTING") {
      setVoteForm((prev) => ({ ...prev, proxyForUserId: "", proxyForName: "" }));
    }
  }, [selectedVoteResolution]);

  const submitRoom = async () => {
    setError(null);
    setActionStatus(null);
    setActionScope("rooms");
    try {
      const endpoint = editingRoomId ? `${apiBase}/api/rooms/${editingRoomId}` : `${apiBase}/api/rooms`;
      const response = await fetch(endpoint, {
        method: editingRoomId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomForm.name,
          latitude: Number(roomForm.latitude),
          longitude: Number(roomForm.longitude)
        })
      });
      if (!response.ok) {
        throw new Error(editingRoomId ? "Failed to update room" : "Failed to create room");
      }
      setRoomForm({ name: "", latitude: "", longitude: "" });
      setEditingRoomId(null);
      await refreshData();
      setActionStatus({
        kind: "success",
        message: editingRoomId ? "Room updated." : "Room created."
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const editRoom = (room: Room) => {
    setRoomForm({
      name: room.name,
      latitude: String(room.latitude),
      longitude: String(room.longitude)
    });
    setEditingRoomId(room.id);
  };

  const cancelRoomEdit = () => {
    setRoomForm({ name: "", latitude: "", longitude: "" });
    setEditingRoomId(null);
  };

  const deleteRoom = async (id: number) => {
    setError(null);
    setActionStatus(null);
    setActionScope("rooms");
    try {
      const response = await fetch(`${apiBase}/api/rooms/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      await refreshData();
      setActionStatus({ kind: "success", message: "Room deleted." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const submitResolution = async () => {
    setError(null);
    setActionStatus(null);
    setActionScope("resolutions");
    try {
      const endpoint = editingResolutionId
        ? `${apiBase}/api/resolutions/${editingResolutionId}`
        : `${apiBase}/api/resolutions`;

      const toIso = (value: string) => (value ? new Date(value).toISOString() : null);
      const response = await fetch(endpoint, {
        method: editingResolutionId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: resolutionForm.title,
          description: resolutionForm.description,
          roomId: Number(resolutionForm.roomId),
          publishAt: toIso(resolutionForm.publishAt),
          votingStartAt: toIso(resolutionForm.votingStartAt),
          votingEndAt: toIso(resolutionForm.votingEndAt),
          primaryPurposePersonId: resolutionForm.primaryPurposePersonId ? Number(resolutionForm.primaryPurposePersonId) : null,
          secondaryPurposePersonId: resolutionForm.secondaryPurposePersonId ? Number(resolutionForm.secondaryPurposePersonId) : null
        })
      });
      if (!response.ok) {
        throw new Error(editingResolutionId ? "Failed to update resolution" : "Failed to create resolution");
      }
      setResolutionForm({
        title: "",
        description: "",
        roomId: "",
        publishAt: "",
        votingStartAt: "",
        votingEndAt: "",
        primaryPurposePersonId: "",
        secondaryPurposePersonId: ""
      });
      setEditingResolutionId(null);
      await refreshData();
      setActionStatus({
        kind: "success",
        message: editingResolutionId ? "Resolution updated." : "Resolution created."
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const editResolution = (resolution: Resolution) => {
    const toInput = (value?: string | null) => {
      if (!value) {
        return "";
      }
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "";
      }
      const pad = (num: number) => String(num).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}`;
    };
    setResolutionForm({
      title: resolution.title,
      description: resolution.description,
      roomId: String(resolution.room?.id ?? ""),
      publishAt: toInput(resolution.publishAt),
      votingStartAt: toInput(resolution.votingStartAt),
      votingEndAt: toInput(resolution.votingEndAt),
      primaryPurposePersonId: String(resolution.primaryPurposePerson?.id ?? ""),
      secondaryPurposePersonId: String(resolution.secondaryPurposePerson?.id ?? "")
    });
    setEditingResolutionId(resolution.id);
  };

  const cancelResolutionEdit = () => {
    setResolutionForm({
      title: "",
      description: "",
      roomId: "",
      publishAt: "",
      votingStartAt: "",
      votingEndAt: "",
      primaryPurposePersonId: "",
      secondaryPurposePersonId: ""
    });
    setEditingResolutionId(null);
  };

  const deleteResolution = async (id: number) => {
    setError(null);
    setActionStatus(null);
    setActionScope("resolutions");
    try {
      const response = await fetch(`${apiBase}/api/resolutions/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete resolution");
      }
      await refreshData();
      setActionStatus({ kind: "success", message: "Resolution deleted." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const submitUser = async () => {
    setError(null);
    setActionStatus(null);
    setActionScope("users");
    try {
      const endpoint = editingUserId ? `${apiBase}/api/users/${editingUserId}` : `${apiBase}/api/users`;
      const response = await fetch(endpoint, {
        method: editingUserId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          role: userForm.role
        })
      });
      if (!response.ok) {
        throw new Error(editingUserId ? "Failed to update user" : "Failed to create user");
      }
      setUserForm({ name: "", email: "", role: "USER" });
      setEditingUserId(null);
      await refreshData();
      setActionStatus({
        kind: "success",
        message: editingUserId ? "User updated." : "User created."
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const editUser = (user: User) => {
    setUserForm({ name: user.name, email: user.email, role: user.role });
    setEditingUserId(user.id);
  };

  const cancelUserEdit = () => {
    setUserForm({ name: "", email: "", role: "USER" });
    setEditingUserId(null);
  };

  const deleteUser = async (id: number) => {
    setError(null);
    setActionStatus(null);
    setActionScope("users");
    try {
      const response = await fetch(`${apiBase}/api/users/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      await refreshData();
      setActionStatus({ kind: "success", message: "User deleted." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const updateResolutionStatus = async (id: number, action: string) => {
    setError(null);
    setActionStatus(null);
    setActionScope("resolutions");
    try {
      const response = await fetch(`${apiBase}/api/resolutions/${id}/${action}`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action.replace("-", " ")}`);
      }
      await refreshData();
      setActionStatus({
        kind: "success",
        message: `Resolution ${action.replace("-", " ")} successful.`
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setActionStatus({ kind: "error", message });
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("rv_auth_token");
      if (token) {
        await fetch(`${apiBase}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      router.push("/login");
    }
  };

  const submitVote = async () => {
    setError(null);
    setActionStatus(null);
    setActionScope("voting");
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
      setVoteForm({
        resolutionId: voteForm.resolutionId,
        proxyForUserId: "",
        proxyForName: "",
        choice: "FOR",
        latitude: "",
        longitude: ""
      });
      await refreshData();
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
              title="Admin Console"
              subtitle="Manage rooms, resolutions, and voting flows."
              items={ADMIN_NAV}
              activeId={activePanel}
              onSelect={setActivePanel}
            >
              {currentUser && (
                <div className="space-y-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-amber-100">
                    Signed in as <span className="font-semibold text-white">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-red-600/80 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
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
                  title="Admin Console"
                  subtitle="Manage rooms, resolutions, and voting flows."
                  items={ADMIN_NAV}
                  activeId={activePanel}
                  onSelect={(id) => {
                    setActivePanel(id);
                    closeSidebar();
                  }}
                  onClose={closeSidebar}
                >
                  {currentUser && (
                    <div className="space-y-2">
                      <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-amber-100">
                        Signed in as <span className="font-semibold text-white">{currentUser.name}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-red-600/80 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Logout
                      </button>
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
              <LiveClock label="Admin Live" />
            </div>
            <div className="flex items-center justify-between lg:hidden">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700">Admin</p>
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
                <SectionCard title="Draft Resolutions">
                  {draftResolutions.length === 0 ? (
                    <p className="text-sm text-slate-500">No draft resolutions yet.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {draftResolutions.map((resolution) => (
                        <div key={resolution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Draft</p>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">
                            {resolution.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
                          <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
                          {(resolution.primaryPurposePerson || resolution.secondaryPurposePerson) && (
                            <div className="mt-2 space-y-1 text-xs text-slate-600">
                              {resolution.primaryPurposePerson && (
                                <p>Primary: {resolution.primaryPurposePerson.name}</p>
                              )}
                              {resolution.secondaryPurposePerson && (
                                <p>Secondary: {resolution.secondaryPurposePerson.name}</p>
                              )}
                            </div>
                          )}
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Publish At: {formatDateTime(resolution.publishAt)}</span>
                            <span>Scheduled Start: {formatDateTime(resolution.votingStartAt)}</span>
                            <span>Scheduled End: {formatDateTime(resolution.votingEndAt)}</span>
                            <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                            <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Published Resolutions">
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
                          {(resolution.primaryPurposePerson || resolution.secondaryPurposePerson) && (
                            <div className="mt-2 space-y-1 text-xs text-slate-600">
                              {resolution.primaryPurposePerson && (
                                <p>Primary: {resolution.primaryPurposePerson.name}</p>
                              )}
                              {resolution.secondaryPurposePerson && (
                                <p>Secondary: {resolution.secondaryPurposePerson.name}</p>
                              )}
                            </div>
                          )}
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Publish At: {formatDateTime(resolution.publishAt)}</span>
                            <span>Scheduled Start: {formatDateTime(resolution.votingStartAt)}</span>
                            <span>Scheduled End: {formatDateTime(resolution.votingEndAt)}</span>
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
                          {(resolution.primaryPurposePerson || resolution.secondaryPurposePerson) && (
                            <div className="mt-2 space-y-1 text-xs text-slate-600">
                              {resolution.primaryPurposePerson && (
                                <p>Primary: {resolution.primaryPurposePerson.name}</p>
                              )}
                              {resolution.secondaryPurposePerson && (
                                <p>Secondary: {resolution.secondaryPurposePerson.name}</p>
                              )}
                            </div>
                          )}
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Publish At: {formatDateTime(resolution.publishAt)}</span>
                            <span>Scheduled Start: {formatDateTime(resolution.votingStartAt)}</span>
                            <span>Scheduled End: {formatDateTime(resolution.votingEndAt)}</span>
                            <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                            <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
            )}

            {activePanel === "rooms" && (
              <div className="space-y-4">
                {renderActionStatus("rooms")}
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <SectionCard title={editingRoomId ? "Edit Room" : "Create Room"}>
                  <div className="space-y-3 text-sm">
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      placeholder="Room name"
                      value={roomForm.name}
                      onChange={(event) => setRoomForm({ ...roomForm, name: event.target.value })}
                    />
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      placeholder="Latitude"
                      value={roomForm.latitude}
                      onChange={(event) => setRoomForm({ ...roomForm, latitude: event.target.value })}
                    />
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      placeholder="Longitude"
                      value={roomForm.longitude}
                      onChange={(event) => setRoomForm({ ...roomForm, longitude: event.target.value })}
                    />
                    <button
                      onClick={submitRoom}
                      className="w-full rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
                    >
                      {editingRoomId ? "Update Room" : "Create Room"}
                    </button>
                    {editingRoomId && (
                      <button
                        type="button"
                        onClick={cancelRoomEdit}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Room Directory">
                  {rooms.length === 0 ? (
                    <p className="text-sm text-slate-500">No rooms created yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {pagedRooms.map((room) => (
                        <div
                          key={room.id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Room #{room.id}</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">{room.name}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              Lat {room.latitude} · Long {room.longitude}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => editRoom(room)}
                              className="rounded-full bg-amber-100 px-3 py-1 text-amber-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRoom(room.id)}
                              className="rounded-full bg-rose-100 px-3 py-1 text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <Pager
                        page={roomPage}
                        totalPages={roomTotalPages}
                        onPrev={() => setRoomPage((prev) => Math.max(1, prev - 1))}
                        onNext={() => setRoomPage((prev) => Math.min(roomTotalPages, prev + 1))}
                      />
                    </div>
                  )}
                </SectionCard>
                </div>
              </div>
            )}

            {activePanel === "resolutions" && (
              <div className="space-y-4">
                {renderActionStatus("resolutions")}
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <SectionCard title={editingResolutionId ? "Edit Resolution" : "Create Resolution"}>
                  <div className="space-y-3 text-sm">
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Title
                      <input
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        placeholder="Title"
                        value={resolutionForm.title}
                        onChange={(event) => setResolutionForm({ ...resolutionForm, title: event.target.value })}
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Description
                      <textarea
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        placeholder="Description"
                        rows={3}
                        value={resolutionForm.description}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, description: event.target.value })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Room
                      <select
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        value={resolutionForm.roomId}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, roomId: event.target.value })
                        }
                      >
                        <option value="">Select room</option>
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Publish Date/Time
                      <input
                        type="datetime-local"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        placeholder="Publish date/time"
                        value={resolutionForm.publishAt}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, publishAt: event.target.value })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Voting Start Date/Time
                      <input
                        type="datetime-local"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        placeholder="Voting start date/time"
                        value={resolutionForm.votingStartAt}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, votingStartAt: event.target.value })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Voting End Date/Time
                      <input
                        type="datetime-local"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        placeholder="Voting end date/time"
                        value={resolutionForm.votingEndAt}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, votingEndAt: event.target.value })
                        }
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Primary Purpose Person
                      <select
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        value={resolutionForm.primaryPurposePersonId}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, primaryPurposePersonId: event.target.value })
                        }
                      >
                        <option value="">Select user (optional)</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Secondary Purpose Person
                      <select
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                        value={resolutionForm.secondaryPurposePersonId}
                        onChange={(event) =>
                          setResolutionForm({ ...resolutionForm, secondaryPurposePersonId: event.target.value })
                        }
                      >
                        <option value="">Select user (optional)</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      onClick={submitResolution}
                      disabled={!resolutionForm.roomId}
                      className="w-full rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {editingResolutionId ? "Update Resolution" : "Create Resolution"}
                    </button>
                    {editingResolutionId && (
                      <button
                        type="button"
                        onClick={cancelResolutionEdit}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Resolution Directory">
                  {resolutions.length === 0 ? (
                    <p className="text-sm text-slate-500">No resolutions created yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {pagedResolutions.map((resolution) => (
                        <div key={resolution.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>{resolution.status}</span>
                            <span>#{resolution.id}</span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-slate-900 font-display">
                            {resolution.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-600">{resolution.description}</p>
                          <p className="mt-3 text-xs text-slate-500">Room: {resolution.room?.name}</p>
                          {(resolution.primaryPurposePerson || resolution.secondaryPurposePerson) && (
                            <div className="mt-2 space-y-1 text-xs text-slate-600">
                              {resolution.primaryPurposePerson && (
                                <p><span className="font-semibold">Primary:</span> {resolution.primaryPurposePerson.name}</p>
                              )}
                              {resolution.secondaryPurposePerson && (
                                <p><span className="font-semibold">Secondary:</span> {resolution.secondaryPurposePerson.name}</p>
                              )}
                            </div>
                          )}
                          <div className="mt-3 grid gap-1 text-[11px] text-slate-500">
                            <span>Created: {formatDateTime(resolution.createdAt)}</span>
                            <span>Updated: {formatDateTime(resolution.updatedAt)}</span>
                            <span>Publish At: {formatDateTime(resolution.publishAt)}</span>
                            <span>Scheduled Start: {formatDateTime(resolution.votingStartAt)}</span>
                            <span>Scheduled End: {formatDateTime(resolution.votingEndAt)}</span>
                            <span>Voting Start: {formatDateTime(resolution.votingStartedAt)}</span>
                            <span>Voting End: {formatDateTime(resolution.votingEndedAt)}</span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            {(resolution.status === "DRAFT" || resolution.status === "PUBLISHED") && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => editResolution(resolution)}
                                  className="rounded-full bg-amber-100 px-3 py-1 text-amber-800"
                                >
                                  Edit
                                </button>
                                {resolution.status === "DRAFT" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => deleteResolution(resolution.id)}
                                      className="rounded-full bg-rose-100 px-3 py-1 text-rose-700"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => updateResolutionStatus(resolution.id, "publish")}
                                      className="rounded-full bg-amber-100 px-3 py-1 text-amber-800"
                                    >
                                      Publish
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                            {resolution.status === "PUBLISHED" && (
                              <button
                                type="button"
                                onClick={() => updateResolutionStatus(resolution.id, "start-voting")}
                                className="rounded-full bg-sky-100 px-3 py-1 text-sky-800"
                              >
                                Start Voting
                              </button>
                            )}
                            {resolution.status === "VOTING" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => updateResolutionStatus(resolution.id, "end-direct-voting")}
                                  className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800"
                                >
                                  End Direct
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateResolutionStatus(resolution.id, "start-proxy-voting")}
                                  className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800"
                                >
                                  Start Proxy
                                </button>
                              </>
                            )}
                            {resolution.status === "PROXY_VOTING" && (
                              <button
                                type="button"
                                onClick={() => updateResolutionStatus(resolution.id, "end-proxy-voting")}
                                className="rounded-full bg-rose-100 px-3 py-1 text-rose-800"
                              >
                                End Proxy
                              </button>
                            )}
                            {resolution.status === "CLOSED" && (
                              <button
                                type="button"
                                onClick={() => updateResolutionStatus(resolution.id, "publish-results")}
                                className="rounded-full bg-slate-100 px-3 py-1 text-slate-800"
                              >
                                Publish Results
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <Pager
                        page={resolutionPage}
                        totalPages={resolutionTotalPages}
                        onPrev={() => setResolutionPage((prev) => Math.max(1, prev - 1))}
                        onNext={() => setResolutionPage((prev) => Math.min(resolutionTotalPages, prev + 1))}
                      />
                    </div>
                  )}
                </SectionCard>
                </div>
              </div>
            )}

            {activePanel === "users" && (
              <div className="space-y-4">
                {renderActionStatus("users")}
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                <SectionCard title={editingUserId ? "Edit User" : "Create User"}>
                  <div className="space-y-3 text-sm">
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      placeholder="Name"
                      value={userForm.name}
                      onChange={(event) => setUserForm({ ...userForm, name: event.target.value })}
                    />
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      placeholder="Email"
                      value={userForm.email}
                      onChange={(event) => setUserForm({ ...userForm, email: event.target.value })}
                    />
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      value={userForm.role}
                      onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="USER">USER</option>
                    </select>
                    <button
                      onClick={submitUser}
                      className="w-full rounded-xl bg-indigo-700 px-4 py-2 font-semibold text-white hover:bg-indigo-800"
                    >
                      {editingUserId ? "Update User" : "Create User"}
                    </button>
                    {editingUserId && (
                      <button
                        type="button"
                        onClick={cancelUserEdit}
                        className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="User Directory">
                  {users.length === 0 ? (
                    <p className="text-sm text-slate-500">No users created yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {pagedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">User #{user.id}</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">{user.name}</div>
                            <div className="mt-1 text-xs text-slate-500">{user.email}</div>
                            <div className="mt-1 text-xs text-slate-500">Role: {user.role}</div>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => editUser(user)}
                              className="rounded-full bg-amber-100 px-3 py-1 text-amber-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteUser(user.id)}
                              className="rounded-full bg-rose-100 px-3 py-1 text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      <Pager
                        page={userPage}
                        totalPages={userTotalPages}
                        onPrev={() => setUserPage((prev) => Math.max(1, prev - 1))}
                        onNext={() => setUserPage((prev) => Math.min(userTotalPages, prev + 1))}
                      />
                    </div>
                  )}
                </SectionCard>
                </div>
              </div>
            )}

            {activePanel === "voting" && (
              <div className="space-y-4">
                {renderActionStatus("voting")}
                <div className="grid gap-6 lg:grid-cols-2">
                  <AdminVoteCard
                    voteForm={voteForm}
                    onChange={setVoteForm}
                    onSubmit={submitVote}
                    resolutions={resolutions}
                    users={users}
                    isProxyVoting={selectedVoteResolution?.status === "PROXY_VOTING"}
                    currentUserId={currentUser?.id ?? null}
                  />
                  <SectionCard title="Resolution Results">
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
                      <AdminResultsPanel results={results} />
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
