"use client";

import * as React from "react";
import { Droplets, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { useDailyLog, useSettings } from "@/lib/storage";
import { clamp } from "@/lib/utils";

const QUICK_ADDS = [250, 500];

/**
 * Water tracker: +250 ml quick buttons, a custom amount, progress bar and reset.
 * Stored per profile + date via useDailyLog(), so it resets with the day.
 */
export function WaterCard() {
  const { value: daily, setValue: setDaily } = useDailyLog();
  const { value: settings } = useSettings();

  const [entry, setEntry] = React.useState("");

  const targetMl = settings.targets.waterMl || 2500;
  const ml = daily.waterMl;
  const progress = clamp(ml / targetMl, 0, 1);
  const pct = Math.round(progress * 100);

  const addMl = (n: number) => setDaily((d) => ({ ...d, waterMl: Math.max(0, d.waterMl + n) }));

  const parsed = Math.round(Math.abs(parseInt(entry, 10)));
  const hasEntry = Number.isFinite(parsed) && parsed > 0;
  const commitAdd = () => {
    if (!hasEntry) return;
    addMl(parsed);
    setEntry("");
  };
  const reset = () => setDaily((d) => ({ ...d, waterMl: 0 }));

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Droplets className="h-[20px] w-[20px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold tracking-tight">Water</p>
          <p className="text-[12px] text-muted-foreground">Stay hydrated through the day</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-[12px] font-semibold text-muted-foreground tap-scale"
          aria-label="Reset today's water"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <p className="text-[30px] font-extrabold leading-none tracking-tight">
          {(ml / 1000).toFixed(2)}
          <span className="ml-1 text-[14px] font-semibold text-muted-foreground">
            / {(targetMl / 1000).toFixed(1)} L
          </span>
        </p>
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[12px] font-bold text-primary tabular-nums">
          {pct}%
        </span>
      </div>

      <ProgressBar value={progress * 100} max={100} className="mt-2.5 h-2.5" barClassName="bg-primary" />

      <div className="mt-3.5 flex items-center gap-2">
        {QUICK_ADDS.map((n) => (
          <button
            key={n}
            onClick={() => addMl(n)}
            className="flex-1 rounded-2xl bg-primary-soft py-2.5 text-[14px] font-bold text-primary tap-scale"
          >
            +{n} ml
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Custom ml"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitAdd()}
          className="h-11 flex-1"
        />
        <button
          onClick={commitAdd}
          disabled={!hasEntry}
          className="h-11 rounded-2xl bg-primary px-5 text-[14px] font-bold text-white tap-scale disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </Card>
  );
}
