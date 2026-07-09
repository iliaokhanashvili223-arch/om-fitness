"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, X, Youtube } from "lucide-react";
import type { Exercise } from "@/lib/data";
import { cn } from "@/lib/utils";

type VideoModalProps = {
  exercise: Exercise | null;
  onClose: () => void;
};

/** Fullscreen exercise tutorial: YouTube embed + form cues + targets. */
export function VideoModal({ exercise, onClose }: VideoModalProps) {
  const [embedFailed, setEmbedFailed] = React.useState(false);
  const videoId = exercise?.video.videoId;

  // Reset the embed-failure state whenever a different video is opened.
  React.useEffect(() => {
    setEmbedFailed(false);
  }, [videoId]);

  const muscles = exercise
    ? exercise.tags ?? exercise.targetMuscle.split(",").map((s) => s.trim())
    : [];

  // "search" clips have no inline embed — show the branded fallback straight away.
  const isSearch = exercise?.video.kind === "search";
  const showFallback = isSearch || embedFailed;
  const hasThumb = !!exercise?.video.thumbnailUrl;

  return (
    <AnimatePresence>
      {exercise && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mt-auto flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[2rem] bg-card safe-bottom"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="relative aspect-video w-full bg-black">
              {showFallback ? (
                // No inline clip: either a "search" tutorial (Pilates → Eva's
                // Pilates) or an embed the owner disabled. Show a branded panel
                // with a one-tap way out to YouTube.
                <div
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-4 bg-cover bg-center",
                    !hasThumb && "bg-gradient-to-br from-primary/90 via-purple/80 to-primary"
                  )}
                  style={hasThumb ? { backgroundImage: `url(${exercise.video.thumbnailUrl})` } : undefined}
                >
                  <div className="absolute inset-0 bg-black/50" />
                  <p className="relative z-10 px-6 text-center text-sm font-medium text-white/90">
                    {isSearch
                      ? "Tap below to watch this on YouTube."
                      : "This video can’t be played here."}
                  </p>
                  <a
                    href={exercise.video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black shadow tap-scale"
                  >
                    <Youtube className="h-4 w-4 text-[#FF0000]" /> Open on YouTube
                  </a>
                </div>
              ) : (
                <iframe
                  key={exercise.video.videoId}
                  className="h-full w-full"
                  src={`${exercise.video.embedUrl}?playsinline=1&rel=0&modestbranding=1`}
                  title={exercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEmbedFailed(true)}
                />
              )}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur tap-scale"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <h2 className="text-xl font-bold tracking-tight">{exercise.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {exercise.source && (
                  <span className="flex items-center gap-1.5 rounded-full bg-purple-soft px-3 py-1 text-xs font-semibold text-purple">
                    <Youtube className="h-3.5 w-3.5 text-[#FF0000]" />
                    {exercise.source}
                  </span>
                )}
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                  {exercise.scheme ?? `${exercise.sets} sets × ${exercise.reps}`}
                </span>
                {muscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {muscle}
                  </span>
                ))}
              </div>

              <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Form cues
              </h3>
              <ul className="mt-2 space-y-2">
                {exercise.cues.map((cue, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-snug">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>

              {/* Standing fallback: always a one-tap way to the source on YouTube. */}
              <a
                href={exercise.video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-card tap-scale"
              >
                <Youtube className="h-4 w-4 text-[#FF0000]" />
                Open on YouTube
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
