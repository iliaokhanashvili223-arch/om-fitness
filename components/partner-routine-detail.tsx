"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Clock, Play, RotateCcw, Youtube } from "lucide-react";
import { PARTNER_SESSION_CUES, type Exercise, type WorkoutDay } from "@/lib/data";
import { VideoModal } from "@/components/video-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkoutHistory } from "@/lib/storage";
import { cn } from "@/lib/utils";

type PartnerRoutineDetailProps = {
  day: WorkoutDay;
};

/**
 * Eva's Pilates routine detail: one full guided video as the main workout
 * (not a list of small moves). Large thumbnail → shared fullscreen video modal,
 * Start Session, gentle focus cues and a session-completed checkbox.
 */
export function PartnerRoutineDetail({ day }: PartnerRoutineDetailProps) {
  const routine: Exercise = day.exercises[0];
  const { isDoneToday, markDone, undo } = useWorkoutHistory();
  const [videoOpen, setVideoOpen] = React.useState(false);

  const done = isDoneToday(day.id);
  const thumb = routine.video.thumbnailUrl;
  const source = routine.source ?? "Eva's Pilates";
  const duration = routine.scheme ?? `~${day.duration} min`;

  return (
    <>
      <div className="mt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          Today&apos;s routine
        </p>
        <h1 className="mt-1 text-[32px] font-extrabold leading-[1.05] tracking-tight">
          {day.title}
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">{day.subtitle}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-foreground">
            <Clock className="h-4 w-4" /> {duration}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-purple-soft px-3 py-1.5 text-[13px] font-semibold text-purple">
            <Youtube className="h-4 w-4 text-[#FF0000]" /> {source}
          </span>
        </div>
      </div>

      {/* Large video thumbnail → shared fullscreen modal */}
      <button
        onClick={() => setVideoOpen(true)}
        className="group relative mt-4 block aspect-video w-full overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-card"
        aria-label={`Play ${day.title}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-active:scale-[1.03]"
          />
        ) : (
          <span className="block h-full w-full bg-gradient-to-br from-purple via-primary/80 to-primary" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[12px] font-bold text-foreground shadow-sm backdrop-blur">
          <Youtube className="h-3.5 w-3.5 text-[#FF0000]" /> {source}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform group-active:scale-95">
            <Play className="h-7 w-7 translate-x-[2px] fill-primary" />
          </span>
        </span>
      </button>

      {/* Start session */}
      <Button className="mt-4 h-[54px] w-full text-base" onClick={() => setVideoOpen(true)}>
        <Play className="h-5 w-5 fill-current" /> Start Session
      </Button>

      {/* Session completed checkbox */}
      <button
        onClick={() => (done ? undo(day.id) : markDone(day.id, day.title))}
        className={cn(
          "mt-3 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors tap-scale",
          done ? "border-success/50 bg-success-soft" : "border-border bg-card"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            done ? "border-success bg-success text-white" : "border-border bg-card text-muted-foreground"
          )}
        >
          <Check className="h-5 w-5" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-[15px] font-bold", done ? "text-success" : "text-foreground")}>
            {done ? "Session complete" : "Mark session complete"}
          </p>
          <p className="text-[13px] text-muted-foreground">
            {done ? "Logged to your progress." : "Tick this once you've finished the routine."}
          </p>
        </div>
        {done && (
          <span className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-card">
            <RotateCcw className="h-3.5 w-3.5" /> Undo
          </span>
        )}
      </button>

      {/* Focus cues */}
      <Card className="mt-4 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Notes &amp; focus cues
        </h2>
        <ul className="mt-3 space-y-2.5">
          {PARTNER_SESSION_CUES.map((cue, i) => (
            <motion.li
              key={cue}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.2) }}
              className="flex items-center gap-3 text-[15px] leading-snug"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-soft text-purple">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span>{cue}</span>
            </motion.li>
          ))}
        </ul>
      </Card>

      <VideoModal exercise={videoOpen ? routine : null} onClose={() => setVideoOpen(false)} />
    </>
  );
}
