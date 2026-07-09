"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Plus, RotateCcw, SkipForward, X } from "lucide-react";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { cn } from "@/lib/utils";

type RestTimerContextValue = {
  /** Open the timer. Pass seconds to start immediately, or omit to show presets. */
  open: (seconds?: number) => void;
};

const RestTimerContext = React.createContext<RestTimerContextValue | null>(null);

export function useRestTimer() {
  const ctx = React.useContext(RestTimerContext);
  if (!ctx) throw new Error("useRestTimer must be used within RestTimerProvider");
  return ctx;
}

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Short beep + haptic when a timer completes. */
function playChime() {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([120, 60, 120]);
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    beep(880, 0, 0.18);
    beep(1174, 0.2, 0.28);
  } catch {
    /* audio unavailable — ignore */
  }
}

export function RestTimerProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const presets = PROFILES[profile].restPresets;
  const defaultRest = presets[1] ?? presets[0] ?? 60;
  const [visible, setVisible] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [remaining, setRemaining] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [finished, setFinished] = React.useState(false);

  const start = React.useCallback((seconds: number) => {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(true);
    setFinished(false);
  }, []);

  const open = React.useCallback(
    (seconds?: number) => {
      setVisible(true);
      if (seconds) start(seconds);
      else {
        setRunning(false);
        setRemaining(0);
        setDuration(0);
        setFinished(false);
      }
    },
    [start]
  );

  const close = React.useCallback(() => {
    setVisible(false);
    setRunning(false);
  }, []);

  // Countdown tick
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          setRunning(false);
          setFinished(true);
          playChime();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const progress = duration > 0 ? remaining / duration : 0;
  const active = duration > 0;

  return (
    <RestTimerContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-between bg-background/95 px-6 py-10 backdrop-blur-xl safe-top safe-bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex w-full max-w-sm items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Rest Timer
              </span>
              <button
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground tap-scale"
                aria-label="Close timer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="flex flex-col items-center"
            >
              <ProgressRing
                progress={active ? progress : 0}
                size={260}
                strokeWidth={18}
                progressClassName={finished ? "stroke-success" : "stroke-primary"}
              >
                <span className="text-6xl font-bold tabular-nums tracking-tight">
                  {formatTime(active ? remaining : 0)}
                </span>
                <span className="mt-1 text-sm font-medium text-muted-foreground">
                  {finished ? "Time's up 💪" : running ? "Resting…" : active ? "Paused" : "Pick a rest"}
                </span>
              </ProgressRing>
            </motion.div>

            <div className="flex w-full max-w-sm flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                {presets.map((sec) => (
                  <button
                    key={sec}
                    onClick={() => start(sec)}
                    className={cn(
                      "rounded-2xl border py-3.5 text-center font-semibold transition-colors tap-scale",
                      duration === sec && active
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card text-foreground"
                    )}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setRemaining((r) => r + 15);
                    setDuration((d) => d + 15);
                    setFinished(false);
                  }}
                  disabled={!active}
                  aria-label="Add 15 seconds"
                >
                  <Plus className="h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  className="flex-1"
                  variant={running ? "secondary" : "primary"}
                  onClick={() => {
                    if (!active) return start(defaultRest);
                    if (finished) return start(duration || defaultRest);
                    setRunning((r) => !r);
                  }}
                >
                  {running ? (
                    <>
                      <Pause className="h-5 w-5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />{" "}
                      {finished ? "Go again" : active ? "Resume" : `Start ${defaultRest}s`}
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => start(duration || defaultRest)}
                  disabled={!active}
                  aria-label="Reset timer"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              <button
                onClick={close}
                className="mx-auto flex items-center gap-1.5 py-1 text-sm font-semibold text-muted-foreground tap-scale"
              >
                <SkipForward className="h-4 w-4" />
                {finished ? "Done — back to workout" : "Skip rest"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </RestTimerContext.Provider>
  );
}
