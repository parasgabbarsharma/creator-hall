"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "destructive" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmVariant = "destructive",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }
    return undefined;
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className={cn(
          "relative bg-white rounded-xl shadow-lg border border-border w-full max-w-sm p-6",
          "animate-in fade-in zoom-in-95"
        )}
      >
        <h2
          id="confirm-title"
          className="text-lg font-bold text-foreground"
        >
          {title}
        </h2>
        <p id="confirm-message" className="text-sm text-muted mt-2">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            ref={cancelRef}
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={
              confirmVariant === "destructive" ? "destructive" : "primary"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
