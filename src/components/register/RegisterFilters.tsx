"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

interface RegisterFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  /** Number of currently matching initiatives, shown as result counter. */
  resultCount: number;
  /** AI Owner names for the AI OWNER selector (visual only). */
  owners?: string[];
}

interface SelectorConfig {
  label: string;
  options: string[];
}

export function RegisterFilters({
  query,
  onQueryChange,
  resultCount,
  owners = [],
}: RegisterFiltersProps) {
  const selectors: SelectorConfig[] = [
    { label: "STATUS", options: ["In Prüfung", "Freigegeben", "Pausiert", "Stillgelegt"] },
    { label: "GATE", options: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5"] },
    { label: "RISIKO", options: ["Low Risk", "Medium Risk", "High Risk", "in Prüfung"] },
    { label: "AI OWNER", options: owners },
  ];

  return (
    <section className="mb-6 rounded-card border border-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full bg-surface px-4 py-2">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="KI-Initiative suchen…"
            className="w-52 max-w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-text">
            {resultCount} KI-Initiativen
          </span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-surface"
          >
            <SlidersHorizontal size={15} className="text-muted" />
            weitere Filter
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
        {selectors.map((sel) => (
          <label
            key={sel.label}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"
          >
            <span className="whitespace-nowrap">{sel.label}:</span>
            <div className="relative flex-1">
              <select
                defaultValue=""
                className="w-full appearance-none rounded-md border border-border bg-white py-1.5 pl-3 pr-8 text-sm font-normal normal-case text-text outline-none focus:border-primary"
              >
                <option value="">Alle</option>
                {sel.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
