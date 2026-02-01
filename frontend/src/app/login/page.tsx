"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ApiBaseField from "@/components/common/ApiBaseField";
import type { User } from "@/lib/types";

const API_DEFAULT = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("USER");
  const [apiBase, setApiBase] = useState(API_DEFAULT);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(
    () => users.filter((user) => user.role === role),
    [users, role]
  );

  useEffect(() => {
    const loadUsers = async () => {
      setError(null);
      try {
        const response = await fetch(`${apiBase}/api/users`);
        if (!response.ok) {
          throw new Error("Failed to load users");
        }
        setUsers(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error");
      }
    };

    loadUsers();
  }, [apiBase]);

  useEffect(() => {
    if (filteredUsers.length > 0) {
      setSelectedUserId(String(filteredUsers[0].id));
    } else {
      setSelectedUserId("");
    }
  }, [filteredUsers]);

  const handleLogin = () => {
    if (!selectedUserId) {
      setError("Select a user to continue.");
      return;
    }
    const user = users.find((item) => item.id === Number(selectedUserId));
    if (!user) {
      setError("Selected user not found.");
      return;
    }
    localStorage.setItem("rv_current_user", JSON.stringify(user));
    router.push(user.role === "ADMIN" ? "/admin" : "/user");
  };

  return (
    <div className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-700">LSVT Access</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 font-display">
          Welcome Back
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in to manage resolutions or cast your vote.
        </p>

        <ApiBaseField value={apiBase} onChange={setApiBase} />
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Role</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">User</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {filteredUsers.length === 0 ? (
                <option value="">No users available</option>
              ) : (
                filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="rounded-xl bg-amber-600 px-4 py-2 text-center font-semibold text-white hover:bg-amber-700"
          >
            Continue
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm text-slate-600"
          >
            Back to role selection
          </Link>
        </div>
      </div>
    </div>
  );
}
