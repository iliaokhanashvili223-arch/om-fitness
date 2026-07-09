"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Beef,
  ChevronRight,
  Droplets,
  Flame,
  Moon,
  Scale,
  Target,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { HeroCard } from "@/components/hero-card";
import { MetricRow } from "@/components/metric-row";
import { StepsCard } from "@/components/steps-card";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getRestDays, getProgram, workoutForDayIndex } from "@/lib/data";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { useSettings, useDailyLog, useWeights, useWorkoutHistory, useSession } from "@/lib/storage";
import { clamp, formatDuration, formatNumber, programDayIndex } from "@/lib/utils";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 120, damping: 18 },
  }),
};

export default function TodayPage() {
  const { profile } = useProfile();
  const meta = PROFILES[profile];

  const dayIndex = programDayIndex();
  const todayWorkout = workoutForDayIndex(profile, dayIndex);
  const restDay = !todayWorkout ? getRestDays(profile)[dayIndex - getProgram(profile).length] : null;

  const [greeting, setGreeting] = React.useState("Good afternoon");
  const [dateLabel, setDateLabel] = React.useState("");
  React.useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
    setDateLabel(
      new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    );
  }, []);

  const { value: settings } = useSettings();
  const { value: daily, setValue: setDaily } = useDailyLog();
  const { value: weights } = useWeights();
  const { isDoneToday } = useWorkoutHistory();
  const { value: session } = useSession(todayWorkout?.id ?? "rest");

  const totalSets = todayWorkout ? todayWorkout.exercises.reduce((a, e) => a + e.sets, 0) : 0;
  const doneSets = todayWorkout
    ? todayWorkout.exercises.reduce((a, e) => a + (session[e.id]?.filter(Boolean).length ?? 0), 0)
    : 0;
  const ringProgress = totalSets ? doneSets / totalSets : 0;
  const completedToday = todayWorkout ? isDoneToday(todayWorkout.id) : false;

  const latestWeight = weights.length ? weights[weights.length - 1] : null;
  const prevWeight = weights.length > 1 ? weights[weights.length - 2] : null;
  const weightDelta =
    latestWeight && prevWeight ? +(latestWeight.kg - prevWeight.kg).toFixed(1) : null;

  const t = settings.targets;
  const displayName = settings.name && settings.name !== "Athlete" ? settings.name : "";
  const greetName = displayName ? `, ${displayName} 👋` : "";

  return (
    <PageContainer>
      <AppHeader />

      {/* Greeting */}
      <motion.div variants={fade} custom={0} initial="hidden" animate="show">
        <p className="text-sm font-medium text-muted-foreground">{dateLabel || " "}</p>
        <h1 className="mt-0.5 text-[32px] font-extrabold leading-tight tracking-tight">
          {greeting}
          {greetName}
        </h1>
      </motion.div>

      {/* Hero */}
      <motion.div variants={fade} custom={1} initial="hidden" animate="show">
        {todayWorkout ? (
          <HeroCard
            day={todayWorkout}
            progress={ringProgress}
            completed={completedToday}
            resumed={doneSets > 0}
            heroImage={meta.heroImage}
            heroImageDark={meta.heroImageDark}
            tint={profile === "partner" ? "partner" : "me"}
            source={profile === "partner" ? "Eva's Pilates" : undefined}
          />
        ) : (
          restDay && (
            <Card className="relative overflow-hidden rounded-[2rem] p-6">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success">
                <Moon className="h-3.5 w-3.5" /> Today · {restDay.weekday}
              </div>
              <h2 className="mt-1 text-[28px] font-extrabold tracking-tight">{restDay.title}</h2>
              <p className="text-sm text-muted-foreground">{restDay.subtitle}</p>
              <ul className="mt-4 space-y-2">
                {restDay.suggestions.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          )
        )}
      </motion.div>

      {/* Calories + Protein (Me only) */}
      {meta.showMacros && (
        <motion.div variants={fade} custom={2} initial="hidden" animate="show">
          <Card className="p-4">
            <Link href="/nutrition" className="flex items-center gap-2">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-soft text-orange">
                    <Flame className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-muted-foreground">Calories</p>
                    <p className="mt-0.5 leading-none">
                      <span className="text-[19px] font-bold tracking-tight">
                        {formatNumber(daily.caloriesIn)}
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {" "}/ {formatNumber(t.calories)} kcal
                      </span>
                    </p>
                    <ProgressBar
                      value={daily.caloriesIn}
                      max={t.calories}
                      className="mt-2 h-2"
                      barClassName="bg-orange"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2.5 border-l border-border pl-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success">
                    <Beef className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-muted-foreground">Protein</p>
                    <p className="mt-0.5 leading-none">
                      <span className="text-[19px] font-bold tracking-tight">
                        {formatNumber(daily.proteinIn)}
                      </span>
                      <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                        {" "}/ {formatNumber(t.protein)} g
                      </span>
                    </p>
                    <ProgressBar
                      value={daily.proteinIn}
                      max={t.protein}
                      className="mt-2 h-2"
                      barClassName="bg-success"
                    />
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Link>
          </Card>
        </motion.div>
      )}

      {/* Water */}
      <motion.div variants={fade} custom={3} initial="hidden" animate="show">
        <MetricRow
          icon={Droplets}
          tone="primary"
          label="Water"
          value={
            <>
              {(daily.waterMl / 1000).toFixed(1)}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}/ {(t.waterMl / 1000).toFixed(1)} L
              </span>
            </>
          }
          progress={clamp(daily.waterMl / t.waterMl, 0, 1)}
          action={{ label: "+250 ml", onClick: () => setDaily((d) => ({ ...d, waterMl: d.waterMl + 250 })) }}
          href="/nutrition"
        />
      </motion.div>

      {/* Steps — manual tracking only (no pedometer) */}
      <motion.div variants={fade} custom={4} initial="hidden" animate="show">
        <StepsCard />
      </motion.div>

      {/* Sleep */}
      <motion.div variants={fade} custom={5} initial="hidden" animate="show">
        <MetricRow
          icon={Moon}
          tone="purple"
          label="Sleep"
          value={
            <>
              {formatDuration(daily.sleepHours)}
              <span className="text-sm font-medium text-muted-foreground">
                {" "}/ {formatDuration(t.sleepHours)}
              </span>
            </>
          }
          progress={clamp(daily.sleepHours / t.sleepHours, 0, 1)}
          action={{
            label: "+30 min",
            onClick: () =>
              setDaily((d) => ({ ...d, sleepHours: +(d.sleepHours + 0.5).toFixed(2) })),
          }}
          href="/progress"
        />
      </motion.div>

      {/* Current weight */}
      <motion.div variants={fade} custom={6} initial="hidden" animate="show">
        <MetricRow
          icon={Scale}
          tone="primary"
          label="Current weight"
          value={<>{latestWeight ? `${latestWeight.kg} kg` : `${settings.weightKg} kg`}</>}
          badge={
            weightDelta !== null
              ? {
                  label: `${weightDelta > 0 ? "↑ +" : "↓ "}${Math.abs(weightDelta)} kg`,
                  tone: weightDelta <= 0 ? "success" : "danger",
                }
              : undefined
          }
          href="/progress"
        />
      </motion.div>

      {/* Partner goal card */}
      {!meta.showMacros && (
        <motion.div variants={fade} custom={7} initial="hidden" animate="show">
          <Link href="/settings">
            <Card className="flex items-center gap-3 p-4 tap-scale">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success">
                <Target className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-muted-foreground">Goal</p>
                <p className="mt-0.5 text-[17px] font-bold tracking-tight">{meta.goalLine}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        </motion.div>
      )}
    </PageContainer>
  );
}
