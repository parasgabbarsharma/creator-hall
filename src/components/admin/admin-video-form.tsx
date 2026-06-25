"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isValidYouTubeUrl, isValidInstagramUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "@/components/ui/icons";

export function AdminVideoForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const platform = isValidYouTubeUrl(url)
    ? "YouTube"
    : isValidInstagramUrl(url)
    ? "Instagram"
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!platform) {
      toast.error("Enter a valid YouTube or Instagram URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add video");
      }

      setUrl("");
      toast.success("Content added successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Video URL"
        placeholder="https://youtube.com/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />

      {platform && (
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="accent">Detected: {platform}</Badge>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full mt-2">
        <LinkIcon size={18} />
        {loading ? "Adding..." : "Add Content"}
      </Button>
    </form>
  );
}
