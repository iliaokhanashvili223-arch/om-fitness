"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Activity, ArrowRight, CheckCircle2, Clock, RotateCcw, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { ExerciseCard } from "@/components/exercise-card";
import { VideoModal } from "@/components/video-modal";
import { RestTimerBar } from "@/components/rest-timer-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { findWorkout, type Exercise } from "@/lib/data";
import { useProfile } from "@/components/profile-provider";
import { useSession, useWorkoutHistory } from "@/lib/storage";

export default function WorkoutDetailPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const { profile, ready } = useProfile();
  const day = findWorkout(profile, params.day);

  const { value: session, setValue: setSession } = useSession(day?.id ?? "unknown");
  const { isDoneToday, markDone, undo } = useWorkoutHistory();
  const [videoExercise, setVideoExercise] = React.useState<Exercise | null>(null);

  // Switching profile can leave you on a day that doesn't exist here — bounce out.
  // Wait for the stored profile to load first, so a refresh/deep-link on a
  // partner-only day doesn't redirect before "partner" has hydrated.
  React.useEffect(() => {
    if (ready && !day) router.replace("/workout");
  }, [ready, day, router]);

  if (!day) return null;

  const isFlow = day.exercises.every((e) => e.track === "flow");
  const done = isDoneToday(day.id);

  const totalSets = day.exercises.reduce((a, e) => a + e.sets, 0);
  const doneSets = day.exercises.reduce((a, e) => a + (session[e.id]?.filter(Boolean).length ?? 0), 0);
  const doneCount = day.exercises.filter((e) => !!session[e.id]?.[0]).length;

  const pct = isFlow
    ? Math.round((doneCount / day.exercises.length) * 100)
    : totalSets
      ? Math.round((doneSets / totalSets) * 100)
      : 0;
  const countLabel = isFlow
    ? `${doneCount} / ${day.exercises.length} completed`
    : `${doneSets} / ${totalSets} sets`;

  const completedFor = (ex: Exercise) => {
    const arr = session[ex.id] ? [...session[ex.id]] : [];
    while (arr.length < ex.sets) arr.push(false);
    return arr.slice(0, ex.sets);
  };

  const toggleSet = (ex: Exercise, setIndex: number) => {
    setSession((prev) => {
      const arr = prev[ex.id] ? [...prev[ex.id]] : [];
      while (arr.length < ex.sets) arr.push(false);
      arr[setIndex] = !arr[setIndex];
      return { ...prev, [ex.id]: arr };
    });
  };

  const toggleDone = (ex: Exercise) => {
    setSession((prev) => ({ ...prev, [ex.id]: [!prev[ex.id]?.[0]] }));
  };

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md px-5 pb-[calc(env(safe-area-inset-bottom)+10rem)] pt-[max(env(safe-area-inset-top),1.25rem)]">
      <AppHeader back />

      <div className="mt-4">
        <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight">{day.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">{day.subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-foreground">
            <Clock className="h-4 w-4" /> ~{day.duration} min
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-foreground">
            <Activity className="h-4 w-4" /> {day.exercises.length} exercises
          </span>
        </div>
      </div>

      {/* Progress card */}
      <Card className="mt-4 p-4">
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-extrabold tracking-tight tabular-nums">{pct}%</span>
          <ProgressBar value={pct} max={100} className="h-2 flex-1" />
          <span className="whitespace-nowrap text-[13px] font-medium text-muted-foreground">
            {countLabel}
          </span>
        </div>
        {done ? (
          <div className="mt-3 flex items-center gap-2 rounded-full bg-success-soft px-4 py-2.5">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-sm font-semibold text-success">Workout logged</span>
            <button
              onClick={() => undo(day.id)}
              className="ml-auto flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-card tap-scale"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Undo
            </button>
          </div>
        ) : (
          <Button
            className="mt-3 h-12 w-full"
            variant={pct >= 100 ? "success" : "primary"}
            onClick={() => markDone(day.id, day.title)}
          >
            {pct >= 100 ? "Finish workout" : "Start Session"} <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </Card>

      {day.rounds && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
          <Zap className="h-4 w-4 shrink-0" />
          {day.rounds} rounds for time — check off each round as you go.
        </div>
      )}

      {/* Exercises */}
      <div className="mt-5 flex flex-col gap-3.5">
        {day.exercises.map((ex, i) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
          >
            <ExerciseCard
              exercise={ex}
              index={i}
              completed={completedFor(ex)}
              done={!!session[ex.id]?.[0]}
              onToggleSet={(setIndex) => toggleSet(ex, setIndex)}
              onToggleDone={() => toggleDone(ex)}
              onOpenVideo={() => setVideoExercise(ex)}
            />
          </motion.div>
        ))}
      </div>

      <RestTimerBar />
      <VideoModal exercise={videoExercise} onClose={() => setVideoExercise(null)} />
    </div>
  );
}
