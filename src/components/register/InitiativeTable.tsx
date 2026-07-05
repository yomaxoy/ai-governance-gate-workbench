"use client";

import Link from "next/link";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import type { Initiative } from "@/lib/types";
import { RiskBadge } from "@/components/ui/RiskBadge";

// Two-letter initials from an owner name, e.g. "Fabian Dietrich" -> "FD".
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function InitiativeTable({ items }: { items: Initiative[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left align-bottom text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-3 py-3">
              <span className="inline-flex items-center gap-1">
                KI-Initiativen
                <ArrowUpDown size={13} className="text-muted" />
              </span>
            </th>
            <th className="px-3 py-3">Lifecycle Status</th>
            <th className="px-3 py-3">Gate</th>
            <th className="px-3 py-3">Risiko</th>
            <th className="px-3 py-3">Datenklasse</th>
            <th className="px-3 py-3">AI Owner</th>
            <th className="px-3 py-3">Offene Auflagen</th>
            <th className="px-3 py-3">Nächstes Review</th>
            <th className="px-3 py-3">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr
              key={i.id}
              className="border-b border-border last:border-0 hover:bg-surface"
            >
              {/* 1 — KI-Initiativen */}
              <td className="px-3 py-3">
                <div className="font-semibold text-text">{i.title}</div>
                <div className="mt-0.5 text-xs text-muted">{i.description}</div>
              </td>

              {/* 2 — Lifecycle Status */}
              <td className="px-3 py-3">
                <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium text-text">
                  {i.lifecycleLabel}
                </span>
              </td>

              {/* 3 — Gate */}
              <td className="px-3 py-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i.currentGate}
                </span>
              </td>

              {/* 4 — Risiko */}
              <td className="px-3 py-3">
                <RiskBadge risk={i.risk} />
              </td>

              {/* 5 — Datenklasse */}
              <td className="px-3 py-3 text-text">{i.dataClass}</td>

              {/* 6 — AI Owner */}
              <td className="px-3 py-3">
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-[10px] font-semibold text-muted">
                    {initials(i.aiOwner)}
                  </span>
                  <span className="text-text">{i.aiOwner}</span>
                </span>
              </td>

              {/* 7 — Offene Auflagen */}
              <td className="px-3 py-3 text-text">{i.openAuflagen}</td>

              {/* 8 — Nächstes Review */}
              <td className="px-3 py-3 text-text">{i.nextReview}</td>

              {/* 9 — Aktion */}
              <td className="px-3 py-3">
                <Link
                  href={`/initiative/${i.id}`}
                  className="inline-flex items-center gap-0.5 font-medium text-info hover:underline"
                >
                  Details ansehen
                  <ChevronRight size={15} />
                </Link>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-10 text-center text-muted">
                Keine Initiativen gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
