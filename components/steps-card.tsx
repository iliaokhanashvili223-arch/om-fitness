"use client";

import * as React from "react";
import { Footprints, Hand, MapPin, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Input } from "@/components/ui/input";
import { useDailyLog, useSettings } from "@/lib/storage";
import { clamp, cn, formatDistanceKm, formatNumber, stepsToKm } from "@/lib/utils";

const QUICK_ADDS = [500, 1000, 2500];

/**
 * Manual steps tracker for Today. There is NO automatic step counting — steps
 * are added by hand (+500 / +1000 / +2500 or a custom amount), can be set to an
 * exact value, and reset. Stored per profile + date via useDailyLog(), so the
 * count shown always resets with the calendar day.
 */
export function StepsCard() {
  const { value: daily, setValue: setDaily } = useDailyLog();
  const { value: settings } = useSettings();

  const [entry, setEntry] = React.useState("");

  const goal = settings.targets.steps || 10000;
  const steps = daily.steps;
  const progress = clamp(steps / goal, 0, 1);
  const pct = Math.round(progress * 100);
  const distanceKm = stepsToKm(steps, settings.heightCm);

  const addSteps = (n: number) =>
    setDaily((d) => ({ ...d, steps: Math.max(0, d.steps + n) }));

  const parsed = Math.round(Math.abs(parseInt(entry, 10)));
  const hasEntry = Number.isFinite(parsed) && parsed > 0;

  const commitAdd = () => {
    if (!hasEntry) return;
    addSteps(parsed);
    setEntry("");
  };
  const commitSet = () => {
    if (!hasEntry) return;
    setDaily((d) => ({ ...d, steps: parsed }));
    setEntry("");
  };
  const reset = () => setDaily((d) => ({ ...d, steps: 0 }));

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-soft text-purple">
          <Footprints className="h-[20px] w-[20px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[15px] font-bold tracking-tight">Steps</p>
            <span className="flex items-center gap-1 rounded-full bg-purple-soft px-2 py-0.5 text-[10px] font-semibold text-purple">
              <Hand className="h-3 w-3" /> Manual tracking
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">Add your steps by hand</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-[12px] font-semibold text-muted-foreground tap-scale"
          aria-label="Reset today's steps"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* Value + goal */}
      <div className="mt-3 flex items-end justify-between">
        <p className="text-[30px] font-extrabold leading-none tracking-tight">
          {formatNumber(steps)}
          <span className="ml-1 text-[14px] font-semibold text-muted-foreground">
            / {formatNumber(goal)}
          </span>
        </p>
        <span className="rounded-full bg-purple-soft px-2.5 py-1 text-[12px] font-bold text-purple tabular-nums">
          {pct}%
        </span>
      </div>

      <ProgressBar value={progress * 100} max={100} className="mt-2.5 h-2.5" barClassName="bg-purple" />

      {/* Distance estimate */}
      <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-purple" />≈ {formatDistanceKm(distanceKm)} walked
        <span className="text-subtle">· estimated from height</span>
      </p>

      {/* Quick add */}
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        {QUICK_ADDS.map((n) => (
          <button
            key={n}
            onClick={() => addSteps(n)}
            className="rounded-2xl bg-purple-soft py-2.5 text-[14px] font-bold text-purple tap-scale"
          >
            +{formatNumber(n)}
          </button>
        ))}
      </div>

      {/* Custom amount / edit */}
      <div className="mt-2.5 flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="Enter steps"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commitAdd()}
          className="h-11 flex-1"
        />
        <button
          onClick={commitAdd}
          disabled={!hasEntry}
          className={cn(
            "h-11 rounded-2xl px-4 text-[14px] font-bold tap-scale disabled:opacity-40",
            "bg-purple text-white"
          )}
        >
          Add
        </button>
        <button
          onClick={commitSet}
          disabled={!hasEntry}
          className="h-11 rounded-2xl border border-border bg-card px-4 text-[14px] font-bold text-foreground tap-scale disabled:opacity-40"
          title="Set today's steps to this exact number"
        >
          Set
        </button>
      </div>
    </Card>
  );
}
