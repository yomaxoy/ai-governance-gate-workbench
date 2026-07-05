"use client";

import { CircleCheck, Cpu, FileInput } from "lucide-react";
import type { ReviewDecision, ReviewFieldData } from "@/lib/types";
import { DECISION_META, fieldNeedsNote } from "@/lib/workflow";

function SourceBadge({ source }: { source: ReviewFieldData["source"] }) {
  if (source === "none") return null;

  if (source === "ai_request") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-info">
        <FileInput size={11} />
        aus AI Request
      </span>
    );
  }

  if (source === "system") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-warning">
        <Cpu size={11} />
        systemgeneriert
      </span>
    );
  }

  // gate_N — green "Gate N Entscheidung"
  const gateNumber = source.split("_")[1];
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-success">
      <CircleCheck size={11} />
      Gate {gateNumber} Entscheidung
    </span>
  );
}

const DECISIONS: Exclude<ReviewDecision, "unset">[] = [
  "confirmed",
  "clarification",
  "blocker",
];

export function ReviewField({
  field,
  readOnly,
  onChange,
}: {
  field: ReviewFieldData;
  readOnly: boolean;
  onChange: (patch: Partial<ReviewFieldData>) => void;
}) {
  const needsNote = fieldNeedsNote(field);

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-text">
          {field.label} <span className="text-danger">*</span>
        </label>
        <SourceBadge source={field.source} />
      </div>

      {/* Value (read-only, prefilled from source) */}
      <textarea
        value={field.value}
        onChange={(e) => onChange({ value: e.target.value })}
        readOnly={field.source !== "none"}
        rows={field.value.length > 70 ? 2 : 1}
        placeholder={field.source === "none" ? "Eintrag / Bewertung …" : ""}
        className={`mb-3 w-full resize-none rounded-md border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary ${
          field.source !== "none" ? "bg-surface" : "bg-white"
        }`}
      />

      {/* Decision radios */}
      <div className="flex flex-wrap gap-2">
        {DECISIONS.map((d) => {
          const meta = DECISION_META[d];
          const active = field.decision === d;
          return (
            <button
              key={d}
              type="button"
              disabled={readOnly}
              onClick={() => onChange({ decision: d })}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                active
                  ? `${meta.ring} ${meta.text} bg-white`
                  : "border-border text-muted hover:bg-surface"
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                  active ? meta.ring : "border-border"
                }`}
              >
                {active && <span className={`h-2 w-2 rounded-full ${meta.dot}`} />}
              </span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Justification */}
      <textarea
        value={field.note}
        onChange={(e) => onChange({ note: e.target.value })}
        readOnly={readOnly}
        rows={2}
        placeholder="Begründung, Auflage oder Rückfrage"
        className={`mt-3 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-primary ${
          needsNote ? "border-danger" : "border-border"
        }`}
      />
      {needsNote && (
        <p className="mt-1 text-xs text-danger">
          Begründung erforderlich bei Klärung oder Blocker.
        </p>
      )}
    </div>
  );
}
