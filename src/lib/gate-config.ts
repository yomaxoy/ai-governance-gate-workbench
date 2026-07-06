// ============================================================
// Gate configuration — criteria & review fields per gate (Spec §6.7, §7)
// ============================================================
import type {
  AiRequestData,
  EvidenceDoc,
  FieldSource,
  GateId,
  ReviewFieldData,
} from "./types";

export interface GateMeta {
  id: GateId;
  short: string; // e.g. "Intake"
  name: string; // full title for timeline/header
  description: string; // header copy — §7
}

export const GATE_META: Record<GateId, GateMeta> = {
  1: {
    id: 1,
    short: "Intake",
    name: "Intake & Business Case",
    description:
      "Prüfe Business Need, KI-Eignung, Verantwortlichkeit, Scope und initiale Nutzenhypothese. Ergebnis: Freigabe für Gate 2, Änderungen anfordern oder Ablehnung.",
  },
  2: {
    id: 2,
    short: "Risk & Data",
    name: "Risk, Data & Compliance",
    description:
      "Bestätige Risikoklasse, Datenumfang, Personenbezug, Modell- und Anbieterrahmen und Mindestkontrollen. Ergebnis: Risikoprofil und verbindliche Mindestkontrollen für das Security- und Architecture-Review in Gate 3.",
  },
  3: {
    id: 3,
    short: "Design & Security",
    name: "Security & Solution Architecture",
    description:
      "Prüfe, ob das geplante Solution Design die in Gate 2 festgelegten Risiko-, Daten-, Modell- und Kontrollanforderungen technisch und organisatorisch umsetzt. Ergebnis: Freigegebenes Solution Design und verbindliche technische Auflagen für Pilot- und Go-Live-Readiness in Gate 4.",
  },
  4: {
    id: 4,
    short: "Pilot & Go-Live",
    name: "Pilot & Go-Live Readiness",
    description:
      "Prüfe Pilotergebnisse, Tests, Betriebsübergabe und offene Auflagen. Ergebnis: Go-Live-Freigabe, Auflagen oder Rückstufung.",
  },
  5: {
    id: 5,
    short: "Operate & Review",
    name: "Operate, Review & Retire",
    description:
      "Prüfe Wertbeitrag, Qualität, Risiken, Kosten, Incidents, Änderungen und Lifecycle-Status des produktiven AI Service. Ergebnis: Weiterbetrieb, Auflagen, Re-Approval, Pausierung oder Stilllegung.",
  },
};

export const GATE_ORDER: GateId[] = [1, 2, 3, 4, 5];

// Short timeline labels — §6.6
export const GATE_TIMELINE_LABEL: Record<GateId, string> = {
  1: "Intake & Business Case",
  2: "Risk, Data & Compliance",
  3: "Security & Solution Architecture",
  4: "Pilot & Go-Live Readiness",
  5: "Operate, Review & Retire",
};

// RequestRow gate labels — §6.1
export const GATE_ROW_LABEL: Record<GateId, string> = {
  1: "Gate 1 Intake",
  2: "Gate 2 Risk & Data",
  3: "Gate 3 Design & Security",
  4: "Gate 4 Pilot & Go-Live",
  5: "Gate 5 Operate & Review",
};

// --- 9 criteria per gate — §7 -------------------------------
export const GATE_CRITERIA: Record<GateId, string[]> = {
  1: [
    "Legitimer Business Need ist nachvollziehbar",
    "Einsatz von KI ist gegenüber Alternativen plausibel",
    "Erwartetes Ergebnis und Nutzenhypothese sind verständlich",
    "AI Owner und verantwortlicher Fachbereich sind benannt",
    "Scope, Nutzerkreis und betroffener Prozess sind ausreichend klar",
    "Initiative ist hinreichend abgegrenzt, keine offensichtliche Doppelinitiative",
    "Initialer Daten- und Entscheidungskontext ist ausreichend beschrieben",
    "Sponsor bzw. Priorisierungsverantwortung ist geklärt, sofern erforderlich",
    "Request und Nachweise sind ausreichend vollständig für Gate 2",
  ],
  2: [
    "Verarbeitete Datenarten und Datenquellen sind ausreichend beschrieben",
    "Verbindliche Dokumenten- bzw. Datenklasse ist festgelegt",
    "Personenbezug und Schutzbedarf sind bewertet",
    "Entscheidungsrelevanz und Auswirkungen auf Personen/Prozesse sind bewertet",
    "Risikoklasse der KI-Initiative ist festgelegt und begründet",
    "Externe Anbieter und vorgesehene Modellroute sind bewertet",
    "Erforderliches Human-Oversight-Level ist definiert",
    "Verbindliche Mindestkontrollen sind dokumentiert",
    "Scope und Kontrollanforderungen sind vollständig genug für Gate 3",
  ],
  3: [
    "Lösungsgrenze, Komponenten und Datenflüsse sind nachvollziehbar dokumentiert",
    "Modell-Backend und zulässige Modellroute entsprechen den Gate-2-Vorgaben",
    "Identitäts-, Rollen- und Zugriffskontrollen sind definiert",
    "Datenquellen, Integrationen und Schnittstellen sind freigegeben",
    "DLP-, Retrieval-, Dokumenten- und Human-Review-Kontrollen sind abgebildet",
    "Logging, Auditierbarkeit und Monitoring sind ausreichend konzipiert",
    "Secrets-, Netzwerk-, Sicherheits- und Incident-Anforderungen berücksichtigt",
    "Technische Ownership, Abhängigkeiten und Fallback-Lösung sind geklärt",
    "Solution Design und Nachweise sind vollständig genug für Gate 4",
  ],
  4: [
    "Umsetzung entspricht dem freigegebenen Solution Design",
    "Funktions-, Integrations- und Sicherheitstests sind durchgeführt",
    "Qualitäts- und Evaluationskriterien sind erfüllt",
    "Daten-, Rollen- und Zugriffskontrollen funktionieren wie vorgesehen",
    "Monitoring, Logging, Alerts und Incident-Prozess sind aktiv",
    "Fallback, Rollback und Betriebsübergabe sind vorbereitet",
    "Pilotgruppe, Nutzertraining und Support sind definiert",
    "Offene Gate-3-Auflagen sind geschlossen oder akzeptiert",
    "Pilot-/Go-Live-Scope und Bedingungen sind entscheidungsreif",
  ],
  5: [
    "Nutzen und Adoption sind ausreichend und nachvollziehbar",
    "Qualität und Zuverlässigkeit liegen innerhalb der genehmigten Grenzen",
    "Risiko-, Compliance- und Security-Kontrollen funktionieren",
    "Incidents, Findings und Beschwerden sind angemessen behandelt",
    "Kosten, Kapazität und Nutzung sind vertretbar",
    "Änderungen an Zweck, Daten, Modell, Prompt, Integration oder Nutzerkreis sind vollständig erfasst",
    "Re-Approval-Bedarf ist korrekt bewertet",
    "Ownership, Support und Dokumentation sind aktuell",
    "Weiterbetrieb, Nachschärfung, Pausierung oder Stilllegung ist entscheidungsreif",
  ],
};

// --- Review-field section blueprints per gate ---------------
// Each field references a key in AiRequestData (or a synthetic value) plus a source.
interface FieldBlueprint {
  id: string;
  label: string;
  source: FieldSource;
  // pull value from request, or a fixed/synthetic value
  from?: keyof AiRequestData;
  fixed?: string;
  optional?: boolean; // no "*" marker
  placeholder?: string; // hint for editable gate-decision / free fields
  inputRole?: string; // for source "gate_input": responsible role — §7 Gate 4/5
  // "evidence" → dropzone + document table; "upload" → single dropzone;
  // "control" → control-implementation card (Komponente/Rolle/Umsetzung/Nachweis);
  // "matrix" → labelled multi-cell grid (Kriterien-/Kennzahltabellen — §7 Gate 4/5)
  kind?: "field" | "evidence" | "upload" | "control" | "matrix";
  docs?: EvidenceDoc[]; // document rows for an evidence block
  uploadHint?: string; // caption for a single-file upload field
  control?: ControlImpl; // sub-inputs for a control-implementation card
  columns?: MatrixCell[]; // cells for a "matrix" field
}

