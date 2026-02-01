import Link from "next/link";

export default function TempleHeader() {
  return (
    <header className="temple-header">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/90">
            Hindu Community and Cultural Center
          </p>
          <h1 className="mt-1 text-lg font-semibold text-white md:text-xl font-display">
            Shiva-Vishnu Temple, Livermore
          </h1>
          <p className="text-[10px] text-white/80">
            || Om Namah Shivaya || || Om Namo Narayanaya ||
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/80">
          <Link href="/login" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
            Login
          </Link>
          <Link href="/admin" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
            Admin
          </Link>
          <Link href="/user" className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">
            User
          </Link>
        </div>
      </div>
    </header>
  );
}
