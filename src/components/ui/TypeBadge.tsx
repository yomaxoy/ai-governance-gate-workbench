import type { NotificationType } from "@/lib/types";

const STYLES: Record<NotificationType, string> = {
  Alerts: "bg-[color:var(--color-badge-alerts-bg)] text-[#8a1f1f]",
  Policy: "bg-[color:var(--color-badge-policy-bg)] text-[#7a5c0a]",
  Incident: "bg-[color:var(--color-badge-incident-bg)] text-[#1f4f7a]",
  "Re-Approval": "bg-[color:var(--color-badge-reapproval-bg)] text-[#1f6b4a]",
  "New Request": "bg-[color:var(--color-badge-newrequest-bg)] text-[#3f4a44]",
};

export function TypeBadge({ type }: { type: NotificationType }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[type]}`}
    >
      {type}
    </span>
  );
}
