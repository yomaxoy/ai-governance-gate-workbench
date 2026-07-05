// Deterministische Mock-Trenddaten für das Management-Dashboard.
// Bewusst KEIN Math.random()/Date.now() — feste Arrays, damit Server- und
// Client-Render identisch sind (keine Hydration-Mismatches).

export type TrendRange = "daily" | "weekly" | "monthly";

export interface TrendPoint {
  /** X-Achsen-Label (Wochentag, Kalenderwoche oder Monat) */
  label: string;
  /** AI-Aktivität: verarbeitete Requests im jeweiligen Zeitraum */
  value: number;
}

/** Menschlesbare Beschriftung je Zeitraum (für Untertitel/Legende). */
export const TREND_RANGE_LABELS: Record<TrendRange, string> = {
  daily: "Täglich",
  weekly: "Wöchentlich",
  monthly: "Monatlich",
};

/**
 * AI-Aktivität (Anzahl verarbeiteter Requests) im Zeitverlauf.
 * daily: aktuelle Woche (Mo–So), weekly: KW1–KW8, monthly: Jan–Dez.
 */
export const MANAGEMENT_TREND: Record<TrendRange, TrendPoint[]> = {
  daily: [
    { label: "Mo", value: 148 },
    { label: "Di", value: 172 },
    { label: "Mi", value: 205 },
    { label: "Do", value: 261 },
    { label: "Fr", value: 243 },
    { label: "Sa", value: 96 },
    { label: "So", value: 78 },
  ],
  weekly: [
    { label: "KW1", value: 820 },
    { label: "KW2", value: 905 },
    { label: "KW3", value: 1140 },
    { label: "KW4", value: 1075 },
    { label: "KW5", value: 1298 },
    { label: "KW6", value: 1210 },
    { label: "KW7", value: 1425 },
    { label: "KW8", value: 1560 },
  ],
  monthly: [
    { label: "Jan", value: 3200 },
    { label: "Feb", value: 3480 },
    { label: "Mär", value: 3910 },
    { label: "Apr", value: 4260 },
    { label: "Mai", value: 4120 },
    { label: "Jun", value: 4680 },
    { label: "Jul", value: 5240 },
    { label: "Aug", value: 4990 },
    { label: "Sep", value: 5510 },
    { label: "Okt", value: 6020 },
    { label: "Nov", value: 6340 },
    { label: "Dez", value: 6810 },
  ],
};
