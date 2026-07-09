"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styling of the confirm button. Defaults to "danger". */
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Centered confirmation modal used for destructive actions
 * (deleting a weigh-in, resetting all data). Dismisses on backdrop tap.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Lock body scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
            aria-hidden
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-[20rem] rounded-3xl border border-border bg-card p-6 text-center shadow-card-hover"
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <span
              className={
                tone === "danger"
                  ? "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft text-danger"
                  : "mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary"
              }
            >
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-lg font-bold tracking-tight">{title}</h2>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
            )}
            <div className="mt-5 flex flex-col gap-2.5">
              <Button
                variant={tone === "danger" ? "danger" : "primary"}
                className="w-full"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
              <Button variant="ghost" className="w-full" onClick={onCancel}>
                {cancelLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
