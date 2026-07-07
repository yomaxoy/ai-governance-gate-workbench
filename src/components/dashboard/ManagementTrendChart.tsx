"use client";

const portfolioBubbles = [
  {
    label: "KI Wissens-Assistent",
    x: 68,
    y: 28,
    className: "bg-emerald-400",
  },
  {
    label: "Fraud Detector",
    x: 54,
    y: 58,
    className: "bg-rose-600",
  },
  {
    label: "HR Talent Scout",
    x: 42,
    y: 56,
    className: "bg-amber-500",
  },
  {
    label: "Marketing Content Gen",
    x: 80,
    y: 72,
    className: "bg-primary",
  },
];

const gateDistribution = [
  { label: "G1", value: 4, className: "bg-primary" },
  { label: "G2", value: 5, className: "bg-blue-500" },
  { label: "G3", value: 6, className: "bg-sky-400" },
  { label: "G4", value: 7, className: "bg-teal-400" },
  { label: "G5", value: 3, className: "bg-emerald-400" },
];

const lifecycleStats = [
  {
    label: "In Prüfung",
    value: 8,
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    label: "Pilot",
    value: 7,
    className: "border-teal-200 bg-teal-50 text-teal-800",
  },
  {
    label: "Produktiv",
    value: 6,
    className: "border-gray-200 bg-white text-text",
  },
  {
    label: "Review fällig",
    value: 3,
    className: "border-gray-200 bg-white text-text",
  },
  {
    label: "Blockiert",
    value: 1,
    className: "border-red-200 bg-red-50 text-red-700",
  },
];

const steeringSignals = [
  {
    label: "Kritische Findings offen",
    value: 4,
    icon: "!",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  {
    label: "Re-Approvals fällig",
    value: 3,
    icon: "↻",
    className: "border-gray-200 bg-gray-50 text-text",
  },
  {
    label: "Kostenwarnungen",
    value: 2,
    icon: "↗",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  {
    label: "Blockierender Gate-Fund",
    value: 1,
    icon: "i",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
];

export function ManagementTrendChart() {
  return (
    <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.78fr_0.9fr]">
      {/* Risk / Value Matrix */}
      <div className="rounded-card border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text">
              Risk / Value Portfolio Matrix
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Priorisierung nach Wertbeitrag, Adoption und Kontrollbedarf
            </p>
          </div>

          <div className="inline-flex shrink-0 rounded-lg bg-surface p-0.5 text-xs">
            <span className="rounded-md px-2 py-1 text-muted">Täglich</span>
            <span className="rounded-md px-2 py-1 text-muted">Wöchentlich</span>
            <span className="rounded-md bg-primary px-2 py-1 font-medium text-primary-foreground">
              Monatlich
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-4">
          <div className="relative h-[245px]">
            {/* Plot area */}
            <div className="absolute bottom-8 left-4 right-4 top-3">
              {/* quadrant lines */}
              <div className="absolute left-1/2 top-0 h-full border-l border-border" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-border" />

              {/* quadrant labels */}
              <span className="absolute left-8 top-3 text-xs font-medium text-muted">
                Eng steuern
              </span>
              <span className="absolute right-16 top-3 text-xs font-medium text-muted">
                Skalieren
              </span>
              <span className="absolute bottom-3 left-8 text-xs font-medium text-muted">
                Pausieren
              </span>
              <span className="absolute bottom-3 right-16 text-xs font-medium text-muted">
                Beobachten
              </span>

              {portfolioBubbles.map((item) => (
                <div
                  key={item.label}
                  className={`absolute h-4 w-4 rounded-full shadow-sm ring-4 ring-white ${item.className}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  title={item.label}
                />
              ))}
            </div>

            {/* y-axis label */}
            <div className="absolute bottom-12 -left-17 top-5 flex flex-col items-center justify-center gap-1">
              <span className="-rotate-90 whitespace-nowrap text-xs font-semibold text-text">
                Risiko / Kontrollbedarf →
              </span>
            </div>

            {/* x-axis label */}
            <div className="absolute bottom-3 left-4 right-4 text-center text-xs font-semibold text-text">
              Wertbeitrag / Adoption →
            </div>
          </div>

          {/* legend below chart, no overlap */}
          <div className="mt-3 flex flex-wrap gap-2">
            {portfolioBubbles.map((item) => (
              <span
                key={item.label}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold text-white ${item.className}`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio by Gate / Lifecycle */}
      <div className="rounded-card border border-border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text">
            Portfolio nach Gate & Lifecycle
          </h2>
          <p className="mt-1 text-xs text-muted">
            Status der registrierten KI-Initiativen
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-text">Gates 1–5 Verteilung</span>
          <span className="font-bold text-text">25 Gesamt</span>
        </div>

        <div className="flex h-3 overflow-hidden rounded-full bg-surface">
          {gateDistribution.map((gate) => (
            <div
              key={gate.label}
              className={gate.className}
              style={{ width: `${(gate.value / 25) * 100}%` }}
              title={`${gate.label}: ${gate.value}`}
            />
          ))}
        </div>

        <div className="mt-2 grid grid-cols-5 gap-1 text-[10px] text-muted">
          {gateDistribution.map((gate) => (
            <span key={gate.label}>
              {gate.label}: {gate.value}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {lifecycleStats.map((item) => (
            <div
              key={item.label}
              className={`rounded-lg border px-3 py-2 text-sm ${item.className}`}
            >
              <span className="font-medium">{item.label}</span>
              <span className="float-right font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steering Signals */}
      <div className="rounded-card border border-border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-text">
            Aktuelle Steuerungssignale
          </h2>
          <p className="mt-1 text-xs text-muted">
            Handlungsbedarf aus Gates, Betrieb und Monitoring
          </p>
        </div>

        <div className="space-y-3">
          {steeringSignals.map((signal) => (
            <div
              key={signal.label}
              className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${signal.className}`}
                >
                  {signal.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">
                    {signal.value} {signal.label}
                  </p>
                  <p className="text-xs text-muted">
                    Aus AI Register, Gate Workbench und Betrieb
                  </p>
                </div>
              </div>

              <button className="text-xs font-semibold text-primary hover:underline">
                Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}