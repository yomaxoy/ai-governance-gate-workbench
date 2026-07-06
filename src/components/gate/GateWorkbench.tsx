"use client";

import { useMemo, useState } from "react";
import { ChevronUp, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Modal } from "@/components/ui/Modal";
import { GateTimeline } from "./GateTimeline";
import { CriteriaChecklist } from "./CriteriaChecklist";
import { ReviewField } from "./ReviewField";
import { InheritedConstraints } from "./InheritedConstraints";
import {
  buildGateFields,
  GATE_CRITERIA,
  GATE_META,
  GATE_SECTIONS,
} from "@/lib/gate-config";
import {
  applyGateDecision,
  decisionToCriterionStatus,
  evaluateGate,
  gateHasMissingNotes,
} from "@/lib/workflow";
import { canDecide, GATE_REVIEWER_ROLE } from "@/lib/types";
import type {
  GateId,
  GateReview,
  Initiative,
  ReviewFieldData,
} from "@/lib/types";

const ROLE_NAME: Record<GateId, string> = {
  1: "Intake / AI Governance",
  2: "Risk & Compliance",
  3: "Security & Architektur",
  4: "Go-Live / Betrieb",
  5: "Betrieb / Governance",
};

// Gate-5 footer "Weitere Aktionen" — §6.9
type Gate5Action =
  | "confirm"
  | "measure"
  | "reapproval"
  | "pause"
  | "retire"
  | "defer" // Review zurückstellen
  | "escalate"; // An Governance Board eskalieren

// Build a working GateReview for a gate from an initiative (existing or fresh).
function loadReview(initiative: Initiative, gate: GateId): GateReview {
  const existing = initiative.gateReviews[gate];
  if (existing) {
    return {
      gate,
      criteria: existing.criteria.map((c) => ({ ...c })),
      fields: existing.fields.map((f) => ({ ...f })),
    };
  }
  return {
    gate,
    criteria: GATE_CRITERIA[gate].map((label) => ({
      label,
      status: "unchecked",
    })),
    fields: buildGateFields(gate, initiative.request),
  };
}

export function GateWorkbench() {
  const { workbench, getInitiative } = useApp();
  if (!workbench.open) return null;
  const initiative = getInitiative(workbench.initiativeId);
  if (!initiative) return null;
  // Remount per open (seq) → state initializes fresh from the initiative.
  return (
    <WorkbenchBody
      key={workbench.seq}
      initiative={initiative}
      initialGate={workbench.gate}
    />
  );
}

