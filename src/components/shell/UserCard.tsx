"use client";

import { useState } from "react";
import { ChevronUp, LogOut, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { DashboardView, GateId, Role } from "@/lib/types";
import { GATE_REVIEWER_ROLE } from "@/lib/types";

const VIEW_LABEL: Record<DashboardView, string> = {
  AI_OWNER: "AI Owner",
  MANAGEMENT: "Management",
  AIGOV: "AI Governance",
};

const GATE_ROLE_LABEL: Record<GateId, string> = {
  1: "Gate 1 · Intake",
  2: "Gate 2 · Risk",
  3: "Gate 3 · Security",
  4: "Gate 4 · Go-Live",
  5: "Gate 5 · Operate",
};

export function UserCard() {
  const { loggedIn, user, logout, setDashboardView, toggleRole } = useApp();
  const [open, setOpen] = useState(false);

  if (!loggedIn) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-border bg-white px-3 py-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-muted">
          <User size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-text">Please Login</p>
        </div>
        <span className="text-muted">›</span>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-border bg-white">
      {open && (
        <div className="border-b border-border p-3 space-y-4">
          <div>
            <p className="group-label mb-2">Dashboard-Sicht</p>
            <div className="flex flex-col gap-1">
              {(Object.keys(VIEW_LABEL) as DashboardView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setDashboardView(v)}
                  className={`rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    user.dashboardView === v
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-text hover:bg-surface"
                  }`}
                >
                  {VIEW_LABEL[v]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="group-label mb-2">Gate-Rollen (Demo)</p>
            <div className="flex flex-col gap-1">
              {([1, 2, 3, 4, 5] as GateId[]).map((g) => {
                const role: Role = GATE_REVIEWER_ROLE[g];
                const active = user.roles.includes(role);
                return (
                  <label
                    key={g}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-text hover:bg-surface"
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleRole(role)}
                      className="accent-[color:var(--color-primary)]"
                    />
                    {GATE_ROLE_LABEL[g]}
                  </label>
                );
              })}
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-danger hover:bg-red-50"
          >
            <LogOut size={15} /> Abmelden
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-text">{user.name}</p>
          <p className="truncate text-xs text-muted">{VIEW_LABEL[user.dashboardView]}</p>
        </div>
        <ChevronUp
          size={16}
          className={`text-muted transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
}
