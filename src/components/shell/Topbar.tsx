"use client";

import { useState } from "react";
import { Bell, ChevronUp, Menu, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";

export function Topbar({
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  const { unreadCount, openWizard } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-white px-4">
      <button
        onClick={onToggleMenu}
        aria-label="Menü"
        className="flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-surface"
      >
        {menuOpen ? <ChevronUp size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Benachrichtigungen"
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-surface"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            )}
          </button>
          {notifOpen && (
            <NotificationPopover onClose={() => setNotifOpen(false)} />
          )}
        </div>

        <button
          onClick={() => openWizard()}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          AI Request
        </button>
      </div>
    </header>
  );
}
