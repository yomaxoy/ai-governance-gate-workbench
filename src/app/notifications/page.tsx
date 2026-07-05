"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { NotificationType } from "@/lib/types";

const TYPES: NotificationType[] = [
  "Alerts",
  "Policy",
  "Incident",
  "Re-Approval",
  "New Request",
];

export default function NotificationsPage() {
  const { notifications, markAllRead } = useApp();
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<NotificationType | null>(null);

  const filtered = notifications.filter(
    (n) =>
      (!activeType || n.type === activeType) &&
      (n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.initiativeName.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHeader icon={Bell} title="Risks & Notifications">
        <button
          onClick={markAllRead}
          className="text-sm font-medium text-info hover:underline"
        >
          Alle als gelesen markieren
        </button>
      </PageHeader>

      <section className="rounded-card border border-border bg-white p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text">
            Alle Benachrichtigungen
          </h2>
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Search size={15} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveType(null)}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              activeType === null
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-white text-text hover:bg-surface"
            }`}
          >
            Alle
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                activeType === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-text hover:bg-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-border">
          {filtered.map((n) => (
            <li key={n.id} className="flex items-center gap-3 py-3">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  n.read ? "bg-transparent" : "bg-info"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {n.title}
                </p>
                <p className="truncate text-xs text-muted">{n.initiativeName}</p>
              </div>
              <TypeBadge type={n.type} />
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-8 text-center text-sm text-muted">
              Keine Benachrichtigungen.
            </li>
          )}
        </ul>
      </section>
    </>
  );
}
