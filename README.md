# AI Governance Gate-Workbench

Internes AI-Governance-Portal ("AI-First Referenzarchitektur") für die Erfassung,
Prüfung und Freigabe von KI-Initiativen über einen mehrstufigen Gate-Prozess
(5 Gates: Intake → Risk → Security → Pilot/Go-Live → Operate).

Prototyp-Frontend, gebaut nach der Build-Spezifikation. Keine echte Auth/Backend —
Microsoft-Login und Daten sind Mock/Client-State.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`-Tokens in `src/app/globals.css`)
- **lucide-react** Icons
- State: React Context (`src/context/AppContext.tsx`) + Mock-Daten

> Hinweis: Die Spezifikation nannte Next.js 15 als Vorschlag. `create-next-app@latest`
> liefert aktuell Next.js 16 (+ React 19, Tailwind v4) — vollständig kompatibel mit
> allen Anforderungen der Spec. Tailwind v4 nutzt CSS-first-Konfiguration statt
> `tailwind.config.js`; die Design-Tokens stehen in `globals.css`.

## Starten

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktionsbuild
npm run lint
```

## Projektstruktur

```
src/
  app/                     Routen (App Router)
    page.tsx               Landing (ausgeloggt) → redirect /dashboard
    dashboard/             Rollenabhängiges Dashboard
    register/              AI Register (?view=table|kachel)
    drafts/                My Drafts
    notifications/         Risks & Notifications
    initiative/[id]/       Initiative-Detail (öffnet Gate Workbench)
  components/
    shell/                 Topbar, OverlayMenu, UserCard, Footer, AppShell
    ui/                    KpiTile, TypeBadge, RiskBadge, StatusBadge,
                           ProgressBar, Modal, Field, PageHeader
    request/               RequestRow, AiRequestWizard (4-Schritt-Modal)
    register/              InitiativeTable, InitiativeCard
    gate/                  GateTimeline, CriteriaChecklist, ReviewField,
                           InheritedConstraints, GateWorkbench (Gates 1–5)
    notifications/         NotificationPopover
  context/AppContext.tsx   Login, User/Rollen, Initiativen, Modal-State
  lib/
    types.ts               Datenmodell (§8) + canDecide
    workflow.ts            Workflow-Logik (§13): Gate-Ergebnis, Statusmodell,
                           Vollständigkeit, Entscheidungs-Helper
    gate-config.ts         Kriterien, Review-Felder, Vorgaben je Gate (§7)
    mock-data.ts           Initiativen, Notifications, Drafts, User
    dashboard-kpis.ts      KPI-Sätze je Dashboard-Sicht (§5.2, §5.4)
    wizard-options.ts      Dropdown-/Multi-Select-Optionen (§5.6)
```

## Wichtige Verhaltensweisen (Spec §13)

- **Gate-Entscheidung** (`evaluateGate`): ≥1 Blocker → nur „Ablehnen"; sonst
  ≥1 Klärung → „Änderungen anfordern"; alle bestätigt → „Freigeben" (Gate 5:
  „Betrieb bestätigen"). Primärbutton ist deaktiviert, bis jedes Review-Feld
  entschieden ist; Begründung ist Pflicht bei Klärung/Blocker.
- **Statusmodell** (`applyGateDecision`): draft → submitted → in_review (atGate)
  → … → live; changes_requested / rejected / paused / retired wie spezifiziert.
- **Rollen**: jede Person kann mehrere Gate-Rollen haben. `canDecide(user, gate)`
  steuert, ob die Workbench editierbar oder read-only (Hinweisbanner) ist.
  Lesen darf jeder alles.
- **Risikoklasse** wird manuell in Gate 2 gesetzt; davor Status „in Prüfung".
- **Vollständigkeit** (`computeCompleteness`): Anteil gefüllter Pflichtfelder über
  alle 4 Wizard-Schritte. Einreichen erst ab 100 % (`SUBMIT_THRESHOLD`).
- **Datenvererbung**: Review-Felder tragen eine Quelle („aus AI Request" / „aus
  Gate N"); Gate N>1 zeigt „Verbindliche Vorgaben aus Gate N-1".

## Demo-Bedienung

- **Hamburger** (oben links) öffnet das Overlay-Menü; unten die User-Card.
- **User-Card aufklappen** → zwei Demo-Schalter:
  - **Dashboard-Sicht** (AI Owner / Management / AI Governance) — ändert nur die
    KPI-Kacheln.
  - **Gate-Rollen** (Mehrfachauswahl) — steuert, in welchen Gates entschieden
    werden darf (sonst Workbench read-only).
- **Glocke** → Notification-Popover. **+ AI Request** → Wizard.
- Dashboard-Zeilen / Register „Details / Manage" → Gate Workbench.

## Annahmen / Abweichungen

- Next.js 16 / Tailwind v4 statt 15 / v3 (s. o.).
- Tabellen-Spalten des AI Registers ausdefiniert (Spec §6.2).
- „TODO"-Vorgaben in Gate 3–5 plausibel befüllt (`gate-config.ts`).
- Re-Approval = vorbefüllter Wizard im Modus „reapproval" (Spec §13.8).
- Einreich-Schwelle 100 % (zentral konfigurierbar in `workflow.ts`).
- State ist Client-seitig (kein Persistieren über Reload) — Prototyp-Scope.
- Wizard/Workbench werden pro Öffnung neu gemountet (Remount-Key), damit der
  Formular-State frisch initialisiert — kein State-Reset im Effect.

---

AI-First Referenzarchitektur · TU Darmstadt × OVB Holding AG · 2026
