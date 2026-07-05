"use client";

import { useState, type ReactNode } from "react";
import { Topbar } from "./Topbar";
import { OverlayMenu } from "./OverlayMenu";
import { Footer } from "./Footer";
import { AiRequestWizard } from "@/components/request/AiRequestWizard";
import { GateWorkbench } from "@/components/gate/GateWorkbench";

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Topbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} />
      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex flex-1 flex-col pt-14">
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8">
          {children}
        </div>
        <Footer />
      </main>

      {/* Global modals */}
      <AiRequestWizard />
      <GateWorkbench />
    </div>
  );
}
