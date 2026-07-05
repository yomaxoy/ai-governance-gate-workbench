"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Collapsible card panel used across the detail view.
 * Header shows a small icon + title and a chevron; body sits below a divider.
 */
export function Panel({
  icon: Icon,
  title,
  defaultOpen = true,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-card border border-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 p-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text">
          {Icon && <Icon size={16} className="text-primary" />}
          {title}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && <div className="border-t border-border p-4">{children}</div>}
    </section>
  );
}
