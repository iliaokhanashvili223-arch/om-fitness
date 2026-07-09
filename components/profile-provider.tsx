"use client";

import * as React from "react";
import type { ProfileId } from "@/lib/profiles";

const STORAGE_KEY = "fos:profile";

type ProfileContextValue = {
  profile: ProfileId;
  setProfile: (id: ProfileId) => void;
  ready: boolean;
};

const ProfileContext = React.createContext<ProfileContextValue | null>(null);

export function useProfile() {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Start on "me" for a stable SSR/first paint; hydrate real choice after mount.
  const [profile, setProfileState] = React.useState<ProfileId>("me");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "me" || stored === "partner") setProfileState(stored);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setProfile = React.useCallback((id: ProfileId) => {
    setProfileState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo(() => ({ profile, setProfile, ready }), [profile, setProfile, ready]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
