"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useProfile } from "@/components/profile-provider";
import { PROFILE_IDS, PROFILES } from "@/lib/profiles";
import { cn } from "@/lib/utils";

/** The Me / Partner switch that scopes the whole app to one person. */
export function ProfileSegmented() {
  const { profile, setProfile } = useProfile();

  return (
    <div className="flex items-center rounded-full bg-muted p-1">
      {PROFILE_IDS.map((id) => {
        const active = profile === id;
        return (
          <button
            key={id}
            onClick={() => setProfile(id)}
            className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 tap-scale"
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="profile-active"
                className="absolute inset-0 rounded-full bg-card shadow-card"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <User
              className={cn(
                "relative z-10 h-4 w-4 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={2.2}
            />
            <span
              className={cn(
                "relative z-10 text-[13px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {PROFILES[id].label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
