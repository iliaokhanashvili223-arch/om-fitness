"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, ChevronRight, Dumbbell, Flame, Moon, Play } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { HeroCard } from "@/components/hero-card";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getRestDays, getProgram, workoutForDayIndex, type WorkoutDay } from "@/lib/data";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import {
  computeStreak,
  useSettings,
  useSession,
  useWorkoutHistory,
  type SessionProgress,
} from "@/lib/storage";
import { dateKey, programDayIndex } from "@/lib/utils";

const fade = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: "spring", stiffness: 120, damping: 18 },
  }),
};

/** First exercise with sets still unchecked (falls back to the last one). */
function nextExerciseOf(day: WorkoutDay, session: SessionProgress) {
  for (const ex of day.exercises) {
    const done = session[ex.id]?.filter(Boolean).length ?? 0;
    if (done < ex.sets) return ex;
  }
  return day.exercises[day.exercises.length - 1] ?? null;
}

/** "Today" / "Yesterday" / "Mon, Jul 7". */
function relativeDay(dateStr: string): string {
  if (dateStr === dateKey()) return "Today";
  if (dateStr === dateKey(new Date(Date.now() - 864e5))) return "Yesterday";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function TodayPage() {
  const { profile } = useProfile();
  const meta = PROFILES[profile];
  const isPartner = profile === "partner";

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
  const { value: workouts, isDoneToday } = useWorkoutHistory();
  const { value: session } = useSession(todayWorkout?.id ?? "rest");

  const totalSets = todayWorkout ? todayWorkout.exercises.reduce((a, e) => a + e.sets, 0) : 0;
  const doneSets = todayWorkout
    ? todayWorkout.exercises.reduce((a, e) => a + (session[e.id]?.filter(Boolean).length ?? 0), 0)
    : 0;
  const ringProgress = totalSets ? doneSets / totalSets : 0;
  const completedToday = todayWorkout ? isDoneToday(todayWorkout.id) : false;
  const inProgress = doneSets > 0 && !completedToday;
  const nextEx = todayWorkout && !completedToday ? nextExerciseOf(todayWorkout, session) : null;

  const streak = computeStreak(workouts);
  const weekAgo = dateKey(new Date(Date.now() - 6 * 864e5));
  const sessionsThisWeek = workouts.filter((w) => w.date >= weekAgo).length;
  const recent = workouts.length
    ? [...workouts].sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

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
            tint={isPartner ? "partner" : "me"}
            source={isPartner ? "Eva's Pilates" : undefined}
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

      {/* Up next / continue — with video preview */}
      {todayWorkout && nextEx && (
        <motion.div variants={fade} custom={2} initial="hidden" animate="show">
          <Link href={`/workout/${todayWorkout.id}`}>
            <Card className="flex items-center gap-3.5 p-3.5 tap-scale">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
                {nextEx.video.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nextEx.video.thumbnailUrl}
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  {inProgress ? "Continue" : isPartner ? "Today's session" : "Up next"}
                </p>
                <p className="mt-0.5 truncate text-[16px] font-bold tracking-tight">{nextEx.name}</p>
                <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
                  {isPartner ? nextEx.reps : `${nextEx.sets} × ${nextEx.reps}`}
                </p>
                {inProgress && <ProgressBar value={doneSets} max={totalSets} className="mt-2 h-1.5" />}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </Card>
          </Link>
        </motion.div>
      )}

      {/* Streak + this week */}
      <motion.div variants={fade} custom={3} initial="hidden" animate="show">
        <Card className="flex items-center gap-4 p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Flame className="h-6 w-6" />
          </span>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="text-[26px] font-extrabold leading-none tracking-tight tabular-nums">
                {streak}
              </p>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">
                {isPartner ? "Pilates streak" : "Day streak"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[26px] font-extrabold leading-none tracking-tight tabular-nums">
                {sessionsThisWeek}
              </p>
              <p className="mt-1 text-[12px] font-medium text-muted-foreground">This week</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent completed session */}
      <motion.div variants={fade} custom={4} initial="hidden" animate="show">
        <Link href="/progress">
          <Card className="flex items-center gap-3.5 p-4 tap-scale">
            <span
              className={
                recent
                  ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success"
                  : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
              }
            >
              {recent ? <CheckCircle2 className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-muted-foreground">
                {recent ? "Last completed" : isPartner ? "No sessions yet" : "No workouts yet"}
              </p>
              <p className="mt-0.5 truncate text-[16px] font-bold tracking-tight">
                {recent ? recent.title : "Start today's session to begin"}
              </p>
              {recent && (
                <p className="mt-0.5 text-[12px] text-muted-foreground">{relativeDay(recent.date)}</p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Card>
        </Link>
      </motion.div>
    </PageContainer>
  );
}
