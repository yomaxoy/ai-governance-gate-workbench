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
  kind?: "field" | "evidence"; // "evidence" → upload + document table
  docs?: EvidenceDoc[]; // document rows for an evidence block
}

export interface GateSection {
  title: string;
  fields: FieldBlueprint[];
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
        { id: "g3_solution", label: "Beschreibung des geplanten Solution Designs", source: "gate_3", fixed: "" },
        { id: "g3_loesung", label: "Bevorzugte Lösung / Tool", source: "ai_request", from: "bevorzugteLoesung" },
        { id: "g3_betrieb", label: "Betriebsmodell", source: "ai_request", from: "betriebsmodell" },
        { id: "g3_integr", label: "Geplante Integrationen", source: "ai_request", from: "integrationen" },
      ],
    },
    {
      title: "Security Controls",
      fields: [
        { id: "g3_iam", label: "Identitäts-, Rollen- und Zugriffskonzept", source: "none", fixed: "" },
        { id: "g3_dlp", label: "DLP-, Retrieval- und Human-Review-Kontrollen", source: "none", fixed: "" },
        { id: "g3_logging", label: "Logging, Auditierbarkeit und Monitoring", source: "none", fixed: "" },
        { id: "g3_fallback", label: "Technische Ownership und Fallback", source: "none", fixed: "" },
      ],
    },
  ],
  4: [
    {
      title: "Pilot & Tests",
      fields: [
        { id: "g4_tests", label: "Funktions-, Integrations- und Sicherheitstests", source: "none", fixed: "" },
        { id: "g4_quality", label: "Qualitäts- und Evaluationskriterien", source: "none", fixed: "" },
        { id: "g4_controls", label: "Daten-, Rollen- und Zugriffskontrollen (Wirksamkeit)", source: "none", fixed: "" },
      ],
    },
    {
      title: "Betriebsübergabe",
      fields: [
        { id: "g4_monitoring", label: "Monitoring, Logging, Alerts, Incident-Prozess", source: "none", fixed: "" },
        { id: "g4_rollback", label: "Fallback, Rollback und Betriebsübergabe", source: "none", fixed: "" },
        { id: "g4_support", label: "Pilotgruppe, Training und Support", source: "none", fixed: "" },
      ],
    },
  ],
  5: [
    {
      title: "Review-Kontext",
      fields: [
        { id: "g5_reviewart", label: "Review-Art", source: "gate_5", fixed: "Planmäßiger Review" },
        { id: "g5_zeitraum", label: "Review-Zeitraum", source: "gate_5", fixed: "" },
      ],
    },
    {
      title: "Value, Adoption & Portfolio Fit",
      fields: [
        { id: "g5_activeusers", label: "Aktive Nutzer im Reviewzeitraum", source: "system", fixed: "32 von 40 Pilotnutzern aktiv · 80 % Adoption · Zielwert 70 %" },
        { id: "g5_volume", label: "Anfrage- oder Prozessvolumen", source: "system", fixed: "1.280 Anfragen im Reviewzeitraum · durchschnittlich 6,7 Anfragen je aktivem Nutzer und Woche" },
        { id: "g5_nutzen", label: "Nutzen und Adoption", source: "none", fixed: "" },
        { id: "g5_quality", label: "Qualität und Zuverlässigkeit", source: "none", fixed: "" },
        { id: "g5_risk", label: "Risiko-, Compliance- und Security-Kontrollen", source: "none", fixed: "" },
        { id: "g5_costs", label: "Kosten, Kapazität und Nutzung", source: "none", fixed: "" },
        { id: "g5_changes", label: "Änderungen an Zweck/Daten/Modell/Rollen", source: "none", fixed: "" },
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
  ],
  5: [
    {
      label: "Freigabestatus",
      value: "Pilot unter Auflagen freigegeben",
      fromGate: 4,
    },
    {
      label: "Offene Auflagen aus Go-Live",
      value: "Quartalsweises Kosten-/Kapazitätsreview; Re-Evaluation der Modellroute nach 6 Monaten.",
      fromGate: 4,
    },
    {
      label: "Betriebsübergabe",
      value: "Betrieb durch Plattform-Team; Incident-Prozess aktiv; Monitoring-Dashboard live.",
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
