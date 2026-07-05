"use client";

import { useState } from "react";
import {
  MANAGEMENT_TREND,
  TREND_RANGE_LABELS,
  type TrendRange,
} from "@/lib/management-trend";

const RANGES: TrendRange[] = ["daily", "weekly", "monthly"];

// viewBox-Koordinaten (skalieren via width:100% + preserveAspectRatio).
const VB_W = 640;
const VB_H = 280;
const PAD_L = 46;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 30;
const PLOT_L = PAD_L;
const PLOT_R = VB_W - PAD_R;
const PLOT_T = PAD_T;
const PLOT_B = VB_H - PAD_B;
const PLOT_W = PLOT_R - PLOT_L;
const PLOT_H = PLOT_B - PLOT_T;
const TICK_COUNT = 4; // → 5 horizontale Gitterlinien inkl. 0 und Maximum

const nf = new Intl.NumberFormat("de-DE");

/** Rundet den Maximalwert auf einen „schönen" Achsenwert auf. */
function niceMax(v: number): number {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((s) => n <= s) ?? 10;
  return step * pow;
}

export function ManagementTrendChart() {
  const [range, setRange] = useState<TrendRange>("monthly");
  const [hovered, setHovered] = useState<number | null>(null);

  const data = MANAGEMENT_TREND[range];
  const max = niceMax(Math.max(...data.map((d) => d.value)));

  const x = (i: number) =>
    data.length <= 1 ? PLOT_L : PLOT_L + (i / (data.length - 1)) * PLOT_W;
  const y = (v: number) => PLOT_B - (v / max) * PLOT_H;

  const points = data.map((d, i) => ({ ...d, cx: x(i), cy: y(d.value) }));
  const linePoints = points.map((p) => `${p.cx},${p.cy}`).join(" ");
  const areaPoints = `${PLOT_L},${PLOT_B} ${linePoints} ${PLOT_R},${PLOT_B}`;

  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, t) => {
    const value = (t / TICK_COUNT) * max;
    return { value, cy: y(value) };
  });

  const active = hovered != null ? points[hovered] : null;

  return (
    <section className="mt-6 rounded-card border border-border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">
            AI-Aktivität im Zeitverlauf
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            Verarbeitete AI-Requests · {TREND_RANGE_LABELS[range]}
          </p>
        </div>

        <div
          className="inline-flex rounded-lg bg-surface p-0.5"
          role="tablist"
          aria-label="Zeitraum"
        >
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={range === r}
              onClick={() => {
                setRange(r);
                setHovered(null);
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                range === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted hover:text-text"
              }`}
            >
              {TREND_RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          role="img"
          aria-label={`Liniendiagramm der AI-Aktivität (${TREND_RANGE_LABELS[range]})`}
          className="block h-auto w-full"
          onMouseLeave={() => setHovered(null)}
        >
          {/* horizontale Gitterlinien + Y-Achsen-Beschriftung */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PLOT_L}
                y1={t.cy}
                x2={PLOT_R}
                y2={t.cy}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={PLOT_L - 8}
                y={t.cy + 3}
                textAnchor="end"
                fontSize={11}
                fill="var(--color-muted)"
              >
                {nf.format(Math.round(t.value))}
              </text>
            </g>
          ))}

          {/* Fläche unter der Linie */}
          <polygon
            points={areaPoints}
            fill="var(--color-primary)"
            opacity={0.08}
          />

          {/* Linie in Primärfarbe */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X-Achsen-Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.cx}
              y={VB_H - 10}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-muted)"
            >
              {p.label}
            </text>
          ))}

          {/* Datenpunkte + Hover-Ziele */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={hovered === i ? 5 : 3.5}
                fill={hovered === i ? "var(--color-primary)" : "#ffffff"}
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
              {/* großzügiges, transparentes Hover-Ziel */}
              <rect
                x={p.cx - PLOT_W / (data.length * 2)}
                y={PLOT_T}
                width={PLOT_W / data.length}
                height={PLOT_H}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
              >
                <title>{`${p.label}: ${nf.format(p.value)} Requests`}</title>
              </rect>
            </g>
          ))}

          {/* State-basierter Tooltip */}
          {active && (
            <g pointerEvents="none">
              <line
                x1={active.cx}
                y1={PLOT_T}
                x2={active.cx}
                y2={PLOT_B}
                stroke="var(--color-primary)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.5}
              />
              {(() => {
                const label = `${active.label}: ${nf.format(active.value)}`;
                const w = label.length * 6.5 + 18;
                const tx = Math.min(
                  Math.max(active.cx, PLOT_L + w / 2),
                  PLOT_R - w / 2,
                );
                const ty = Math.max(active.cy - 34, PLOT_T + 2);
                return (
                  <>
                    <rect
                      x={tx - w / 2}
                      y={ty}
                      width={w}
                      height={24}
                      rx={6}
                      fill="var(--color-text)"
                    />
                    <text
                      x={tx}
                      y={ty + 16}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="#ffffff"
                    >
                      {label}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
