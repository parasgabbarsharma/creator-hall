"use client";

import Image from "next/image";
import { cn, formatTimeAgo } from "@/lib/utils";
import { isYouTubeShortUrl } from "@/lib/video-url";
import { Video } from "@prisma/client";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { YouTubeIcon, InstagramIcon, PlayIcon } from "@/components/ui/icons";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export function VideoCard({ video, priority = false }: VideoCardProps) {
  const isShort = isYouTubeShortUrl(video.url) || video.platform === "INSTAGRAM";

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group h-full flex flex-col"
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-4 h-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-xl"
      >
        <div className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-surface border border-border/50 shadow-sm transition-all duration-300 ease-out group-hover:shadow-lg group-hover:border-border",
          isShort ? "aspect-[9/16]" : "aspect-video"
        )}>
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes={isShort ? "(max-width: 640px) 50vw, 20vw" : "(max-width: 640px) 100vw, 25vw"}
            loading={priority ? undefined : "lazy"}
            priority={priority}
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-white/90 shadow-xl text-accent flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
              <PlayIcon size={24} className="ml-1" />
            </div>
          </div>
          {video.duration && !isShort && (
            <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-md z-20 tracking-wide">
              {video.duration}
            </div>
          )}
          {isShort && (
            <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md shadow-sm text-foreground text-[11px] font-semibold px-2.5 py-1 rounded-full z-20 flex items-center gap-1.5">
              {video.platform === "YOUTUBE" ? <YouTubeIcon size={12} className="text-accent" /> : <InstagramIcon size={12} className="text-pink-600" />}
              {video.platform === "YOUTUBE" ? "Short" : "Reel"}
            </div>
          )}
        </div>

        <div className="flex gap-3.5 px-1">
          <Avatar
            src={video.creatorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.creatorName || "C")}&background=dc2626&color=fff`}
            alt={video.creatorName || "Creator"}
            size="md"
          />
          <div className="flex flex-col overflow-hidden pt-0.5">
            <h3 className="text-[14px] md:text-[15px] font-heading font-semibold text-foreground md:line-clamp-2 leading-snug group-hover:text-accent transition-colors">
              {video.title}
            </h3>
            <p className="text-[13px] text-muted mt-1.5 flex items-center gap-1.5 truncate">
              {video.platform === "YOUTUBE" ? <YouTubeIcon size={12} className="text-muted shrink-0" /> : <InstagramIcon size={12} className="text-muted shrink-0" />}
              <span className="truncate">{video.creatorName || (video.platform === "YOUTUBE" ? "YouTube" : "Instagram")}</span>
              <span className="w-1 h-1 rounded-full bg-border shrink-0 mx-0.5" />
              <span className="shrink-0">{formatTimeAgo(video.createdAt)}</span>
            </p>
            {video.description && (
              <p className="text-[12px] text-muted/80 mt-1 line-clamp-1">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export function VideoCardSkeleton({ isShort = false }: { isShort?: boolean }) {
  return (
    <div className="flex flex-col gap-3 h-full animate-pulse">
      <Skeleton className={cn("w-full", isShort ? "aspect-[9/16]" : "aspect-video")} />
      <div className="flex gap-3 px-1">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    </div>
  );
}
