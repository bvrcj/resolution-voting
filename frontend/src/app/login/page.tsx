"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ApiBaseField from "@/components/common/ApiBaseField";

const API_DEFAULT = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [apiBase, setApiBase] = useState(API_DEFAULT);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Invalid username or password");
      }

      const data = await response.json();

      // Store token and user info
      localStorage.setItem("rv_auth_token", data.token);
      localStorage.setItem("rv_current_user", JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
      }));
      localStorage.setItem("rv_token_expiry", String(Date.now() + 7 * 24 * 60 * 60 * 1000));
      localStorage.setItem("rv_api_base", apiBase);

      // Redirect based on role
      router.push(data.role === "ADMIN" ? "/admin" : "/user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleLogin} className="mt-6 space-y-4 text-sm">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Email / Username
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Password
            </label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="mt-8 grid gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-600 px-4 py-2 text-center font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm text-slate-600 hover:bg-slate-50"
            >
              Back to home
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          For testing: Use any user email from the system as username
        </p>
      </div>
    </div>
  );
}
