"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Dumbbell, Flame, Moon, Plus, Scale, Trash2, TrendingDown, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { WeightChart } from "@/components/weight-chart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  computeStreak,
  useDailyLog,
  useSettings,
  useWeights,
  useWorkoutHistory,
  weeklyAverage,
  type WeightEntry,
} from "@/lib/storage";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { cn, dateKey } from "@/lib/utils";

type Tone = "primary" | "success" | "purple" | "danger";

const BUBBLE: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  purple: "bg-purple-soft text-purple",
  danger: "bg-danger-soft text-danger",
};

type Stat = { icon: LucideIcon; tone: Tone; label: string; value: string; unit: string; pill?: string };

function StatCard({ icon: Icon, tone, label, value, unit, pill }: Stat) {
  return (
    <Card className="relative p-4">
      <div className="flex items-start gap-3">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", BUBBLE[tone])}>
          <Icon className="h-[20px] w-[20px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-[26px] font-extrabold leading-none tracking-tight">{value}</p>
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">{unit}</p>
        </div>
      </div>
      {pill && (
        <span className="absolute bottom-3 right-3 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
          {pill}
        </span>
      )}
    </Card>
  );
}

export default function ProgressPage() {
  const { profile } = useProfile();
  const meta = PROFILES[profile];
  const { value: settings } = useSettings();
  const { value: weights, addWeight, removeWeight } = useWeights();
  const { value: workouts } = useWorkoutHistory();
  const { value: daily } = useDailyLog();

  const [input, setInput] = React.useState("");
  const [pendingDelete, setPendingDelete] = React.useState<WeightEntry | null>(null);

  const streak = computeStreak(workouts);
  const avg = weeklyAverage(weights);
  const latest = weights.length ? weights[weights.length - 1] : null;
  const first = weights.length ? weights[0] : null;
  const totalChange = latest && first ? +(latest.kg - first.kg).toFixed(1) : null;

  const weekAgo = dateKey(new Date(Date.now() - 6 * 864e5));
  const sessionsThisWeek = workouts.filter((w) => w.date >= weekAgo).length;
  const consistency = Math.round(Math.min(sessionsThisWeek / 5, 1) * 100);

  const stats: Stat[] = meta.showMacros
    ? [
        { icon: Flame, tone: "primary", label: "Day streak", value: `${streak}`, unit: "days" },
        { icon: Dumbbell, tone: "purple", label: "Workouts done", value: `${workouts.length}`, unit: "workouts" },
        { icon: Scale, tone: "success", label: "Weekly average", value: avg ? `${avg}` : "—", unit: "kg" },
        {
          icon: TrendingDown,
          tone: totalChange !== null && totalChange <= 0 ? "success" : "primary",
          label: "Total change",
          value: totalChange !== null ? `${totalChange > 0 ? "+" : ""}${totalChange}` : "—",
          unit: "kg",
          pill: "vs last 7 days",
        },
      ]
    : [
        { icon: Flame, tone: "primary", label: "Pilates streak", value: `${streak}`, unit: "days" },
        { icon: Activity, tone: "purple", label: "Sessions done", value: `${workouts.length}`, unit: "sessions" },
        { icon: Wind, tone: "success", label: "Mobility", value: `${consistency}`, unit: "% this week" },
        {
          icon: Moon,
          tone: "purple",
          label: "Sleep",
          value: `${daily.sleepHours.toFixed(1)}`,
          unit: "hours",
          pill: daily.sleepHours >= 7 ? "Good" : undefined,
        },
      ];

  const submit = () => {
    const kg = parseFloat(input.replace(",", "."));
    if (!isNaN(kg) && kg > 0) {
      addWeight(Math.round(kg * 10) / 10);
      setInput("");
    }
  };

  const recent = [...weights].reverse().slice(0, 6);
  const recentTones: Tone[] = ["primary", "purple", "success"];

  return (
    <PageContainer>
      <AppHeader />

      <div className="mt-1">
        <p className="text-sm font-medium text-muted-foreground">{meta.progressSubtitle}</p>
        <h1 className="mt-0.5 text-[34px] font-extrabold leading-tight tracking-tight">Progress</h1>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Weight trend */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <p className="text-[17px] font-bold tracking-tight">Weight trend</p>
          {latest && (
            <div className="text-right">
              <p className="text-[11px] font-medium text-muted-foreground">Current weight</p>
              <p className="text-[19px] font-bold tracking-tight">
                {latest.kg} <span className="text-sm font-semibold text-muted-foreground">kg</span>
              </p>
            </div>
          )}
        </div>
        <div className="mt-3">
          <WeightChart entries={weights} />
        </div>
      </Card>

      {/* Log weight */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Scale className="h-5 w-5" />
          </span>
          <p className="text-[15px] font-semibold">Log today&apos;s weight</p>
        </div>
        <div className="mt-3 flex gap-2.5">
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder={`${settings.weightKg}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              kg
            </span>
          </div>
          <Button onClick={submit} disabled={!input} className="px-6">
            <Plus className="h-5 w-5" /> Log
          </Button>
        </div>
      </Card>

      {/* Recent weigh-ins */}
      <div>
        <h2 className="mb-2 px-1 text-[17px] font-bold tracking-tight">Recent weigh-ins</h2>
        {recent.length === 0 ? (
          <Card className="flex flex-col items-center gap-2 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Scale className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium">No weigh-ins yet</p>
            <p className="text-xs text-muted-foreground">Log your weight above to start tracking.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recent.map((e, i) => (
              <motion.div
                key={e.date}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="flex items-center gap-3 p-3.5">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                      BUBBLE[recentTones[i % recentTones.length]]
                    )}
                  >
                    <Scale className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-bold tracking-tight">
                      {e.kg} <span className="text-[13px] font-semibold text-muted-foreground">kg</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setPendingDelete(e)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-danger-soft hover:text-danger tap-scale"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this weigh-in?"
        description={
          pendingDelete
            ? `${pendingDelete.kg} kg logged on ${new Date(
                pendingDelete.date + "T00:00:00"
              ).toLocaleDateString("en-US", { month: "short", day: "numeric" })} will be removed.`
            : undefined
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (pendingDelete) removeWeight(pendingDelete.date);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </PageContainer>
  );
}
