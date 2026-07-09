/**
 * Fitness OS — static program data (per profile).
 *
 * EDIT ME: everything a person trains lives here.
 *  - Workouts: ME_PROGRAM (calisthenics) and PARTNER_PROGRAM (Eva's Pilates routines).
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
  /** Optional override for the scheme line (e.g. "5 rounds • 20 reps"). */
  scheme?: string;
  /** Rest between sets, e.g. "2–3 min", "90 sec" (omit for supersets/finishers). */
  rest?: string;
  /** Kit needed, e.g. "Pull-up bar" or "Bodyweight". */
  equipment?: string;
  /** Tempo prescription, e.g. "5 sec down". */
  tempo?: string;
  /** Section label — supersets & finishers, e.g. "Superset A", "Finisher". */
  group?: string;
  /** Note shown on the group header (rest between rounds, etc.). */
  groupNote?: string;
  targetMuscle: string;
  /** Colored muscle tag pills; falls back to targetMuscle split on commas. */
  tags?: string[];
  cues: string[];
  /** Resolved YouTube tutorial (thumbnail + embed + watch link). */
  video: ExerciseVideo;
  /** "sets" = per-set checkboxes (strength); "flow" = single done toggle (pilates). */
  track?: "sets" | "flow";
  /** Creator/source badge, e.g. "Eva's Pilates" (Partner routines). */
  source?: string;
  note?: string;
};

/**
 * The reader-facing scheme line, e.g. "5 sets • 4–8 reps". Uses an explicit
 * `scheme` override when present (rounds, EMOM, etc.), otherwise builds it from
 * sets + reps. Kept here so the card, video modal and home screen all match.
 */
export function schemeLabel(ex: Exercise): string {
  return ex.scheme ?? `${ex.sets} sets • ${ex.reps}`;
}

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
  /** Rest between rounds for a circuit day, e.g. "2–3 min". */
  roundsRest?: string;
  exercises: Exercise[];
};

/**
 * Recovery guidance shown on every workout. Advanced lifters cut best when most
 * sets stay a rep or two shy of failure — see the Training note card in the app.
 */
export const TRAINING_NOTE =
  "Train hard, but recoverable. Most sets should end with 1–2 reps left. Go near failure only on final sets.";

/** How to add load week to week (change ONE variable at a time). */
export const PROGRESSION_TIPS = [
  "Add 1 rep per set, or",
  "Add 1 set to one exercise, or",
  "Slow the tempo, or",
  "Cut rest by 10–15 sec.",
];

