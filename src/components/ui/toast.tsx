"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: (msg) => add("success", msg),
        error: (msg) => add("error", msg),
        info: (msg) => add("info", msg),
      }}
    >
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              "pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium shadow-md transition-all duration-300 border",
              toast.type === "success" &&
                "bg-green-50 text-success border-green-200",
              toast.type === "error" &&
                "bg-accent-light text-destructive border-red-200",
              toast.type === "info" &&
                "bg-surface text-foreground border-border"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span>{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-muted hover:text-foreground shrink-0"
                aria-label="Dismiss"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
