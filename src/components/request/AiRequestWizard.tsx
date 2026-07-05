"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Upload } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/ui/Modal";
import {
  MultiSelectField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui/Field";
import { EMPTY_REQUEST } from "@/lib/mock-data";
import type { AiRequestData, GateId, Initiative } from "@/lib/types";
import { buildGateFields, GATE_CRITERIA } from "@/lib/gate-config";
import { canSubmit, computeCompleteness } from "@/lib/workflow";
import {
  ART_OPTIONS,
  BETRIEBSMODELL_OPTIONS,
  DATENARTEN_OPTIONS,
  DATENKLASSE_OPTIONS,
  ENTSCHEIDUNG_OPTIONS,
  INTEGRATION_OPTIONS,
  KI_ERFORDERLICH_OPTIONS,
  NUTZEN_OPTIONS,
  NUTZUNG_OPTIONS,
} from "@/lib/wizard-options";

const STEPS = [
  "Vorhaben & Nutzen",
  "Nutzer & Daten",
  "Technik & Integration",
  "Prüfen & Einreichen",
];

export function AiRequestWizard() {
  const { wizard } = useApp();
  // Remount per open (seq) so form state initializes fresh — no reset effect.
  if (!wizard.open) return null;
  return <WizardForm key={wizard.seq} />;
}

function WizardForm() {
  const { wizard, closeWizard, addInitiative, addDraft, user } = useApp();
  const [step, setStep] = useState(wizard.startStep ?? 1);
  const [data, setData] = useState<AiRequestData>(
    wizard.initialData ?? EMPTY_REQUEST,
  );

  const completeness = useMemo(
    () => computeCompleteness(data as unknown as Record<string, unknown>),
    [data],
  );
  const submittable = canSubmit(data as unknown as Record<string, unknown>);

  const set = <K extends keyof AiRequestData>(key: K, value: AiRequestData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const isReapproval = wizard.mode === "reapproval";

  const handleSaveDraft = () => {
    addDraft({
      id: `d-${Date.now()}`,
      title: data.titel || "Unbenannter Entwurf",
      type: isReapproval ? "Re-Approval" : "New Request",
      completeness: completeness.percent,
    });
    closeWizard();
  };

  const handleSubmit = () => {
    const gateReviews: Partial<Record<GateId, { gate: GateId; criteria: { label: string; status: "unchecked" }[]; fields: ReturnType<typeof buildGateFields> }>> = {
      1: {
        gate: 1,
        criteria: GATE_CRITERIA[1].map((label) => ({ label, status: "unchecked" })),
        fields: buildGateFields(1, data),
      },
    };
    const today = "2026-06-29";
    const init: Initiative = {
      id: `req-${Date.now()}`,
      registerId: `AI-REG-${String(Date.now()).slice(-3)}`,
      title: data.titel || "Neue KI-Initiative",
      summary: data.problem.slice(0, 80) || "Neue eingereichte Initiative.",
      description: data.problem.slice(0, 120) || "Neue eingereichte Initiative.",
      aiOwner: data.aiOwner || user.name,
      technicalOwner: data.technischerAnsprechpartner || "—",
      fachbereich: data.fachbereich,
      risk: "in Prüfung",
      dataClass: data.datenklasse || "—",
      lifecycleLabel: "In Prüfung",
      currentGate: 1,
      gateProgress: 8,
      status: "in_review",
      reApprovalDue: isReapproval,
      gateReviews,
      createdDate: today,
      lastChanged: today,
      nextReview: "—",
      openAuflagen: 0,
      criticalFindings: 0,
      changesSinceApproval: "—",
      gateDecisionSummary: "Intake eingereicht.",
      nextStep: "Gate 1 Entscheidung durch das Intake Board.",
      usage: {
        activeUsers: 0,
        pilotUsers: 0,
        calls30d: 0,
        tokensUsedM: 0,
        tokenLimitM: 0,
        costMonth: 0,
        costLimit: 0,
      },
      request: data,
    };
    addInitiative(init);
    closeWizard();
  };

  const footer = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="w-24">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface"
          >
            Zurück
          </button>
        )}
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-text">
          Request Vollständigkeit: {completeness.percent}%
        </span>
        <p className="mt-1 text-xs text-muted">
          {completeness.missingCount} Pflichtfelder fehlen
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveDraft}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface"
        >
          Entwurf speichern
        </button>
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark"
          >
            Weiter
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!submittable}
            title={submittable ? "" : "Erst bei 100% Vollständigkeit möglich"}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Einreichen
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      open={wizard.open}
      onClose={closeWizard}
      title={isReapproval ? "Re-Approval Request" : "AI Request erstellen"}
      subtitle="Beschreibe deine KI-Initiative. Die Angaben dienen als Grundlage für die fachliche, regulatorische und technische Prüfung."
      footer={footer}
    >
      {/* Stepper */}
      <div className="mb-6 flex items-center justify-between gap-2">
        {STEPS.map((label, idx) => {
          const n = idx + 1;
          const reached = n <= step;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    reached
                      ? "bg-primary text-primary-foreground"
                      : "bg-white text-muted ring-1 ring-border"
                  }`}
                >
                  {n < step ? <Check size={14} /> : n}
                </span>
                <span
                  className={`hidden text-xs sm:block ${
                    reached ? "font-medium text-primary" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </div>
              {n < STEPS.length && (
                <div
                  className={`h-px flex-1 ${reached ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <TextField
            label="Titel der KI-Initiative"
            required
            value={data.titel}
            onChange={(v) => set("titel", v)}
            placeholder="Beispiel: KI-gestützter Wissensassistent für interne Richtlinien"
          />
          <SelectField
            label="Art der KI-Initiative"
            required
            value={data.art}
            onChange={(v) => set("art", v)}
            options={ART_OPTIONS}
          />
          <TextField
            label="Fachbereich / Organisationseinheit / Länder"
            required
            value={data.fachbereich}
            onChange={(v) => set("fachbereich", v)}
            placeholder="Beispiel: Governance, DE/AT/CH"
          />
          <TextField
            label="AI Owner"
            required
            hint="Fachlich verantwortliche Person für Nutzen, Daten, Qualität und Betrieb"
            value={data.aiOwner}
            onChange={(v) => set("aiOwner", v)}
          />
          <TextField
            label="Management Sponsor"
            hint="Optionaler Sponsor für Priorisierung und Ressourcen"
            value={data.managementSponsor ?? ""}
            onChange={(v) => set("managementSponsor", v)}
          />
          <TextAreaField
            label="Welches Problem soll gelöst werden?"
            required
            value={data.problem}
            onChange={(v) => set("problem", v)}
          />
          <TextAreaField
            label="Welches Ergebnis soll erreicht werden?"
            required
            hint="Gewünschtes fachliches Ergebnis, nicht nur die technische Lösung"
            value={data.ergebnis}
            onChange={(v) => set("ergebnis", v)}
          />
          <MultiSelectField
            label="Erwarteter Nutzen (Mehrfachauswahl)"
            required
            values={data.nutzen}
            onChange={(v) => set("nutzen", v)}
            options={NUTZEN_OPTIONS}
          />
          <TextAreaField
            label="Nutzenhypothese"
            required
            hint="Beispiel: Reduktion des monatlichen Rechercheaufwands um ca. 80 Stunden"
            value={data.nutzenhypothese}
            onChange={(v) => set("nutzenhypothese", v)}
          />
          <SelectField
            label="Ist KI für diesen Anwendungsfall erforderlich?"
            required
            value={data.kiErforderlich}
            onChange={(v) => set("kiErforderlich", v)}
            options={KI_ERFORDERLICH_OPTIONS}
          />
          <TextAreaField
            label="Begründung / betrachtete Alternativen"
            value={data.kiBegruendung ?? ""}
            onChange={(v) => set("kiBegruendung", v)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <TextAreaField
            label="Vorgesehener Nutzerkreis"
            required
            hint="Betroffene Rollen, Fachbereiche, Landesgesellschaften oder externe Nutzer"
            value={data.nutzerkreis}
            onChange={(v) => set("nutzerkreis", v)}
          />
          <TextField
            label="Betroffener Geschäftsprozess"
            required
            value={data.geschaeftsprozess}
            onChange={(v) => set("geschaeftsprozess", v)}
          />
          <SelectField
            label="Erwartete Nutzung"
            required
            value={data.erwarteteNutzung}
            onChange={(v) => set("erwarteteNutzung", v)}
            options={NUTZUNG_OPTIONS}
          />
          <SelectField
            label="Verarbeitete Datenarten"
            required
            value={data.datenarten}
            onChange={(v) => set("datenarten", v)}
            options={DATENARTEN_OPTIONS}
          />
          <SelectField
            label="Vorläufige Dokumenten-/Datenklasse"
            value={data.datenklasse ?? ""}
            onChange={(v) => set("datenklasse", v)}
            options={DATENKLASSE_OPTIONS}
          />
          <SelectField
            label="Hat der Output Einfluss auf wesentliche Entscheidungen?"
            required
            value={data.entscheidungseinfluss}
            onChange={(v) => set("entscheidungseinfluss", v)}
            options={ENTSCHEIDUNG_OPTIONS}
          />
          <TextAreaField
            label="Vorgesehene menschliche Kontrolle"
            value={data.menschlicheKontrolle ?? ""}
            onChange={(v) => set("menschlicheKontrolle", v)}
            placeholder="Beschreibe, wer Ergebnisse prüft, freigibt oder bei Fehlern eingreift."
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <TextField
            label="Bevorzugte Lösung oder Tool"
            hint="Vorläufige Angabe. Finale Entscheidung im Architektur- & Security-Review"
            value={data.bevorzugteLoesung ?? ""}
            onChange={(v) => set("bevorzugteLoesung", v)}
          />
          <SelectField
            label="Betriebsmodell"
            required
            value={data.betriebsmodell}
            onChange={(v) => set("betriebsmodell", v)}
            options={BETRIEBSMODELL_OPTIONS}
          />
          <TextField
            label="Benötigte Systeme und Datenquellen"
            required
            hint="Beispiel: DMS, SQL, CRM, Enterprise Data Platform oder Wissensbasis"
            value={data.systeme}
            onChange={(v) => set("systeme", v)}
          />
          <MultiSelectField
            label="Geplante Integrationen (Mehrfachauswahl)"
            required
            values={data.integrationen}
            onChange={(v) => set("integrationen", v)}
            options={INTEGRATION_OPTIONS}
          />
          <TextField
            label="Externer Anbieter"
            required
            hint="Falls bereits bekannt"
            value={data.externerAnbieter}
            onChange={(v) => set("externerAnbieter", v)}
          />
          <TextField
            label="Erwartetes Nutzungsvolumen"
            required
            hint="Nutzerzahl, Anfragen oder Prozessausführungen pro Monat"
            value={data.nutzungsvolumen}
            onChange={(v) => set("nutzungsvolumen", v)}
          />
          <TextField
            label="Technischer Ansprechpartner / Betrieb"
            value={data.technischerAnsprechpartner ?? ""}
            onChange={(v) => set("technischerAnsprechpartner", v)}
          />
        </div>
      )}

      {step === 4 && (
        <Step4Summary data={data} completeness={completeness} />
      )}
    </Modal>
  );
}

function Accordion({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-card border border-border bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-semibold text-text">{title}</span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <dl className="space-y-2 border-t border-border px-4 py-3">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="text-sm text-text sm:col-span-2">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Step4Summary({
  data,
  completeness,
}: {
  data: AiRequestData;
  completeness: ReturnType<typeof computeCompleteness>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-text">
        Zusammenfassung der Initiative
      </h3>

      <Accordion
        title="Vorhaben & Nutzen"
        rows={[
          ["Titel", data.titel],
          ["Art", data.art],
          ["Fachbereich", data.fachbereich],
          ["AI Owner", data.aiOwner],
          ["Problem", data.problem],
          ["Ergebnis", data.ergebnis],
          ["Nutzen", data.nutzen.join(", ")],
          ["Nutzenhypothese", data.nutzenhypothese],
        ]}
      />
      <Accordion
        title="Nutzer & Daten"
        rows={[
          ["Nutzerkreis", data.nutzerkreis],
          ["Geschäftsprozess", data.geschaeftsprozess],
          ["Erwartete Nutzung", data.erwarteteNutzung],
          ["Datenarten", data.datenarten],
          ["Datenklasse", data.datenklasse ?? ""],
          ["Entscheidungseinfluss", data.entscheidungseinfluss],
          ["Menschliche Kontrolle", data.menschlicheKontrolle ?? ""],
        ]}
      />
      <Accordion
        title="Technik & Integration"
        rows={[
          ["Bevorzugte Lösung", data.bevorzugteLoesung ?? ""],
          ["Betriebsmodell", data.betriebsmodell],
          ["Systeme", data.systeme],
          ["Integrationen", data.integrationen.join(", ")],
          ["Externer Anbieter", data.externerAnbieter],
          ["Nutzungsvolumen", data.nutzungsvolumen],
        ]}
      />

      <div className="rounded-card border border-border bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Request Vollständigkeit
        </p>
        <p className="mt-1 text-sm text-text">
          {completeness.percent}% vollständig
        </p>
      </div>

      {completeness.missing.length > 0 && (
        <div className="rounded-card border border-warning/40 bg-yellow-50 p-4">
          <p className="text-sm font-semibold text-text">
            Fehlende oder unklare Angaben
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text">
            {completeness.missing.map((m) => (
              <li key={m.key}>
                {m.step}. {STEPS[m.step - 1]}: {m.label} → fehlt
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-card border-2 border-dashed border-border bg-white p-6 text-center">
        <Upload size={22} className="mx-auto text-muted" />
        <p className="mt-2 text-sm font-medium text-text">
          Nachweise und Anhänge
        </p>
        <p className="text-xs text-muted">
          Dateien hierher ziehen oder klicken zum Hochladen
        </p>
      </div>
    </div>
  );
}
