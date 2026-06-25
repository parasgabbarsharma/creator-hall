"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { isYouTubeShortUrl } from "@/lib/video-url";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { YouTubeIcon, InstagramIcon, EyeIcon, EyeOffIcon, TrashIcon } from "@/components/ui/icons";
import { Video } from "@prisma/client";

interface VideoListProps {
  videos: Video[];
  hasMore?: boolean;
  nextCursor?: string | null;
  activeTab?: string;
}

export function VideoList({ videos, hasMore = false, nextCursor, activeTab = "all" }: VideoListProps) {
  const [items, setItems] = useState(videos);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setItems(videos);
  }, [videos]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prev) => prev.filter((v) => v.id !== id));
        toast.success("Content deleted.");
      } else {
        toast.error("Failed to delete content.");
      }
    } catch {
      toast.error("Failed to delete content.");
    } finally {
      setDeleting(null);
      setConfirmDeleteId(null);
    }
  };

  const togglePublished = async (id: string, currentState: boolean) => {
    setToggling(id);
    setItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, published: !currentState } : v))
    );

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentState }),
      });

      if (!response.ok) throw new Error();
    } catch {
      setItems((prev) =>
        prev.map((v) => (v.id === id ? { ...v, published: currentState } : v))
      );
      toast.error("Failed to update status.");
    } finally {
      setToggling(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-muted text-sm border border-dashed border-border rounded-lg">
        No content yet. Add your first YouTube or Instagram link.
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-border">
      {items.map((video) => {

        const isShort =
          isYouTubeShortUrl(video.url) || video.platform === "INSTAGRAM";

        return (
          <div
            key={video.id}
            className={cn(
              "py-4 flex items-center gap-4 transition-opacity",
              !video.published && "opacity-50"
            )}
          >
            <div
              className={cn(
                "relative shrink-0 rounded-xl overflow-hidden bg-surface border border-border/50 shadow-sm",
                isShort ? "w-14 aspect-[9/16]" : "w-28 aspect-video"
              )}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-heading font-semibold text-foreground truncate mb-1">
                {video.title}
              </h4>
              <div className="flex items-center gap-2.5 text-[13px] text-muted mt-1.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-light text-accent">
                  {video.platform === "YOUTUBE" ? (
                    <YouTubeIcon size={14} className="text-accent" />
                  ) : (
                    <InstagramIcon size={14} className="text-pink-600" />
                  )}
                </span>
                <span className="font-medium">{new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => togglePublished(video.id, video.published)}
                title={video.published ? "Unpublish" : "Publish"}
                disabled={toggling === video.id}
                className={cn(
                  "p-2.5 rounded-full transition-colors disabled:opacity-30",
                  video.published
                    ? "text-success hover:bg-success/10"
                    : "text-muted hover:bg-surface"
                )}
                aria-label={video.published ? "Unpublish video" : "Publish video"}
              >
                {video.published ? (
                  <EyeIcon size={18} />
                ) : (
                  <EyeOffIcon size={18} />
                )}
              </button>
              <button
                onClick={() => setConfirmDeleteId(video.id)}
                disabled={deleting === video.id}
                title="Delete"
                className="p-2.5 rounded-full text-muted hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30"
                aria-label="Delete video"
              >
                <TrashIcon size={18} />
              </button>
            </div>
          </div>
        );
      })}
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Content"
        message="This action cannot be undone. The video and all associated analytics will be permanently removed."
        confirmLabel="Delete"
        loading={deleting === confirmDeleteId}
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {hasMore && nextCursor && (
        <div className="flex justify-center pt-4">
          <Link href={`/dashboard?cursor=${nextCursor}&tab=${activeTab}`}>
            <Button variant="secondary">Load More</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
