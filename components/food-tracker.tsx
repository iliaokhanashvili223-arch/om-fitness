"use client";

import * as React from "react";
import { Beef, Flame, Plus, Trash2, X, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDailyLog, useSavedFoods } from "@/lib/storage";
import { cn, formatNumber } from "@/lib/utils";

const KCAL_STEPS = [100, 250, 500];
const PROTEIN_STEPS = [10, 20, 30];

/** Me-only: quick-add calories/protein and a reusable "Saved foods" list. */
export function FoodTracker() {
  const { setValue: setDaily } = useDailyLog();
  const { value: foods, addFood, removeFood } = useSavedFoods();

  const addMacros = (kcal: number, protein: number) =>
    setDaily((d) => ({
      ...d,
      caloriesIn: Math.max(0, d.caloriesIn + kcal),
      proteinIn: Math.max(0, d.proteinIn + protein),
    }));

  // Custom quick-add inputs
  const [kcal, setKcal] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const kcalN = Math.round(Math.abs(parseInt(kcal, 10))) || 0;
  const proteinN = Math.round(Math.abs(parseInt(protein, 10))) || 0;
  const canQuickAdd = kcalN > 0 || proteinN > 0;
  const commitQuickAdd = () => {
    if (!canQuickAdd) return;
    addMacros(kcalN, proteinN);
    setKcal("");
    setProtein("");
  };

  // New saved food form
  const [formOpen, setFormOpen] = React.useState(false);
  const [fName, setFName] = React.useState("");
  const [fKcal, setFKcal] = React.useState("");
  const [fProtein, setFProtein] = React.useState("");
  const canSave = fName.trim().length > 0 && (parseInt(fKcal, 10) > 0 || parseInt(fProtein, 10) > 0);
  const saveFood = () => {
    if (!canSave) return;
    addFood(fName.trim(), Math.round(Math.abs(parseInt(fKcal, 10))) || 0, Math.round(Math.abs(parseInt(fProtein, 10))) || 0);
    setFName("");
    setFKcal("");
    setFProtein("");
    setFormOpen(false);
  };

  return (
    <>
      {/* Quick add */}
      <Card className="p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-soft text-orange">
            <Zap className="h-3.5 w-3.5" />
          </span>
          Quick add
        </h3>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-orange" /> Calories
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {KCAL_STEPS.map((n) => (
            <button
              key={n}
              onClick={() => addMacros(n, 0)}
              className="rounded-2xl bg-orange-soft py-2.5 text-[14px] font-bold text-orange tap-scale"
            >
              +{formatNumber(n)}
            </button>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
          <Beef className="h-3.5 w-3.5 text-success" /> Protein
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {PROTEIN_STEPS.map((n) => (
            <button
              key={n}
              onClick={() => addMacros(0, n)}
              className="rounded-2xl bg-success-soft py-2.5 text-[14px] font-bold text-success tap-scale"
            >
              +{n}g
            </button>
          ))}
        </div>

        {/* Custom kcal + protein */}
        <div className="mt-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="kcal"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="relative flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="protein g"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitQuickAdd()}
              className="h-11"
            />
          </div>
          <button
            onClick={commitQuickAdd}
            disabled={!canQuickAdd}
            className="h-11 rounded-2xl bg-primary px-5 text-[14px] font-bold text-white tap-scale disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </Card>

      {/* Saved foods */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">Saved foods</h3>
          <button
            onClick={() => setFormOpen((o) => !o)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold tap-scale",
              formOpen ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary"
            )}
          >
            {formOpen ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {formOpen ? "Close" : "New food"}
          </button>
        </div>

        {formOpen && (
          <div className="mt-3 space-y-2 rounded-2xl bg-muted/50 p-3">
            <Input
              type="text"
              placeholder="Food name (e.g. Tuna can)"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              className="h-11"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="kcal"
                value={fKcal}
                onChange={(e) => setFKcal(e.target.value)}
                className="h-11 flex-1"
              />
              <Input
                type="number"
                inputMode="numeric"
                placeholder="protein g"
                value={fProtein}
                onChange={(e) => setFProtein(e.target.value)}
                className="h-11 flex-1"
              />
              <button
                onClick={saveFood}
                disabled={!canSave}
                className="h-11 rounded-2xl bg-primary px-5 text-[14px] font-bold text-white tap-scale disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-2">
          {foods.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-muted-foreground">
              No saved foods yet — add one above.
            </p>
          ) : (
            foods.map((f) => (
              <div key={f.id} className="flex items-center gap-2.5 rounded-2xl border border-border bg-card p-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{f.name}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {formatNumber(f.kcal)} kcal · {f.protein}g protein
                  </p>
                </div>
                <button
                  onClick={() => addMacros(f.kcal, f.protein)}
                  className="flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-[13px] font-bold text-primary tap-scale"
                  aria-label={`Add ${f.name}`}
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
                <button
                  onClick={() => removeFood(f.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-danger-soft hover:text-danger tap-scale"
                  aria-label={`Delete ${f.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}
