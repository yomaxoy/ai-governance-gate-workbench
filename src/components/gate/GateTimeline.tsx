"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { GateId } from "@/lib/types";
import { GATE_TIMELINE_LABEL } from "@/lib/gate-config";
import { ProgressBar } from "@/components/ui/ProgressBar";

const GATES: GateId[] = [1, 2, 3, 4, 5];

export function GateTimeline({
  currentGate,
  activeGate,
  onSelect,
}: {
  /** highest reached gate (filled up to here) */
  currentGate: GateId;
  /** the gate currently open in the workbench */
  activeGate: GateId;
  onSelect: (g: GateId) => void;
}) {
  const [open, setOpen] = useState(true);
  const progress = ((currentGate - 1) / 4) * 100;

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-3 flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-text">Timeline der Gates</h3>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>

      {open && (
        <>
          <div className="flex items-start justify-between gap-1">
            {GATES.map((g) => {
              const reached = g <= currentGate;
              const isActive = g === activeGate;
              return (
                <button
                  key={g}
                  onClick={() => reached && onSelect(g)}
                  disabled={!reached}
                  className="flex flex-1 flex-col items-center gap-2 text-center disabled:cursor-not-allowed"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-offset-2 transition-colors ${
                      reached
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-muted"
                    } ${isActive ? "ring-primary" : "ring-transparent"}`}
                  >
                    {g < currentGate ? <Check size={16} /> : g}
                  </span>
                  <span
                    className={`text-[11px] leading-tight ${
                      isActive ? "font-semibold text-primary" : "text-muted"
                    }`}
                  >
                    {GATE_TIMELINE_LABEL[g]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <ProgressBar value={progress} color="bg-primary" />
          </div>
        </>
      )}
    </div>
  );
}
