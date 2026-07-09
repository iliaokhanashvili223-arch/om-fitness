"use client";

import { Timer } from "lucide-react";
import { useRestTimer } from "@/components/rest-timer";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { cn } from "@/lib/utils";

/** Floating rest-timer pill shown at the bottom of the workout detail screen. */
export function RestTimerBar() {
  const { open } = useRestTimer();
  const { profile } = useProfile();
  const presets = PROFILES[profile].restPresets;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.25rem)] z-30 flex justify-center px-5">
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-card/95 p-2 pl-3.5 shadow-card-hover backdrop-blur-xl">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-soft text-purple">
          <Timer className="h-4 w-4" />
        </span>
        <span className="text-[13px] font-semibold">Rest timer</span>
        <div className="ml-auto flex items-center gap-1.5">
          {presets.map((sec, i) => (
            <button
              key={sec}
              onClick={() => open(sec)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold tap-scale",
                i === 0
                  ? "border border-primary bg-card text-primary"
                  : "bg-muted text-foreground"
              )}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
