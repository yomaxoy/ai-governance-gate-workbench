"use client";

import {
  ArrowUpCircle,
  CircleCheck,
  Cpu,
  FileInput,
  PenLine,
  Upload,
} from "lucide-react";
import type { EvidenceDoc, ReviewDecision, ReviewFieldData } from "@/lib/types";
import type { ControlImpl, MatrixCell } from "@/lib/gate-config";
import { DECISION_META, fieldNeedsNote } from "@/lib/workflow";

// A field's value is reviewer-editable when it is decided at *this* gate
// (a "Gate N Entscheidung" where N === current gate) or a free status field —
// not when it is inherited from the AI Request, a previous gate, or the system.
function isEditable(
  source: ReviewFieldData["source"],
  currentGate: number,
): boolean {
  if (source === "none") return true;
  if (source === "gate_input") return true; // role-submitted gate input
  if (source.startsWith("gate_")) return Number(source.split("_")[1]) >= currentGate;
  return false;
}

// "Nachweise und Anhänge" — upload dropzone + expected-document table (§7).
function EvidenceArea({ docs }: { docs: EvidenceDoc[] }) {
  const statusClass = (s: string) =>
    s === "Akzeptiert" || s === "Eingereicht"
      ? "text-success"
      : s === "Fehlt"
        ? "text-danger"
        : s === "In Prüfung"
          ? "text-warning"
          : "text-muted";
  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-border bg-surface px-3 py-4 text-center">
        <Upload size={18} className="text-muted" />
        <p className="text-xs text-muted">
          Dateien hier ablegen oder klicken (PDF, PNG, JPG, JPEG, PPTX, DOCX)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead>
            <tr className="text-muted">
              <th className="py-1 pr-3 font-medium">Dokumentname</th>
              <th className="py-1 pr-3 font-medium">Herkunft</th>
              <th className="py-1 pr-3 font-medium">Pflichtstatus</th>
              <th className="py-1 pr-3 font-medium">Eingereicht durch</th>
              <th className="py-1 pr-3 font-medium">Reviewstatus</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {docs.map((d) => (
              <tr key={d.name} className="border-t border-border">
                <td className="py-1.5 pr-3">{d.name}</td>
                <td className="py-1.5 pr-3 text-muted">{d.origin}</td>
                <td className="py-1.5 pr-3 text-muted">{d.requirement}</td>
                <td className="py-1.5 pr-3 text-muted">{d.submittedBy}</td>
                <td className={`py-1.5 pr-3 font-medium ${statusClass(d.status)}`}>
                  {d.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// A single-file upload field (dropzone + caption) — Gate 3 §7.
function UploadArea({ hint }: { hint?: string }) {
  return (
    <div className="mb-3 flex flex-col items-center gap-1 rounded-md border border-dashed border-border bg-surface px-3 py-4 text-center">
      <Upload size={18} className="text-muted" />
      <p className="text-xs text-muted">
        Dateien hier ablegen oder klicken (PDF, PNG, JPG, JPEG, PPTX, DOCX)
      </p>
      {hint && <p className="mt-0.5 text-[11px] text-muted/80">{hint}</p>}
    </div>
  );
}

// A control-implementation card — Komponente / Rolle / Umsetzung / Nachweis (§7 Gate 3).
function ControlCard({ control }: { control: ControlImpl }) {
  const cell = (label: string, value: string) => (
    <div>
      <p className="mb-1 text-xs font-medium text-muted">{label}</p>
      <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text">
        {value}
      </div>
    </div>
  );
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      {cell("Plattformdienst / Komponente", control.component)}
      {cell("Verantwortliche Rolle", control.role)}
      {cell("Technische Umsetzung", control.impl)}
      <div>
        <p className="mb-1 text-xs font-medium text-muted">Nachweis</p>
        <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
          <Upload size={14} />
          {control.evidenceHint}
        </div>
      </div>
    </div>
  );
}

// A labelled multi-cell grid — Kriterien-/Kennzahltabellen (§7 Gate 4/5).
function MatrixArea({ cells }: { cells: MatrixCell[] }) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      {cells.map((c) => (
        <div key={c.label}>
          <p className="mb-1 text-xs font-medium text-muted">{c.label}</p>
          {c.upload ? (
            <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-surface px-3 py-2 text-xs text-muted">
              <Upload size={14} />
              Nachweis ablegen
            </div>
          ) : c.value ? (
            <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text">
              {c.value}
            </div>
          ) : (
            <input
              type="text"
              defaultValue=""
              placeholder={c.hint ?? "Eintrag …"}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SourceBadge({
  source,
  currentGate,
  inputRole,
}: {
  source: ReviewFieldData["source"];
  currentGate: number;
  inputRole?: string;
}) {
  if (source === "none") return null;

  if (source === "gate_input") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
        <PenLine size={11} />
        Gate {currentGate} Eingabe{inputRole ? ` · ${inputRole}` : ""}
      </span>
    );
  }

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

  // gate_N — decided at *this* gate → green "Gate N Entscheidung";
  // inherited from an earlier gate → amber "aus Gate N" (read-only).
  const gateNumber = Number(source.split("_")[1]);
  if (gateNumber < currentGate) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
        <ArrowUpCircle size={11} />
        aus Gate {gateNumber}
      </span>
    );
  }
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
  docs,
  kind,
  uploadHint,
  control,
  columns,
  currentGate = 1,
}: {
  field: ReviewFieldData;
  readOnly: boolean;
  onChange: (patch: Partial<ReviewFieldData>) => void;
  docs?: EvidenceDoc[];
  kind?: "field" | "evidence" | "upload" | "control" | "matrix";
  uploadHint?: string;
  control?: ControlImpl;
  columns?: MatrixCell[];
  currentGate?: number;
}) {
  const needsNote = fieldNeedsNote(field);
  const editable = isEditable(field.source, currentGate);

  return (
    <div className="rounded-card border border-border bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-text">
          {field.label}{" "}
          {field.required !== false && <span className="text-danger">*</span>}
        </label>
        <SourceBadge
          source={field.source}
          currentGate={currentGate}
          inputRole={field.inputRole}
        />
      </div>

      {/* Value — evidence table, upload, control card, matrix grid, or a value box */}
      {docs ? (
        <EvidenceArea docs={docs} />
      ) : kind === "upload" ? (
        <UploadArea hint={uploadHint} />
      ) : kind === "control" && control ? (
        <ControlCard control={control} />
      ) : kind === "matrix" && columns ? (
        <MatrixArea cells={columns} />
      ) : (
        <textarea
          value={field.value}
          onChange={(e) => onChange({ value: e.target.value })}
          readOnly={readOnly || !editable}
          rows={field.value.length > 70 ? 2 : 1}
          placeholder={
            editable ? (field.placeholder ?? "Eintrag / Bewertung …") : ""
          }
          className={`mb-3 w-full resize-none rounded-md border border-border px-3 py-2 text-sm text-text outline-none focus:border-primary ${
            editable ? "bg-white" : "bg-surface"
          }`}
        />
      )}

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
