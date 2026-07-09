"use client";

import { Check, ChevronRight, Clock, Gauge, Play } from "lucide-react";
import { schemeLabel, type Exercise } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ExerciseCardProps = {
  exercise: Exercise;
  index: number;
  /** Per-set completion (strength track). */
  completed: boolean[];
  /** Whole-exercise completion (flow track). */
  done: boolean;
  onToggleSet: (setIndex: number) => void;
  onToggleDone: () => void;
  onOpenVideo: () => void;
};

type Tone = "primary" | "purple" | "success";

const TAG: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  purple: "bg-purple-soft text-purple",
  success: "bg-success-soft text-success",
};

const PURPLE = ["triceps", "glute", "mobility", "posture", "power", "control", "spine", "athletic", "oblique"];
const GREEN = ["leg", "quad", "hip", "calf", "balance", "hamstring", "full body", "cardio", "conditioning", "fat loss"];

function tagTone(tag: string): Tone {
  const t = tag.toLowerCase();
  if (PURPLE.some((k) => t.includes(k))) return "purple";
  if (GREEN.some((k) => t.includes(k))) return "success";
  return "primary";
}

export function ExerciseCard({
  exercise,
  index,
  completed,
  done,
  onToggleSet,
  onToggleDone,
  onOpenVideo,
}: ExerciseCardProps) {
  const isFlow = exercise.track === "flow";
  const tags = exercise.tags ?? exercise.targetMuscle.split(",").map((s) => s.trim());
  const scheme = schemeLabel(exercise);
  const thumb = exercise.video.thumbnailUrl;
  const isSearch = exercise.video.kind === "search" || !thumb;
  const allSetsDone = completed.length > 0 && completed.every(Boolean);
  const highlight = isFlow ? done : allSetsDone;

  return (
    <Card className={cn("overflow-hidden p-3.5 transition-colors", highlight && "border-success/50")}>
      <div className="flex gap-3.5">
        {/* Thumbnail */}
        <button
          onClick={onOpenVideo}
          className="group relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl bg-muted tap-scale"
          aria-label={`Play ${exercise.name} tutorial`}
        >
          {isSearch ? (
            // No specific clip on file — branded tile that opens a YouTube search.
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/85 to-purple">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-primary shadow">
                <Play className="h-4 w-4 translate-x-[1px] fill-primary" />
              </span>
            </span>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-active:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/15">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-primary shadow">
                  <Play className="h-4 w-4 translate-x-[1px] fill-primary" />
                </span>
              </span>
            </>
          )}
        </button>

        {/* Meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[12px] font-bold text-primary">
              {index + 1}
            </span>
            <h3 className="line-clamp-2 text-[15.5px] font-bold leading-tight">{exercise.name}</h3>
          </div>

          <p className="mt-1.5 text-[14px] font-semibold text-primary">{scheme}</p>

          {/* Rest + equipment */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
            {exercise.rest && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {exercise.rest} rest
              </span>
            )}
            {exercise.equipment && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {exercise.equipment}
              </span>
            )}
          </div>

          {/* Tempo pill (only when prescribed) */}
          {exercise.tempo && (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-purple-soft px-2 py-0.5 text-[11px] font-semibold text-purple">
              <Gauge className="h-3 w-3" /> {exercise.tempo}
            </span>
          )}

          {/* Tags */}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", TAG[tagTone(tag)])}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Flow track: single done toggle on the right */}
        {isFlow && (
          <div className="flex shrink-0 flex-col items-center justify-center gap-2">
            <button
              onClick={onToggleDone}
              aria-pressed={done}
              aria-label={done ? "Mark not done" : "Mark done"}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all tap-scale",
                done ? "border-success bg-success text-white" : "border-border bg-card text-muted-foreground"
              )}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </button>
            <button onClick={onOpenVideo} aria-label="Open exercise" className="text-muted-foreground tap-scale">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Optional note (finishers, EMOM, etc.) */}
      {exercise.note && (
        <p className="mt-2.5 text-[12.5px] leading-snug text-muted-foreground">{exercise.note}</p>
      )}

      {/* Strength track: compact wrapped set toggles */}
      {!isFlow && (
        <div className="mt-3 flex items-center gap-2.5 border-t border-border/70 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle">Sets</span>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: exercise.sets }).map((_, i) => {
              const setDone = completed[i];
              return (
                <button
                  key={i}
                  onClick={() => onToggleSet(i)}
                  aria-pressed={setDone}
                  aria-label={`Set ${i + 1} ${setDone ? "done" : "not done"}`}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold transition-all tap-scale",
                    setDone
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {setDone ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
