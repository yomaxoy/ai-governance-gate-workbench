"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  ClipboardCheck,
  Coins,
  Database,
  FileDown,
  FileText,
  Gavel,
  GitBranch,
  History,
  RefreshCw,
  Route,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
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
import { GATE_META, GATE_ORDER } from "@/lib/gate-config";
import type { AuditEntry, GateId, Initiative } from "@/lib/types";

const TABS = [
  "Überblick",
  "Governance",
  "Modell & Integration",
  "Nutzung & Kosten",
  "Risiko & Audit",
] as const;

const SUBTITLE =
  "Zentrale Ansicht für Lifecycle, Freigaben, Risiken, Modelle, Nutzung und Änderungen.";

// Reviewer role names per gate — used for the audit trail fallback.
const GATE_ACTOR: Record<GateId, string> = {
  1: "Intake Board",
  2: "Data & Compliance",
  3: "Security & Architektur",
  4: "Gatekeeper 4",
  5: "Betrieb / Governance",
};

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

// A colored status pill (Aktiv / Re-Approval erforderlich / …).
function StatusPill({
  text,
  tone,
}: {
  text: string;
  tone: "green" | "amber" | "muted";
}) {
  const cls =
    tone === "green"
      ? "bg-green-50 text-success"
      : tone === "amber"
        ? "bg-amber-50 text-amber-600"
        : "bg-surface text-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {text}
    </span>
  );
}

// A label ↔ value/badge row (Governance rules, Re-Approval triggers, …).
function RuleRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2.5">
      <span className="text-sm text-text">{label}</span>
      {children}
    </div>
  );
}

