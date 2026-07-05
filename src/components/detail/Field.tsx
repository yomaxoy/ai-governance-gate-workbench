import type { ReactNode } from "react";

/**
 * Label above a read-only, input-styled value box.
 * Uses flex-1 on the box so fields in the same grid row share height.
 */
export function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: ReactNode;
  className?: string;
}) {
  const empty = value === undefined || value === null || value === "";

  return (
    <div className={`flex flex-col ${className}`}>
      <p className="mb-1 text-xs font-semibold text-text">{label}</p>
      <div className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text">
        {empty ? <span className="text-muted">—</span> : value}
      </div>
    </div>
  );
}
