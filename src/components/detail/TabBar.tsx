"use client";

/** Underline tab bar; the active tab uses border-b-2 border-primary text-primary. */
export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-border">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`-mb-px border-b-2 pb-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-text"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