// Fallback audit trail derived from the gates an initiative has passed.
function deriveAudit(initiative: Initiative): AuditEntry[] {
  const rows: AuditEntry[] = [];
  for (let g = initiative.currentGate; g >= 1; g = (g - 1) as GateId) {
    rows.push({
      date: "—",
      event: `Gate ${g} ${GATE_META[g].short}`,
      actor: GATE_ACTOR[g],
      action:
        g === initiative.currentGate
          ? initiative.gateDecisionSummary
          : "abgeschlossen",
    });
  }
  rows.push({
    date: "—",
    event: "AI Request erstellt",
    actor: "AI Owner",
    action: "Initialer Request eingereicht",
  });
  return rows;
}

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
  const adoptionPct = pct(usage.activeUsers, usage.pilotUsers);
  const adoptionTarget = usage.adoptionTargetPct ?? 70;
  const avgCalls =
    usage.activeUsers > 0 ? Math.round(usage.calls30d / usage.activeUsers) : 0;
  const costPer1k =
    usage.calls30d > 0
      ? Math.round((usage.costMonth / usage.calls30d) * 1000)
      : 0;

  // Read a review-field value captured across the gates (single source of truth).
  const gv = (id: string): string => {
    for (const g of GATE_ORDER) {
      const f = initiative.gateReviews[g]?.fields.find((x) => x.id === id);
      if (f?.value) return f.value;
    }
    return "";
  };

  const auditRows = initiative.auditTrail ?? deriveAudit(initiative);
  const auditTotal = initiative.auditTotal ?? auditRows.length;

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

            <Panel icon={AlertTriangle} title="Aktuelle Steuerungssignale">
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
            <Panel icon={Gavel} title="Freigabe- und Entscheidungsstatus">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Aktuelle Freigabe"
                  value={initiative.lifecycleLabel}
                />
                <Field
                  label="Offene Auflagen"
                  value={de(initiative.openAuflagen)}
                />
                <Field label="Nächstes Review" value={initiative.nextReview} />
                <Field
                  label="Letzte Gate-Entscheidung"
                  value={initiative.gateDecisionSummary}
                />
              </div>
            </Panel>

            <Panel icon={ShieldCheck} title="Verbindliche Governance-Regeln">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Datenklassen" value={initiative.dataClass} />
                <Field label="Human Oversight" value={gv("g2_oversight")} />
                <Field label="DLP / Redaction" value={gv("g3_dlp")} />
                <Field label="Logging Level" value={gv("g3_logconcept")} />
              </div>
            </Panel>

            <Panel icon={RefreshCw} title="Re-Approval Trigger">
              <div className="space-y-2">
                {[
                  "Änderung des Nutzerkreises",
                  "Änderung des Modells",
                  "Änderung der Datenquellen",
                  "Änderung des Zwecks",
                ].map((label) => (
                  <RuleRow key={label} label={label}>
                    <StatusPill text="Re-Approval erforderlich" tone="amber" />
                  </RuleRow>
                ))}
              </div>
            </Panel>
          </>
        )}

        {/* ----------------------------------------------- Modell & Integration */}
        {tab === "Modell & Integration" && (
          <>
            <Panel icon={Route} title="Modellroute">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Primäres Modell" value={gv("g3_backend")} />
                <Field label="Modellroute" value={gv("g3_route")} />
                <Field label="Fallback-Modell" value={gv("g3_fallbackmodel")} />
                <Field
                  label="Tokenlimit"
                  value={`${usage.tokenLimitM}M Tokens / Monat`}
                />
              </div>
            </Panel>

            <Panel icon={Database} title="Datenquellen & Systeme">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Search / Retrieval" value={gv("g3_aidienste")} />
                <Field label="Identity Provider" value={gv("g3_authn")} />
                <Field
                  className="md:col-span-2"
                  label="Dokumentenquelle / Wissensquellen"
                  value={request.systeme}
                />
              </div>
            </Panel>

            <Panel icon={ShieldCheck} title="Technische Kontrollen">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Gateway Enforcement" value={gv("g3_gateway")} />
                <Field label="DLP Prüfung" value={gv("g3_dlp")} />
                <Field label="Secrets Management" value={gv("g3_secrets")} />
                <Field label="Monitoring" value={gv("g3_siem")} />
              </div>
            </Panel>
          </>
        )}

        {/* ------------------------------------------------- Nutzung & Kosten */}
        {tab === "Nutzung & Kosten" && (
          <>
            <Panel icon={BarChart3} title="Nutzungsübersicht">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricTile
                  label="Aktive Nutzer, letzte 30 Tage"
                  value={`${usage.activeUsers}/${usage.pilotUsers}`}
                  sub="Pilotnutzer"
                />
                <MetricTile
                  label="Aufrufe, letzte 30 Tage"
                  value={de(usage.calls30d)}
                />
                <MetricTile
                  label="Ø Aufrufe je aktivem Nutzer"
                  value={de(avgCalls)}
                />
                <MetricTile
                  label="Adoption gegenüber Zielwert"
                  value={`${adoptionPct}%`}
                  sub={`Zielwert ${adoptionTarget}%`}
                />
              </div>
              <div className="mt-4 rounded-card border border-border bg-surface p-3 text-sm text-muted">
                <span className="font-semibold text-text">Status: </span>
                {adoptionPct >= adoptionTarget
                  ? "Nutzung liegt über dem definierten Zielwert. Pilot zeigt ausreichende Adoption für Gate-5-Review."
                  : "Nutzung liegt unter dem definierten Zielwert."}
              </div>
            </Panel>

            <Panel icon={Coins} title="Kosten & Budget">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricTile
                  label="Kosten aktueller Monat"
                  value={`€${de(usage.costMonth)}`}
                  sub={`von €${de(usage.costLimit)} Limit`}
                />
                <MetricTile
                  label="Token Verbrauch"
                  value={`${usage.tokensUsedM}M`}
                  sub={`von ${usage.tokenLimitM}M Limit`}
                />
                <MetricTile
                  label="Kosten je 1000 Aufrufe"
                  value={`€${de(costPer1k)}`}
                  sub="Ø inkl. Search- und Modellkosten"
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

            <Panel icon={TrendingUp} title="Nutzenindikatoren">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Geschätzter Wertbeitrag"
                  value={
                    usage.estimatedValueMonth != null
                      ? `€${de(usage.estimatedValueMonth)} p.M.`
                      : undefined
                  }
                />
                <Field label="Primärer Nutzenhebel" value={usage.valueLever} />
                <Field
                  className="md:col-span-2"
                  label="Business Owner Bewertung"
                  value={usage.ownerAssessment}
                />
              </div>
            </Panel>

            <Panel icon={ClipboardCheck} title="Kosten-/Nutzungsbewertung">
              <div className="space-y-2">
                <RuleRow label="Adoption">
                  <StatusPill
                    text={
                      adoptionPct >= adoptionTarget
                        ? "Über Zielwert"
                        : "Unter Zielwert"
                    }
                    tone={adoptionPct >= adoptionTarget ? "green" : "amber"}
                  />
                </RuleRow>
                <RuleRow label="Kosten">
                  <StatusPill
                    text={
                      usage.costMonth <= usage.costLimit
                        ? "Innerhalb des freigegebenen Monatslimits"
                        : "Über Monatslimit"
                    }
                    tone={usage.costMonth <= usage.costLimit ? "green" : "amber"}
                  />
                </RuleRow>
                <RuleRow label="Skalierung">
                  <StatusPill
                    text={`Erweiterung auf ${usage.pilotUsers * 2} Nutzer nur nach Re-Approval`}
                    tone="amber"
                  />
                </RuleRow>
              </div>
            </Panel>
          </>
        )}

        {/* --------------------------------------------------- Risiko & Audit */}
        {tab === "Risiko & Audit" && (
          <>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-surface">
                <FileText size={14} /> Nachweise anzeigen
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-surface">
                <FileDown size={14} /> Audit-Report exportieren
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-surface">
                <FileDown size={14} /> Gate-Entscheidung exportieren
              </button>
            </div>

            <Panel icon={ShieldAlert} title="Risikoprofil">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col">
                  <p className="mb-1 text-xs font-semibold text-text">
                    Risikoklasse
                  </p>
                  <div className="flex flex-1 items-center rounded-lg border border-border bg-white px-3 py-2">
                    <RiskBadge risk={initiative.risk} />
                  </div>
                </div>
                <Field label="Datenklasse" value={initiative.dataClass} />
                <Field
                  label="Kritische Findings"
                  value={de(initiative.criticalFindings)}
                />
                <Field
                  label="Offene Findings"
                  value={de(initiative.openFindings ?? 0)}
                />
              </div>
            </Panel>

            <Panel icon={History} title="Audit Trail">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-muted">
                      <th className="py-2 pr-3 font-medium">Datum</th>
                      <th className="py-2 pr-3 font-medium">Lifecycle-Status</th>
                      <th className="py-2 pr-3 font-medium">Bearbeiter</th>
                      <th className="py-2 pr-3 font-medium">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="text-text">
                    {auditRows.map((a, i) => (
                      <tr
                        key={`${a.event}-${i}`}
                        className="border-t border-border"
                      >
                        <td className="py-2.5 pr-3 text-muted">{a.date}</td>
                        <td className="py-2.5 pr-3 font-medium">{a.event}</td>
                        <td className="py-2.5 pr-3 text-muted">{a.actor}</td>
                        <td className="py-2.5 pr-3">{a.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">
                Zeige {auditRows.length} von {auditTotal} Audits
              </p>
            </Panel>
          </>
        )}
      </div>
    </>
  );
}
