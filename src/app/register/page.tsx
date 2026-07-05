"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiTile } from "@/components/ui/KpiTile";
import { REGISTER_KPIS } from "@/lib/dashboard-kpis";
import { InitiativeTable } from "@/components/register/InitiativeTable";
import { RegisterFilters } from "@/components/register/RegisterFilters";
import {
  CreateInitiativeCard,
  InitiativeCard,
} from "@/components/register/InitiativeCard";

type ViewMode = "table" | "kachel";

function RegisterContent() {
  const { initiatives } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const view: ViewMode = params.get("view") === "kachel" ? "kachel" : "table";
  const [query, setQuery] = useState("");

  const setView = (v: ViewMode) => router.replace(`/register?view=${v}`);

  const filtered = initiatives.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.aiOwner.toLowerCase().includes(query.toLowerCase()),
  );

  const owners = Array.from(new Set(initiatives.map((i) => i.aiOwner)));

  return (
    <>
      <PageHeader
        icon={LayoutGrid}
        title="AI Register"
        subtitle="Zentrale Übersicht aller registrierten KI-Initiativen, Freigaben, Risiken und Lifecycle-Status."
      >
        <div className="flex items-center gap-1 rounded-full border border-border bg-white p-1">
          <button
            onClick={() => setView("table")}
            aria-label="Listenansicht"
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              view === "table" ? "bg-primary text-primary-foreground" : "text-muted"
            }`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("kachel")}
            aria-label="Kachelansicht"
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              view === "kachel" ? "bg-primary text-primary-foreground" : "text-muted"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REGISTER_KPIS.map((k) => (
          <KpiTile key={k.label} {...k} />
        ))}
      </div>

      {view === "table" ? (
        <div className="mt-6">
          <RegisterFilters
            query={query}
            onQueryChange={setQuery}
            resultCount={filtered.length}
            owners={owners}
          />

          <section className="rounded-card border border-border bg-white">
            <div className="p-4">
              <InitiativeTable items={filtered} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
              <p className="text-sm text-muted">
                Zeige{" "}
                <span className="font-semibold text-text">{filtered.length}</span>{" "}
                von{" "}
                <span className="font-semibold text-text">
                  {initiatives.length}
                </span>{" "}
                Initiativen
              </p>

              <nav
                aria-label="Seitennavigation"
                className="flex items-center gap-1"
              >
                <button
                  type="button"
                  aria-label="Vorherige Seite"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-surface"
                >
                  <ChevronLeft size={16} />
                </button>
                {["1", "2", "3", "…", "5"].map((p, idx) => (
                  <button
                    key={`${p}-${idx}`}
                    type="button"
                    aria-current={p === "1" ? "page" : undefined}
                    disabled={p === "…"}
                    className={`flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                      p === "1"
                        ? "border border-primary bg-primary font-semibold text-primary-foreground"
                        : p === "…"
                          ? "text-muted"
                          : "border border-border text-muted hover:bg-surface"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Nächste Seite"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:bg-surface"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </section>
        </div>
      ) : (
        <section className="mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {["Filter", "Filter", "Filter"].map((f, idx) => (
              <button
                key={idx}
                className="rounded-full border border-border bg-white px-4 py-1.5 text-sm text-text hover:bg-surface"
              >
                {f}
              </button>
            ))}
            <button className="px-3 py-1.5 text-sm text-info">More ›</button>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 border border-border">
              <Search size={15} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="KI-Initiative suchen…"
                className="bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CreateInitiativeCard />
            {filtered.map((i) => (
              <InitiativeCard key={i.id} initiative={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted">Lädt …</div>}>
      <RegisterContent />
    </Suspense>
  );
}
