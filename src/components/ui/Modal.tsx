"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClass = "max-w-3xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-8">
      <div
        className={`relative flex max-h-[90vh] w-full ${widthClass} flex-col rounded-card bg-white shadow-xl overflow-hidden rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-text">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin bg-surface p-5">
          {children}
        </div>

        {footer && (
          <div className="border-t border-border bg-white p-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
