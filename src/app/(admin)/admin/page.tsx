"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody } from "@/components/ui/card";
import { LockIcon } from "@/components/ui/icons";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Invalid password");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardBody className="p-8 sm:p-10 flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-accent/10 flex items-center justify-center rounded-2xl shadow-sm">
              <LockIcon size={28} className="text-accent" />
            </div>
            <div>
              <h1 className="text-[26px] font-heading font-bold text-foreground tracking-tight">
                Admin Portal
              </h1>
              <p className="text-[15px] text-muted mt-2">Enter your password to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p
                role="alert"
                className="text-sm text-destructive bg-destructive/10 rounded-xl p-3 font-medium"
              >
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
