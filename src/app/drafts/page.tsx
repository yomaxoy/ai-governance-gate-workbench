"use client";

import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DraftsPage() {
  const { drafts, getInitiative, openWizard } = useApp();
  const [query, setQuery] = useState("");

  const filtered = drafts.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase()),
  );

  const openDraft = (draftId: string) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (!draft) return;
    if (draft.type === "Re-Approval" && draft.initiativeId) {
      const init = getInitiative(draft.initiativeId);
      openWizard({
        mode: "reapproval",
        initialData: init?.request,
        draftId,
      });
    } else {
      openWizard({ mode: "new", draftId });
    }
  };

  return (
    <>
      <PageHeader icon={FileText} title="My Drafts" />

      <section className="rounded-card border border-border bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text">Meine Entwürfe</h2>
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5">
            <Search size={15} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent text-sm outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => openDraft(d.id)}
              className="flex w-full items-center gap-4 rounded-card border border-border p-4 text-left hover:bg-surface"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface text-primary">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text">{d.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <ProgressBar value={d.completeness} color="bg-primary" />
                  <span className="shrink-0 text-xs text-muted">
                    {d.completeness}%
                  </span>
                </div>
              </div>
              <TypeBadge type={d.type} />
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">
              Keine Entwürfe.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
