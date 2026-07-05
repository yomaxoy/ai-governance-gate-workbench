import { Check } from "lucide-react";
import type { GateId } from "@/lib/types";
import { GATE_TIMELINE_LABEL } from "@/lib/gate-config";

const GATES: GateId[] = [1, 2, 3, 4, 5];

/**
 * Read-only 5-gate timeline.
 * Passed gates (< current) are checked, the current gate is outlined,
 * later gates are greyed out. Dashed connector runs behind the circles.
 */
export function GateStatusTimeline({ currentGate }: { currentGate: GateId }) {
  return (
    <div className="relative">
      {/* connector line, from first to last circle center */}
      <div className="absolute left-[10%] right-[10%] top-4 border-t-2 border-dashed border-border" />

      <div className="relative grid grid-cols-5">
        {GATES.map((g) => {
          const done = g < currentGate;
          const active = g === currentGate;

          const circle = done
            ? "bg-primary text-primary-foreground"
            : active
              ? "border-2 border-primary bg-white text-primary"
              : "bg-surface text-muted";

          const gateLabel = active
            ? "font-semibold text-primary"
            : done
              ? "font-semibold text-text"
              : "font-semibold text-muted";

          return (
            <div
              key={g}
              className="flex flex-col items-center px-1 text-center"
            >
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${circle}`}
              >
                {done ? <Check size={16} /> : g}
              </span>
              <span className={`mt-2 text-xs ${gateLabel}`}>Gate {g}</span>
              <span className="text-[11px] leading-tight text-muted">
                {GATE_TIMELINE_LABEL[g]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