// One control's implementation record — Gate 3 §7 "Control Implementation"
export interface ControlImpl {
  component: string; // Plattformdienst / Komponente
  role: string; // Verantwortliche Rolle
  impl: string; // Technische Umsetzung
  evidenceHint: string; // Nachweis-Hinweis
}

// One cell of a "matrix" field — a labelled sub-input — §7 Gate 4/5
export interface MatrixCell {
  label: string; // column / row label
  value?: string; // prefilled read-only value (systemgeneriert)
  hint?: string; // placeholder for an editable cell
  upload?: boolean; // render as a mini upload dropzone
}

export interface GateSection {
  title: string;
  fields: FieldBlueprint[];
  // renders above the inherited-constraints block without a "Section X:" prefix
  // and is skipped in the A/B/C… numbering — §7 Gate 5 (Review-Kontext)
  preface?: boolean;
}

// Expected evidence documents per gate — §7 "Nachweise und Anhänge"
export const GATE1_DOCS: EvidenceDoc[] = [
  { name: "Business Case", origin: "AI Request", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Prozessbeschreibung", origin: "AI Request", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
  { name: "erste Nutzenannahmen", origin: "Gate 1", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Anbieter-/Transferinformationen", origin: "Gate 1", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "vorhandene fachliche Richtlinien", origin: "Gate 1", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
];

export const GATE2_DOCS: EvidenceDoc[] = [
  { name: "Datenklassifizierung", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Datenschutzbewertung", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
  { name: "Anbieter-/Transferinformationen", origin: "AI Request", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Risikoanalyse", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "Prozessbeschreibung", origin: "AI Request", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
];

export const GATE3_DOCS: EvidenceDoc[] = [
  { name: "Business Case", origin: "AI Request", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Datenklassifizierung", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "Datenschutzbewertung", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Anbieter-/Transferinformationen", origin: "AI Request", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
  { name: "Risikoanalyse", origin: "Gate 2", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "Prozessbeschreibung", origin: "AI Request", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
  { name: "Architekturdiagramm", origin: "Gate 3", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Datenflussdiagramm", origin: "Gate 3", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "IAM-/Rollenmatrix", origin: "Gate 3", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
  { name: "Control Implementation List", origin: "Gate 3", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Logging-/Monitoring-Konzept", origin: "Gate 3", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Security-Konzept", origin: "Gate 3", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
];

export const GATE4_DOCS: EvidenceDoc[] = [
  { name: "Deployment- und Release-Dokumentation", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Funktions- und Integrationstestbericht", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Security- und Zugriffstest", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "DLP-/Datenkontrolltest", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Evaluations-/TEVV-Report", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
  { name: "Human-Oversight-Test", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Pilotkonzept", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "Trainingsmaterial", origin: "Gate 4", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
  { name: "Betriebs- und Supportkonzept", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Monitoring-/Alert-Nachweis", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Incident-/Fallback-Test", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Abnahmeprotokoll", origin: "Gate 4", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
];

export const GATE5_DOCS: EvidenceDoc[] = [
  { name: "Betriebs- und Monitoringreport", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Value-/Adoptionsreport", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Nutzerfeedback", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "aktueller Evaluationsreport", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Human-Review-Auswertung", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Incident- und Finding-Historie", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Akzeptiert" },
  { name: "Kostenreport", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Eingereicht" },
  { name: "Berechtigungsreview", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Control Effectiveness Review", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "Fehlt" },
  { name: "Change Log", origin: "Gate 5", requirement: "Pflicht", submittedBy: "Max Mustermann", status: "In Prüfung" },
  { name: "Re-Approval-Unterlagen", origin: "Gate 5", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
  { name: "Stilllegungskonzept", origin: "Gate 5", requirement: "Optional", submittedBy: "Max Mustermann", status: "Nicht vorhanden" },
];

export const GATE_SECTIONS: Record<GateId, GateSection[]> = {
  1: [
    {
      title: "Initiative & Ownership",
      fields: [
        { id: "g1_titel", label: "Titel der KI-Initiative", source: "ai_request", from: "titel" },
        { id: "g1_art", label: "Art der KI-Initiative", source: "ai_request", from: "art" },
        { id: "g1_fach", label: "Fachbereich / Organisationseinheit / Länder", source: "ai_request", from: "fachbereich" },
        { id: "g1_owner", label: "AI Owner", source: "ai_request", from: "aiOwner" },
        { id: "g1_sponsor", label: "Management Sponsor", source: "ai_request", from: "managementSponsor", optional: true },
      ],
    },
    {
      title: "Business Need & Value",
      fields: [
        { id: "g1_problem", label: "Welches Problem soll gelöst werden?", source: "ai_request", from: "problem" },
        { id: "g1_ergebnis", label: "Welches Ergebnis soll erreicht werden?", source: "ai_request", from: "ergebnis" },
        { id: "g1_nutzen", label: "Erwarteter Nutzen (Mehrfachauswahl)", source: "ai_request", from: "nutzen" },
        { id: "g1_hyp", label: "Nutzenhypothese", source: "ai_request", from: "nutzenhypothese" },
        { id: "g1_kierf", label: "Ist KI für diesen Anwendungsfall erforderlich?", source: "ai_request", from: "kiErforderlich" },
      ],
    },
    {
      title: "Scope & Users",
      fields: [
        { id: "g1_nutzerkreis", label: "Vorgesehener Nutzerkreis", source: "ai_request", from: "nutzerkreis" },
        { id: "g1_prozess", label: "Betroffener Geschäftsprozess", source: "ai_request", from: "geschaeftsprozess" },
        { id: "g1_nutzung", label: "Erwartete Nutzung", source: "ai_request", from: "erwarteteNutzung" },
        { id: "g1_abgrenzung", label: "Abgrenzung der Initiative", source: "gate_1", fixed: "", placeholder: "Beispiel: Abgrenzung der Initiative zu anderen Use-Cases in AI Register" },
        { id: "g1_doppel", label: "Gefundene ähnliche Initiative / Doppelinitiative", source: "none", fixed: "", optional: true, placeholder: "Status: Keine gefunden / mögliche Überschneidung / Eskalation" },
      ],
    },
    {
      title: "Early risk context (Pre-Check für Gate 2)",
      fields: [
        { id: "g1_datenarten", label: "Verarbeitete Datenarten", source: "ai_request", from: "datenarten" },
        { id: "g1_datenklasse", label: "Vorläufige Dokumenten-/Datenklasse", source: "ai_request", from: "datenklasse" },
        { id: "g1_entsch", label: "Hat der Output Einfluss auf wesentliche Entscheidungen?", source: "ai_request", from: "entscheidungseinfluss" },
        { id: "g1_kontrolle", label: "Vorgesehene menschliche Kontrolle", source: "ai_request", from: "menschlicheKontrolle", optional: true },
        { id: "g1_anbieter", label: "Externer Anbieter oder externe Verarbeitung vorgesehen?", source: "ai_request", from: "externerAnbieter" },
      ],
    },
    {
      title: "Evidence",
      fields: [
        { id: "g1_nachweise", label: "Nachweise und Anhänge", source: "none", fixed: "", optional: true, kind: "evidence", docs: GATE1_DOCS },
        { id: "g1_begruendung", label: "Gate 1 Entscheidungsbegründung", source: "gate_1", fixed: "", placeholder: "Fasse zusammen, warum die Initiative für Gate 2 freigegeben, zur Überarbeitung zurückgegeben oder abgelehnt wird. Nenne zentrale Nachweise, offene Punkte und verbindliche Auflagen." },
      ],
    },
  ],
  2: [
    {
      title: "Data Scope & Classification",
      fields: [
        { id: "g2_daten", label: "Verarbeitete Datenarten", source: "ai_request", from: "datenarten" },
        { id: "g2_systeme", label: "Benötigte Systeme und Datenquellen", source: "ai_request", from: "systeme" },
        { id: "g2_vklasse", label: "Vorläufige Dokumenten-/Datenklasse", source: "ai_request", from: "datenklasse", optional: true },
        { id: "g2_pii", label: "Personenbezogene Daten enthalten?", source: "ai_request", fixed: "Nein" },
        { id: "g2_schutz", label: "Besondere Schutzbedarfe erkannt? (Mehrfachauswahl)", source: "gate_2", fixed: "", placeholder: "Auswahl: besondere Kategorien personenbezogener Daten; Zugangsdaten / Secrets; Geschäftsgeheimnisse; Vertrags- oder Finanzinformationen; regulatorisch sensible Informationen; keine; unklar" },
        { id: "g2_fach", label: "Fachbereich / Organisationseinheiten / Länder", source: "ai_request", from: "fachbereich" },
        { id: "g2_bklasse", label: "Bestätigte Dokumenten-/Datenklasse", source: "gate_2", fixed: "", placeholder: "Auswahl: Klasse 0: Public; Klasse 1: Internal; Klasse 2: Restricted; Klasse 3: Confidential; Klasse 4: Highly Confidential / Sonderfreigabe; Klärung erforderlich" },
        { id: "g2_umfang", label: "Freigegebener Datenumfang", source: "gate_2", fixed: "", placeholder: "Beispiel: C1–C3; C3 nur nach Data-Owner-Freigabe und Human Review" },
      ],
    },
    {
      title: "Risk & Decision Relevance",
      fields: [
        { id: "g2_nutzerkreis", label: "Vorgesehener Nutzerkreis", source: "ai_request", from: "nutzerkreis" },
        { id: "g2_prozess", label: "Betroffener Geschäftsprozess", source: "gate_1", from: "geschaeftsprozess" },
        { id: "g2_einfluss", label: "Hat der Output Einfluss auf wesentliche Entscheidungen?", source: "ai_request", from: "entscheidungseinfluss", optional: true },
        { id: "g2_schaden", label: "Mögliche negative Auswirkungen bei Fehlfunktion oder Fehlentscheidung", source: "gate_2", fixed: "", optional: true, placeholder: "Beschreibe mögliche Schäden oder Fehlfolgen, z. B. falsche fachliche Entscheidungen, Benachteiligung betroffener Personen, Offenlegung sensibler Daten, Prozessunterbrechungen, finanzielle Schäden oder Reputationsrisiken." },
        { id: "g2_risk", label: "Bestätigte Risikoklasse", source: "gate_2", fixed: "", placeholder: "Auswahl: Low Risk; High Risk; Unzulässig / Eskalation erforderlich" },
        { id: "g2_govrel", label: "Regulatorische oder interne Governance-Relevanz (Mehrfachauswahl)", source: "gate_2", fixed: "", placeholder: "Auswahl: Keine besondere Relevanz erkannt; Datenschutzprüfung erforderlich; Legal-/Compliance-Prüfung erforderlich; Erhöhte Human-Oversight-Anforderung; Eskalation an AI Governance Board erforderlich" },
      ],
    },
    {
      title: "Model, Provider & Processing Context",
      fields: [
        { id: "g2_loesung", label: "Bevorzugte Lösung oder Tool", source: "ai_request", from: "bevorzugteLoesung", optional: true },
        { id: "g2_betrieb", label: "Vorgeschlagenes Betriebsmodell", source: "ai_request", from: "betriebsmodell", optional: true },
        { id: "g2_anbieter", label: "Externer Anbieter (falls vorhanden)", source: "ai_request", from: "externerAnbieter", optional: true },
        { id: "g2_transfer", label: "Dürfen Daten an ein externes Modell übertragen werden?", source: "gate_2", fixed: "", optional: true, placeholder: "Auswahl: Ja; Ja unter Auflagen; Nein; Noch zu klären" },
        { id: "g2_zbetrieb", label: "Zulässiges Betriebsmodell", source: "gate_2", fixed: "", placeholder: "Auswahl: externes Cloud-/SaaS-Modell; internes oder lokal betriebenes Modell; hybride Lösung; noch offen" },
        { id: "g2_zmodell", label: "Zulässiger Modellrahmen", source: "gate_2", fixed: "", placeholder: "Auswahl: Freigegebene externe Modelle; Nur interne/private Modelle; Lokales Modell erforderlich; Finale Auswahl erfolgt in Gate 3" },
        { id: "g2_eskal", label: "Eskalation erforderlich?", source: "gate_2", fixed: "", placeholder: "Auswahl: Nein; Ja – AI Governance Board; Ja – andere zuständige Stelle" },
        { id: "g2_exttransfer", label: "Externe Datenübertragung", source: "gate_2", fixed: "", placeholder: "Auswahl: erlaubt; erlaubt unter Auflagen; untersagt" },
      ],
    },
    {
      title: "Human Oversight & Minimum Controls",
      fields: [
        { id: "g2_kontrolle", label: "Vorgesehene menschliche Kontrolle", source: "ai_request", from: "menschlicheKontrolle", optional: true },
        { id: "g2_oversight", label: "Verbindliches Human-Oversight-Level", source: "gate_2", fixed: "", placeholder: "Auswahl: Keine zusätzliche menschliche Prüfung erforderlich; Stichprobenartige Prüfung; Menschliche Prüfung vor wesentlicher Nutzung; Verbindliche menschliche Freigabe jedes entscheidungsrelevanten Outputs; Human Review bei Ausnahmen oder Eskalationen" },
        { id: "g2_controls", label: "Erforderliche Mindestkontrollen (Mehrfachauswahl)", source: "gate_2", fixed: "", placeholder: "Auswahl: Rollen- und Zugriffskontrolle; Data Loss Prevention; Logging und Audit Trail; Einschränkung der zulässigen Modelle; Retrieval- und Datenzugriffsbeschränkungen; Redaction / Datenminimierung; Human Review; Output- bzw. Content-Filter; Incident- und Eskalationsprozess; Regelmäßige Re-Evaluation; Nutzung externer Modelle untersagt" },
      ],
    },
    {
      title: "Evidence & Gate Decision",
      fields: [
        { id: "g2_nachweise", label: "Nachweise und Anhänge", source: "none", fixed: "", optional: true, kind: "evidence", docs: GATE2_DOCS },
        { id: "g2_auflagen", label: "Verbindliche Auflagen für Gate 3", source: "gate_2", fixed: "", placeholder: "Dokumentiere die technischen und organisatorischen Vorgaben, die im Solution Design nachgewiesen werden müssen, z. B. Nutzung eines internen Modells, keine externe Datenübertragung, RBAC, DLP, Human Review, Retrieval-Beschränkungen, Logging oder Incident-Eskalation." },
        { id: "g2_begruendung", label: "Gate 2 Entscheidungsbegründung", source: "gate_2", fixed: "", placeholder: "Fasse das bestätigte Risikoprofil zusammen und begründe Datenklasse, Risikoklasse, Modellrahmen, Human-Oversight-Level und die für Gate 3 verbindlichen Mindestkontrollen." },
      ],
    },
  ],
  3: [
    {
      title: "Solution Context & Architecture",
      fields: [
        { id: "g3_techowner", label: "Technischer Owner / Betriebsverantwortung", source: "ai_request", from: "technischerAnsprechpartner" },
        { id: "g3_solution", label: "Beschreibung des geplanten Solution Designs", source: "gate_3", fixed: "", placeholder: "Beschreibe Systemgrenze, Hauptkomponenten, Datenflüsse, zentrale Plattformdienste und Verantwortlichkeiten." },
        { id: "g3_systeme", label: "Finale Systeme und Datenquellen (Mehrfachauswahl)", source: "ai_request", from: "systeme" },
        { id: "g3_integr", label: "Finale Integrationen (Mehrfachauswahl)", source: "ai_request", from: "integrationen" },
        { id: "g3_archdoc", label: "Architektur- oder Solution-Design-Nachweis", source: "gate_3", fixed: "", kind: "upload", uploadHint: "Lade ein Architekturdiagramm oder einen äquivalenten Solution-Design-Nachweis mit Systemgrenzen, Komponenten und Integrationen hoch." },
        { id: "g3_dataflow", label: "Datenflussdiagramm", source: "gate_3", fixed: "", kind: "upload", uploadHint: "Pflichtfeld: bei personenbezogenen/vertraulichen Daten, externem Transfer, RAG oder mehreren Datenquellen." },
      ],
    },
    {
      title: "Model, Gateway & Routing",
      fields: [
        { id: "g3_vbetrieb", label: "Vorgeschlagenes Betriebsmodell", source: "ai_request", from: "betriebsmodell", optional: true },
        { id: "g3_zbetrieb", label: "Zulässiges Betriebsmodell", source: "gate_2", fixed: "internes oder lokal betriebenes Modell", optional: true },
        { id: "g3_finbetrieb", label: "Finales Betriebs- und Bereitstellungsmodell", source: "gate_3", fixed: "", placeholder: "z. B. Azure Private Endpoint / interne Modellplattform" },
        { id: "g3_backend", label: "Primäres Modell-Backend", source: "gate_3", fixed: "", placeholder: "Freigegebenes Modell oder Deployment aus dem AI-Katalog auswählen. Beispieloptionen: Freigegebenes externes Modell; Freigegebenes internes/private Modell; Lokales Modell; Neue Modellfreigabe erforderlich" },
        { id: "g3_katalog", label: "Katalog-Metadaten", source: "system", fixed: "Katalogstatus: Freigegeben · Provider: Interne AI-Plattform · Hosting: Private Cloud · Region: EU · Katalog-ID: AI-MOD-017 · Deployment: knowledge-assistant-prod", optional: true },
        { id: "g3_route", label: "Finale Modellroute", source: "gate_3", fixed: "", placeholder: "Auswahl: zentrale Gateway-Schicht; internes/private Backend über Plattform; lokales Modell; externe Modellroute unter Gate-2-Auflagen — inkl. Katalog-/Deployment-Auswahl (Bsp.: Internes GPT-Deployment · EU-Region · AI-MOD-017 · Freigabestand 1.2)" },
        { id: "g3_aidienste", label: "Zusätzliche AI- und Plattformdienste (Mehrfachauswahl)", source: "gate_3", fixed: "", placeholder: "Auswahl: RAG / Vector Search; OCR / Document Intelligence; Tool Calling; externe API; interne Datenplattform; Content Safety; Human Review Service; weitere; keine" },
        { id: "g3_gateway", label: "Gateway- und Policy-Enforcement-Anforderungen (Mehrfachauswahl)", source: "gate_3", fixed: "", optional: true, placeholder: "Auswahl: AuthN / AuthZ; RBAC / ABAC; Quotas und Rate Limits; Model Routing; Prompt- und Content-Filter; Policy Enforcement; Kosten- und Tokenkontrolle; Tool-Allow-List; API- / MCP-Governance" },
        { id: "g3_fallbackmodel", label: "Fallback-Modell oder Fallback-Prozess", source: "gate_3", fixed: "", optional: true, placeholder: "Beschreibe alternatives Modell, manuellen Ersatzprozess oder definiertes Degraded-Mode-Verhalten. Pflichtfeld: bei High Risk, geschäftskritischen Prozessen oder automatisierten Abläufen." },
      ],
    },
    {
      title: "Identity, Access & Data Controls",
      fields: [
        { id: "g3_rbac", label: "Rollen- und Zugriffskontrolle", source: "gate_3", fixed: "", kind: "control", control: { component: "Identity Provider / Gateway", role: "Plattform-Team", impl: "Entra-ID-Gruppen und RBAC", evidenceHint: "z. B. Rollenmatrix" } },
        { id: "g3_dlp", label: "Data Loss Prevention (DLP)", source: "gate_3", fixed: "", kind: "control", control: { component: "Document Intake", role: "Plattform-Team", impl: "Scan vor Ingestion und Deny Rule", evidenceHint: "z. B. DLP-Konzept.pdf" } },
        { id: "g3_logctrl", label: "Logging & Audit Trail", source: "gate_3", fixed: "", kind: "control", control: { component: "Observability", role: "Plattform-Team", impl: "Gateway Logs und SIEM", evidenceHint: "z. B. Logging-Konzept.pdf" } },
        { id: "g3_authn", label: "Authentifizierung", source: "gate_3", fixed: "", placeholder: "Auswahl: SSO / OIDC / OAuth2; technischer Service Account; Kombination; andere" },
        { id: "g3_authz", label: "Autorisierungskonzept", source: "gate_3", fixed: "", placeholder: "Auswahl: RBAC; ABAC; Kombination aus RBAC und ABAC" },
        { id: "g3_rollen", label: "Zulässige Rollen und Organisationseinheiten (Mehrfachauswahl)", source: "gate_3", fixed: "", placeholder: "Zulässige Rollen, Fachbereiche und Organisationseinheiten festlegen" },
        { id: "g3_pipeline", label: "Dokumenten- und Retrieval-Pipeline erforderlich?", source: "gate_3", fixed: "", placeholder: "Auswahl: Nein; Ja; Nur für bestimmte Datenklassen oder Quellen" },
        { id: "g3_docproc", label: "Bei Ja: Erforderliche Dokumentenverarbeitung (Mehrfachauswahl)", source: "gate_3", fixed: "", optional: true, placeholder: "Auswahl: Quarantäne / Malware-Scan; Textextraktion / OCR; Klassifizierung; DLP-Prüfung; Redaction / Datenminimierung; Human Review vor Indexierung; Chunking / Embedding; kontrollierte Indexierung; Metadaten- und Berechtigungsfilter" },
        { id: "g3_hitl", label: "Umsetzung des Human-Oversight-Levels", source: "gate_3", fixed: "", placeholder: "Beschreibe, an welcher Stelle ein Mensch prüft, entscheidet oder eskaliert und wie diese Entscheidung dokumentiert wird. Pflichtfeld: wenn Gate 2 Human Oversight verlangt." },
        { id: "g3_secrets", label: "Secrets-Management", source: "gate_3", fixed: "", placeholder: "Pflichtfeld bei APIs, Tools oder technischen Credentials. Auswahl: zentrale Secrets-Verwaltung; Managed Identity; andere genehmigte Lösung" },
      ],
    },
    {
      title: "Logging, Monitoring & Operational Security",
      fields: [
        { id: "g3_logconcept", label: "Logging- und Audit-Konzept", source: "gate_3", fixed: "", placeholder: "Zu protokollieren — Auswahl: Zugriff; Policy-Entscheidung; Modell-/Tool-Aufruf; Ingestion; abgelehnter Zugriff; Human Review; Konfigurationsänderung; Kosten/Nutzung; Incident" },
        { id: "g3_logevents", label: "Zu protokollierende Ereignisse (Mehrfachauswahl)", source: "gate_3", fixed: "", placeholder: "Auswahl: Authentifizierungs- und Zugriffsereignisse; Policy-Entscheidungen; Modell- und Tool-Aufrufe; Dokumenten-Ingestion; abgelehnte Zugriffe; Human-Review-Entscheidungen; Modell-, Prompt- und Konfigurationsänderungen; Kosten, Token und Nutzung; Incidents und Findings" },
        { id: "g3_monitoring", label: "Monitoring und Alerts", source: "gate_3", fixed: "", placeholder: "Beschreibe überwachte Qualitäts-, Sicherheits-, Nutzungs- und Kostenereignisse sowie zugehörige Schwellenwerte und Empfänger." },
        { id: "g3_siem", label: "SIEM- oder zentrale Observability-Anbindung", source: "gate_3", fixed: "", optional: true, placeholder: "Auswahl: vorhanden; geplant; nicht erforderlich (mit Begründung)" },
        { id: "g3_incident", label: "Incident- und Eskalationsprozess", source: "gate_3", fixed: "", placeholder: "Beschreibe Erkennung, Verantwortliche, Eskalationswege, Reaktionszeit und Dokumentation." },
        { id: "g3_degraded", label: "Technischer Fallback / Degraded Mode", source: "gate_3", fixed: "", optional: true, placeholder: "Beschreibe das Verhalten bei Modell-/Dienstausfall (Degraded Mode, manueller Ersatzprozess)." },
        { id: "g3_versioning", label: "Prompt-, Modell- und Konfigurationsversionierung", source: "gate_3", fixed: "", placeholder: "Beschreibe Versionierung, Freigabestatus, Rollback und Re-Approval-Trigger." },
      ],
    },
    {
      title: "Dependencies, Evidence & Gate Decision",
      fields: [
        { id: "g3_evidence", label: "Nachweise und Anhänge", source: "none", fixed: "", optional: true, kind: "evidence", docs: GATE3_DOCS },
        { id: "g3_auflagen", label: "Verbindliche Auflagen für Gate 4", source: "gate_3", fixed: "", placeholder: "Dokumentiere verbleibende Vorgaben, die vor Pilot oder Go-Live umgesetzt und nachgewiesen werden müssen, z. B. Penetrationstest, finale IAM-Konfiguration, DLP-Validierung, Monitoring-Schwellenwerte oder Behebung offener Findings." },
        { id: "g3_begruendung", label: "Gate 3 Entscheidungsbegründung", source: "gate_3", fixed: "", placeholder: "Fasse zusammen, wie das Solution Design die Gate-2-Vorgaben technisch umsetzt. Begründe Modellroute, Zugriffskontrollen, Daten- und Retrieval-Schutz, Logging, Monitoring und die für Gate 4 verbleibenden Auflagen." },
      ],
    },
  ],
  4: [
    {
      title: "Implementation Conformance",
      fields: [
        { id: "g4_implstatus", label: "Implementierungsstatus", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Wähle den aktuellen Umsetzungs- und Readiness-Status des AI Service. Drop Down: nicht begonnen; in Umsetzung; technisch umgesetzt; pilotbereit; produktionsbereit" },
        { id: "g4_implbeschreibung", label: "Beschreibung des aktuellen Implementierungsstands", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe, welche Komponenten produktiv umgesetzt sind, welche Funktionen bereits getestet wurden und welche Restarbeiten vor Pilot oder Go-Live bestehen." },
        { id: "g4_abweichungen", label: "Abweichungen vom freigegebenen Solution Design", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe alle Abweichungen vom Gate-3-Solution-Design. Falls keine Abweichung besteht, trage „Keine Abweichungen“ ein." },
        { id: "g4_umgesetztesysteme", label: "Umgesetzte Systeme, Datenquellen und Integrationen (Mehrfachauswahl)", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Wähle alle tatsächlich umgesetzten Systeme, Datenquellen und Integrationen aus." },
        { id: "g4_umsetzungsnachweis", label: "Umsetzungsnachweis / Deployment-Referenz", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Lade Deployment- oder Release-Dokumentation als Umsetzungsnachweis hoch." },
      ],
    },
    {
      title: "Test & Evaluation Evidence",
      fields: [
        { id: "g4_funktionstests", label: "Funktionstests", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Fasse getestete Kernfunktionen, Testergebnis und verbleibende Fehler zusammen. Verknüpfe den vollständigen Testreport als Nachweis." },
        { id: "g4_funktionstests_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Funktionstestbericht" },
        { id: "g4_integrationstests", label: "Integrations- und End-to-End-Tests", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe getestete End-to-End-Flows zwischen Frontend, Gateway, Modell, Retrieval, Datenquelle, Logging und Human Review." },
        { id: "g4_integrationstests_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Integrationstestbericht" },
        { id: "g4_securitytests", label: "Security- und Zugriffstests", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe Rollen-, Rechte-, Authentifizierungs- und Zugriffstests einschließlich negativer Tests für unberechtigte Nutzer." },
        { id: "g4_securitytests_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Security- und Zugriffstestbericht" },
        { id: "g4_dlptests", label: "Daten- und DLP-Tests", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe Tests zu Datenklassifikation, DLP, Redaction, Retrieval-Filtern, Indexierungsregeln und Datenübertragung." },
        { id: "g4_dlptests_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "DLP-/Datenkontrolltestbericht" },
        { id: "g4_qualitaet", label: "Qualitäts- und Evaluationskriterien", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "matrix", columns: [
          { label: "Qualitätsmetrik", hint: "z. B. Quellenabdeckung" },
          { label: "Zielwert", hint: "z. B. ≥ 95 %" },
          { label: "gemessener Wert", hint: "z. B. 97 %" },
          { label: "Status", hint: "erfüllt / nicht erfüllt" },
        ] },
        { id: "g4_testdatensatz", label: "Testdatensatz / Nachweis", source: "gate_input", inputRole: "AI Owner", fixed: "", kind: "upload", uploadHint: "Evaluations-/TEVV-Report inkl. Testdatensatz" },
        { id: "g4_hitltest", label: "Human-Oversight-Test", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe, wie Review Queue, Eskalation, Freigabe, Ablehnung und Audit Trail getestet wurden." },
        { id: "g4_hitltest_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Human-Oversight-Testnachweis" },
      ],
    },
    {
      title: "Pilot & User Readiness",
      fields: [
        { id: "g4_pilotscope", label: "Pilot- oder Rollout-Scope", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Beschreibe Organisationseinheiten, Länder, Nutzergruppen, Datenklassen, Funktionen und Laufzeit des geplanten Piloten oder Rollouts." },
        { id: "g4_pilotgruppe", label: "Pilotgruppe / Nutzerkreis (Mehrfachauswahl)", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Wähle die für Pilot oder Go-Live zugelassenen Rollen und Organisationseinheiten." },
        { id: "g4_training", label: "Nutzerinformation und Training", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Beschreibe Einweisung, Nutzungsgrenzen, Do-not-use-Szenarien, Datenhinweise und verfügbare Trainingsmaterialien." },
        { id: "g4_support", label: "Support- und Feedbackprozess", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Beschreibe Supportkanal, verantwortliche Rolle, Reaktionszeit, Feedbackerfassung und Eskalation bei kritischen Problemen." },
        { id: "g4_erfolgskriterien", label: "Erfolgskriterien für Pilot oder Go-Live", source: "gate_input", inputRole: "AI Owner", fixed: "", kind: "matrix", columns: [
          { label: "Kriterium", hint: "messbares Erfolgskriterium" },
          { label: "Zielwert", hint: "z. B. ≥ 70 %" },
          { label: "Messmethode", hint: "z. B. Telemetrie" },
          { label: "verantwortliche Rolle", hint: "z. B. AI Owner" },
          { label: "Bewertungszeitpunkt", hint: "z. B. nach 3 Monaten" },
        ] },
      ],
    },
    {
      title: "Operational Readiness",
      fields: [
        { id: "g4_betriebsowner", label: "Betriebsowner und Supportverantwortung", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Person Picker: Benenne den technischen Betriebsowner, Supportverantwortliche und Eskalationsvertretung." },
        { id: "g4_monitoringaktiv", label: "Monitoring und Alerting aktiv?", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Drop Down: vollständig aktiv / teilweise aktiv / noch nicht aktiv. Beschreibe aktive Qualitäts-, Sicherheits-, Nutzungs-, Kosten- und Verfügbarkeitsalarme." },
        { id: "g4_incidenttest", label: "Incident- und Eskalationsprozess getestet", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Drop Down: getestet und bestätigt; teilweise getestet; nicht getestet" },
        { id: "g4_incidenttest_nw", label: "Test Nachweis", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "upload", uploadHint: "Beschreibe das getestete Incident-Szenario, beteiligte Rollen, Reaktionszeit und dokumentiertes Ergebnis." },
        { id: "g4_fallbacktest", label: "Fallback / Rollback getestet", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Drop Down: getestet und erfolgreich; teilweise getestet; nicht getestet; nicht anwendbar mit Begründung. Beschreibe Fallback-Modell, manuellen Ersatzprozess, Rollback-Ablauf und Testergebnis." },
        { id: "g4_quotas", label: "Quotas, Budget Guards und Kapazität", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", kind: "matrix", columns: [
          { label: "monatliches Budgetlimit", hint: "z. B. 2.500 €" },
          { label: "Token-/Anfragelimit", hint: "z. B. 5 Mio. Token" },
          { label: "Rate Limits", hint: "z. B. 60 req/min" },
          { label: "erwartete Nutzerzahl", hint: "z. B. 40" },
          { label: "Kapazitätsreserve", hint: "z. B. 30 %" },
          { label: "Eskalation bei Überschreitung", hint: "z. B. Alert an Betrieb" },
        ] },
        { id: "g4_reapprovaltrigger", label: "Review- und Re-Approval-Trigger (Mehrfachauswahl)", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Wähle alle Änderungen oder Ereignisse aus, die eine erneute Freigabe auslösen." },
        { id: "g4_stilllegungsvorb", label: "Lösch-, Aufbewahrungs- und Stilllegungsvorbereitung", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe Aufbewahrungsfristen, Löschwege für Dokumente, Chunks, Indizes, Logs und Secrets sowie die technische Stilllegung." },
      ],
    },
    {
      title: "Evidence & Gate Decision",
      fields: [
        { id: "g4_evidence", label: "Nachweise und Anhänge", source: "none", fixed: "", optional: true, kind: "evidence", docs: GATE4_DOCS },
        { id: "g4_freigabetyp", label: "Gate 4 Entscheidung: Freigabetyp", source: "gate_4", fixed: "", placeholder: "Drop Down: Pilot freigegeben; Pilot unter Auflagen freigegeben; Go-Live freigegeben; Go-Live unter Auflagen freigegeben; Änderungen erforderlich; Eskalation; Ablehnung" },
        { id: "g4_freigabescope", label: "Gate 4 Entscheidung: Freigegebener Scope (bei Freigabe)", source: "gate_4", fixed: "", placeholder: "Dokumentiere freigegebene Nutzergruppen, Organisationseinheiten, Länder, Datenklassen, Funktionen, Modelle, Integrationen und zeitliche Begrenzungen." },
        { id: "g4_betriebsauflagen", label: "Gate 4 Entscheidung: Verbindliche Betriebsauflagen (bei bedingter Freigabe)", source: "gate_4", fixed: "", placeholder: "Formuliere konkrete, überprüfbare Auflagen mit verantwortlicher Rolle und Fälligkeit." },
        { id: "g4_kpiset", label: "Gate 4 Entscheidung: KPI- und Monitoring-Set (Mehrfachauswahl)", source: "gate_4", fixed: "", placeholder: "Wähle die für Gate 5 verbindlich zu überwachenden KPIs und definiere Schwellenwerte." },
        { id: "g4_naechsterreview", label: "Gate 4 Entscheidung: Nächster Reviewtermin", source: "gate_4", fixed: "", placeholder: "Datum" },
        { id: "g4_begruendung", label: "Gate 4 Entscheidungsbegründung", source: "gate_4", fixed: "", placeholder: "Bei Freigabe: Begründe, warum Umsetzung, Tests, Kontrollen, Betrieb und Nutzerbefähigung für den freigegebenen Scope ausreichend sind. Nenne verbleibende Auflagen. Bei Änderungen: Beschreibe konkret, welche Tests, Nachweise, Kontrollen oder Betriebsanforderungen fehlen und wer diese bis wann nachreichen muss. Bei Ablehnung: Begründe, warum wesentliche Voraussetzungen nicht erfüllt sind und eine sichere Pilotierung oder produktive Nutzung nicht vertretbar ist." },
      ],
    },
  ],
  5: [
    {
      title: "Review-Kontext",
      preface: true,
      fields: [
        { id: "g5_reviewart", label: "Review-Art", source: "gate_5", fixed: "", placeholder: "Wähle den Auslöser dieser Gate-5-Prüfung. Drop-Down: planmäßiger Review; ereignisgetriebener Review; Incident Review; Change Review; Kosten-/Kapazitätsreview; Qualitätsreview; Stilllegungsreview" },
        { id: "g5_zeitraum", label: "Review-Zeitraum", source: "gate_5", fixed: "", placeholder: "Wähle den ausgewerteten Betriebszeitraum. (von-bis-Datum-Picker)" },
      ],
    },
    {
      title: "Value, Adoption & Portfolio Fit",
      fields: [
        { id: "g5_activeusers", label: "Aktive Nutzer im Reviewzeitraum", source: "system", fixed: "32 von 40 Pilotnutzern aktiv · 80 % Adoption · Zielwert 70 %", optional: true },
        { id: "g5_volume", label: "Anfrage- oder Prozessvolumen", source: "system", fixed: "1.280 Anfragen im Reviewzeitraum · durchschnittlich 6,7 Anfragen je aktivem Nutzer und Woche", optional: true },
        { id: "g5_realnutzen", label: "Realisierter Nutzen", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Beschreibe den tatsächlich realisierten fachlichen Nutzen und belege ihn mit Messwerten oder Nutzerfeedback." },
        { id: "g5_hyp_evidenz", label: "Nutzenhypothese versus Evidenz", source: "system", fixed: "", optional: true, kind: "matrix", columns: [
          { label: "ursprüngliche Nutzenhypothese", value: "Hypothese: 30 % geringerer Rechercheaufwand." },
          { label: "aktueller Messwert", value: "Gemessen: 38,9 % Reduktion" },
          { label: "Status", value: "erreicht / teilweise erreicht / nicht erreicht" },
        ] },
        { id: "g5_feedback", label: "Nutzerfeedback und Beschwerden", source: "gate_input", inputRole: "AI Owner", fixed: "", placeholder: "Fasse positives Feedback, wiederkehrende Probleme, Beschwerden und gewünschte Verbesserungen zusammen." },
        { id: "g5_feedback_nw", label: "Feedback Nachweis", source: "gate_input", inputRole: "AI Owner", fixed: "", optional: true, kind: "upload", uploadHint: "Nutzerfeedback-Auswertung als Nachweis" },
        { id: "g5_portfolio", label: "Portfolio-Relevanz und strategischer Fit", source: "gate_5", fixed: "", optional: true, placeholder: "Bewerte, ob der AI Service weiterhin zur AI-First-Strategie und zum Portfolioziel beiträgt. Drop-Down: hoher strategischer Beitrag; mittlerer Beitrag; geringer Beitrag; strategischer Fit nicht mehr gegeben" },
      ],
    },
    {
      title: "Quality, Reliability & Human Oversight",
      fields: [
        { id: "g5_antwortqualitaet", label: "Fachliche Antwortqualität", source: "system", fixed: "88 % fachlich korrekte Antworten · Ziel ≥ 85 % · Trend stabil", optional: true },
        { id: "g5_quellen", label: "Quellenabdeckung und Zitierqualität", source: "system", fixed: "97 % der Antworten enthalten mindestens eine freigegebene Quelle · Ziel ≥ 95 %", optional: true },
        { id: "g5_halluzination", label: "Kritische Fehlantworten / Halluzinationen", source: "system", fixed: "0 kritische Halluzinationen · 6 nicht-kritische fachliche Korrekturen", optional: true },
        { id: "g5_latenz", label: "Latenz und Verfügbarkeit", source: "system", fixed: "P95-Latenz 6,4 Sekunden · Ziel < 8 Sekunden · Verfügbarkeit 99,6 %", optional: true },
        { id: "g5_humanreviewfaelle", label: "Human-Review-Fälle", source: "system", fixed: "Anzahl Fälle · bestätigt · abgelehnt · überfällig · durchschnittliche Bearbeitungszeit", optional: true },
        { id: "g5_oversightwirksam", label: "Wirksamkeit der Human-Oversight-Regel", source: "gate_5", fixed: "", optional: true, placeholder: "Drop Down: wirksam; teilweise wirksam; nicht wirksam; nicht ausreichend beurteilbar. Begründe, ob Review, Eskalation und Freigabe die vorgesehenen Risiken tatsächlich kontrollieren." },
      ],
    },
    {
      title: "Risk, Compliance, Security & Incidents",
      fields: [
        { id: "g5_policyverstoss", label: "Policy-Verstöße und blockierte Zugriffe", source: "system", fixed: "27 blockierte Zugriffe auf nicht freigegebene Daten · 0 erfolgreiche Policy-Umgehungen", optional: true },
        { id: "g5_incidents", label: "Incidents und Security Findings", source: "system", fixed: "0 kritische · 1 mittleres Finding geschlossen · 2 niedrige Findings offen", optional: true },
        { id: "g5_compliancefindings", label: "Datenschutz- oder Compliance-Findings", source: "gate_5", fixed: "", optional: true, placeholder: "Dokumentiere relevante Datenschutz-, Compliance- oder Governance-Findings und ihren Bearbeitungsstatus." },
        { id: "g5_auflagenstatus", label: "Status früherer Auflagen", source: "system", fixed: "Auflagenliste mit Status: erfüllt; in Bearbeitung; überfällig; nicht mehr anwendbar", optional: true },
        { id: "g5_kontrollwirksamkeit", label: "Kontrollwirksamkeit", source: "gate_5", fixed: "", kind: "matrix", columns: [
          { label: "Kontrollname", hint: "z. B. DLP-Gateway" },
          { label: "Sollvorgabe", hint: "erwartete Wirkung" },
          { label: "Bewertung", hint: "wirksam / teilweise wirksam / unwirksam" },
          { label: "aktueller Nachweis", upload: true },
        ] },
      ],
    },
    {
      title: "Cost, Capacity & Vendor",
      fields: [
        { id: "g5_gesamtkosten", label: "Gesamtkosten im Reviewzeitraum", source: "system", fixed: "Ist-Kosten · Budget · Abweichung · Trend", optional: true },
        { id: "g5_kostenproanfrage", label: "Kosten je Anfrage oder Prozess", source: "system", fixed: "3,79 € je 1.000 Anfragen inklusive Search- und Modellkosten", optional: true },
        { id: "g5_kapazitaet", label: "Kapazität und Performance", source: "system", fixed: "KPI · Beschreibe Kapazitätsengpässe, Skalierungsbedarf oder Performance-Risiken.", optional: true },
        { id: "g5_abhaengigkeiten", label: "Anbieter-, Modell- und Plattformabhängigkeiten", source: "gate_input", inputRole: "Umsetzung & Betrieb", fixed: "", placeholder: "Beschreibe kritische Anbieter-, Modell-, Plattform- oder Lizenzabhängigkeiten und mögliche Exit-/Fallback-Optionen." },
        { id: "g5_vendorentwicklung", label: "Vendor-, Modell- oder Plattformentwicklung", source: "system", fixed: "Ereignisliste: Modellversion abgekündigt; Preismodell geändert; Region oder Hosting geändert; neue Vertragsbedingungen; API- oder MCP-Schnittstelle geändert; relevante Security Advisory", optional: true },
      ],
    },
    {
      title: "Change & Re-Approval Assessment",
      fields: [
        { id: "g5_aenderungen", label: "Festgestellte Änderungen seit letzter Freigabe (Mehrfachauswahl)", source: "gate_5", fixed: "", placeholder: "Drop Down: Zweck geändert; Nutzerkreis erweitert; neue Organisationseinheit / neues Land; neue Datenquelle; höhere Datenklasse; neues Modell / Deployment; wesentliche Modellversion; neue Prompt- oder Agentenlogik; neue Integration; neues Tool / neuer MCP-Server; höherer Automatisierungsgrad; Human-Oversight-Level geändert; Betriebsmodell geändert; keine relevante Änderung" },
        { id: "g5_aenderungsbeschreibung", label: "Beschreibung der Änderungen", source: "gate_input", inputRole: "AI Owner", fixed: "", optional: true, placeholder: "Beschreibe Umfang, Grund und erwartete Auswirkung der Änderung auf Zweck, Daten, Modell, Nutzer, Kontrollen und Betrieb." },
        { id: "g5_reapprovalempfehlung", label: "Automatische Re-Approval-Empfehlung", source: "system", fixed: "kein Re-Approval erforderlich; Re-Approval ab Gate 2 empfohlen; Re-Approval ab Gate 3 empfohlen; Re-Approval ab Gate 4 empfohlen; sofortige Eskalation empfohlen", optional: true },
        { id: "g5_reapproval", label: "Re-Approval erforderlich", source: "gate_5", fixed: "", placeholder: "nein; ja, zurück zu Gate 2; ja, zurück zu Gate 3; ja, zurück zu Gate 4; Eskalation. Begründe, warum die Änderung innerhalb der bisherigen Freigabe bleibt oder welches Gate erneut durchlaufen werden muss." },
        { id: "g5_schutzmassnahme", label: "Temporäre Schutzmaßnahme bis zur Entscheidung (Mehrfachauswahl)", source: "gate_5", fixed: "", optional: true, placeholder: "Drop Down: keine; Nutzerkreis einschränken; Datenquelle sperren; höhere Datenklasse sperren; Modellroute sperren; Tool-/MCP-Zugriff deaktivieren; Human Review verschärfen; nur manueller Fallback; Service pausieren" },
      ],
    },
    {
      title: "Evidence & Lifecycle Decision",
      fields: [
        { id: "g5_evidence", label: "Nachweise und Anhänge", source: "none", fixed: "", optional: true, kind: "evidence", docs: GATE5_DOCS },
        { id: "g5_lifecycle", label: "Lifecycle-Status", source: "gate_5", fixed: "", placeholder: "Weiterbetrieb; Weiterbetrieb unter Auflagen; Nachschärfung ohne vollständiges Re-Approval; Re-Approval ab Gate 2; Re-Approval ab Gate 3; Re-Approval ab Gate 4; temporär pausieren; stilllegen" },
        { id: "g5_auflagen", label: "Verbindliche Auflagen", source: "gate_5", fixed: "", optional: true, placeholder: "Formuliere konkrete Maßnahmen, verantwortliche Rollen, Nachweise und Fristen für den weiteren Betrieb." },
        { id: "g5_naechsterreview", label: "Nächster Reviewtermin", source: "gate_5", fixed: "", optional: true, placeholder: "Datum" },
        { id: "g5_begruendung", label: "Gate 5 Entscheidungsbegründung", source: "gate_5", fixed: "", placeholder: "bei Weiterbetrieb: Begründe anhand von Nutzen, Qualität, Risiko, Kosten und Kontrollwirksamkeit, warum der AI Service weiterbetrieben werden kann. bei Re-Approval: Beschreibe die wesentliche Änderung oder Risikolage, das erforderliche Ziel-Gate und temporäre Schutzmaßnahmen. bei Pausierung: Begründe die unmittelbare Pausierung und definiere Voraussetzungen für eine Wiederaufnahme. bei Stilllegung: Begründe die Stilllegung und dokumentiere Datenlöschung, Deaktivierung von Zugängen, Abschlusskontrollen und Aktualisierung des AI Registers." },
      ],
    },
    {
      title: "Stilllegungsplan (nur wenn „stilllegen“ ausgewählt)",
      fields: [
        { id: "g5_stilllegungsdatum", label: "Stilllegungsdatum", source: "gate_5", fixed: "", optional: true, placeholder: "Datum" },
        { id: "g5_schnittstellen", label: "Zu deaktivierende Schnittstellen und Zugänge (Mehrfachauswahl)", source: "gate_5", fixed: "", optional: true, placeholder: "Liste APIs, MCP-Server, Modellrouten, Service Accounts, Rollen und Frontends auf, die deaktiviert werden." },
        { id: "g5_datenbehandlung", label: "Daten-, Index- und Logbehandlung", source: "gate_5", fixed: "", optional: true, placeholder: "Beschreibe Löschung, Archivierung oder Aufbewahrung von Dokumenten, Chunks, Vektorindizes, Logs und Backups." },
        { id: "g5_secrets", label: "Secrets und technische Ressourcen", source: "gate_5", fixed: "", optional: true, placeholder: "Beschreibe Widerruf von Secrets, Zertifikaten, Deployments, Quotas und Cloud-Ressourcen." },
        { id: "g5_kommunikation", label: "Nutzer- und Stakeholder-Kommunikation", source: "gate_5", fixed: "", optional: true, placeholder: "Beschreibe Information der Nutzer, Fachbereiche, Governance-Rollen und Supportverantwortlichen." },
        { id: "g5_abschlussnachweis", label: "Abschluss Nachweis", source: "gate_5", fixed: "", optional: true, kind: "upload", uploadHint: "Deaktivierungsprotokoll, Lösch-/Archivierungsnachweis, Kostenabschluss, Aktualisierung des AI Registers, Abschlussbewertung" },
      ],
    },
  ],
};

// --- "Verbindliche Vorgaben aus Gate N-1" read-only blocks — §7 ---
export interface InheritedConstraint {
  label: string;
  value: string;
  fromGate: GateId;
}

export const INHERITED_CONSTRAINTS: Partial<Record<GateId, InheritedConstraint[]>> = {
  3: [
    {
      label: "Freigegebene Datenklasse",
      value: "C1–C3; C3 nur nach Data-Owner-Freigabe und Human Review",
      fromGate: 2,
    },
    { label: "Risikoklasse", value: "Medium Risk", fromGate: 2 },
    {
      label: "Zulässiger Modellrahmen",
      value: "C2/C3 nur interne oder private, freigegebene Modelle",
      fromGate: 2,
    },
    {
      label: "Externe Datenübertragung",
      value: "Nur C0/C1 unter Gateway-, DLP- und Redaction-Auflagen",
      fromGate: 2,
    },
    {
      label: "Human-Oversight-Level",
      value: "Review vor C3-Indexierung und bei Ausnahmen; Stichproben für C1/C2",
      fromGate: 2,
    },
    {
      label: "Verbindliche Mindestkontrollen",
      value: "RBAC, DLP, Classification Tags, Retrieval Filter, HITL, Logging, Model Routing",
      fromGate: 2,
    },
    {
      label: "Offene Auflagen",
      value: "Rollenmatrix, Chunk-Filter und C3-DLP-Test noch nachzuweisen",
      fromGate: 2,
    },
    {
      label: "Eskalationsstatus",
      value: "Keine; Re-Eskalation bei C4, externem Modell oder Zweckänderung",
      fromGate: 2,
    },
  ],
  4: [
    {
      label: "Freigegebenes Solution Design",
      value:
        "Azure-basierter interner Wissensassistent mit RAG-Architektur. Nutzer authentifizieren sich über Entra ID; Retrieval ausschließlich auf freigegebene Wissensquellen.",
      fromGate: 3,
    },
    {
      label: "Genehmigte Modellroute",
      value:
        "Standardroute über die zentrale Gateway-Schicht zu einem freigegebenen Azure-OpenAI-Deployment in der EU-Region.",
      fromGate: 3,
    },
    {
      label: "Genehmigte Integrationen",
      value: "Benutzeroberfläche (intern) und API über Gateway; Dokumenten-Upload mit DLP-Scan.",
      fromGate: 3,
    },
    {
      label: "Verbindliche technische Kontrollen",
      value: "DLP-Gateway, Prompt-/Output-Logging, rollenbasierter Zugriff, Human-Review für C3.",
      fromGate: 3,
    },
    {
      label: "Logging-/Monitoring-Vorgaben",
      value: "Gateway-Logs und SIEM-Anbindung; Protokollierung von Zugriff, Policy-Entscheidungen, Modell-/Tool-Aufrufen, Human Review und Incidents.",
      fromGate: 3,
    },
    {
      label: "Human-Oversight-Umsetzung",
      value: "Human Review vor C3-Indexierung und bei Ausnahmen; Stichprobenprüfung für C1/C2.",
      fromGate: 3,
    },
    {
      label: "Technische Auflagen",
      value: "Penetrationstest, finale IAM-Konfiguration und C3-DLP-Validierung vor Go-Live nachzuweisen.",
      fromGate: 3,
    },
    {
      label: "Offene Abhängigkeiten",
      value: "Rollenmatrix, Chunk-Filter und C3-DLP-Test noch offen.",
      fromGate: 3,
    },
  ],
  5: [
    {
      label: "Freigabestatus",
      value: "Go-Live unter Auflagen freigegeben",
      fromGate: 4,
    },
    {
      label: "Freigegebener Scope",
      value: "Interne Wissensarbeit für freigegebene Fachbereiche; Datenklassen C1–C3; Standard-Modellroute über Gateway.",
      fromGate: 4,
    },
    {
      label: "Verbindliche Betriebsauflagen",
      value: "Quartalsweises Kosten-/Kapazitätsreview; Re-Evaluation der Modellroute nach 6 Monaten; aktiver Incident-Prozess.",
      fromGate: 4,
    },
    {
      label: "KPI- und Monitoring-Set",
      value: "Antwortqualität, Quellenabdeckung, Halluzinationsrate, Latenz/Verfügbarkeit, Kosten je Anfrage, Human-Review-Durchsatz.",
      fromGate: 4,
    },
    {
      label: "Nächster Reviewtermin",
      value: "Planmäßiger Gate-5-Review nach 3 Monaten Produktivbetrieb.",
      fromGate: 4,
    },
  ],
};

// Build fresh review fields for a gate from an initiative's request data.
export function buildGateFields(
  gate: GateId,
  request: AiRequestData,
): ReviewFieldData[] {
  const fields: ReviewFieldData[] = [];
  for (const section of GATE_SECTIONS[gate]) {
    for (const bp of section.fields) {
      let value = bp.fixed ?? "";
      if (bp.from) {
        const raw = request[bp.from];
        value = Array.isArray(raw) ? raw.join(", ") : (raw ?? "").toString();
      }
      fields.push({
        id: bp.id,
        label: bp.label,
        source: bp.source,
        value,
        decision: "unset",
        note: "",
        required: !bp.optional,
        placeholder: bp.placeholder,
        inputRole: bp.inputRole,
      });
    }
  }
  return fields;
}

// Map a field id to its section title (for grouping in the workbench UI).
export function sectionForField(gate: GateId, fieldId: string): string {
  const sec = GATE_SECTIONS[gate].find((s) =>
    s.fields.some((f) => f.id === fieldId),
  );
  return sec?.title ?? "";
}

// Re-Approval review-art options — §7 Gate 5
export const REVIEW_ART_OPTIONS = [
  "Planmäßiger Review",
  "Ereignisgetriebener Review",
  "Incident-Review",
  "Change-Review",
  "Kosten-/Kapazitätsreview",
  "Qualitätsreview",
  "Stilllegungsreview",
];