function WorkbenchBody({
  initiative,
  initialGate,
}: {
  initiative: Initiative;
  initialGate: GateId;
}) {
  const { closeWorkbench, updateInitiative, user } = useApp();

  const [activeGate, setActiveGate] = useState<GateId>(initialGate);
  // Working copies per gate, lazily built as gates are visited.
  const [reviews, setReviews] = useState<Partial<Record<GateId, GateReview>>>(
    () => ({ [initialGate]: loadReview(initiative, initialGate) }),
  );
  const review = reviews[activeGate] ?? loadReview(initiative, activeGate);

  const switchGate = (g: GateId) => {
    setReviews((prev) =>
      prev[g] ? prev : { ...prev, [g]: loadReview(initiative, g) },
    );
    setActiveGate(g);
  };

  const readOnly = !canDecide(user, activeGate);

  const outcome = useMemo(() => evaluateGate(review.fields), [review]);
  const missingNotes = gateHasMissingNotes(review.fields);

  const meta = GATE_META[activeGate];

  const updateField = (id: string, patch: Partial<ReviewFieldData>) => {
    setReviews((prev) => {
      const r = prev[activeGate];
      if (!r) return prev;
      return {
        ...prev,
        [activeGate]: {
          ...r,
          fields: r.fields.map((f) =>
            f.id === id ? { ...f, ...patch } : f,
          ),
        },
      };
    });
  };

  // Persist current working review back into the initiative.
  const persist = (extra?: Partial<Initiative>) => {
    const criteria = review.criteria.map((c, i) => {
      const f = review.fields[i];
      return f ? { ...c, status: decisionToCriterionStatus(f.decision) } : c;
    });
    updateInitiative(initiative.id, {
      gateReviews: {
        ...initiative.gateReviews,
        [activeGate]: { ...review, criteria },
      },
      ...extra,
    });
  };

  const handleSaveDraft = () => {
    persist();
    closeWorkbench();
  };

  const handlePrimary = () => {
    if (!outcome.primaryEnabled || missingNotes) return;
    const next = applyGateDecision(initiative, activeGate, outcome.outcome);
    persist({
      status: next.status,
      currentGate: next.currentGate,
      gateProgress: Math.round(((next.currentGate - 1) / 4) * 100) || 8,
    });
    closeWorkbench();
  };

  const handleGate5Action = (action: Gate5Action) => {
    let extra: Partial<Initiative> = {};
    switch (action) {
      case "confirm":
        extra = { status: "live" };
        break;
      case "measure":
      case "escalate": // Eskalation ans Governance Board — wie „Maßnahme"
        extra = { status: "changes_requested" };
        break;
      case "reapproval":
        extra = { status: "in_review", currentGate: 5, reApprovalDue: true };
        break;
      case "defer": // Review zurückstellen — bleibt in Prüfung
        extra = { status: "in_review", currentGate: 5 };
        break;
      case "pause":
        extra = { status: "paused" };
        break;
      case "retire":
        extra = { status: "retired" };
        break;
    }
    persist(extra);
    closeWorkbench();
  };

  const footer = (
    <GateFooter
      gate={activeGate}
      outcome={outcome}
      missingNotes={missingNotes}
      readOnly={readOnly}
      onReject={() => {
        persist({ status: "rejected" });
        closeWorkbench();
      }}
      onSaveDraft={handleSaveDraft}
      onPrimary={handlePrimary}
      onGate5Action={handleGate5Action}
    />
  );

  return (
    <Modal
      open
      onClose={closeWorkbench}
      title={`Gate Workbench: Gate ${activeGate} · ${meta.name}`}
      subtitle={meta.description}
      footer={footer}
      widthClass="max-w-5xl"
    >
      <div className="space-y-4">
        {readOnly && (
          <div className="flex items-center gap-2 rounded-card border border-border bg-yellow-50 px-4 py-3 text-sm text-text">
            <Lock size={16} className="text-warning" />
            Nur lesend — Prüfung erfolgt durch Rolle „{ROLE_NAME[activeGate]}“
            ({GATE_REVIEWER_ROLE[activeGate]}).
          </div>
        )}

        <GateTimeline
          currentGate={initiative.currentGate}
          activeGate={activeGate}
          onSelect={switchGate}
        />

        <CriteriaChecklist gate={activeGate} criteria={review.criteria} />

        <InheritedConstraints gate={activeGate} />

        {/* Review sections */}
        {GATE_SECTIONS[activeGate].map((section, i) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold text-text">
              Section {String.fromCharCode(65 + i)}: {section.title}
            </h3>
            {section.fields.map((bp) => {
              const f = review.fields.find((x) => x.id === bp.id);
              if (!f) return null;
              return (
                <ReviewField
                  key={f.id}
                  field={f}
                  readOnly={readOnly}
                  onChange={(patch) => updateField(f.id, patch)}
                  docs={bp.kind === "evidence" ? bp.docs : undefined}
                  currentGate={activeGate}
                />
              );
            })}
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ---- Footer (sticky) — §6.9 -------------------------------
function GateFooter({
  gate,
  outcome,
  missingNotes,
  readOnly,
  onReject,
  onSaveDraft,
  onPrimary,
  onGate5Action,
}: {
  gate: GateId;
  outcome: ReturnType<typeof evaluateGate>;
  missingNotes: boolean;
  readOnly: boolean;
  onReject: () => void;
  onSaveDraft: () => void;
  onPrimary: () => void;
  onGate5Action: (a: Gate5Action) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryDisabled = readOnly || !outcome.primaryEnabled || missingNotes;
  const remaining = outcome.totalCount - outcome.decidedCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {gate === 5 ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              disabled={readOnly}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface disabled:opacity-50"
            >
              Weitere Aktionen
              <ChevronUp
                size={14}
                className={`transition-transform ${menuOpen ? "" : "rotate-180"}`}
              />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute bottom-12 left-0 z-20 w-56 space-y-1 rounded-card border border-border bg-white p-2 shadow-lg">
                  {(
                    [
                      ["measure", "Maßnahme anfordern"],
                      ["reapproval", "Re-Approval auslösen"],
                      ["defer", "Review zurückstellen"],
                      ["escalate", "An Governance Board eskalieren"],
                      ["pause", "Service sofort pausieren"],
                      ["retire", "Stilllegung einleiten"],
                    ] as [Gate5Action, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setMenuOpen(false);
                        onGate5Action(key);
                      }}
                      className="w-full rounded-full bg-primary px-3 py-1.5 text-left text-xs font-medium text-primary-foreground hover:bg-primary-dark"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onReject}
            disabled={readOnly}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-danger hover:bg-red-50 disabled:opacity-50"
          >
            Ablehnen
          </button>
        )}
      </div>

      <div className="text-center text-xs">
        <span className="inline-flex flex-col items-center rounded-full bg-surface px-4 py-1 leading-tight">
          <span className="text-sm font-semibold text-primary">
            {outcome.totalCount > 0
              ? Math.round((outcome.decidedCount / outcome.totalCount) * 100)
              : 0}
            %
          </span>
          <span className="text-[11px] font-medium text-muted">
            {gate === 5
              ? "Review Fortschritt"
              : `${remaining} von ${outcome.totalCount} Kriterien zu prüfen`}
          </span>
        </span>
        {missingNotes && (
          <p className="mt-1 text-danger">Begründung(en) fehlen.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSaveDraft}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface"
        >
          Entwurf speichern
        </button>
        <button
          onClick={onPrimary}
          disabled={primaryDisabled}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {gate === 5 && outcome.outcome === "approve"
            ? "Betrieb bestätigen"
            : outcome.primaryLabel}
        </button>
      </div>
    </div>
  );
}
