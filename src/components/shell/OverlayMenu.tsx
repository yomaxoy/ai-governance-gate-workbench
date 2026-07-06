"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutGrid, Home, Search } from "lucide-react";
import { RECENTS } from "@/lib/mock-data";
import { UserCard } from "./UserCard";

const MAIN_MENU = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/register", label: "AI Register", icon: LayoutGrid },
  { href: "/drafts", label: "My Drafts", icon: FileText },
];

export function OverlayMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  if (!open) return null;

  return (
    <>
      {/* Click-away backdrop */}
      <div className="fixed inset-0 top-14 z-30" onClick={onClose} />
      <aside className="fixed left-0 top-14 bottom-0 z-40 flex w-72 flex-col border-r border-border bg-white shadow-sm">
        <div className="p-3">
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-2">
            <input
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <Search size={16} className="text-muted" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scroll-thin px-3">
          <p className="group-label px-2.5 pb-2 pt-2">Main Menu</p>
          <div className="flex flex-col gap-1">
            {MAIN_MENU.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-surface font-semibold text-primary"
                      : "text-text hover:bg-surface"
                  }`}
                >
                  <Icon size={18} className={active ? "text-accent" : ""} />
                  {label}
                </Link>
              );
            })}
          </div>

          <p className="group-label px-2.5 pb-2 pt-5">Recents</p>
          <div className="flex flex-col gap-1">
            {RECENTS.map((r) => (
              <Link
                key={r.id}
                href={`/initiative/${r.id}`}
                onClick={onClose}
                className="rounded-full px-3 py-2 text-sm text-primary hover:bg-surface"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-3">
          <UserCard />
        </div>
      </aside>
    </>
  );
}
