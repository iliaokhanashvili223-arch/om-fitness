"use client";

import * as React from "react";
import { CheckCircle2, Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * One-tap install button. Chrome/Edge (Android + desktop) fire
 * `beforeinstallprompt`, which we capture and replay on click. On iOS Safari the
 * event never fires, so this renders nothing and the manual instructions apply.
 */
export function PwaInstallButton() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-success-soft px-4 py-3 text-sm font-semibold text-success">
        <CheckCircle2 className="h-5 w-5" /> App installed
      </div>
    );
  }

  if (!deferred) return null;

  return (
    <button
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground tap-scale"
    >
      <Download className="h-5 w-5" /> Install app now
    </button>
  );
}
