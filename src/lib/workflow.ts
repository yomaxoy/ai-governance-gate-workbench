// ============================================================
// Workflow logic — Spec §13 (authoritative behavior)
// ============================================================
import type {
  GateId,
  GateReview,
  Initiative,
  InitiativeStatus,
  ReviewDecision,
  ReviewFieldData,
} from "./types";

// Submit threshold for the wizard — §13.7 (default 100%, configurable here)
export const SUBMIT_THRESHOLD = 100;

// --- 13.1 Gate decision logic --------------------------------
export type GateOutcome = "reject" | "request_changes" | "approve" | "incomplete";

export interface GateOutcomeResult {
  outcome: GateOutcome;
  decidedCount: number;
  totalCount: number;
  hasBlocker: boolean;
  hasClarification: boolean;
  // The footer primary action label depends on the outcome — §13.1
  primaryLabel: string;
  primaryEnabled: boolean;
}

export function evaluateGate(fields: ReviewFieldData[]): GateOutcomeResult {
  const total = fields.length;
  const decided = fields.filter((f) => f.decision !== "unset").length;
  const hasBlocker = fields.some((f) => f.decision === "blocker");
  const hasClarification = fields.some((f) => f.decision === "clarification");
  const allDecided = total > 0 && decided === total;

  let outcome: GateOutcome;
  let primaryLabel: string;

  if (!allDecided) {
    outcome = "incomplete";
    primaryLabel = "Freigeben";
  } else if (hasBlocker) {
    outcome = "reject";
    primaryLabel = "Ablehnen";
  } else if (hasClarification) {
    outcome = "request_changes";
    primaryLabel = "Änderungen anfordern";
  } else {
    outcome = "approve";
    primaryLabel = "Freigeben";
  }

  return {
    outcome,
    decidedCount: decided,
    totalCount: total,
    hasBlocker,
    hasClarification,
    primaryLabel,
    primaryEnabled: allDecided,
  };
}

// A note (Begründung) is mandatory once a field is clarification/blocker — §13.1
export function fieldNeedsNote(f: ReviewFieldData): boolean {
  return (
    (f.decision === "clarification" || f.decision === "blocker") &&
    f.note.trim().length === 0
  );
}

export function gateHasMissingNotes(fields: ReviewFieldData[]): boolean {
  return fields.some(fieldNeedsNote);
}

// --- 13.2 Status transitions ---------------------------------
// Apply the gate primary action and return the next initiative state.
export function applyGateDecision(
  initiative: Initiative,
  gate: GateId,
  outcome: GateOutcome,
): Pick<Initiative, "status" | "currentGate"> {
  switch (outcome) {
    case "reject":
      return { status: "rejected", currentGate: gate };
    case "request_changes":
      return { status: "changes_requested", currentGate: gate };
    case "approve":
      if (gate >= 5) return { status: "live", currentGate: 5 };
      return { status: "in_review", currentGate: (gate + 1) as GateId };
    default:
      return { status: initiative.status, currentGate: initiative.currentGate };
  }
}

export const STATUS_LABEL: Record<InitiativeStatus, string> = {
  draft: "Entwurf",
  submitted: "Eingereicht",
  in_review: "In Prüfung",
  changes_requested: "Änderungen angefordert",
  rejected: "Abgelehnt",
  live: "Live",
  paused: "Pausiert",
  retired: "Stillgelegt",
};

// Status badge color classes — §13.2
export const STATUS_BADGE_CLASS: Record<InitiativeStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  submitted: "bg-blue-50 text-info",
  in_review: "bg-blue-50 text-info",
  changes_requested: "bg-yellow-50 text-warning",
  rejected: "bg-red-50 text-danger",
  live: "bg-green-50 text-success",
  paused: "bg-orange-50 text-orange-600",
  retired: "bg-gray-200 text-gray-700",
};

