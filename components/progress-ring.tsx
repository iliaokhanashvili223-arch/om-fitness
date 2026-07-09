"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

type ProgressRingProps = {
  /** 0–1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  progressClassName?: string;
  children?: React.ReactNode;
};

/** Animated circular progress ring (Apple Fitness style). */
export function ProgressRing({
  progress,
  size = 160,
  strokeWidth = 14,
  className,
  trackClassName,
  progressClassName,
  children,
}: ProgressRingProps) {
  const p = clamp(progress, 0, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - p);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-muted", trackClassName)}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-primary", progressClassName)}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}
