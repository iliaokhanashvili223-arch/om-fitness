/**
 * Fitness OS — static program & nutrition data (per profile).
 *
 * EDIT ME: everything a person trains and eats lives here.
 *  - Workouts: ME_PROGRAM (calisthenics) and PARTNER_PROGRAM (pilates).
 *  - Nutrition: ME_NUTRITION (2-meal cut) and PARTNER_NUTRITION (healthy routine).
 *
 * VIDEOS: exercises are matched to real YouTube tutorials by name via the
 * `exerciseVideos` map below. `withVideos()` attaches a derived `video` object
 * (videoUrl / embedUrl / thumbnailUrl / videoSource) to every exercise, so an
 * exercise that appears on several days automatically reuses the same clip.
 * Anything without a mapped video falls back to a neutral placeholder so the
 * thumbnail and embed always render.
 */

import { extractYouTubeId } from "@/lib/utils";
import type { ProfileId } from "@/lib/profiles";

export type VideoSource = "YouTube";

/**
 * A resolved tutorial for an exercise. Two kinds:
 *  - "embed"  — a specific YouTube clip: it plays inline in the video modal.
 *  - "search" — no specific clip on file: the card shows a branded thumbnail and
 *               the modal opens a YouTube search (e.g. Eva's Pilates) via
 *               `videoUrl`. This is how every Partner Pilates move resolves so it
 *               always surfaces Eva's Pilates videos — swap in a specific URL any
 *               time (see `exerciseVideos` below) to get inline playback instead.
 *
 * videoUrl / embedUrl / thumbnailUrl are always present (empty string when N/A)
 * so UI code can read them without extra guards.
 */
export type ExerciseVideo = {
  kind: "embed" | "search";
  videoId: string;
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  videoSource: VideoSource;
  /** Only for kind === "search": the query used to open YouTube. */
  query?: string;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  /** Optional override for the "sets × reps" line (e.g. "2 rounds"). */
  scheme?: string;
  targetMuscle: string;
  /** Colored muscle tag pills; falls back to targetMuscle split on commas. */
  tags?: string[];
  cues: string[];
  /** Resolved YouTube tutorial (thumbnail + embed + watch link). */
  video: ExerciseVideo;
  /** "sets" = per-set checkboxes (strength); "flow" = single done toggle (pilates). */
  track?: "sets" | "flow";
  note?: string;
};

export type WorkoutDay = {
  id: string;
  weekday: string;
  title: string;
  subtitle: string;
  focus: string[];
  /** minutes, rough estimate */
  duration: number;
  /** conditioning circuits repeat the exercise list N rounds */
  rounds?: number;
  exercises: Exercise[];
};

export type RestDay = {
  weekday: string;
  title: string;
  subtitle: string;
  suggestions: string[];
};

/* ============================== EXERCISE VIDEOS =========================== */

/**
 * Name → specific YouTube tutorial (inline embed). Matched case-insensitively
 * (see videoForName), so "Pull-ups" in the program resolves to the "Pull-Ups"
 * entry here. Reuse the same entry for an exercise that appears on more days.
 *
 * EDIT ME to change a clip, or add a new "Exercise Name": { videoUrl } entry.
 * Any exercise NOT listed here falls back to a YouTube *search* instead of a
 * wrong clip — for Partner Pilates that search is "Eva Pilates <exercise>", so
 * her videos always show up. Add a Partner entry here to embed a specific Eva
 * video inline.
 */
