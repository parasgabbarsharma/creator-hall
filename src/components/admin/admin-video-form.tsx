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
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [platformInput, setPlatformInput] = useState<"YOUTUBE" | "INSTAGRAM">("YOUTUBE");
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

    if (!url || !title || !thumbnail) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, thumbnail, platform: platformInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add video");
      }

      setUrl("");
      setTitle("");
      setThumbnail("");
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

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name="platform" checked={platformInput === "YOUTUBE"} onChange={() => setPlatformInput("YOUTUBE")} />
          YouTube
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="radio" name="platform" checked={platformInput === "INSTAGRAM"} onChange={() => setPlatformInput("INSTAGRAM")} />
          Instagram
        </label>
      </div>

      <Input
        label="Video Title"
        placeholder="Enter a catchy title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Thumbnail URL"
        placeholder="https://example.com/image.jpg"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        required
      />

      <Button type="submit" disabled={loading} className="w-full mt-2">
        <LinkIcon size={18} />
        {loading ? "Adding..." : "Add Content"}
      </Button>
    </form>
  );
}
