"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Beef,
  Check,
  ClipboardCheck,
  Droplets,
  Flame,
  Moon,
  Plus,
  Sun,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { WaterCard } from "@/components/water-card";
import { FoodTracker } from "@/components/food-tracker";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ME_NUTRITION, PARTNER_NUTRITION, type Meal } from "@/lib/data";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { useDailyLog, useSettings } from "@/lib/storage";
import { cn, formatNumber } from "@/lib/utils";

const DOT: Record<string, string> = {
  Protein: "bg-purple",
  Carbs: "bg-primary",
  Veg: "bg-success",
  Fat: "bg-orange",
};

const PILLAR_VISUAL: Record<string, { icon: typeof Droplets; tone: string }> = {
  hydration: { icon: Droplets, tone: "bg-primary-soft text-primary" },
  balanced: { icon: UtensilsCrossed, tone: "bg-success-soft text-success" },
  protein: { icon: Beef, tone: "bg-orange-soft text-orange" },
  energy: { icon: Zap, tone: "bg-purple-soft text-purple" },
};

export default function NutritionPage() {
  const { profile } = useProfile();
  const meta = PROFILES[profile];
  const { value: settings } = useSettings();
  const { value: daily, setValue: setDaily } = useDailyLog();
  const t = settings.targets;

  const toggleMeal = (meal: Meal) => {
    setDaily((d) => {
      const isDone = !!d.mealsDone[meal.id];
      return {
        ...d,
        mealsDone: { ...d.mealsDone, [meal.id]: !isDone },
        caloriesIn: Math.max(0, d.caloriesIn + (isDone ? -meal.kcal : meal.kcal)),
        proteinIn: Math.max(0, d.proteinIn + (isDone ? -meal.protein : meal.protein)),
      };
    });
  };

  const mealsLogged = ME_NUTRITION.meals.filter((m) => daily.mealsDone[m.id]).length;

  return (
    <PageContainer>
      <AppHeader />

      <div className="mt-1">
        <p className="text-sm font-medium text-muted-foreground">{meta.nutritionEyebrow}</p>
        <h1 className="mt-0.5 text-[34px] font-extrabold leading-tight tracking-tight">Nutrition</h1>
      </div>

      {meta.showMacros ? (
        <>
          {/* Calories + Protein */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3">
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
                  <ProgressBar value={daily.caloriesIn} max={t.calories} className="mt-2 h-2" barClassName="bg-orange" />
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
                  <ProgressBar value={daily.proteinIn} max={t.protein} className="mt-2 h-2" barClassName="bg-success" />
                </div>
              </div>
            </div>
          </Card>

          {/* Water */}
          <WaterCard />

          {/* Quick add calories/protein + saved foods */}
          <FoodTracker />

          {/* Meals */}
          <div className="mt-1 flex items-center justify-between px-1">
            <h2 className="text-[22px] font-extrabold tracking-tight">Meals</h2>
            <span className="text-[13px] font-medium text-muted-foreground">
              {mealsLogged}/{ME_NUTRITION.meals.length} logged
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {ME_NUTRITION.meals.map((meal, idx) => {
              const logged = !!daily.mealsDone[meal.id];
              const MealIcon = idx === 0 ? Sun : Moon;
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Card className={cn("overflow-hidden transition-colors", logged && "border-success/50")}>
                    <div className="flex items-center justify-between gap-3 p-4 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-soft text-purple">
                          <MealIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-[18px] font-bold tracking-tight">{meal.title}</h3>
                            <AnimatePresence>
                              {logged && (
                                <motion.span
                                  key="c"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-white"
                                >
                                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <p className="text-xs text-muted-foreground">{meal.time}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="rounded-full bg-purple-soft px-2.5 py-0.5 text-[11px] font-semibold text-purple">
                          ~{meal.kcal} kcal
                        </span>
                        <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-[11px] font-semibold text-success">
                          {meal.protein}g protein
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-border px-4 pt-3">
                      {meal.components.map((c) => (
                        <div key={c.label} className="flex items-center gap-2.5 text-[13px]">
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[c.label] ?? "bg-primary")} />
                          <span className="w-12 shrink-0 font-semibold">{c.label}</span>
                          <span className="truncate text-muted-foreground">{c.options.join(", ")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 pt-3">
                      <button
                        onClick={() => toggleMeal(meal)}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-colors tap-scale",
                          logged ? "bg-success text-white" : "bg-primary-soft text-primary"
                        )}
                      >
                        {logged ? (
                          <>
                            <Check className="h-4 w-4" strokeWidth={3} /> Meal logged
                          </>
                        ) : (
                          <>
                            <ClipboardCheck className="h-4 w-4" /> Log meal
                          </>
                        )}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Daily targets */}
          <Card className="p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Flame className="h-3.5 w-3.5" />
              </span>
              Daily targets
            </h3>
            <div className="grid grid-cols-3 divide-x divide-border">
              <TargetStat icon={Flame} tone="bg-orange-soft text-orange" label="Calories" value={formatNumber(t.calories)} unit="kcal" />
              <TargetStat icon={Beef} tone="bg-success-soft text-success" label="Protein" value={`${t.protein}`} unit="g" />
              <TargetStat icon={Droplets} tone="bg-primary-soft text-primary" label="Water" value={(t.waterMl / 1000).toFixed(1)} unit="L" />
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Partner — healthy routine (no calorie pressure) */}
          <WaterCard />

          <div className="mt-1 px-1">
            <h2 className="text-[22px] font-extrabold tracking-tight">Your routine</h2>
            <p className="text-[13px] text-muted-foreground">
              Gentle habits — no counting, no pressure.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {PARTNER_NUTRITION.pillars.map((p, idx) => {
              const v = PILLAR_VISUAL[p.id] ?? { icon: Droplets, tone: "bg-primary-soft text-primary" };
              const Icon = v.icon;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Card className="flex items-center gap-3.5 p-4">
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", v.tone)}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[17px] font-bold tracking-tight">{p.title}</h3>
                      <p className="text-[13px] text-muted-foreground">{p.note}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card className="bg-primary-soft/40 p-4">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Eat balanced meals you enjoy, keep water up, and prioritise protein and veg. Movement and
              recovery matter more than any number.
            </p>
          </Card>
        </>
      )}
    </PageContainer>
  );
}

function TargetStat({
  icon: Icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: typeof Flame;
  tone: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 text-center">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-[15px] font-bold leading-none">
        {value}
        <span className="text-[11px] font-medium text-muted-foreground"> {unit}</span>
      </p>
    </div>
  );
}
