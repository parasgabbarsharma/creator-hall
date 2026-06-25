"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-20 text-center">
      <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted mt-2 mb-6">{error.message || "Failed to load dashboard."}</p>
      <Button onClick={reset} variant="secondary">
        Try again
      </Button>
    </div>
  );
}
