"use client";

import { Bot, Plus, Share2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Initiative } from "@/lib/types";

export function CreateInitiativeCard() {
  const { openWizard } = useApp();
  return (
    <button
      onClick={() => openWizard()}
      className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-border bg-white text-primary transition-colors hover:border-primary hover:bg-surface"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Plus size={20} />
      </span>
      <span className="text-sm font-semibold">Create AI Request</span>
    </button>
  );
}

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const { openWorkbench } = useApp();
  return (
    <div className="flex min-h-44 flex-col rounded-card border border-border bg-white p-4">
      <div className="mb-3 flex items-start">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface text-primary">
          <Bot size={20} />
        </div>
      </div>
      <h3 className="font-semibold text-text">{initiative.title}</h3>
      <p className="mt-1 text-xs text-muted">AI Owner: {initiative.aiOwner}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <button
          onClick={() => openWorkbench(initiative.id, initiative.currentGate)}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-dark"
        >
          Manage
        </button>
        <button
          aria-label="Teilen"
          className="text-muted hover:text-text"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}
