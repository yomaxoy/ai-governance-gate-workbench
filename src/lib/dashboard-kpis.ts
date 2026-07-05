// Dashboard KPI sets per view — Spec §5.2 (values switch with dashboardView only)
import type { DashboardView } from "./types";
import type { KpiTileProps } from "@/components/ui/KpiTile";

export const DASHBOARD_KPIS: Record<DashboardView, KpiTileProps[]> = {
  AIGOV: [
    { label: "Offene Reviews", value: "12", delta: -12, positiveIsGood: false },
    {
      label: "Überfällige Entscheidungen",
      value: "3",
      delta: 18,
      positiveIsGood: false,
    },
    {
      label: "Re-Approval erforderlich",
      value: "6",
      delta: -12,
      positiveIsGood: false,
    },
    {
      label: "High Risk Fälle in Prüfung",
      value: "4",
      delta: -18,
      positiveIsGood: false,
    },
  ],
  AI_OWNER: [
    { label: "Meine aktiven Requests", value: "2", delta: 12 },
    { label: "Offene Aufgaben", value: "3", delta: 18, positiveIsGood: false },
    { label: "In Prüfung", value: "2", delta: 12 },
    { label: "Freigegebene Initiativen", value: "1", delta: -18 },
  ],
  // Management: 8 KPI-Kacheln (2 Reihen à 4) — Spec §5.2
  MANAGEMENT: [
    { label: "KI-Initiativen im Portfolio", value: "25", delta: 8 },
    { label: "Use Cases mit validierten Nutzen", value: "6/25", delta: 15 },
    {
      label: "Monatliche AI-Betriebskosten",
      value: "25.250 €",
      delta: -18,
      positiveIsGood: false,
    },
    {
      label: "Offene kritische Findings",
      value: "4",
      delta: 18,
      positiveIsGood: false,
    },
    { label: "KI-Initiativen in Prüfung", value: "8", delta: 12 },
    {
      label: "Re-Approvals fällig",
      value: "3",
      delta: -12,
      positiveIsGood: false,
    },
    {
      label: "Gate-Durchlaufzeit im Schnitt",
      value: "18 Tage",
      delta: -6,
      positiveIsGood: false,
    },
    {
      label: "Kostenrisiko / Budgetauslastung",
      value: "72 %",
      delta: 6,
      positiveIsGood: false,
    },
  ],
};

// AI Register KPI tiles — Spec §5.4
export const REGISTER_KPIS: KpiTileProps[] = [
  { label: "Wertbeitrag KPI", value: "6/25", delta: 12, subtext: "vs letzten Monat" },
  {
    label: "Kosten KPI",
    value: "25.250 €",
    delta: -18,
    positiveIsGood: false,
    subtext: "vs letzten Monat",
  },
  { label: "AI Adoption KPI", value: "25", delta: 12, subtext: "vs letzten Monat" },
  {
    label: "Risiko KPI",
    value: "25",
    delta: -18,
    positiveIsGood: false,
    subtext: "vs letzten Monat",
  },
];
