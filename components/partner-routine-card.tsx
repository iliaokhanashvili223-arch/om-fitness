"use client";

import Link from "next/link";
import { ArrowRight, Check, Clock, Play, Youtube } from "lucide-react";
import type { WorkoutDay } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PartnerRoutineCardProps = {
  day: WorkoutDay;
  isToday: boolean;
  done: boolean;
  /** Open the shared fullscreen video modal on the routine's clip. */
  onOpenVideo: () => void;
};

/**
 * Premium Eva's Pilates routine card: source badge, YouTube thumbnail, play
 * button, focus tags, duration + progress. The whole body links to the detail
 * screen; the thumbnail's play button opens the shared video modal.
 */
export function PartnerRoutineCard({ day, isToday, done, onOpenVideo }: PartnerRoutineCardProps) {
  const routine = day.exercises[0];
  const thumb = routine.video.thumbnailUrl;
  const source = routine.source ?? "Eva's Pilates";
  const duration = routine.scheme ?? `~${day.duration} min`;

  return (
    <Card
      className={cn(
        "overflow-hidden p-0",
        isToday && "border-primary/50 ring-1 ring-primary/10"
      )}
    >
      {/* Thumbnail — tap the play button to watch inline */}
      <button
        onClick={onOpenVideo}
        className="group relative block aspect-video w-full overflow-hidden bg-muted"
        aria-label={`Play ${day.title}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-active:scale-[1.03]"
          />
        ) : (
          <span className="block h-full w-full bg-gradient-to-br from-purple via-primary/80 to-primary" />
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/25" />

        {/* Source badge */}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm backdrop-blur">
          <Youtube className="h-3.5 w-3.5 text-[#FF0000]" />
          {source}
        </span>

        {/* Done tick / duration */}
        {done ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-bold text-white shadow">
            <Check className="h-3.5 w-3.5" strokeWidth={3} /> Done
          </span>
        ) : (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <Clock className="h-3.5 w-3.5" /> {duration}
          </span>
        )}

        {/* Play */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform group-active:scale-95">
            <Play className="h-6 w-6 translate-x-[2px] fill-primary" />
          </span>
        </span>
      </button>

      {/* Body — links through to the routine detail */}
      <Link href={`/workout/${day.id}`} className="block p-4 tap-scale">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-[13px] font-medium",
              isToday ? "text-primary" : "text-muted-foreground"
            )}
          >
            {day.weekday}
          </p>
          {isToday && (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              Today
            </span>
          )}
        </div>

        <h3 className="mt-0.5 text-[20px] font-bold leading-tight tracking-tight">{day.title}</h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {day.focus.map((f) => (
            <span
              key={f}
              className="rounded-full bg-purple-soft px-2.5 py-0.5 text-[11px] font-semibold text-purple"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] font-medium text-muted-foreground">{day.subtitle}</span>
          <span
            className={cn(
              "flex items-center gap-1 text-[13px] font-bold",
              done ? "text-success" : "text-primary"
            )}
          >
            {done ? (
              <>
                <Check className="h-4 w-4" strokeWidth={3} /> Completed
              </>
            ) : (
              <>
                Start Session <ArrowRight className="h-4 w-4" />
              </>
            )}
          </span>
        </div>
      </Link>
    </Card>
  );
}
