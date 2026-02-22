import Link from "next/link";

export default function TempleHeader() {
  return (
    <header className="temple-header">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-1 text-lg font-semibold text-white md:text-xl font-display">
            Shiva-Vishnu Temple
          </h1>
          <p className="text-[12px] text-white/80">
            || Om Namah Shivaya || || Om Namo Narayanaya ||
          </p>
        </div>
      </div>
    </header>
  );
}
