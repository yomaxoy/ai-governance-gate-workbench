import type { ReactNode } from "react";

/** Small pill used in the header meta row and for integration tags. */
export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-text ${className}`}
    >
      {children}
    </span>
  );
}
