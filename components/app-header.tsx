"use client";

import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { ProfileSegmented } from "@/components/profile-segmented";

type AppHeaderProps = {
  /** Show a back button (→ /workout) instead of the wordmark. */
  back?: boolean;
  /** Hide the Me/Partner switch (rare). */
  showProfile?: boolean;
};

/** Top bar: Fitness OS wordmark (or back), Me/Partner switch, notification bell. */
export function AppHeader({ back = false, showProfile = true }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-2 pt-1">
      {back ? (
        <Link
          href="/workout"
          aria-label="Back to workouts"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card tap-scale"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : (
        <Link href="/" className="text-xl font-extrabold tracking-tight tap-scale">
          Fitness<span className="text-primary"> OS</span>
        </Link>
      )}

      <div className="flex items-center gap-1">
        {showProfile && <ProfileSegmented />}
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground tap-scale"
        >
          <Bell className="h-[22px] w-[22px]" strokeWidth={1.9} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </button>
      </div>
    </header>
  );
}
