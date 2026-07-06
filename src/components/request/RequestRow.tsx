"use client";

import { Bot } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { GateId, Initiative } from "@/lib/types";
import { GATE_ROW_LABEL } from "@/lib/gate-config";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";

const GATES: GateId[] = [1, 2, 3, 4, 5];

export function RequestRow({ initiative }: { initiative: Initiative }) {
  const { openWorkbench } = useApp();

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
            <Bot size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-text">{initiative.title}</h3>
            <p className="truncate text-sm text-muted">{initiative.summary}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-muted">AI Owner</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-text">
            <span className="h-2 w-2 rounded-full bg-success" />
            {initiative.aiOwner}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge risk={initiative.risk} />
          <button
            onClick={() => openWorkbench(initiative.id, initiative.currentGate)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Details ansehen ›
          </button>
        </div>
      </div>

      {/* Gate labels + progress */}
      <div className="mt-4">
        <div className="mb-2 grid grid-cols-5 gap-1">
          {GATES.map((g) => {
            const reached = g <= initiative.currentGate;
            return (
              <button
                key={g}
                onClick={() => openWorkbench(initiative.id, g)}
                className={`truncate text-left text-[11px] ${
                  reached ? "font-medium text-primary" : "text-muted"
                }`}
                title={GATE_ROW_LABEL[g]}
              >
                {GATE_ROW_LABEL[g]}
              </button>
            );
          })}
        </div>
        <ProgressBar value={initiative.gateProgress} />
      </div>
    </div>
  );
}
