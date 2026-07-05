"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  FileText,
  Gavel,
  GitBranch,
  Network,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Panel } from "@/components/detail/Panel";
import { Field } from "@/components/detail/Field";
import { Chip } from "@/components/detail/Chip";
import { MetricTile } from "@/components/detail/MetricTile";
import { TabBar } from "@/components/detail/TabBar";
import { GateStatusTimeline } from "@/components/detail/GateStatusTimeline";

const TABS = [
  "Überblick",
  "Governance",
  "Modell & Integration",
  "Nutzung & Kosten",
  "Risiko & Audit",
] as const;

const SUBTITLE =
  "Zentrale Ansicht für Lifecycle, Freigaben, Risiken, Modelle, Nutzung und Änderungen.";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const de = (n: number) => n.toLocaleString("de-DE");
const pct = (used: number, limit: number) =>
  limit > 0 ? Math.round((used / limit) * 100) : 0;
const barColor = (p: number) =>
  p >= 90 ? "bg-danger" : p >= 75 ? "bg-warning" : "bg-primary";

export default function InitiativePage() {
  const params = useParams<{ id: string }>();
  const { getInitiative, openWorkbench } = useApp();
  const initiative = getInitiative(params.id);
  const [tab, setTab] = useState<string>(TABS[0]);

  if (!initiative) {
    return (
      <>
        <PageHeader icon={Bot} title="Initiative" />
        <p className="rounded-card border border-border bg-white p-8 text-center text-muted">
          Initiative „{params.id}“ nicht gefunden.
        </p>
      </>
    );
  }

  const { usage, request } = initiative;
  const budgetPct = pct(usage.costMonth, usage.costLimit);
  const tokenPct = pct(usage.tokensUsedM, usage.tokenLimitM);

  return (
    <>
      <PageHeader
        icon={Bot}
        title={`AI Register: ${initiative.title}`}
        subtitle={SUBTITLE}
      >
        <button
          onClick={() => openWorkbench(initiative.id, initiative.currentGate)}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
        >
          Gate Workbench öffnen
        </button>
      </PageHeader>

      {/* Meta chip row */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Chip>{initiative.lifecycleLabel}</Chip>
        <RiskBadge risk={initiative.risk} />
        <Chip>
          Gate
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {initiative.currentGate}
          </span>
        </Chip>
        <Chip>Datenklasse {initiative.dataClass}</Chip>
        <Chip>#{initiative.registerId}</Chip>

        <div className="ml-auto flex items-center gap-2 text-sm text-muted">
          <span>AI Owner:</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-text">
            {initials(initiative.aiOwner)}
          </span>
          <span className="font-medium text-text">{initiative.aiOwner}</span>
        </div>
      </div>

      {/* Tabs */}
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {/* ---------------------------------------------------------- Überblick */}
        {tab === "Überblick" && (
          <>
            <Panel icon={Users} title="Überblick & Verantwortlichkeiten">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field
                  className="md:col-span-2 md:row-span-2"
                  label="Beschreibung"
                  value={initiative.description}
                />
                <Field label="Fachbereich" value={initiative.fachbereich} />
                <Field
                  label="Management Sponsor"
                  value={request.managementSponsor}
                />
                <Field label="AI Owner" value={initiative.aiOwner} />
                <Field
                  label="Technischer Owner"
                  value={initiative.technicalOwner}
                />
                <Field
                  label="Offene Auflagen"
                  value={de(initiative.openAuflagen)}
                />
                <Field
                  label="Erstellungsdatum"
                  value={initiative.createdDate}
                />
                <Field label="Letzte Änderung" value={initiative.lastChanged} />
                <Field label="Nächstes Review" value={initiative.nextReview} />
              </div>
            </Panel>

            <Panel icon={GitBranch} title="Lifecycle & Gate Status">
              <GateStatusTimeline currentGate={initiative.currentGate} />
              <div className="mt-6">
                <ProgressBar value={initiative.gateProgress} color="bg-primary" />
              </div>
              <div className="mt-4 space-y-3 rounded-card border border-border bg-surface p-4 text-sm">
                <div>
                  <p className="font-semibold text-text">Aktueller Status:</p>
                  <p className="text-muted">{initiative.lifecycleLabel}</p>
                </div>
                <div>
                  <p className="font-semibold text-text">
                    Letzte Gate-Entscheidung:
                  </p>
                  <p className="text-muted">{initiative.gateDecisionSummary}</p>
                </div>
                <div>
                  <p className="font-semibold text-text">
                    Nächster erwarteter Schritt:
                  </p>
                  <p className="text-muted">{initiative.nextStep}</p>
                </div>
              </div>
            </Panel>

            <Panel icon={AlertTriangle} title="Aktuelle Aufmerksamkeit">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field
                  label="Offene Auflagen"
                  value={de(initiative.openAuflagen)}
                />
                <Field
                  label="Kritische Findings"
                  value={de(initiative.criticalFindings)}
                />
                <Field
                  label="Änderungen seit letzter Freigabe"
                  value={initiative.changesSinceApproval}
                />
              </div>
            </Panel>

            <Panel icon={BarChart3} title="Nutzung & Kosten (Zusammenfassung)">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label="Aktive Nutzer, letzte 30 Tage"
                  value={`${usage.activeUsers}/${usage.pilotUsers} Pilotnutzer`}
                />
                <Field
                  label="Aufrufe letzte 30 Tage"
                  value={de(usage.calls30d)}
                />
                <Field
                  label="Tokenverbrauch, aktueller Monat"
                  value={`${usage.tokensUsedM}M / ${usage.tokenLimitM}M`}
                />
                <Field
                  label="Kosten aktueller Monat"
                  value={`€${de(usage.costMonth)} / €${de(usage.costLimit)}`}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                  <span>Budgetauslastung</span>
                  <span>{budgetPct}%</span>
                </div>
                <ProgressBar value={budgetPct} color={barColor(budgetPct)} />
              </div>
            </Panel>
          </>
        )}

        {/* ---------------------------------------------------------- Governance */}
        {tab === "Governance" && (
          <>
            <Panel icon={FileText} title="Governance & Business Case">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Problem" value={request.problem} />
                <Field label="Ergebnis" value={request.ergebnis} />
                <Field label="Nutzenhypothese" value={request.nutzenhypothese} />
                <Field label="Nutzerkreis" value={request.nutzerkreis} />
              </div>
            </Panel>

            <Panel icon={Gavel} title="Letzte Gate-Entscheidung">
              <Field
                label="Zusammenfassung"
                value={initiative.gateDecisionSummary}
              />
            </Panel>
          </>
        )}

        {/* ----------------------------------------------- Modell & Integration */}
        {tab === "Modell & Integration" && (
          <Panel icon={Network} title="Modell & Integration">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Systeme & Datenquellen"
                value={request.systeme}
              />
              <Field
                label="Externer Anbieter"
                value={request.externerAnbieter}
              />
              <Field label="Betriebsmodell" value={request.betriebsmodell} />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-text">
                Integrationen
              </p>
              <div className="flex flex-wrap gap-2">
                {request.integrationen.length > 0 ? (
                  request.integrationen.map((i) => <Chip key={i}>{i}</Chip>)
                ) : (
                  <span className="text-sm text-muted">—</span>
                )}
              </div>
            </div>
          </Panel>
        )}

        {/* ------------------------------------------------- Nutzung & Kosten */}
        {tab === "Nutzung & Kosten" && (
          <Panel icon={BarChart3} title="Nutzung & Kosten">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricTile
                label="Aktive Nutzer, letzte 30 Tage"
                value={`${usage.activeUsers}/${usage.pilotUsers}`}
                sub="Pilotnutzer"
              />
              <MetricTile
                label="Aufrufe letzte 30 Tage"
                value={de(usage.calls30d)}
              />
              <MetricTile
                label="Tokenverbrauch, aktueller Monat"
                value={`${usage.tokensUsedM}M`}
                sub={`von ${usage.tokenLimitM}M Limit`}
              />
              <MetricTile
                label="Kosten aktueller Monat"
                value={`€${de(usage.costMonth)}`}
                sub={`von €${de(usage.costLimit)} Limit`}
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                  <span>Budgetauslastung (Kosten)</span>
                  <span>{budgetPct}%</span>
                </div>
                <ProgressBar value={budgetPct} color={barColor(budgetPct)} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted">
                  <span>Tokenauslastung</span>
                  <span>{tokenPct}%</span>
                </div>
                <ProgressBar value={tokenPct} color={barColor(tokenPct)} />
              </div>
            </div>
          </Panel>
        )}

        {/* --------------------------------------------------- Risiko & Audit */}
        {tab === "Risiko & Audit" && (
          <Panel icon={ShieldAlert} title="Risiko & Audit">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <p className="mb-1 text-xs font-semibold text-text">
                  Risikoklasse
                </p>
                <div className="flex-1 rounded-lg border border-border bg-white px-3 py-2">
                  <RiskBadge risk={initiative.risk} />
                </div>
              </div>
              <Field label="Datenklasse" value={initiative.dataClass} />
              <Field label="Datenarten" value={request.datenarten} />
              <Field
                label="Entscheidungseinfluss"
                value={request.entscheidungseinfluss}
              />
              <Field
                label="Offene Auflagen"
                value={de(initiative.openAuflagen)}
              />
              <Field
                label="Kritische Findings"
                value={de(initiative.criticalFindings)}
              />
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
