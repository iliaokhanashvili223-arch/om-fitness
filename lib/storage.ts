"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { dateKey } from "@/lib/utils";
import { useProfile } from "@/components/profile-provider";
import { PROFILES, type ProfileId } from "@/lib/profiles";

/* ----------------------------- Types & defaults ---------------------------- */

export type Settings = {
  name: string;
  heightCm: number;
  weightKg: number;
  goal: string;
};

/** Per-profile default settings, seeded from lib/profiles.ts. */
export function defaultSettings(profile: ProfileId): Settings {
  const s = PROFILES[profile].settings;
  return {
    name: s.name,
    heightCm: s.heightCm,
    weightKg: s.weightKg,
    goal: s.goal,
  };
}

export type WeightEntry = { date: string; kg: number };

export type WorkoutRecord = { date: string; dayId: string; title: string };

/** Set-completion map for a session: { [exerciseId]: boolean[] } */
export type SessionProgress = Record<string, boolean[]>;

/* ------------------------------- Storage keys ------------------------------ */
/* Every key is namespaced by profile so "Me" and "Partner" never collide. */

const KEYS = {
  settings: (p: ProfileId) => `fos:${p}:settings`,
  weights: (p: ProfileId) => `fos:${p}:weights`,
  workouts: (p: ProfileId) => `fos:${p}:workouts`,
  session: (p: ProfileId, d: string, dayId: string) => `fos:${p}:session:${d}:${dayId}`,
};

/* ------------------------------ Core LS hook ------------------------------- */

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/*
 * Same-tab sync bus. The browser's native `storage` event only fires in OTHER
 * tabs, so two hooks on the same key in ONE tab would drift and clobber each
 * other's fields. This registry lets every write notify sibling instances of the
 * same key in-tab.
 */
const busListeners = new Map<string, Set<(raw: string) => void>>();
function busNotify(key: string, raw: string, except: (raw: string) => void) {
  const set = busListeners.get(key);
  if (!set) return;
  set.forEach((fn) => {
    if (fn !== except) fn(raw);
  });
}

/**
 * SSR-safe localStorage state. First render (server + client) uses `initial`
 * so hydration matches; the stored value is loaded in an effect after mount.
 * Re-reads whenever `key` changes (e.g. switching profile). `ready` flips true
 * once we've read from storage. All hook instances on the same key stay in sync
 * within the tab (via the bus above) and across tabs (via the `storage` event).
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  // Last serialized value this instance knows about — guards against write/echo
  // loops so a broadcast we just applied doesn't re-broadcast itself.
  const rawRef = useRef<string>("");

  // Load from storage on mount / key change.
  useEffect(() => {
    const raw = readRaw(key);
    if (raw !== null) {
      try {
        setValue(JSON.parse(raw) as T);
        rawRef.current = raw;
      } catch {
        rawRef.current = "";
      }
    } else {
      setValue(initial);
      rawRef.current = "";
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist + broadcast when our value changes (skip echoes of applied broadcasts).
  useEffect(() => {
    if (!ready) return;
    const raw = JSON.stringify(value);
    if (raw === rawRef.current) return;
    rawRef.current = raw;
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      /* storage full or unavailable — ignore */
    }
    busNotify(key, raw, applyRef.current);
  }, [key, value, ready]);

  // Stable listener that applies an incoming raw value to our state.
  const applyRef = useRef<(raw: string) => void>(() => {});
  useEffect(() => {
    const apply = (raw: string) => {
      if (raw === rawRef.current) return;
      rawRef.current = raw;
      try {
        setValue(JSON.parse(raw) as T);
      } catch {
        /* ignore malformed */
      }
    };
    applyRef.current = apply;

    let set = busListeners.get(key);
    if (!set) {
      set = new Set();
      busListeners.set(key, set);
    }
    set.add(apply);

    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue != null) apply(e.newValue);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      set!.delete(apply);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  return { value, setValue, ready };
}

/* ------------------------------ Feature hooks ------------------------------ */

export function useSettings() {
  const { profile } = useProfile();
  return useLocalStorage<Settings>(KEYS.settings(profile), defaultSettings(profile));
}

export function useWeights() {
  const { profile } = useProfile();
  const store = useLocalStorage<WeightEntry[]>(KEYS.weights(profile), []);

  const addWeight = useCallback(
    (kg: number, date: string = dateKey()) => {
      store.setValue((prev) => {
        const rest = prev.filter((e) => e.date !== date);
        return [...rest, { date, kg }].sort((a, b) => a.date.localeCompare(b.date));
      });
    },
    [store]
  );

  const removeWeight = useCallback(
    (date: string) => {
      store.setValue((prev) => prev.filter((e) => e.date !== date));
    },
    [store]
  );

  return { ...store, addWeight, removeWeight };
}

export function useWorkoutHistory() {
  const { profile } = useProfile();
  const store = useLocalStorage<WorkoutRecord[]>(KEYS.workouts(profile), []);

  const isDoneToday = useCallback(
    (dayId: string, date: string = dateKey()) =>
      store.value.some((w) => w.date === date && w.dayId === dayId),
    [store.value]
  );

  const markDone = useCallback(
    (dayId: string, title: string, date: string = dateKey()) => {
      store.setValue((prev) => {
        if (prev.some((w) => w.date === date && w.dayId === dayId)) return prev;
        return [...prev, { date, dayId, title }];
      });
    },
    [store]
  );

  const undo = useCallback(
    (dayId: string, date: string = dateKey()) => {
      store.setValue((prev) => prev.filter((w) => !(w.date === date && w.dayId === dayId)));
    },
    [store]
  );

  return { ...store, isDoneToday, markDone, undo };
}

export function useSession(dayId: string, date: string = dateKey()) {
  const { profile } = useProfile();
  return useLocalStorage<SessionProgress>(KEYS.session(profile, date, dayId), {});
}

/* ------------------------------- Derived data ------------------------------ */

/** Consecutive-day workout streak counting back from today. */
export function computeStreak(records: WorkoutRecord[]): number {
  if (records.length === 0) return 0;
  const days = new Set(records.map((r) => r.date));
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to hold if today isn't trained yet but yesterday was.
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Average of the most recent `n` weight entries. */
export function weeklyAverage(entries: WeightEntry[], n = 7): number | null {
  if (entries.length === 0) return null;
  const recent = [...entries].slice(-n);
  const sum = recent.reduce((acc, e) => acc + e.kg, 0);
  return Math.round((sum / recent.length) * 10) / 10;
}
