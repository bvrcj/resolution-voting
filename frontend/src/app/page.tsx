import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/30 bg-white/70 p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-700">LSVT Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl font-display">
            Siva Vishnu Temple Resolution Voting
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-700">
            Choose a role or sign in to access the voting experience.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Link
              href="/login"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-900 font-display">Login</h2>
              <p className="mt-2 text-sm text-slate-600">Enter and route by role.</p>
            </Link>
            <Link
              href="/admin"
              className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-amber-900 font-display">Admin Console</h2>
              <p className="mt-2 text-sm text-amber-800">
                Manage rooms, resolutions, and voting lifecycle.
              </p>
            </Link>
            <Link
              href="/user"
              className="rounded-2xl border border-sky-200 bg-sky-50 px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-sky-900 font-display">User Voting</h2>
              <p className="mt-2 text-sm text-sky-800">
                View resolutions, cast votes, and check results.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
