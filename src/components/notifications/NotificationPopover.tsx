"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { TypeBadge } from "@/components/ui/TypeBadge";

export function NotificationPopover({ onClose }: { onClose: () => void }) {
  const { notifications } = useApp();
  const items = notifications.slice(0, 4);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-11 z-50 w-80 rounded-card border border-border bg-white shadow-lg">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-text">Benachrichtigungen</h3>
        </div>
        <ul className="max-h-80 overflow-y-auto scroll-thin">
          {items.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
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
        </ul>
        <div className="px-4 py-3 text-right">
          <Link
            href="/notifications"
            onClick={onClose}
            className="text-sm font-medium text-primary hover:underline"
          >
            alle Ansehen ›
          </Link>
        </div>
      </div>
    </>
  );
}
