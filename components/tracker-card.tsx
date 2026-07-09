"use client";

import { Minus, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

type TrackerCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  target?: string;
  progress?: number; // 0–1
  accent?: "primary" | "success";
  onIncrement?: () => void;
  onDecrement?: () => void;
  stepLabel?: string;
};

/** Reusable tracker with an inline +/- stepper and progress bar. */
export function TrackerCard({
  icon: Icon,
  title,
  value,
  target,
  progress,
  accent = "primary",
  onIncrement,
  onDecrement,
  stepLabel,
}: TrackerCardProps) {
  const showStepper = onIncrement || onDecrement;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              accent === "success" ? "bg-success-soft text-success" : "bg-primary-soft text-primary"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            {target && <p className="text-xs text-muted-foreground">{target}</p>}
          </div>
        </div>

        {showStepper && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onDecrement}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground tap-scale disabled:opacity-40"
              aria-label={`Decrease ${title}`}
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={onIncrement}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground tap-scale"
              aria-label={`Increase ${title}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {stepLabel && <p className="text-xs font-medium text-muted-foreground">{stepLabel}</p>}
      </div>

      {typeof progress === "number" && (
        <ProgressBar
          value={progress * 100}
          max={100}
          className="mt-3"
          barClassName={accent === "success" ? "bg-success" : "bg-primary"}
        />
      )}
    </Card>
  );
}
