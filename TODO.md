# TODO — AI Governance Gate-Workbench

Prototyp wird abschnittsweise **1:1 aus den Figma-Exporten** (CSS/PDF in `docs/`) nachgebaut.
Quelle je Abschnitt: Section-Titel + Feld-Labels + Badges + Dropdown-Optionen aus den `/* … */`-Kommentaren der PDFs.

## ✅ Erledigt
- **Request Wizard** — vollständig
- **Gate Workbench: Gate 1–5** — alle Review-Felder 1:1 nachgebaut + per Screenshot verifiziert
  - Neue Feld-Konzepte für Gate 4/5: Quelle `gate_input` (Badge „Gate N Eingabe · Rolle"), `kind: "matrix"`, `section.preface`
- **OVB-Branding** — Theme-Tokens in `src/app/globals.css` auf OVB Corporate Design (ovb.de) umgestellt: `--color-primary #003366` (Navy), `--color-accent #ff3399` (Magenta). Links `text-info` → `text-primary` (Navy), Notification-Dot + aktives Nav-Icon = Magenta. Semantische Status-Farben unverändert.

## ✅ AI Register — Detailansicht-Reiter (erledigt)
Datei: `src/app/initiative/[id]/page.tsx` · alle 5 Reiter 1:1 nach PDF + Screenshot-verifiziert.
**Datenquelle-Prinzip:** kein neues Datenmodell — Reiter lesen über den `gv(id)`-Helfer aus `initiative.gateReviews` (Workbench = Single Source of Truth) + `request` + `usage` + `initiative`. Nur echte Lücken ergänzt: `req-123`-Gate-Feldwerte (`REG025_FIELD_VALUES`), `usage.{adoptionTargetPct,estimatedValueMonth,valueLever,ownerAssessment}`, `initiative.{openFindings,auditTrail,auditTotal}` (`AuditEntry`).

| Reiter                  | Referenz-PDF                              | Ergebnis        |
|-------------------------|-------------------------------------------|-----------------|
| Überblick               | AI Register Übersicht.pdf                  | ✅ Panel „Aktuelle Steuerungssignale" umbenannt |
| Governance              | AI Register Governance.pdf                 | ✅ neu gebaut    |
| Modell & Integration    | AI Register Modelle und Integration.pdf    | ✅ neu gebaut    |
| Nutzung & Kosten        | AI Register Nutzung und Kosten.pdf         | ✅ ausgebaut     |
| Risiko & Audit          | AI Register Risiko und Audit.pdf           | ✅ Audit-Trail-Tabelle + Export-Aktionen |

### Frühere Prüfbefunde (Referenz)

### Prüfergebnis je Reiter (Soll = PDF, Ist = `page.tsx`)

**1. Überblick — ✅ fast korrekt.** Panels 1 „Überblick & Verantwortlichkeiten", 2 „Lifecycle & Gate Status", 4 „Nutzung & Kosten (Zusammenfassung)" passen. Panel 3 heißt aktuell „Aktuelle Aufmerksamkeit" → laut PDF **„Aktuelle Steuerungssignale"** (Felder Offene Auflagen / Kritische Findings / Änderungen seit letzter Freigabe passen).

**2. Governance — ❌ falscher Inhalt.** Soll-Panels: (a) **Freigabe- und Entscheidungsstatus** (Aktuelle Freigabe, Offene Auflagen, Nächstes Review, Letzte Gate-Entscheidung); (b) **Verbindliche Governance-Regeln** (Datenklassen 0-2, Human Oversight, DLP / Redaction „Aktiv für C2/C3", Logging Level „Erweitertes Audit Logging"); (c) **Re-Approval Trigger** (Nutzerkreis / Modell / Datenquellen / Zweck → je „Re-Approval erforderlich"). Ist: „Governance & Business Case" (Problem/Ergebnis/…) + „Letzte Gate-Entscheidung" — nicht spezkonform.

**3. Modell & Integration — ❌ Rebuild.** Soll-Panels: (a) **Modellroute** (Primäres Modell „Azure OpenAI EU Deployment", Modellroute „Gateway → Policy Check → Azure OpenAI EU", Fallback-Modell „Nicht freigegeben", Tokenlimit „10M / Monat"); (b) **Datenquellen & Systeme** (Search/Retrieval „Azure AI Search", Identity Provider „Entra ID", Dokumentenquelle „DMS / freigegebene Wissensbasis"); (c) **Technische Kontrollen** (Gateway Enforcement „Aktiv", DLP Prüfung „Aktiv", Secrets Management „Key Vault", Monitoring „Application Insights / SIEM"). Ist: 3 Felder + Integrations-Chips.

**4. Nutzung & Kosten — ⚠️ ausbauen.** Soll-Panels: (a) **Nutzungsübersicht** (Aktive Nutzer 32/40, Aufrufe, Ø Aufrufe je Nutzer, Adoption 80 %/Ziel 70 %, Status-Text); (b) **Kosten & Budget** (Kosten 1240€/2000€, Budgetauslastung, Token 8.4M/10M, Kosten je 1000 Aufrufe 52€); (c) **Nutzenindikatoren** (Geschätzter Wertbeitrag €4.800 p.M., Primärer Nutzenhebel, Business-Owner-Bewertung); (d) **Kosten-/Nutzungsbewertung** (Adoption „Über Zielwert", Kosten „Innerhalb Limit", Skalierung „nur nach Re-Approval"). Ist: nur (a)+(b) grob via MetricTiles — Panels (c)+(d) fehlen.

**5. Risiko & Audit — ❌ Audit-Trail fehlt.** Soll-Panels: (a) **Risikoprofil** (Risikoklasse, Datenklasse 0-2, Kritische Findings, Offene Findings); (b) **Audit Trail** = Tabelle (Datum / Lifecycle-Status / Bearbeiter / Aktion) mit Zeilen Gate 4 Pilotfreigabe, Gate 3 Review, Gate 2 Review, AI Request erstellt + „Zeige 6 von 25 Audits". Ist: Risikoprofil-ähnlich (mit Extra-Feldern), **Audit-Trail-Tabelle fehlt**. Zudem laut PDF Reiter-spezifische Footer-Aktionen (Nachweise anzeigen / Audit-Report-Export / Gate-Entscheidung-Export).

Vorgehen je Reiter: anpassen → per Screenshot (`scratchpad/dumpgate.mjs`-Muster) verifizieren.

## 🐞 Bekannte offene Punkte
- ✅ Gate-Footer: Zähler benennt jetzt eindeutig „X von N Feldern zu bearbeiten" (statt irreführend „Kriterien zu prüfen") — der Zähler zählt technisch die Review-Felder, nicht die 9 Prüfkriterien; die Checkliste bleibt „Gate N Prüfkriterien".
