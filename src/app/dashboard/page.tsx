"use client";

import { Home } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiTile } from "@/components/ui/KpiTile";
import { RequestRow } from "@/components/request/RequestRow";
import { ManagementTrendChart } from "@/components/dashboard/ManagementTrendChart";
import { DASHBOARD_KPIS } from "@/lib/dashboard-kpis";

export default function DashboardPage() {
  const { user, initiatives } = useApp();
  const kpis = DASHBOARD_KPIS[user.dashboardView];

  // "Offene AI Request Aufgaben" — initiatives currently in review.
  const openTasks = initiatives.filter(
    (i) => i.status === "in_review" || i.status === "changes_requested",
  );

  return (
    <>
      <PageHeader icon={Home} title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <KpiTile key={k.label} {...k} />
        ))}
      </div>

      {user.dashboardView === "MANAGEMENT" && <ManagementTrendChart />}

      <section className="mt-6 rounded-card border border-border bg-white p-4">
        <h2 className="mb-4 text-base font-semibold text-text">
          Offene AI Request Aufgaben
        </h2>
        <div className="space-y-3">
          {openTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              Keine offenen Aufgaben.
            </p>
          ) : (
            openTasks.map((i) => <RequestRow key={i.id} initiative={i} />)
          )}
        </div>
      </section>
    </>
  );
}
