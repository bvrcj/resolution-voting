import Link from "next/link";

export default function TempleFooter() {
  return (
    <footer className="temple-footer">
      <div className="mx-auto grid h-full max-w-6xl items-center gap-4 px-6 py-3 text-[11px] text-white/90 md:grid-cols-3">
        <div>
          <p className="text-xs text-white">© 2026 Hindu Community and Cultural Center</p>
        </div>
        <div className="text-center">

        </div>
        <div className="text-right">
          <p className="text-xs text-white">Terms and Conditions | Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