const exerciseVideos: Record<string, { videoUrl: string; videoId: string }> = {
  // ME — PULL
  "Pull-Ups": { videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g", videoId: "eGo4IYlbE5g" },
  "Chin-Ups": { videoUrl: "https://www.youtube.com/watch?v=e1YSApl-QcM", videoId: "e1YSApl-QcM" },
  "Archer Pull-Up Progression": { videoUrl: "https://www.youtube.com/watch?v=_LGLKUiQH5k", videoId: "_LGLKUiQH5k" },
  "Slow Negative Pull-Ups": { videoUrl: "https://www.youtube.com/watch?v=gbPURTSxQLY", videoId: "gbPURTSxQLY" },
  "Hanging Leg Raises": { videoUrl: "https://www.youtube.com/watch?v=9CDyRwTn-2Y", videoId: "9CDyRwTn-2Y" },
  "Dead Hang": { videoUrl: "https://www.youtube.com/watch?v=NUv1WpYA_x8", videoId: "NUv1WpYA_x8" },

  // ME — PUSH
  "Decline Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=SKPab2YC8BE", videoId: "SKPab2YC8BE" },
  "Pseudo Planche Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=i-gSmqe9tNw", videoId: "i-gSmqe9tNw" },
  "Pike Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=3r3tvRF1tVA", videoId: "3r3tvRF1tVA" },
  "Diamond Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=J0DnG1_S92I", videoId: "J0DnG1_S92I" },
  "Chair Dips": { videoUrl: "https://www.youtube.com/watch?v=AWz_7B1cch0", videoId: "AWz_7B1cch0" },
  "Push-Up Finisher": { videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4", videoId: "IODxDxX7oi4" },

  // ME — LEGS + CORE
  "Assisted Pistol Squats": { videoUrl: "https://www.youtube.com/watch?v=tiA23NSUm7A", videoId: "tiA23NSUm7A" },
  "Bulgarian Split Squats": { videoUrl: "https://www.youtube.com/watch?v=2C-uNgKwPLE", videoId: "2C-uNgKwPLE" },
  "Jump Squats": { videoUrl: "https://www.youtube.com/watch?v=AD9nF5fFdnY", videoId: "AD9nF5fFdnY" },
  "Walking Lunges": { videoUrl: "https://www.youtube.com/watch?v=vYfp2t4XgqQ", videoId: "vYfp2t4XgqQ" },
  "Single-Leg Calf Raises": { videoUrl: "https://www.youtube.com/watch?v=qPd73snQfUs", videoId: "qPd73snQfUs" },
  "Hanging Knee Raises": { videoUrl: "https://www.youtube.com/watch?v=G6a5267YpHM", videoId: "G6a5267YpHM" },
  "Plank": { videoUrl: "https://www.youtube.com/watch?v=A2b2EmIg0dA", videoId: "A2b2EmIg0dA" },

  // ME — CONDITIONING
  "Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4", videoId: "IODxDxX7oi4" },
  "Squats": { videoUrl: "https://www.youtube.com/watch?v=m0GcZ24pK6k", videoId: "m0GcZ24pK6k" },
  "Burpees": { videoUrl: "https://www.youtube.com/watch?v=qLBImHhCXSw", videoId: "qLBImHhCXSw" },
  "Mountain Climbers": { videoUrl: "https://www.youtube.com/watch?v=cnyTQDSE884", videoId: "cnyTQDSE884" },

  // PARTNER — PILATES
  // Left intentionally empty: every Pilates move resolves to an "Eva Pilates
  // <move>" YouTube search (see partnerFallbackQuery) so her videos always show.
  // To pin a specific Eva clip inline, add e.g.
  //   "The Hundred": { videoUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX", videoId: "XXXXXXXXXXX" },
};