/** Every 6th week is a deload. */
export const DELOAD_NOTE =
  "Every 6th week: halve total sets, stay well clear of failure, and focus on clean form and recovery.";

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
  "Slow Negative Pull-Ups": { videoUrl: "https://www.youtube.com/watch?v=gbPURTSxQLY", videoId: "gbPURTSxQLY" },
  "Hanging Leg Raises": { videoUrl: "https://www.youtube.com/watch?v=9CDyRwTn-2Y", videoId: "9CDyRwTn-2Y" },
  "Hanging Knee Raises": { videoUrl: "https://www.youtube.com/watch?v=G6a5267YpHM", videoId: "G6a5267YpHM" },

  // ME — PUSH
  "Pseudo Planche Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=i-gSmqe9tNw", videoId: "i-gSmqe9tNw" },
  "Pike Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=3r3tvRF1tVA", videoId: "3r3tvRF1tVA" },
  "Diamond Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=J0DnG1_S92I", videoId: "J0DnG1_S92I" },
  "Push-Ups": { videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4", videoId: "IODxDxX7oi4" },

  // ME — LEGS
  "Jump Squats": { videoUrl: "https://www.youtube.com/watch?v=AD9nF5fFdnY", videoId: "AD9nF5fFdnY" },
  "Single-Leg Calf Raises": { videoUrl: "https://www.youtube.com/watch?v=qPd73snQfUs", videoId: "qPd73snQfUs" },

  // ME — CONDITIONING
  "Burpees": { videoUrl: "https://www.youtube.com/watch?v=qLBImHhCXSw", videoId: "qLBImHhCXSw" },
  "Mountain Climbers": { videoUrl: "https://www.youtube.com/watch?v=cnyTQDSE884", videoId: "cnyTQDSE884" },

  // Anything not listed here (Wide Pull-Ups, Scapular Pull-Ups, Archer Push-Ups,
  // Pistol/Shrimp Squat progressions, etc.) intentionally resolves to a YouTube
  // *search* via meFallbackQuery, so a card never shows a wrong clip. Add a
  // "Name": { videoUrl, videoId } entry above to embed a specific tutorial.

  // PARTNER — EVA'S PILATES
  // Partner routines don't use this name→clip map. Each day pins a specific
  // Eva's Pilates video by id in PARTNER_ROUTINES below (one full guided routine
  // per day). Change a `videoId` there to swap a clip.
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
  /* ---------------------------- DAY 1 · PULL + ABS ---------------------------- */
  {
    id: "pull",
    weekday: "Monday",
    title: "Pull",
    subtitle: "Pull strength + abs",
    focus: ["Back", "Lats", "Abs"],
    duration: 55,
    exercises: [
      {
        id: "d1-pull-ups",
        name: "Pull-Ups",
        sets: 5,
        reps: "4–8 reps",
        rest: "2–3 min",
        equipment: "Pull-up bar",
        targetMuscle: "Back, lats",
        tags: ["Back", "Lats", "Strength"],
        cues: ["Dead-hang start, shoulders packed", "Drive elbows down to the ribs", "Control the descent — no kipping"],
      },
      {
        id: "d1-chin-ups",
        name: "Chin-Ups",
        sets: 4,
        reps: "6–10 reps",
        rest: "2 min",
        equipment: "Pull-up bar",
        targetMuscle: "Back, biceps",
        tags: ["Back", "Biceps", "Strength"],
        cues: ["Supinated shoulder-width grip", "Squeeze the biceps at the top", "Full stretch at the bottom"],
      },
      {
        id: "d1-wide-pull-ups",
        name: "Wide Pull-Ups",
        sets: 4,
        reps: "Max reps",
        rest: "2 min",
        equipment: "Pull-up bar",
        targetMuscle: "Lats, upper back",
        tags: ["Lats", "V-Taper", "Back"],
        cues: ["Grip wider than the shoulders", "Lead with the chest to the bar", "Full range on every rep"],
      },
      {
        id: "d1-negative-pull-ups",
        name: "Slow Negative Pull-Ups",
        sets: 3,
        reps: "5 reps",
        rest: "90 sec",
        tempo: "5 sec down",
        equipment: "Pull-up bar",
        targetMuscle: "Back, eccentric control",
        tags: ["Back", "Control", "Strength"],
        cues: ["Jump or pull to the top", "Lower for a slow 5-count", "Stay tight, resist the drop"],
      },
      {
        id: "d1-scapular-pull-ups",
        name: "Scapular Pull-Ups",
        sets: 3,
        reps: "12–15 reps",
        rest: "60 sec",
        equipment: "Pull-up bar",
        targetMuscle: "Scapula, shoulder health",
        tags: ["Scapula", "Shoulder Health", "Back"],
        cues: ["Keep the arms straight", "Depress and retract the shoulder blades", "Small, controlled range"],
      },
      {
        id: "d1-hanging-leg-raises",
        name: "Hanging Leg Raises",
        sets: 4,
        reps: "10–15 reps",
        rest: "90 sec",
        equipment: "Pull-up bar",
        targetMuscle: "Lower abs, hip flexors",
        tags: ["Abs", "Core"],
        cues: ["Brace before you lift", "Raise legs to parallel or higher", "Lower slowly, no swing"],
      },
      {
        id: "d1-hollow-body-hold",
        name: "Hollow Body Hold",
        sets: 3,
        reps: "40–60 sec hold",
        rest: "60 sec",
        equipment: "Bodyweight",
        targetMuscle: "Core, abs",
        tags: ["Core", "Abs", "Stability"],
        cues: ["Low back pressed to the floor", "Arms and legs long", "Breathe shallow, stay rigid"],
      },
    ],
  },

  /* ------------------------------ DAY 2 · PUSH ------------------------------- */
  {
    id: "push",
    weekday: "Tuesday",
    title: "Push",
    subtitle: "Push strength — chest, shoulders & triceps",
    focus: ["Chest", "Shoulders", "Triceps"],
    duration: 50,
    exercises: [
      {
        id: "d2-pseudo-planche-push-ups",
        name: "Pseudo Planche Push-Ups",
        sets: 5,
        reps: "6–10 reps",
        rest: "2–3 min",
        equipment: "Bodyweight",
        targetMuscle: "Chest, anterior delts",
        tags: ["Chest", "Shoulders", "Strength"],
        cues: ["Hands by the waist, fingers out", "Lean the shoulders past the hands", "Protract and stay hollow"],
      },
      {
        id: "d2-pike-push-ups",
        name: "Pike Push-Ups",
        sets: 5,
        reps: "8–12 reps",
        rest: "2 min",
        equipment: "Bodyweight",
        targetMuscle: "Shoulders, triceps",
        tags: ["Shoulders", "Triceps"],
        cues: ["Hips high in an inverted V", "Lower the crown toward the floor", "Press tall and vertical"],
      },
      {
        id: "d2-diamond-push-ups",
        name: "Diamond Push-Ups",
        sets: 4,
        reps: "10–15 reps",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Triceps, inner chest",
        tags: ["Triceps", "Chest"],
        cues: ["Index fingers and thumbs touch", "Elbows tucked to the ribs", "Full lockout, squeeze triceps"],
      },
      {
        id: "d2-archer-push-ups",
        name: "Archer Push-Ups",
        sets: 4,
        reps: "6–10 / side",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Chest, unilateral strength",
        tags: ["Chest", "Strength", "Control"],
        cues: ["Shift the weight over the working arm", "Keep the other arm straight", "Alternate sides evenly"],
      },
      {
        id: "d2-slow-push-ups",
        name: "Slow Push-Ups",
        sets: 3,
        reps: "12–15 reps",
        rest: "90 sec",
        tempo: "3 sec down + 1 sec pause",
        equipment: "Bodyweight",
        targetMuscle: "Chest, control",
        tags: ["Chest", "Control", "Hypertrophy"],
        cues: ["Lower for a 3-count", "Pause one second at the bottom", "Chest to floor, tight core"],
      },
      {
        id: "d2-explosive-push-ups",
        name: "Explosive Push-Ups",
        sets: 4,
        reps: "6–10 reps",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Chest, power",
        tags: ["Power", "Chest", "Athletic"],
        cues: ["Descend under control", "Drive up hard off the floor", "Land soft and reset"],
      },
      {
        id: "d2-plank-shoulder-taps",
        name: "Plank Shoulder Taps",
        sets: 3,
        reps: "30–40 taps",
        rest: "60 sec",
        equipment: "Bodyweight",
        targetMuscle: "Core, shoulders",
        tags: ["Core", "Stability"],
        cues: ["Wide, stable feet", "Hips level — no rocking", "Tap the opposite shoulder slowly"],
      },
    ],
  },

  /* -------------------- DAY 3 · LEGS + CORE + CONDITIONING -------------------- */
  {
    id: "legs-core",
    weekday: "Wednesday",
    title: "Legs + Core",
    subtitle: "Lower body, core & conditioning",
    focus: ["Legs", "Core", "Conditioning"],
    duration: 60,
    exercises: [
      {
        id: "d3-pistol-squats",
        name: "Pistol Squat Progression",
        sets: 5,
        reps: "5–8 / leg",
        rest: "2 min",
        equipment: "Bodyweight",
        targetMuscle: "Quads, glutes, balance",
        tags: ["Legs", "Strength", "Balance"],
        cues: ["Sit back onto one leg", "Heel planted, chest up", "Use a support only as needed"],
      },
      {
        id: "d3-shrimp-squats",
        name: "Shrimp Squat Progression",
        sets: 4,
        reps: "6–10 / leg",
        rest: "2 min",
        equipment: "Bodyweight",
        targetMuscle: "Quads, control",
        tags: ["Quads", "Strength", "Control"],
        cues: ["Hold the rear foot behind you", "Lower under control", "Drive through the front heel"],
      },
      {
        id: "d3-reverse-lunges",
        name: "Reverse Lunges",
        sets: 4,
        reps: "15–20 / leg",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Legs, glutes",
        tags: ["Legs", "Glutes"],
        cues: ["Step back into a long stride", "Rear knee taps the floor", "Push through the front heel"],
      },
      {
        id: "d3-single-leg-rdl",
        name: "Single-Leg Romanian Deadlift",
        sets: 4,
        reps: "12–15 / leg",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Hamstrings, glutes",
        tags: ["Hamstrings", "Glutes", "Balance"],
        cues: ["Hinge at the hip", "Flat back, slight knee bend", "Feel the hamstring stretch"],
      },
      {
        id: "d3-jump-squats",
        name: "Jump Squats",
        sets: 5,
        reps: "12–15 reps",
        rest: "90 sec",
        equipment: "Bodyweight",
        targetMuscle: "Legs, power",
        tags: ["Power", "Legs", "Athletic"],
        cues: ["Squat to parallel", "Explode straight up", "Land soft, absorb the impact"],
      },
      {
        id: "d3-single-leg-calf-raises",
        name: "Single-Leg Calf Raises",
        sets: 5,
        reps: "20–30 / leg",
        rest: "60 sec",
        equipment: "Bodyweight",
        targetMuscle: "Calves",
        tags: ["Calves", "Legs"],
        cues: ["Rise to full height", "Pause at the top", "Lower into a deep stretch"],
      },
      {
        id: "d3-hanging-knee-raises",
        name: "Hanging Knee Raises",
        sets: 4,
        reps: "15–20 reps",
        rest: "90 sec",
        equipment: "Pull-up bar",
        targetMuscle: "Lower abs",
        tags: ["Abs", "Core"],
        cues: ["Brace the core first", "Drive knees to the chest", "No swinging momentum"],
      },
      {
        id: "d3-burpee-finisher",
        name: "Burpee Intervals",
        sets: 8,
        reps: "30s on / 30s off",
        scheme: "8 rounds • 30s on / 30s off",
        rest: "30 sec",
        equipment: "Bodyweight",
        note: "Max-effort burpees for 30 sec, then rest 30 sec. Repeat for 8 rounds.",
        targetMuscle: "Full body, conditioning",
        tags: ["Conditioning", "Fat Loss", "Athletic"],
        cues: ["Full chest-to-floor burpee", "Move fast in the 30-second window", "Recover, then repeat"],
        group: "Finisher",
      },
    ],
  },

  /* ------------------------- DAY 4 · UPPER HYPERTROPHY ------------------------ */
  {
    id: "upper-volume",
    weekday: "Thursday",
    title: "Upper Body",
    subtitle: "Hypertrophy supersets",
    focus: ["Back", "Chest", "Arms"],
    duration: 55,
    exercises: [
      {
        id: "d4-a-pull-ups",
        name: "Pull-Ups",
        sets: 4,
        reps: "Max reps",
        equipment: "Pull-up bar",
        targetMuscle: "Back, lats",
        tags: ["Back", "Lats"],
        cues: ["Clean reps only", "Full dead hang", "Control the negative"],
        group: "Superset A",
        groupNote: "Rest 2 min after each round",
      },
      {
        id: "d4-a-push-ups",
        name: "Push-Ups",
        sets: 4,
        reps: "20–30 reps",
        equipment: "Bodyweight",
        targetMuscle: "Chest, triceps",
        tags: ["Chest", "Triceps"],
        cues: ["Body in a straight line", "Chest to the floor", "Steady, even tempo"],
        group: "Superset A",
      },
      {
        id: "d4-b-chin-ups",
        name: "Chin-Ups",
        sets: 4,
        reps: "Max reps",
        equipment: "Pull-up bar",
        targetMuscle: "Back, biceps",
        tags: ["Back", "Biceps"],
        cues: ["Supinated grip", "Squeeze at the top", "Full stretch"],
        group: "Superset B",
        groupNote: "Rest 2 min after each round",
      },
      {
        id: "d4-b-pike-push-ups",
        name: "Pike Push-Ups",
        sets: 4,
        reps: "10–15 reps",
        equipment: "Bodyweight",
        targetMuscle: "Shoulders, triceps",
        tags: ["Shoulders", "Triceps"],
        cues: ["Hips high, inverted V", "Crown toward the floor", "Press tall"],
        group: "Superset B",
      },
      {
        id: "d4-c-close-grip-chin-ups",
        name: "Close-Grip Chin-Ups",
        sets: 3,
        reps: "8–12 reps",
        equipment: "Pull-up bar",
        targetMuscle: "Biceps, back",
        tags: ["Biceps", "Back"],
        cues: ["Hands close together", "Pull the chest to the bar", "Slow negative each rep"],
        group: "Superset C",
        groupNote: "Rest 90 sec after each round",
      },
      {
        id: "d4-c-diamond-push-ups",
        name: "Diamond Push-Ups",
        sets: 3,
        reps: "12–20 reps",
        equipment: "Bodyweight",
        targetMuscle: "Triceps, inner chest",
        tags: ["Triceps", "Chest"],
        cues: ["Diamond hands", "Elbows tucked", "Full range"],
        group: "Superset C",
      },
      {
        id: "d4-d-scapular-pull-ups",
        name: "Scapular Pull-Ups",
        sets: 3,
        reps: "15 reps",
        equipment: "Pull-up bar",
        targetMuscle: "Back, shoulder health",
        tags: ["Back", "Shoulder Health"],
        cues: ["Arms stay straight", "Depress and retract the scaps", "Controlled range"],
        group: "Superset D",
        groupNote: "Rest 90 sec after each round",
      },
      {
        id: "d4-d-planche-lean-hold",
        name: "Pseudo Planche Lean Hold",
        sets: 3,
        reps: "20–40 sec hold",
        equipment: "Bodyweight",
        targetMuscle: "Shoulders, core",
        tags: ["Shoulders", "Core", "Strength"],
        cues: ["Lean the shoulders past the hands", "Protract and hollow hard", "Hold — don't sag"],
        group: "Superset D",
      },
      {
        id: "d4-hanging-leg-raises",
        name: "Hanging Leg Raises",
        sets: 4,
        reps: "10–15 reps",
        rest: "90 sec",
        equipment: "Pull-up bar",
        targetMuscle: "Lower abs",
        tags: ["Abs", "Core"],
        cues: ["Brace first", "Legs to parallel", "Lower slowly"],
        group: "Core",
      },
      {
        id: "d4-side-plank",
        name: "Side Plank",
        sets: 3,
        reps: "45–60 sec / side",
        rest: "60 sec",
        equipment: "Bodyweight",
        targetMuscle: "Obliques, core",
        tags: ["Core", "Obliques"],
        cues: ["Stack the hips and shoulders", "Lift the hips high", "Hold steady, breathe"],
        group: "Core",
      },
    ],
  },

  /* ----------------- DAY 5 · ATHLETIC CONDITIONING + FULL BODY ---------------- */
  {
    id: "conditioning",
    weekday: "Friday",
    title: "Conditioning",
    subtitle: "Full-body circuit + EMOM finisher",
    focus: ["Full Body", "Cardio", "Athletic"],
    duration: 40,
    rounds: 5,
    roundsRest: "2–3 min",
    exercises: [
      {
        id: "d5-pull-ups",
        name: "Pull-Ups",
        sets: 5,
        reps: "8–12 reps",
        scheme: "5 rounds • 8–12 reps",
        equipment: "Pull-up bar",
        targetMuscle: "Back",
        tags: ["Back"],
        cues: ["Break sets only if needed", "Quality pulls"],
      },
      {
        id: "d5-push-ups",
        name: "Push-Ups",
        sets: 5,
        reps: "20 reps",
        scheme: "5 rounds • 20 reps",
        equipment: "Bodyweight",
        targetMuscle: "Chest",
        tags: ["Chest"],
        cues: ["Straight line", "Chest to floor"],
      },
      {
        id: "d5-jump-squats",
        name: "Jump Squats",
        sets: 5,
        reps: "20 reps",
        scheme: "5 rounds • 20 reps",
        equipment: "Bodyweight",
        targetMuscle: "Legs, power",
        tags: ["Legs", "Power"],
        cues: ["Full depth", "Land soft"],
      },
      {
        id: "d5-chin-ups",
        name: "Chin-Ups",
        sets: 5,
        reps: "6–10 reps",
        scheme: "5 rounds • 6–10 reps",
        equipment: "Pull-up bar",
        targetMuscle: "Back, biceps",
        tags: ["Back", "Biceps"],
        cues: ["Squeeze the top", "Control the negative"],
      },
      {
        id: "d5-mountain-climbers",
        name: "Mountain Climbers",
        sets: 5,
        reps: "40 reps",
        scheme: "5 rounds • 40 reps",
        equipment: "Bodyweight",
        targetMuscle: "Core, cardio",
        tags: ["Core", "Cardio"],
        cues: ["Flat back, hips down", "Drive knees quickly"],
      },
      {
        id: "d5-pike-push-ups",
        name: "Pike Push-Ups",
        sets: 5,
        reps: "10–12 reps",
        scheme: "5 rounds • 10–12 reps",
        equipment: "Bodyweight",
        targetMuscle: "Shoulders, triceps",
        tags: ["Shoulders", "Triceps"],
        cues: ["Hips high", "Press tall"],
      },
      {
        id: "d5-reverse-lunges",
        name: "Reverse Lunges",
        sets: 5,
        reps: "15 / leg",
        scheme: "5 rounds • 15 / leg",
        equipment: "Bodyweight",
        targetMuscle: "Legs, glutes",
        tags: ["Legs", "Glutes"],
        cues: ["Long stride", "Push the front heel"],
      },
      {
        id: "d5-hanging-knee-raises",
        name: "Hanging Knee Raises",
        sets: 5,
        reps: "15 reps",
        scheme: "5 rounds • 15 reps",
        equipment: "Pull-up bar",
        targetMuscle: "Lower abs",
        tags: ["Abs", "Core"],
        cues: ["Brace the core", "Knees to chest"],
      },
      {
        id: "d5-emom-finisher",
        name: "EMOM Finisher",
        sets: 5,
        reps: "10 min",
        scheme: "10-min EMOM",
        equipment: "Bodyweight",
        note: "Minute 1: 12 burpees. Minute 2: 15 push-ups. Repeat for 10 minutes.",
        targetMuscle: "Full body, conditioning",
        tags: ["Conditioning", "Athletic", "Fat Loss", "Full Body"],
        cues: ["Start each set on the minute", "Burpees minute one, push-ups minute two", "Rest with whatever time is left"],
        group: "Finisher",
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

/* ===================== PARTNER — EVA'S PILATES ROUTINES ==================== */

/**
 * Partner (Eva) trains along to real **Eva's Pilates** YouTube routines — one
 * full guided video per day, not a list of small moves. Each day pins a
 * specific clip from the @evaspilates channel that plays inline in the shared
 * video modal (the exact same one the Me/Calisthenics videos use); a standing
 * "Open on YouTube" fallback covers any video the creator has embed-disabled.
 *
 * IMPORTANT — healthy language: several source titles use weight-loss / body
 * wording ("tiny waist", "slim", "lose belly fat", "de-bloat"). Those NEVER
 * surface in the app. We show only the rewritten `title`/`focus` below
 * (Core Strength, Glutes + Posture, Mobility, Lower Body, Full Body Flow,
 * Stretch & Recovery). To swap a clip, change `videoId` only.
 */
export type PilatesRoutine = {
  id: string;
  profile: "partner";
  /** Creator badge shown on every card & the detail screen. */
  source: string;
  /** App-facing title (healthy language, never the raw YouTube title). */
  title: string;
  weekday: string;
  /** Short focus line, e.g. "Core • Posture • Control". */
  subtitle: string;
  /** Human duration label, e.g. "~15 min". */
  duration: string;
  /** Rough minutes for the shared numeric UI (hero ring meta, list). */
  durationMin: number;
  /** Colored focus pills. */
  focus: string[];
  /** Pinned Eva's Pilates YouTube video id. */
  videoId: string;
  /** Gentle cues shown in the video modal. */
  notes: string[];
};

/** Universal, body-neutral session cues shown on every Partner detail screen. */
export const PARTNER_SESSION_CUES = [
  "Move slowly",
  "Control breathing",
  "Keep posture clean",
  "Stop if something feels painful",
];

export const PARTNER_ROUTINES: PilatesRoutine[] = [
  {
    id: "partner-core-monday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Core",
    weekday: "Monday",
    subtitle: "Core • Posture • Control",
    duration: "~20 min",
    durationMin: 20,
    focus: ["Core", "Posture", "Control"],
    videoId: "w7JksabVmcw",
    notes: ["Controlled breathing", "Slow, controlled movement", "Keep your posture tall"],
  },
  {
    id: "partner-glutes-tuesday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Glutes + Posture",
    weekday: "Tuesday",
    subtitle: "Glutes • Hips • Posture",
    duration: "~10 min",
    durationMin: 10,
    focus: ["Glutes", "Hips", "Posture"],
    videoId: "iSR73LhKcB0",
    notes: ["Squeeze through the glutes", "Keep hips level", "Move with control"],
  },
  {
    id: "partner-mobility-wednesday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Mobility Flow",
    weekday: "Wednesday",
    subtitle: "Mobility • Posture • Breath",
    duration: "~10 min",
    durationMin: 10,
    focus: ["Mobility", "Posture", "Breath"],
    videoId: "5owlP1A_Hc4",
    notes: ["Breathe into each movement", "Move slowly", "Lengthen through the spine"],
  },
  {
    id: "partner-lower-thursday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Lower Body",
    weekday: "Thursday",
    subtitle: "Legs • Glutes • Balance",
    duration: "~10 min",
    durationMin: 10,
    focus: ["Legs", "Glutes", "Balance"],
    videoId: "MImzuAfIf-o",
    notes: ["Steady, controlled reps", "Keep knees tracking", "Balance and breathe"],
  },
  {
    id: "partner-fullbody-friday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Full Body Flow",
    weekday: "Friday",
    subtitle: "Full Body • Energy • Control",
    duration: "~15 min",
    durationMin: 15,
    focus: ["Full Body", "Energy", "Control"],
    videoId: "Nr41z1LK6GU",
    notes: ["Flow at your own pace", "Keep the core engaged", "Breathe steadily"],
  },
  {
    id: "partner-stretch-saturday",
    profile: "partner",
    source: "Eva's Pilates",
    title: "Eva's Pilates Stretch & Recovery",
    weekday: "Saturday",
    subtitle: "Stretch • Mobility • Recovery",
    duration: "~10 min",
    durationMin: 10,
    focus: ["Stretch", "Mobility", "Recovery"],
    videoId: "rpPuaKYlyBs",
    notes: ["Relax into the movement", "Long, slow breaths", "Never force a stretch"],
  },
];

/** A Partner routine → a WorkoutDay with a single "flow" video, so the shared
 *  home hero, session tracking and workout history keep working unchanged. */
function routineToDay(r: PilatesRoutine): WorkoutDay {
  return {
    id: r.id,
    weekday: r.weekday,
    title: r.title,
    subtitle: r.subtitle,
    focus: r.focus,
    duration: r.durationMin,
    exercises: [
      {
        id: `${r.id}-routine`,
        name: r.title,
        sets: 1,
        reps: r.duration,
        scheme: r.duration,
        targetMuscle: r.focus.join(", "),
        tags: r.focus,
        cues: r.notes,
        video: makeEmbedVideo(r.videoId),
        track: "flow",
        source: r.source,
      },
    ],
  };
}

export const PARTNER_PROGRAM: WorkoutDay[] = PARTNER_ROUTINES.map(routineToDay);

/** Look up the rich routine (source, notes, video id) behind a Partner day. */
export function getPartnerRoutine(dayId: string): PilatesRoutine | undefined {
  return PARTNER_ROUTINES.find((r) => r.id === dayId);
}

export const PARTNER_REST_DAYS: RestDay[] = [
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

/* ------------------------------ Back-compat ------------------------------- */
export const PROGRAM = ME_PROGRAM;
export const REST_DAYS = ME_REST_DAYS;
