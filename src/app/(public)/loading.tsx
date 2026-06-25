import { VideoCardSkeleton } from "@/components/video/video-card";

export default function PublicLoading() {
  return (
    <div className="space-y-12 mt-8">
      <div className="space-y-6">
        <div className="h-8 bg-border/60 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-border/60 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <VideoCardSkeleton key={i} isShort />
          ))}
        </div>
      </div>
    </div>
  );
}
