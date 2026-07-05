import { Lock } from "lucide-react";
import type { GateId } from "@/lib/types";
import { INHERITED_CONSTRAINTS } from "@/lib/gate-config";

export function InheritedConstraints({ gate }: { gate: GateId }) {
  const items = INHERITED_CONSTRAINTS[gate];
  if (!items || items.length === 0) return null;
  const fromGate = items[0].fromGate;
  const isOperate = gate === 5;

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-text">
        {isOperate
          ? `Verbindliche Betriebsfreigabe aus Gate ${fromGate}`
          : `Verbindliche Vorgaben aus Gate ${fromGate}`}
      </h3>
      <div className="space-y-3">
        {items.map((c) => (
          <div
            key={c.label}
            className="rounded-md border border-border bg-surface p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-medium text-text">{c.label}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-warning">
                <Lock size={11} />
                aus Gate {c.fromGate}
              </span>
            </div>
            <p className="text-sm text-text">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
