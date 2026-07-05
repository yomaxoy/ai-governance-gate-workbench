"use client";

import { useState } from "react";
import { AlertCircle, Check, ChevronDown, HelpCircle } from "lucide-react";
import type { CriterionData, CriterionStatus, GateId } from "@/lib/types";

function StatusIcon({ status }: { status: CriterionStatus }) {
  switch (status) {
    case "met":
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <Check size={12} />
        </span>
      );
    case "open":
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning text-white">
          <HelpCircle size={12} />
        </span>
      );
    case "problem":
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger text-white">
          <AlertCircle size={12} />
        </span>
      );
    default:
      return (
        <span className="h-5 w-5 shrink-0 rounded-full border-2 border-border" />
      );
  }
}

export function CriteriaChecklist({
  gate,
  criteria,
}: {
  gate: GateId;
  criteria: CriterionData[];
}) {
  const [open, setOpen] = useState(true);

  // split into 3 columns
  const cols: CriterionData[][] = [[], [], []];
  criteria.forEach((c, i) => cols[i % 3].push(c));

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-text">
          Gate {gate} Prüfkriterien
        </h3>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-3">
          {cols.map((col, ci) => (
            <ul key={ci} className="space-y-3">
              {col.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  <StatusIcon status={c.status} />
                  <span className="text-sm leading-snug text-text">
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      )}
    </div>
  );
}
