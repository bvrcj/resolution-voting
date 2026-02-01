import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-sm ${
        className ?? ""
      }`}
    >
      <h2 className="text-lg font-semibold text-slate-900 font-display">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
