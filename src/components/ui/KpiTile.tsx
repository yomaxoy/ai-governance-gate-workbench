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

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-text">{value}</p>
      {hasDelta && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              good
                ? "bg-green-50 text-success"
                : "bg-red-50 text-danger"
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
