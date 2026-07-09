"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ChevronRight,
  Clock,
  Dumbbell,
  Footprints,
  HeartPulse,
  Moon,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { PartnerRoutineCard } from "@/components/partner-routine-card";
import { VideoModal } from "@/components/video-modal";
import { Card } from "@/components/ui/card";
import { DELOAD_NOTE, PROGRESSION_TIPS, getProgram, getRestDays, type Exercise } from "@/lib/data";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { useWorkoutHistory } from "@/lib/storage";
import { cn, programDayIndex } from "@/lib/utils";

type Tone = "primary" | "success" | "purple" | "orange";

const BUBBLE: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  purple: "bg-purple-soft text-purple",
  orange: "bg-orange-soft text-orange",
};

// Me/calisthenics day visuals. Partner days render as Eva's Pilates routine
// cards (see PartnerRoutineCard), so they don't need an entry here.
const DAY_VISUAL: Record<string, { icon: LucideIcon; tone: Tone }> = {
  pull: { icon: Dumbbell, tone: "primary" },
  push: { icon: Activity, tone: "primary" },
  "legs-core": { icon: Footprints, tone: "success" },
  "upper-volume": { icon: Dumbbell, tone: "purple" },
  conditioning: { icon: HeartPulse, tone: "orange" },
};

const REST_VISUAL: Record<string, { icon: LucideIcon; tone: Tone }> = {
  Saturday: { icon: Footprints, tone: "success" },
  Sunday: { icon: Moon, tone: "purple" },
};

export default function WorkoutListPage() {
  const { profile } = useProfile();
  const meta = PROFILES[profile];
  const program = getProgram(profile);
  const restDays = getRestDays(profile);
  const todayIndex = programDayIndex();
  const { isDoneToday } = useWorkoutHistory();
  const isPartner = profile === "partner";
  const [videoExercise, setVideoExercise] = React.useState<Exercise | null>(null);

  return (
    <PageContainer>
      <AppHeader />

      <div className="mt-1">
        <p className="text-sm font-medium text-muted-foreground">{meta.workoutSubtitle}</p>
        <h1 className="mt-0.5 text-[34px] font-extrabold leading-tight tracking-tight">Workout</h1>
      </div>

      <div className="flex flex-col gap-3">
        {program.map((day, i) => {
          const isToday = i === todayIndex;
          const done = isToday && isDoneToday(day.id);

          if (isPartner) {
            return (
              <motion.div
                key={day.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PartnerRoutineCard
                  day={day}
                  isToday={isToday}
                  done={done}
                  onOpenVideo={() => setVideoExercise(day.exercises[0])}
                />
              </motion.div>
            );
          }

          const v = DAY_VISUAL[day.id] ?? { icon: Dumbbell, tone: "primary" as Tone };
          const Icon = v.icon;
          return (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/workout/${day.id}`}>
                <Card
                  className={cn(
                    "flex items-center gap-3.5 p-4 tap-scale",
                    isToday && "border-primary/50 ring-1 ring-primary/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                      BUBBLE[v.tone]
                    )}
                  >
                    <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
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
                      {done && (
                        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                          Done
                        </span>
                      )}
                    </div>
                    <h3 className="truncate text-[19px] font-bold tracking-tight">{day.title}</h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Dumbbell className="h-3.5 w-3.5" /> {day.exercises.length} exercises
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {day.duration} min
                    </span>
                  </div>
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      isToday ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div>
        <p className="mb-2 mt-2 px-1 text-sm font-semibold text-muted-foreground">Weekend</p>
        <div className="flex flex-col gap-3">
          {restDays.map((rest) => {
            const v = REST_VISUAL[rest.weekday] ?? { icon: Moon, tone: "purple" as Tone };
            const Icon = v.icon;
            return (
              <Card key={rest.weekday} className="flex items-center gap-3.5 p-4">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                    BUBBLE[v.tone]
                  )}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-muted-foreground">{rest.weekday}</p>
                  <h3 className="truncate text-[19px] font-bold tracking-tight">{rest.title}</h3>
                  <p className="truncate text-[13px] text-muted-foreground">{rest.subtitle}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </Card>
            );
          })}
        </div>
      </div>

      {!isPartner && (
        <div>
          <p className="mb-2 mt-2 px-1 text-sm font-semibold text-muted-foreground">How to progress</p>
          <Card className="p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h3 className="text-[15px] font-bold tracking-tight">Weekly progression</h3>
            </div>
            <p className="mt-2.5 text-[12.5px] text-muted-foreground">
              Each week, improve just one variable:
            </p>
            <ul className="mt-1.5 space-y-1">
              {PROGRESSION_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-[13px] leading-snug">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-muted px-3 py-2.5">
              <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-purple" />
              <p className="text-[12.5px] leading-snug text-muted-foreground">
                <span className="font-semibold text-foreground">Deload · </span>
                {DELOAD_NOTE}
              </p>
            </div>
          </Card>
        </div>
      )}

      <VideoModal exercise={videoExercise} onClose={() => setVideoExercise(null)} />
    </PageContainer>
  );
}
