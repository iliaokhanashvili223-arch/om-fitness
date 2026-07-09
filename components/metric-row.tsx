"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

export type Tone = "primary" | "success" | "orange" | "purple" | "danger";

const BUBBLE: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  orange: "bg-orange-soft text-orange",
  purple: "bg-purple-soft text-purple",
  danger: "bg-danger-soft text-danger",
};

const BAR: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  orange: "bg-orange",
  purple: "bg-purple",
  danger: "bg-danger",
};

const PILL: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  orange: "bg-orange-soft text-orange",
  purple: "bg-purple-soft text-purple",
  danger: "bg-danger-soft text-danger",
};

type MetricRowProps = {
  icon: LucideIcon;
  tone: Tone;
  label: string;
  value: React.ReactNode;
  progress?: number; // 0..1
  barTone?: Tone;
  action?: { label: string; onClick: () => void; tone?: Tone };
  badge?: { label: React.ReactNode; tone: Tone; icon?: LucideIcon };
  href?: string;
};

/** Large metric card: icon bubble · label · big value · colored bar · pill · chevron. */
export function MetricRow({
  icon: Icon,
  tone,
  label,
  value,
  progress,
  barTone,
  action,
  badge,
  href,
}: MetricRowProps) {
  const BadgeIcon = badge?.icon;
  const left = (
    <>
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          BUBBLE[tone]
        )}
      >
        <Icon className="h-[20px] w-[20px]" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[22px] font-bold leading-none tracking-tight">{value}</p>
        {typeof progress === "number" && (
          <ProgressBar
            value={progress * 100}
            max={100}
            className="mt-2.5 h-2"
            barClassName={BAR[barTone ?? tone]}
          />
        )}
      </div>
    </>
  );

  return (
    <Card className="flex items-center gap-3 p-4">
      {href ? (
        <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
          {left}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{left}</div>
      )}

      <div className="flex shrink-0 items-center gap-1.5">
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "rounded-full px-3 py-1.5 text-[13px] font-semibold tap-scale",
              PILL[action.tone ?? tone]
            )}
          >
            {action.label}
          </button>
        )}
        {badge && (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-semibold",
              PILL[badge.tone]
            )}
          >
            {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5" />}
            {badge.label}
          </span>
        )}
        {href && (
          <Link
            href={href}
            aria-label={`Open ${label}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground tap-scale"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>
    </Card>
  );
}
