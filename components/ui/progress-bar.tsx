"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
};

/** Slim animated linear progress used across trackers. */
export function ProgressBar({ value, max, className, barClassName }: ProgressBarProps) {
  const pct = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cn("h-full rounded-full bg-primary", barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
