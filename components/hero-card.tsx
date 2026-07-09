"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Activity } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import type { WorkoutDay } from "@/lib/data";
import { cn } from "@/lib/utils";

type HeroCardProps = {
  day: WorkoutDay;
  progress: number; // 0..1
  completed: boolean;
  resumed: boolean;
  heroImage: string;
  tint: "me" | "partner";
};

/** Premium "today's workout" hero: progress ring, meta, focus tags, CTA + figure. */
export function HeroCard({ day, progress, completed, resumed, heroImage, tint }: HeroCardProps) {
  const pct = completed ? 100 : Math.round(progress * 100);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border shadow-card",
        tint === "partner"
          ? "bg-gradient-to-br from-purple-soft via-primary-soft/50 to-card"
          : "bg-gradient-to-br from-primary-soft via-primary-soft/55 to-card"
      )}
    >
      {/* Full-bleed figure photo. High-key in light mode, a soft luminous
          figure in dark mode (see .hero-photo / .hero-scrim in globals.css). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImage}
        alt=""
        aria-hidden
        className="hero-photo pointer-events-none absolute inset-0 h-full w-full select-none"
      />
      {/* Theme-aware scrim keeps the ring, title and tags legible over the photo. */}
      <div className="hero-scrim pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-[116px] w-[116px] shrink-0 items-center justify-center rounded-full bg-card shadow-card">
            <ProgressRing
              progress={completed ? 1 : progress}
              size={116}
              strokeWidth={11}
              trackClassName="stroke-muted"
              progressClassName={completed ? "stroke-success" : "stroke-primary"}
            >
              <span className="text-[26px] font-bold leading-none tracking-tight tabular-nums">
                {pct}
                <span className="text-sm font-semibold">%</span>
              </span>
              <span className="mt-1 text-xs font-medium text-muted-foreground">Complete</span>
            </ProgressRing>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Today&apos;s workout
            </p>
            <h2 className="mt-1 text-[30px] font-extrabold leading-[1.05] tracking-tight">
              {day.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> ~{day.duration} min
              </span>
              <span className="text-subtle">·</span>
              <span className="flex items-center gap-1">
                <Activity className="h-4 w-4" /> {day.exercises.length} exercises
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Focus
          </span>
          {day.focus.map((f) => (
            <span
              key={f}
              className="rounded-full border border-border bg-card/80 px-3 py-1 text-[13px] font-semibold text-primary backdrop-blur-sm"
            >
              {f}
            </span>
          ))}
        </div>

        <Button
          asChild
          size="lg"
          className="mt-4 h-[54px] w-full text-base"
          variant={completed ? "success" : "primary"}
        >
          <Link href={`/workout/${day.id}`}>
            {completed ? (
              <>
                <CheckCircle2 className="h-5 w-5" /> Workout complete
              </>
            ) : resumed ? (
              <>
                Continue Workout <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Start Workout <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