// --- 13.7 Wizard completeness --------------------------------
// Required fields (marked * in §5.6), across all 4 steps.
export const REQUIRED_FIELDS: { key: string; step: number; label: string }[] = [
  // Step 1
  { key: "titel", step: 1, label: "Titel der KI-Initiative" },
  { key: "art", step: 1, label: "Art der KI-Initiative" },
  { key: "fachbereich", step: 1, label: "Fachbereich / Organisationseinheit / Länder" },
  { key: "aiOwner", step: 1, label: "AI Owner" },
  { key: "problem", step: 1, label: "Welches Problem soll gelöst werden?" },
  { key: "ergebnis", step: 1, label: "Welches Ergebnis soll erreicht werden?" },
  { key: "nutzen", step: 1, label: "Erwarteter Nutzen" },
  { key: "nutzenhypothese", step: 1, label: "Nutzenhypothese" },
  { key: "kiErforderlich", step: 1, label: "Ist KI für diesen Anwendungsfall erforderlich?" },
  // Step 2
  { key: "nutzerkreis", step: 2, label: "Vorgesehener Nutzerkreis" },
  { key: "geschaeftsprozess", step: 2, label: "Betroffener Geschäftsprozess" },
  { key: "erwarteteNutzung", step: 2, label: "Erwartete Nutzung" },
  { key: "datenarten", step: 2, label: "Verarbeitete Datenarten" },
  { key: "entscheidungseinfluss", step: 2, label: "Einfluss auf wesentliche Entscheidungen" },
  // Step 3
  { key: "betriebsmodell", step: 3, label: "Betriebsmodell" },
  { key: "systeme", step: 3, label: "Benötigte Systeme und Datenquellen" },
  { key: "integrationen", step: 3, label: "Geplante Integrationen" },
  { key: "externerAnbieter", step: 3, label: "Externer Anbieter" },
  { key: "nutzungsvolumen", step: 3, label: "Erwartetes Nutzungsvolumen" },
];

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" ? value.trim().length > 0 : value != null;
}

export interface CompletenessResult {
  percent: number;
  missingCount: number;
  missing: { key: string; step: number; label: string }[];
}

export function computeCompleteness(
  data: Record<string, unknown>,
): CompletenessResult {
  const missing = REQUIRED_FIELDS.filter((f) => !isFilled(data[f.key]));
  const filled = REQUIRED_FIELDS.length - missing.length;
  const percent = Math.round((filled / REQUIRED_FIELDS.length) * 100);
  return { percent, missingCount: missing.length, missing };
}

export function canSubmit(data: Record<string, unknown>): boolean {
  return computeCompleteness(data).percent >= SUBMIT_THRESHOLD;
}

// --- Decision UI helpers -------------------------------------
export const DECISION_META: Record<
  Exclude<ReviewDecision, "unset">,
  { label: string; dot: string; text: string; ring: string }
> = {
  confirmed: {
    label: "Bestätigt",
    dot: "bg-success",
    text: "text-success",
    ring: "border-success",
  },
  clarification: {
    label: "Klärung erforderlich",
    dot: "bg-warning",
    text: "text-warning",
    ring: "border-warning",
  },
  blocker: {
    label: "Blockierendes Finding",
    dot: "bg-danger",
    text: "text-danger",
    ring: "border-danger",
  },
};

// Map a single field decision -> criterion-like status (for icons reuse)
export function decisionToCriterionStatus(d: ReviewDecision) {
  switch (d) {
    case "confirmed":
      return "met" as const;
    case "clarification":
      return "open" as const;
    case "blocker":
      return "problem" as const;
    default:
      return "unchecked" as const;
  }
}

// Recompute a gate review's criteria summary count for footer display.
export function decidedFieldCount(review?: GateReview): {
  decided: number;
  total: number;
} {
  if (!review) return { decided: 0, total: 9 };
  const total = review.fields.length;
  const decided = review.fields.filter((f) => f.decision !== "unset").length;
  return { decided, total };
}
