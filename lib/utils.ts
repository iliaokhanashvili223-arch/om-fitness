import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes intelligently (dedupes conflicts). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Local date key like "2026-07-07" (device local time, not UTC). */
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Weekday index in a Mon–Sun program (Mon = 0 ... Sun = 6). */
export function programDayIndex(date: Date = new Date()): number {
  return (date.getDay() + 6) % 7;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Whole number with thousands separators, ALWAYS en-US. Using an explicit
 * locale keeps output identical on the server (Node) and every device — a bare
 * `toLocaleString()` renders "2.100" / "2 100" on non-US locales and causes SSR
 * hydration mismatches. Use this for every displayed count (kcal, steps, …).
 */
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

/** Decimal hours → "7h 12m" (drops the minutes when it lands on the hour: "8h"). */
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Rough walking distance in km from a step count, using a height-based stride
 * (step length ≈ 0.415 × height). Estimate only — steps are entered manually.
 */
export function stepsToKm(steps: number, heightCm: number): number {
  const strideM = (0.415 * (heightCm || 170)) / 100; // metres per step
  return (steps * strideM) / 1000;
}

/** Format a km distance for display: "1.2 km" (2 decimals under 10 km). */
export function formatDistanceKm(km: number): string {
  return `${km < 10 ? km.toFixed(2) : km.toFixed(1)} km`;
}

/**
 * Extract a YouTube video ID from any common form — a full watch URL, a
 * youtu.be short link, an /embed/ or /shorts/ URL, or a bare 11-char ID.
 * Returns null when nothing usable is found.
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const value = input.trim();

  // Already a bare video id (YouTube ids are 11 URL-safe characters).
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/, // watch?v=ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/, // youtu.be/ID
    /\/embed\/([a-zA-Z0-9_-]{11})/, // /embed/ID
    /\/shorts\/([a-zA-Z0-9_-]{11})/, // /shorts/ID
  ];

  for (const re of patterns) {
    const match = value.match(re);
    if (match) return match[1];
  }

  return null;
}
