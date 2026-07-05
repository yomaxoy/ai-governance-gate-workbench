import type { InitiativeStatus } from "@/lib/types";
import { STATUS_BADGE_CLASS, STATUS_LABEL } from "@/lib/workflow";

export function StatusBadge({ status }: { status: InitiativeStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