/** Inline-playable clip from a YouTube id (+ optional canonical watch URL). */
export function makeEmbedVideo(videoId: string, videoUrl?: string): ExerciseVideo {
  return {
    kind: "embed",
    videoId,
    videoUrl: videoUrl ?? `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    videoSource: "YouTube",
  };
}

/** A "search on YouTube" tutorial — no inline clip, opens results for `query`. */
export function makeSearchVideo(query: string): ExerciseVideo {
  return {
    kind: "search",
    videoId: "",
    videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    embedUrl: "",
    thumbnailUrl: "",
    videoSource: "YouTube",
    query,
  };
}

// Case-insensitive index so "Pull-ups" and "Pull-Ups" resolve to the same clip.
const videoByLowerName = new Map(
  Object.entries(exerciseVideos).map(([name, v]) => [name.toLowerCase(), v] as const)
);

/**
 * Resolve an exercise name to its tutorial. Uses the specific clip from
 * `exerciseVideos` when one exists; otherwise falls back to a YouTube search
 * built by `fallbackQuery` (so nothing ever shows a wrong/placeholder clip).
 */
function videoForName(name: string, fallbackQuery: (name: string) => string): ExerciseVideo {
  const mapped = videoByLowerName.get(name.trim().toLowerCase());
  if (mapped) {
    const id = extractYouTubeId(mapped.videoUrl) ?? mapped.videoId;
    return makeEmbedVideo(id, mapped.videoUrl);
  }
  return makeSearchVideo(fallbackQuery(name));
}

/* ------------------------------ authoring types --------------------------- */

/** Exercises are authored without `video`; withVideos() attaches it by name. */
type ExerciseInput = Omit<Exercise, "video">;
type WorkoutDayInput = Omit<WorkoutDay, "exercises"> & { exercises: ExerciseInput[] };

/** Search query for a Me/calisthenics move that has no specific clip on file. */
const meFallbackQuery = (name: string) => `${name} calisthenics tutorial`;
/** Search query for a Partner move — always surfaces Eva's Pilates videos. */
const partnerFallbackQuery = (name: string) => `Eva Pilates ${name}`;

/** Attach a resolved `video` to every exercise, matched by name. */
function withVideos(
  days: WorkoutDayInput[],
  fallbackQuery: (name: string) => string
): WorkoutDay[] {
  return days.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => ({ ...ex, video: videoForName(ex.name, fallbackQuery) })),
  }));
}

/* ============================ ME — CALISTHENICS ============================ */

const ME_PROGRAM_RAW: WorkoutDayInput[] = [
  {
    id: "pull",
    weekday: "Monday",
    title: "Pull",
    subtitle: "Back, biceps & grip",
    focus: ["Back", "Biceps", "Grip"],
    duration: 55,
    exercises: [
      {
        id: "pull-ups",
        name: "Pull-ups",
        sets: 5,
        reps: "6–10",
        targetMuscle: "Lats, mid-back",
        tags: ["Back", "Lats"],
        cues: ["Dead hang start", "Elbows to ribs", "Control the descent"],
      },
      {
        id: "chin-ups",
        name: "Chin-ups",
        sets: 4,
        reps: "8–12",
        targetMuscle: "Biceps, lats",
        tags: ["Biceps", "Lats"],
        cues: ["Supinated grip", "Squeeze at top", "Full stretch"],
      },
      {
        id: "archer-pull-ups",
        name: "Archer Pull-up Progression",
        sets: 3,
        reps: "4–8",
        targetMuscle: "Lats, unilateral strength",
        tags: ["Back", "Lats"],
        cues: ["Pull to one hand", "Keep other arm long", "Alternate sides"],
      },
      {
        id: "negative-pull-ups",
        name: "Slow Negative Pull-ups",
        sets: 3,
        reps: "5 reps",
        targetMuscle: "Lats, eccentric control",
        tags: ["Back", "Control"],
        cues: ["Jump to the top", "Lower 4–5 sec", "Stay tight"],
      },
      {
        id: "hanging-leg-raises",
        name: "Hanging Leg Raises",
        sets: 4,
        reps: "10–15",
        targetMuscle: "Lower abs, hip flexors",
        tags: ["Core", "Abs"],
        cues: ["Brace first", "Raise to parallel", "Lower slow"],
      },
      {
        id: "dead-hang",
        name: "Dead Hang",
        sets: 2,
        reps: "Max time",
        targetMuscle: "Grip, shoulders",
        tags: ["Grip"],
        cues: ["Shoulders active", "Breathe steady", "Log best time"],
      },
    ],
  },
  {
    id: "push",
    weekday: "Tuesday",
    title: "Push",
    subtitle: "Chest, shoulders & triceps",
    focus: ["Chest", "Shoulders", "Triceps"],
    duration: 50,
    exercises: [
      {
        id: "decline-push-ups",
        name: "Decline Push-Ups",
        sets: 4,
        reps: "12–20",
        targetMuscle: "Upper chest, shoulders",
        tags: ["Chest", "Shoulders", "Triceps"],
        cues: ["Slow eccentric", "Elbows 45°", "Full lockout"],
      },
      {
        id: "pseudo-planche-push-ups",
        name: "Pseudo Planche Push-Ups",
        sets: 4,
        reps: "8–12",
        targetMuscle: "Chest, anterior delts",
        tags: ["Chest", "Shoulders", "Triceps"],
        cues: ["Lean forward", "Rigid core", "Shoulders protracted"],
      },
      {
        id: "pike-push-ups",
        name: "Pike Push-Ups",
        sets: 4,
        reps: "8–15",
        targetMuscle: "Shoulders, triceps",
        tags: ["Shoulders", "Triceps"],
        cues: ["Hips high", "Head forward", "Press vertical"],
      },
      {
        id: "diamond-push-ups",
        name: "Diamond Push-Ups",
        sets: 3,
        reps: "12–20",
        targetMuscle: "Triceps, inner chest",
        tags: ["Chest", "Triceps"],
        cues: ["Close grip", "Squeeze triceps", "Control tempo"],
      },
      {
        id: "chair-dips",
        name: "Chair Dips",
        sets: 3,
        reps: "12–20",
        targetMuscle: "Triceps, lower chest",
        tags: ["Chest", "Triceps"],
        cues: ["Keep chest high", "Control descent", "Full lockout"],
      },
      {
        id: "push-up-finisher",
        name: "Push-Up Finisher",
        sets: 1,
        reps: "To near failure",
        targetMuscle: "Chest, full push",
        tags: ["Chest"],
        cues: ["Perfect form", "Stop before breakdown"],
      },
    ],
  },
  {
    id: "legs-core",
    weekday: "Wednesday",
    title: "Legs + Core",
    subtitle: "Quads, glutes & abs",
    focus: ["Legs", "Glutes", "Core"],
    duration: 55,
    exercises: [
      {
        id: "assisted-pistol-squats",
        name: "Assisted Pistol Squats",
        sets: 5,
        reps: "6–10 / leg",
        targetMuscle: "Quads, glutes, balance",
        tags: ["Legs", "Glutes"],
        cues: ["Hold for balance", "Sit back & down", "Heel planted"],
      },
      {
        id: "bulgarian-split-squats",
        name: "Bulgarian Split Squats",
        sets: 4,
        reps: "10–15 / leg",
        targetMuscle: "Quads, glutes",
        tags: ["Legs", "Glutes"],
        cues: ["Rear foot elevated", "Drop straight down", "Drive front heel"],
      },
      {
        id: "jump-squats",
        name: "Jump Squats",
        sets: 3,
        reps: "15",
        targetMuscle: "Explosive legs",
        tags: ["Legs", "Power"],
        cues: ["Squat to parallel", "Land soft", "Reset if needed"],
      },
      {
        id: "walking-lunges",
        name: "Walking Lunges",
        sets: 3,
        reps: "20 steps",
        targetMuscle: "Quads, glutes",
        tags: ["Legs", "Glutes"],
        cues: ["Long stride", "Knee taps floor", "Push front heel"],
      },
      {
        id: "single-leg-calf-raises",
        name: "Single-leg Calf Raises",
        sets: 5,
        reps: "20",
        targetMuscle: "Calves",
        tags: ["Calves"],
        cues: ["Full height", "Pause at top", "Slow stretch"],
      },
      {
        id: "hanging-knee-raises",
        name: "Hanging Knee Raises",
        sets: 3,
        reps: "15",
        targetMuscle: "Lower abs",
        tags: ["Core", "Abs"],
        cues: ["Brace core", "Knees to chest", "No momentum"],
      },
      {
        id: "plank",
        name: "Plank",
        sets: 3,
        reps: "60 sec",
        targetMuscle: "Core, anti-extension",
        tags: ["Core"],
        cues: ["Elbows under shoulders", "Squeeze glutes", "Flat back"],
      },
    ],
  },
  {
    id: "upper-volume",
    weekday: "Thursday",
    title: "Upper Volume",
    subtitle: "High-rep push & pull",
    focus: ["Back", "Chest", "Shoulders"],
    duration: 45,
    exercises: [
      {
        id: "pull-ups-volume",
        name: "Pull-ups",
        sets: 4,
        reps: "Max reps",
        targetMuscle: "Lats, back",
        tags: ["Back", "Lats"],
        cues: ["Clean reps only", "Full dead hang", "Log total reps"],
      },
      {
        id: "push-ups-volume",
        name: "Push-ups",
        sets: 4,
        reps: "20–30",
        targetMuscle: "Chest, triceps",
        tags: ["Chest", "Triceps"],
        cues: ["Straight line", "Chest to floor", "Steady tempo"],
      },
      {
        id: "chin-ups-volume",
        name: "Chin-ups",
        sets: 3,
        reps: "Max reps",
        targetMuscle: "Biceps, lats",
        tags: ["Biceps", "Lats"],
        cues: ["Supinated grip", "Squeeze top", "Control negative"],
      },
      {
        id: "pike-push-ups-volume",
        name: "Pike Push-ups",
        sets: 3,
        reps: "10–15",
        targetMuscle: "Shoulders",
        tags: ["Shoulders"],
        cues: ["Inverted V", "Head between hands", "Press tall"],
      },
      {
        id: "diamond-push-ups-volume",
        name: "Diamond Push-ups",
        sets: 3,
        reps: "15",
        targetMuscle: "Triceps",
        tags: ["Triceps"],
        cues: ["Diamond hands", "Elbows tucked", "Full range"],
      },
      {
        id: "hanging-leg-raises-volume",
        name: "Hanging Leg Raises",
        sets: 3,
        reps: "15",
        targetMuscle: "Lower abs",
        tags: ["Core", "Abs"],
        cues: ["Brace first", "Legs to parallel", "Slow down"],
      },
    ],
  },
  {
    id: "conditioning",
    weekday: "Friday",
    title: "Conditioning",
    subtitle: "5 rounds for time",
    focus: ["Full body", "Cardio"],
    duration: 35,
    rounds: 5,
    exercises: [
      {
        id: "cond-pull-ups",
        name: "Pull-ups",
        sets: 5,
        reps: "8 / round",
        targetMuscle: "Back",
        tags: ["Back"],
        cues: ["Break sets if needed", "Quality pulls"],
      },
      {
        id: "cond-push-ups",
        name: "Push-ups",
        sets: 5,
        reps: "20 / round",
        targetMuscle: "Chest",
        tags: ["Chest"],
        cues: ["Drop to knees to keep moving"],
      },
      {
        id: "cond-squats",
        name: "Squats",
        sets: 5,
        reps: "20 / round",
        targetMuscle: "Legs",
        tags: ["Legs"],
        cues: ["Full depth", "Chest up"],
      },
      {
        id: "cond-burpees",
        name: "Burpees",
        sets: 5,
        reps: "10 / round",
        targetMuscle: "Full body",
        tags: ["Full body"],
        cues: ["Chest to floor", "Pace yourself"],
      },
      {
        id: "cond-mountain-climbers",
        name: "Mountain Climbers",
        sets: 5,
        reps: "30 / round",
        targetMuscle: "Core, cardio",
        tags: ["Core", "Cardio"],
        cues: ["Drive knees fast", "Flat back"],
      },
    ],
  },
];

export const ME_PROGRAM: WorkoutDay[] = withVideos(ME_PROGRAM_RAW, meFallbackQuery);

export const ME_REST_DAYS: RestDay[] = [
  {
    weekday: "Saturday",
    title: "Active Recovery",
    subtitle: "Walk, stretch, breathe",
    suggestions: ["30–45 min easy walk", "10 min full-body mobility", "Hit your step goal"],
  },
  {
    weekday: "Sunday",
    title: "Rest & Mobility",
    subtitle: "Recover for the week ahead",
    suggestions: ["Long walk outdoors", "Hip & shoulder mobility flow", "Foam roll / stretch"],
  },
];

/* ============================== PARTNER — PILATES ========================== */

const flow = (e: Omit<ExerciseInput, "track">): ExerciseInput => ({
  ...e,
  track: "flow",
});

const PARTNER_PROGRAM_RAW: WorkoutDayInput[] = [
  {
    id: "p-core",
    weekday: "Monday",
    title: "Pilates Core",
    subtitle: "Deep core & breath",
    focus: ["Core", "Breath", "Stability"],
    duration: 30,
    exercises: [
      flow({ id: "pc-hundred", name: "The Hundred", sets: 3, reps: "40 sec", targetMuscle: "Deep core", tags: ["Core"], cues: ["Imprint spine", "Controlled breathing"] }),
      flow({ id: "pc-rollup", name: "Roll-Up", sets: 3, reps: "10", targetMuscle: "Abdominals", tags: ["Core"], cues: ["Articulate spine", "Slow descent"] }),
      flow({ id: "pc-deadbug", name: "Dead Bug", sets: 3, reps: "12", targetMuscle: "Core control", tags: ["Core"], cues: ["Ribs down", "Move opposite limbs"] }),
      flow({ id: "pc-plank", name: "Forearm Plank", sets: 3, reps: "40 sec", targetMuscle: "Core, shoulders", tags: ["Core"], cues: ["Long spine", "Squeeze glutes"] }),
      flow({ id: "pc-toetaps", name: "Toe Taps", sets: 3, reps: "12", targetMuscle: "Lower abs", tags: ["Core"], cues: ["Stable pelvis", "Tap lightly"] }),
    ],
  },
  {
    id: "p-flow",
    weekday: "Tuesday",
    title: "Pilates Flow",
    subtitle: "Core, glutes, posture & mobility",
    focus: ["Core", "Glutes", "Mobility", "Posture"],
    duration: 35,
    exercises: [
      flow({ id: "pf-hundred", name: "The Hundred", sets: 3, reps: "40 sec", targetMuscle: "Deep core", tags: ["Core"], cues: ["Imprint spine", "Controlled breathing"] }),
      flow({ id: "pf-rollup", name: "Roll-Up", sets: 3, reps: "10", targetMuscle: "Abdominals", tags: ["Core"], cues: ["Articulate spine", "Slow descent"] }),
      flow({ id: "pf-glutebridge", name: "Glute Bridge", sets: 3, reps: "15", targetMuscle: "Glutes, hamstrings", tags: ["Glutes"], cues: ["Squeeze glutes", "Keep ribs down"] }),
      flow({ id: "pf-sidelying", name: "Side-Lying Leg Series", sets: 3, reps: "12 each side", targetMuscle: "Hips, glute med", tags: ["Hips"], cues: ["Long legs", "Stable pelvis"] }),
      flow({ id: "pf-catcow", name: "Cat-Cow + Thread the Needle", sets: 2, reps: "rounds", scheme: "2 rounds", targetMuscle: "Spine, upper back", tags: ["Mobility"], cues: ["Move slowly", "Open upper back"] }),
    ],
  },
  {
    id: "p-mobility",
    weekday: "Wednesday",
    title: "Mobility Flow",
    subtitle: "Open & lengthen",
    focus: ["Mobility", "Posture", "Spine"],
    duration: 30,
    exercises: [
      flow({ id: "pm-catcow", name: "Cat-Cow", sets: 2, reps: "10", targetMuscle: "Spine", tags: ["Mobility"], cues: ["Segment the spine", "Match your breath"] }),
      flow({ id: "pm-thread", name: "Thread the Needle", sets: 2, reps: "8 each side", targetMuscle: "Upper back", tags: ["Mobility"], cues: ["Reach long", "Rotate from ribs"] }),
      flow({ id: "pm-spinetwist", name: "Seated Spine Twist", sets: 2, reps: "10", targetMuscle: "Obliques, spine", tags: ["Posture"], cues: ["Grow tall first", "Turn on exhale"] }),
      flow({ id: "pm-hipopener", name: "Hip Openers", sets: 2, reps: "8 each side", targetMuscle: "Hips", tags: ["Hips"], cues: ["Move slow", "Breathe into the stretch"] }),
      flow({ id: "pm-child", name: "Child's Pose Reach", sets: 1, reps: "60 sec", targetMuscle: "Back, hips", tags: ["Mobility"], cues: ["Sink the hips", "Walk hands wide"] }),
    ],
  },
  {
    id: "p-lower",
    weekday: "Thursday",
    title: "Lower Body Pilates",
    subtitle: "Glutes, legs & control",
    focus: ["Glutes", "Legs", "Balance"],
    duration: 35,
    exercises: [
      flow({ id: "pl-glutebridge", name: "Glute Bridge", sets: 3, reps: "15", targetMuscle: "Glutes", tags: ["Glutes"], cues: ["Squeeze glutes", "Keep ribs down"] }),
      flow({ id: "pl-clamshell", name: "Clamshells", sets: 3, reps: "15 each side", targetMuscle: "Glute med", tags: ["Glutes"], cues: ["Stack the hips", "Open from the knee"] }),
      flow({ id: "pl-sidelying", name: "Side-Lying Leg Series", sets: 3, reps: "12 each side", targetMuscle: "Hips, glutes", tags: ["Hips"], cues: ["Long legs", "Stable pelvis"] }),
      flow({ id: "pl-circles", name: "Single-Leg Circles", sets: 2, reps: "8 each side", targetMuscle: "Hip control", tags: ["Legs"], cues: ["Small circles", "Pelvis still"] }),
      flow({ id: "pl-balance", name: "Standing Balance", sets: 2, reps: "30 sec each", targetMuscle: "Balance, ankles", tags: ["Balance"], cues: ["Soft knee", "Gaze fixed"] }),
    ],
  },
  {
    id: "p-full",
    weekday: "Friday",
    title: "Full Body Flow",
    subtitle: "Total-body pilates flow",
    focus: ["Full body", "Core", "Mobility"],
    duration: 40,
    exercises: [
      flow({ id: "pfb-hundred", name: "The Hundred", sets: 3, reps: "40 sec", targetMuscle: "Deep core", tags: ["Core"], cues: ["Imprint spine", "Steady breath"] }),
      flow({ id: "pfb-rollup", name: "Roll-Up", sets: 3, reps: "10", targetMuscle: "Abdominals", tags: ["Core"], cues: ["Articulate spine", "Slow descent"] }),
      flow({ id: "pfb-glutebridge", name: "Glute Bridge", sets: 3, reps: "15", targetMuscle: "Glutes", tags: ["Glutes"], cues: ["Squeeze glutes", "Ribs down"] }),
      flow({ id: "pfb-plankpike", name: "Plank to Pike", sets: 3, reps: "10", targetMuscle: "Core, shoulders", tags: ["Core"], cues: ["Lift from the core", "Long arms"] }),
      flow({ id: "pfb-catcow", name: "Cat-Cow", sets: 2, reps: "10", targetMuscle: "Spine", tags: ["Mobility"], cues: ["Move slowly", "Open the back"] }),
    ],
  },
];

export const PARTNER_PROGRAM: WorkoutDay[] = withVideos(PARTNER_PROGRAM_RAW, partnerFallbackQuery);

export const PARTNER_REST_DAYS: RestDay[] = [
  {
    weekday: "Saturday",
    title: "Stretch & Recovery",
    subtitle: "Gentle mobility & breath",
    suggestions: ["15 min full-body stretch", "Slow walk outdoors", "5 min breathing"],
  },
  {
    weekday: "Sunday",
    title: "Rest",
    subtitle: "Let the body recharge",
    suggestions: ["Easy walk if you feel like it", "Light stretching", "Early night"],
  },
];

/* ------------------------------- Accessors -------------------------------- */

export function getProgram(profile: ProfileId): WorkoutDay[] {
  return profile === "partner" ? PARTNER_PROGRAM : ME_PROGRAM;
}

export function getRestDays(profile: ProfileId): RestDay[] {
  return profile === "partner" ? PARTNER_REST_DAYS : ME_REST_DAYS;
}

/** Program day for a Mon-based index (0–4), or null for the weekend. */
export function workoutForDayIndex(profile: ProfileId, index: number): WorkoutDay | null {
  return getProgram(profile)[index] ?? null;
}

export function findWorkout(profile: ProfileId, dayId: string): WorkoutDay | undefined {
  return getProgram(profile).find((d) => d.id === dayId);
}

/* ------------------------------- Nutrition -------------------------------- */

export type Meal = {
  id: string;
  title: string;
  time: string;
  kcal: number;
  protein: number;
  components: { label: string; options: string[] }[];
};

export const ME_NUTRITION = {
  calories: { min: 2000, max: 2200 },
  protein: { min: 140, max: 160 },
  waterLiters: { min: 2.5, max: 3 },
  meals: [
    {
      id: "meal-1",
      title: "Meal 1",
      time: "Around midday",
      kcal: 1050,
      protein: 75,
      components: [
        { label: "Protein", options: ["Chicken", "Turkey", "Fish", "Eggs"] },
        { label: "Carbs", options: ["Rice", "Potatoes"] },
        { label: "Veg", options: ["Mixed vegetables", "Salad greens"] },
        { label: "Fat", options: ["Olive oil (1 tbsp)"] },
      ],
    },
    {
      id: "meal-2",
      title: "Meal 2",
      time: "Evening",
      kcal: 1050,
      protein: 75,
      components: [
        { label: "Protein", options: ["Lean meat", "Fish", "Eggs", "Greek yogurt", "Cottage cheese"] },
        { label: "Carbs", options: ["Rice", "Potatoes"] },
        { label: "Veg", options: ["Mixed vegetables", "Salad greens"] },
      ],
    },
  ] as Meal[],
};

export type NutritionPillar = { id: string; title: string; note: string };

export const PARTNER_NUTRITION = {
  waterLiters: { min: 2, max: 2.5 },
  pillars: [
    { id: "hydration", title: "Hydration", note: "Sip water steadily through the day." },
    { id: "balanced", title: "Balanced meals", note: "Protein, veg and whole-food carbs." },
    { id: "protein", title: "Protein support", note: "A protein source at each meal." },
    { id: "energy", title: "Energy", note: "Eat enough to feel strong and light." },
  ] as NutritionPillar[],
};

/** Back-compat alias used by anything still importing NUTRITION. */
export const NUTRITION = ME_NUTRITION;
export const PROGRAM = ME_PROGRAM;
export const REST_DAYS = ME_REST_DAYS;
