"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { isValidYouTubeUrl, isValidInstagramUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkIcon, LoadingIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/icons";

interface FetchedMeta {
  title: string | null;
  thumbnail: string | null;
  description: string | null;
  shortcode: string | null;
  type: string;
}

type FetchState = "idle" | "fetching" | "done" | "failed";

export function AdminVideoForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [platformInput, setPlatformInput] = useState<"YOUTUBE" | "INSTAGRAM">("YOUTUBE");
  const [loading, setLoading] = useState(false);

  // Instagram fetch-preview state
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [fetchedMeta, setFetchedMeta] = useState<FetchedMeta | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const toast = useToast();

  // Auto-detect platform when URL changes
  const handleUrlChange = (val: string) => {
    setUrl(val);
    if (isValidYouTubeUrl(val)) setPlatformInput("YOUTUBE");
    else if (isValidInstagramUrl(val)) setPlatformInput("INSTAGRAM");
  };

  // Auto-fetch Instagram metadata when a valid IG URL is entered
  useEffect(() => {
    if (platformInput !== "INSTAGRAM" || !isValidInstagramUrl(url)) {
      setFetchedMeta(null);
      setFetchState("idle");
      setFetchError(null);
      return;
    }

    // Debounce: wait 800ms after the user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleFetchMeta(url);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, platformInput]);

  const handleFetchMeta = async (targetUrl: string) => {
    setFetchState("fetching");
    setFetchedMeta(null);
    setFetchError(null);

    try {
      const res = await fetch(
        `/api/instagram/metadata?url=${encodeURIComponent(targetUrl)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setFetchError(data.error || "Failed to fetch metadata");
        setFetchState("failed");
        return;
      }

      setFetchedMeta(data);
      setFetchState("done");

      // Auto-fill fields only if user hasn't typed anything manually
      if (!title && data.title) setTitle(data.title);
      if (!thumbnail && data.thumbnail) setThumbnail(data.thumbnail);
    } catch {
      setFetchError("Network error while fetching metadata.");
      setFetchState("failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please provide a URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send whatever the user has — server will also auto-fetch if fields are empty
        body: JSON.stringify({ url, title, thumbnail, platform: platformInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add video");
      }

      // Reset form
      setUrl("");
      setTitle("");
      setThumbnail("");
      setFetchedMeta(null);
      setFetchState("idle");
      setFetchError(null);

      toast.success("Content added successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add content");
    } finally {
      setLoading(false);
    }
  };

  const isInstagram = platformInput === "INSTAGRAM";
  const hasPreview = fetchState === "done" && fetchedMeta;
  const canRefetch = isInstagram && isValidInstagramUrl(url) && fetchState !== "fetching";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* URL field */}
      <Input
        label="Video URL"
        placeholder="https://youtube.com/... or https://instagram.com/reel/..."
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        required
      />

      {/* Platform badges */}
      <div className="flex gap-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="radio"
            name="platform"
            checked={platformInput === "YOUTUBE"}
            onChange={() => setPlatformInput("YOUTUBE")}
          />
          <YouTubeIcon size={15} className="text-accent" />
          YouTube
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="radio"
            name="platform"
            checked={platformInput === "INSTAGRAM"}
            onChange={() => setPlatformInput("INSTAGRAM")}
          />
          <InstagramIcon size={15} className="text-pink-500" />
          Instagram
        </label>
      </div>

      {/* ─── Instagram fetch preview ─── */}
      {isInstagram && (
        <div className="rounded-xl border border-border/60 bg-surface overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-background/60">
            <span className="text-[13px] font-semibold text-foreground flex items-center gap-2">
              <InstagramIcon size={14} className="text-pink-500" />
              Auto-fetch metadata
            </span>
            {canRefetch && (
              <button
                type="button"
                onClick={() => handleFetchMeta(url)}
                className="text-[12px] text-accent hover:underline font-medium"
              >
                Retry
              </button>
            )}
          </div>

          {/* Status / preview body */}
          <div className="p-4">
            {fetchState === "idle" && (
              <p className="text-[13px] text-muted text-center py-2">
                Paste an Instagram reel/post link above — title &amp; thumbnail will auto-fill.
              </p>
            )}

            {fetchState === "fetching" && (
              <div className="flex items-center justify-center gap-2 py-4 text-muted">
                <LoadingIcon size={16} className="animate-spin" />
                <span className="text-[13px]">Fetching metadata…</span>
              </div>
            )}

            {fetchState === "failed" && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                <p className="text-[12px] text-red-600 font-medium">
                  {fetchError ?? "Could not fetch metadata."}
                </p>
                <p className="text-[11px] text-red-500 mt-1">
                  Instagram may have blocked the request. Please fill in the title and thumbnail manually below.
                </p>
              </div>
            )}

            {hasPreview && (
              <div className="flex gap-3 items-start">
                {/* Thumbnail preview */}
                <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-surface-2 border border-border/40 relative">
                  {fetchedMeta.thumbnail ? (
                    <Image
                      src={fetchedMeta.thumbnail}
                      alt="Reel thumbnail"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <InstagramIcon size={28} className="text-pink-300" />
                    </div>
                  )}
                </div>

                {/* Fetched info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground line-clamp-2 leading-snug">
                    {fetchedMeta.title ?? <span className="text-muted italic">No title found</span>}
                  </p>
                  {fetchedMeta.description && (
                    <p className="text-[11px] text-muted mt-1 line-clamp-2">
                      {fetchedMeta.description}
                    </p>
                  )}
                  <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✓ Fetched from Instagram
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Instagram manual override fields ─── */}
      {isInstagram && (
        <>
          <Input
            label={fetchState === "done" ? "Title (auto-filled — edit if needed)" : "Title"}
            placeholder="Enter a catchy title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label={
              fetchState === "done" && fetchedMeta?.thumbnail
                ? "Thumbnail URL (auto-filled — paste another to override)"
                : "Thumbnail URL (optional)"
            }
            placeholder="https://example.com/image.jpg"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </>
      )}

      <Button type="submit" disabled={loading} className="w-full mt-2">
        <LinkIcon size={18} />
        {loading ? "Adding…" : "Add Content"}
      </Button>
    </form>
  );
}
