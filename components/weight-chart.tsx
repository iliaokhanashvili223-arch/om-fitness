"use client";

import { motion } from "framer-motion";
import type { WeightEntry } from "@/lib/storage";

/** Premium responsive line chart for recent weight entries, with axis labels. */
export function WeightChart({ entries }: { entries: WeightEntry[] }) {
  const data = entries.slice(-7);
  const W = 340;
  const H = 190;
  const padL = 34;
  const padR = 12;
  const padT = 14;
  const padB = 28;

  if (data.length < 2) {
    return (
      <div className="flex h-[190px] items-center justify-center text-sm text-muted-foreground">
        Log at least two weigh-ins to see your trend.
      </div>
    );
  }

  const values = data.map((d) => d.kg);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const pad = Math.max(0.4, (dataMax - dataMin) * 0.35);
  const lo = dataMin - pad;
  const hi = dataMax + pad;
  const range = hi - lo || 1;

  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const x = (i: number) => padL + (i / (data.length - 1)) * plotW;
  const y = (kg: number) => padT + (1 - (kg - lo) / range) * plotH;

  const points = data.map((d, i) => ({ x: x(i), y: y(d.kg) }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${padT + plotH} L${points[0].x},${padT + plotH} Z`;

  const ticks = [0, 1, 2, 3].map((i) => {
    const v = hi - (i / 3) * (hi - lo);
    return { v: Math.round(v * 10) / 10, y: y(v) };
  });

  const fmtDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[190px] w-full">
      <defs>
        <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.16" />
          <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines + y labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={W - padR}
            y1={t.y}
            y2={t.y}
            stroke="rgb(var(--border))"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text
            x={padL - 8}
            y={t.y + 3}
            textAnchor="end"
            className="fill-muted-foreground"
            style={{ fontSize: 10, fontWeight: 500 }}
          >
            {t.v}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#weightFill)" />
      <motion.path
        d={line}
        fill="none"
        stroke="rgb(var(--primary))"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {points.map((p, i) => {
        const last = i === points.length - 1;
        return (
          <g key={i}>
            {last && <circle cx={p.x} cy={p.y} r={7} fill="rgb(var(--primary) / 0.15)" />}
            <circle cx={p.x} cy={p.y} r={last ? 4 : 3} fill="rgb(var(--primary))" />
            {last && <circle cx={p.x} cy={p.y} r={4} fill="none" stroke="rgb(var(--card))" strokeWidth={1.5} />}
          </g>
        );
      })}

      {/* x labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: 10, fontWeight: 500 }}
        >
          {fmtDate(data[i].date)}
        </text>
      ))}
    </svg>
  );
}
