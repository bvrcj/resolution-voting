"use client";

import { useEffect, useState } from "react";

type LiveClockProps = {
  label?: string;
};

export default function LiveClock({ label = "Live" }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(now)
    : "—";

  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-semibold text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        {label}
      </span>
      <span suppressHydrationWarning>{isMounted ? formatted : "—"}</span>
    </div>
  );
}
