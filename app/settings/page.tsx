"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Dumbbell,
  Moon,
  Plus,
  RotateCcw,
  Ruler,
  Scale,
  Share,
  Smartphone,
  Sun,
  User,
  Youtube,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { AppHeader } from "@/components/app-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PwaInstallButton } from "@/components/pwa-install-button";
import { useSettings, type Settings } from "@/lib/storage";
import { useProfile } from "@/components/profile-provider";
import { PROFILES } from "@/lib/profiles";
import { cn } from "@/lib/utils";

function FieldRow({
  label,
  unit,
  children,
}: {
  label: string;
  unit?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {children}
        {unit && <span className="w-8 text-sm font-medium text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function NumberField({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <Input
      type="number"
      inputMode="decimal"
      step={step}
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="h-11 w-24 text-right"
    />
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const { profile } = useProfile();
  const meta = PROFILES[profile];
  const { value: settings, setValue: setSettings } = useSettings();
  const [confirmReset, setConfirmReset] = React.useState(false);

  const goals =
    profile === "partner"
      ? ["Tone & mobility", "Strength", "Maintaining"]
      : ["Cutting", "Maintaining", "Bulking"];

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const resetData = () => {
    if (typeof window === "undefined") return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("fos:"))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.href = "/";
  };

  const isDark = mounted && theme === "dark";

  return (
    <PageContainer>
      <AppHeader />

      <div className="mt-1">
        <p className="text-sm font-medium text-muted-foreground">Personalize your OS</p>
        <h1 className="mt-0.5 text-[34px] font-extrabold leading-tight tracking-tight">Settings</h1>
      </div>

      {/* Active profile */}
      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <User className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-muted-foreground">Editing profile</p>
          <p className="text-[17px] font-bold tracking-tight">
            {meta.label} · {meta.trainingStyle}
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1.5 text-[12px] font-medium text-muted-foreground">
          Switch up top
        </span>
      </Card>

      {/* Partner (Eva's Pilates) program note */}
      {profile === "partner" && (
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-purple-soft/50 p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-purple shadow-card">
            <Youtube className="h-[18px] w-[18px] text-[#FF0000]" />
          </span>
          <p className="text-[13px] leading-snug text-muted-foreground">
            Partner program uses <span className="font-semibold text-foreground">Eva&apos;s Pilates</span>{" "}
            YouTube routines. Some videos may open on YouTube if embedding is disabled by the creator.
          </p>
        </div>
      )}

      {/* Appearance */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h2>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-sm font-semibold">Dark mode</p>
              <p className="text-xs text-muted-foreground">{mounted ? (isDark ? "On" : "Off") : "…"}</p>
            </div>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            aria-label="Toggle dark mode"
          />
        </div>
      </Card>

      {/* Body stats */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Ruler className="h-4 w-4" /> Body stats
        </h2>
        <div className="mt-2 divide-y divide-border">
          <FieldRow label="Name">
            <Input
              type="text"
              value={settings.name === "Athlete" ? "" : settings.name}
              placeholder="Your name"
              onChange={(e) => update({ name: e.target.value })}
              className="h-11 w-36 text-right"
            />
          </FieldRow>
          <FieldRow label="Height" unit="cm">
            <NumberField value={settings.heightCm} onChange={(n) => update({ heightCm: n })} />
          </FieldRow>
          <FieldRow label="Weight" unit="kg">
            <NumberField value={settings.weightKg} step={0.1} onChange={(n) => update({ weightKg: n })} />
          </FieldRow>
          <div className="py-2.5">
            <span className="text-sm font-medium">Goal</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => update({ goal: g })}
                  className={cn(
                    "rounded-2xl border px-1 py-2.5 text-[13px] font-semibold transition-colors tap-scale",
                    settings.goal === g
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Install as app */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Smartphone className="h-4 w-4" /> Install this app on your phone
        </h2>
        <p className="mt-2 text-sm font-medium">
          Add it to your home screen to use it full-screen, like a real app. It keeps working offline
          and all your data stays on your device.
        </p>

        <PwaInstallButton />

        <div className="mt-3 space-y-2.5">
          <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-card">
              <Share className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-snug text-muted-foreground">
              <span className="font-semibold text-foreground">iPhone:</span> Safari → Share →{" "}
              <span className="font-semibold text-foreground">Add to Home Screen</span>.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-card">
              <Plus className="h-4 w-4" />
            </span>
            <p className="text-[13px] leading-snug text-muted-foreground">
              <span className="font-semibold text-foreground">Android:</span> Chrome → menu →{" "}
              <span className="font-semibold text-foreground">Add to Home Screen</span>.
            </p>
          </div>
        </div>
      </Card>

      {/* Data */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <Scale className="h-4 w-4" /> Data
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Everything for both profiles is stored locally on this device. Nothing leaves your phone.
        </p>
        <Button variant="danger" className="mt-4 w-full" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="h-4 w-4" /> Reset all data
        </Button>
      </Card>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-xs text-muted-foreground">
        <Dumbbell className="h-3.5 w-3.5" /> Fitness OS · v2.0
      </p>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        description="This clears workouts, logs, weight and settings for both Me and Partner. This can't be undone."
        confirmLabel="Reset everything"
        onConfirm={resetData}
        onCancel={() => setConfirmReset(false)}
      />
    </PageContainer>
  );
}
