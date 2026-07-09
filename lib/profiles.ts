/**
 * Fitness OS — profiles.
 *
 * Two profiles ("me" and "partner") each get their own settings, logs, weights
 * and workout program. The segmented control in the header switches the active
 * profile, and every storage hook keys off it (see lib/storage.ts).
 *
 * To tweak a person's stats, targets or copy, edit PROFILES below — nothing else.
 */

export type ProfileId = "me" | "partner";

export const PROFILE_IDS: ProfileId[] = ["me", "partner"];

type ProfileSettingsSeed = {
  name: string;
  heightCm: number;
  weightKg: number;
  goal: string;
  targets: {
    calories: number;
    protein: number;
    waterMl: number;
    steps: number;
    sleepHours: number;
  };
};

export type ProfileMeta = {
  id: ProfileId;
  label: string;
  /** "Alex" for Me, "" for Partner (no name shown). */
  greetingName: string;
  trainingStyle: string;
  /** Show calorie + protein tracking (Me = yes, Partner = softer, off by default). */
  showMacros: boolean;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  workoutSubtitle: string;
  nutritionEyebrow: string;
  nutritionTitleNote: string;
  progressSubtitle: string;
  goalLine: string;
  /** Preset rest durations (seconds) offered in the timer. */
  restPresets: number[];
  settings: ProfileSettingsSeed;
};

export const PROFILES: Record<ProfileId, ProfileMeta> = {
  me: {
    id: "me",
    label: "Me",
    greetingName: "Alex",
    trainingStyle: "Calisthenics",
    showMacros: true,
    heroImage: "/assets/background_me_today_hero.png",
    heroTitle: "Today's workout",
    heroSubtitle: "Strength, muscle retention & fat loss",
    workoutSubtitle: "Your 5-day split",
    nutritionEyebrow: "Two-meal cutting plan",
    nutritionTitleNote: "Cutting plan",
    progressSubtitle: "Your cut, tracked",
    goalLine: "Cutting • Strength • Muscle retention",
    restPresets: [60, 90, 120],
    settings: {
      name: "Alex",
      heightCm: 175,
      weightKg: 78,
      goal: "Cutting",
      targets: { calories: 2100, protein: 150, waterMl: 2700, steps: 10000, sleepHours: 8 },
    },
  },
  partner: {
    id: "partner",
    // Switch keeps the "Partner" label; her name (Eva) shows in greetings & copy.
    label: "Partner",
    greetingName: "Eva",
    trainingStyle: "Eva's Pilates",
    showMacros: false,
    heroImage: "/assets/background_partner_pilates_hero.png",
    heroTitle: "Today's workout",
    heroSubtitle: "Core, glutes, posture & mobility",
    workoutSubtitle: "Eva's Pilates flow",
    nutritionEyebrow: "Healthy routine",
    nutritionTitleNote: "Healthy routine",
    progressSubtitle: "Your practice, tracked",
    goalLine: "Tone • Mobility • Posture • Core strength",
    restPresets: [30, 45, 60],
    settings: {
      name: "Eva",
      heightCm: 165,
      weightKg: 50,
      goal: "Tone & mobility",
      // Partner is not on a calorie deficit — macros are hidden, water/steps/sleep only.
      targets: { calories: 1800, protein: 90, waterMl: 2400, steps: 8000, sleepHours: 8 },
    },
  },
};

export function profileMeta(id: ProfileId): ProfileMeta {
  return PROFILES[id];
}
