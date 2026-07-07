import { TrendingDown, TrendingUp } from "lucide-react";

export interface KpiTileProps {
  label: string;
  value: string;
  /** delta percent; positive => up/green, negative => down/red. Omit for no chip. */
  delta?: number;
  /** when true, a positive delta is rendered green (default). Set false to invert. */
  positiveIsGood?: boolean;
  subtext?: string;
}

function Sparkline({
  direction,
  good,
}: {
  direction: "up" | "down" | "risk";
  good: boolean;
}) {
  const path =
    direction === "down"
      ? "M4 10 C12 12 14 20 22 18 C30 15 32 26 40 23 C48 20 51 28 58 24 C66 20 72 17 80 20 C86 22 90 18 92 17"
      : direction === "risk"
        ? "M4 24 C12 22 16 14 24 18 C32 22 35 7 43 12 C51 17 55 5 64 11 C73 17 78 26 92 18"
        : "M4 24 C12 22 15 15 23 17 C31 19 34 9 42 12 C51 15 54 7 64 10 C74 13 79 23 92 17";

  return (
    <svg
      viewBox="0 0 96 36"
      className={`h-9 w-24 shrink-0 ${
        good ? "text-green-300" : "text-red-300"
      }`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiTile({
  label,
  value,
  delta,
  positiveIsGood = true,
  subtext = "vs letzten Monat",
}: KpiTileProps) {
  const hasDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;
  const good = up === positiveIsGood;
  const sparklineDirection = !good ? "risk" : up ? "up" : "down";

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold text-text">{value}</p>
        </div>

        {hasDelta && <Sparkline direction={sparklineDirection} good={good} />}
      </div>

      {hasDelta && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              good ? "bg-green-50 text-success" : "bg-red-50 text-danger"
            }`}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {up ? "+" : ""}
            {delta}%
          </span>
          <span className="text-xs text-muted">{subtext}</span>
        </div>
      )}
    </div>
  );
}