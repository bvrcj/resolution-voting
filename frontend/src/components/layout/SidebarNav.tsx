import type { ReactNode } from "react";

type SidebarItem = {
  id: string;
  label: string;
  description?: string;
};

type SidebarNavProps = {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  children?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
};

export default function SidebarNav({
  title,
  subtitle,
  items,
  activeId,
  onSelect,
  children,
  onClose,
  closeLabel = "Move --> Left menu"
}: SidebarNavProps) {
  return (
    <aside className="temple-glass rounded-3xl p-6 text-slate-900 shadow-xl">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mb-4 w-full rounded-2xl border border-amber-200 bg-white/70 px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.3em] text-amber-800 transition hover:bg-amber-50"
        >
          {closeLabel}
        </button>
      )}
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Console</p>
        <h2 className="mt-3 text-2xl font-semibold font-display">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
      </div>
      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                isActive
                  ? "border-amber-300 bg-amber-50 text-slate-900 shadow-lg"
                  : "border-slate-200 bg-white/60 text-slate-700 hover:border-amber-200 hover:bg-amber-50/60"
              }`}
            >
              <div className="font-semibold">{item.label}</div>
              {item.description && <div className="mt-1 text-xs text-slate-500">{item.description}</div>}
            </button>
          );
        })}
      </nav>
      {children && <div className="mt-6 border-t border-slate-200/60 pt-6">{children}</div>}
    </aside>
  );
}
