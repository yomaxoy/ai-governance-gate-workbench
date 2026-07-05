import { Info } from "lucide-react";
import type { RiskClass } from "@/lib/types";

const STYLES: Record<RiskClass, string> = {
  "Low Risk": "bg-yellow-50 text-warning",
  "Medium Risk": "bg-gray-100 text-gray-600",
  "High Risk": "bg-red-50 text-danger",
  "in Prüfung": "bg-gray-100 text-muted",
};

export function RiskBadge({ risk }: { risk: RiskClass }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[risk]}`}
    >
      <Info size={12} />
      {risk}
    </span>
  );
}
