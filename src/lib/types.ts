// ============================================================
// Data model — Spec §8 + §13
// ============================================================

// Permission roles (a person can hold several) — §8, §13.3
export type Role =
  | "REQUESTER" // every employee: create requests
  | "GATE1_INTAKE" // intake board / AI governance
  | "GATE2_RISK" // risk & compliance reviewer (sets risk class)
  | "GATE3_SECURITY" // security / architecture reviewer
  | "GATE4_GOLIVE" // operations / go-live reviewer
  | "GATE5_OPERATE"; // operations / governance reviewer

export type GateId = 1 | 2 | 3 | 4 | 5;

// Which role reviews which gate — §8
export const GATE_REVIEWER_ROLE: Record<GateId, Role> = {
  1: "GATE1_INTAKE",
  2: "GATE2_RISK",
  3: "GATE3_SECURITY",
  4: "GATE4_GOLIVE",
  5: "GATE5_OPERATE",
};

// Pure dashboard view (NOT a permission) — only switches KPI tiles — §13.4
export type DashboardView = "AI_OWNER" | "MANAGEMENT" | "AIGOV";

export interface CurrentUser {
  name: string;
  jobTitle: string;
  roles: Role[]; // multiple roles allowed
  dashboardView: DashboardView;
}

export type RiskClass = "Low Risk" | "Medium Risk" | "High Risk" | "in Prüfung";

export type ReviewDecision = "confirmed" | "clarification" | "blocker" | "unset";

export type NotificationType =
  | "Alerts"
  | "Policy"
  | "Incident"
  | "Re-Approval"
  | "New Request";

export type InitiativeStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "rejected"
  | "live"
  | "paused"
  | "retired";

export type CriterionStatus = "met" | "open" | "problem" | "unchecked";

export type FieldSource =
  | "ai_request"
  | `gate_${number}`
  | "system" // systemgenerierter Wert (z. B. Telemetrie) — §7 Gate 5
  | "none";

// Inputs from the wizard — §5.6 / §8
export interface AiRequestData {
  // Step 1 — Vorhaben & Nutzen
  titel: string;
  art: string;
  fachbereich: string;
  aiOwner: string;
  managementSponsor?: string;
  problem: string;
  ergebnis: string;
  nutzen: string[];
  nutzenhypothese: string;
  kiErforderlich: string;
  kiBegruendung?: string;
  // Step 2 — Nutzer & Daten
  nutzerkreis: string;
  geschaeftsprozess: string;
  erwarteteNutzung: string;
  datenarten: string;
  datenklasse?: string;
  entscheidungseinfluss: string;
  menschlicheKontrolle?: string;
  // Step 3 — Technik & Integration
  bevorzugteLoesung?: string;
  betriebsmodell: string;
  systeme: string;
  integrationen: string[];
  externerAnbieter: string;
  nutzungsvolumen: string;
  technischerAnsprechpartner?: string;
}

export interface ReviewFieldData {
  id: string;
  label: string;
  source: FieldSource;
  value: string;
  decision: ReviewDecision;
  note: string;
  required?: boolean; // shows the "*" marker; defaults to true when undefined
  placeholder?: string; // hint for editable (gate-decision / free) fields
}

// A row in a gate's "Nachweise und Anhänge" evidence table — §7
export interface EvidenceDoc {
  name: string; // Dokumentname
  origin: string; // Herkunft, e.g. "AI Request" / "Gate 1"
  requirement: string; // Pflichtstatus: "Pflicht" | "Optional"
  submittedBy: string; // Eingereicht durch
  status: string; // Reviewstatus, e.g. "Eingereicht" / "Fehlt"
}

export interface CriterionData {
  label: string;
  status: CriterionStatus;
}

export interface GateReview {
  gate: GateId;
  criteria: CriterionData[];
  fields: ReviewFieldData[];
}

// Usage & cost summary shown in the detail view — §5.5 "Nutzung & Kosten"
export interface UsageCost {
  activeUsers: number; // active users in the last 30 days
  pilotUsers: number; // provisioned pilot users (activeUsers / pilotUsers)
  calls30d: number; // requests in the last 30 days
  tokensUsedM: number; // tokens used this month, in millions
  tokenLimitM: number; // monthly token limit, in millions
  costMonth: number; // € spent this month
  costLimit: number; // € monthly cost limit
}

export interface Initiative {
  id: string;
  registerId: string; // display id, e.g. "AI-REG-025"
  title: string;
  summary: string;
  description: string; // one-line description (detail "Beschreibung")
  aiOwner: string;
  technicalOwner: string; // Technischer Owner / Betriebsverantwortung
  fachbereich: string;
  risk: RiskClass; // 'in Prüfung' until Gate 2 sets the class — §13.6
  dataClass: string; // Datenklasse, e.g. "C1 – C3"
  lifecycleLabel: string; // human lifecycle label, e.g. "Pilot unter Auflagen"
  currentGate: GateId; // = atGate
  gateProgress: number; // 0..100 for the progress bar
  status: InitiativeStatus;
  reApprovalDue: boolean;
  gateReviews: Partial<Record<GateId, GateReview>>;
  logoUrl?: string;
  createdDate: string; // Erstellungsdatum (display date)
  lastChanged: string; // ISO-ish display date
  nextReview: string; // Nächstes Review (display date)
  openAuflagen: number; // Offene Auflagen
  criticalFindings: number; // Kritische Findings
  changesSinceApproval: string; // Änderungen seit letzter Freigabe
  gateDecisionSummary: string; // Zusammenfassung der letzten Gate-Entscheidung
  nextStep: string; // Nächster erwarteter Schritt
  usage: UsageCost; // Nutzung & Kosten
  request: AiRequestData;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  initiativeName: string;
  read: boolean;
}

export type DraftType = "New Request" | "Re-Approval";

export interface DraftItem {
  id: string;
  title: string;
  type: DraftType;
  completeness: number;
  initiativeId?: string; // for re-approvals: source initiative
}

// Does the user get to decide in gate g? — §8 / §13.3
export const canDecide = (u: CurrentUser, g: GateId): boolean =>
  u.roles.includes(GATE_REVIEWER_ROLE[g]);
