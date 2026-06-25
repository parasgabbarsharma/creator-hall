import { TopNavBar } from "@/components/layout/top-nav";
import { Footer } from "@/components/layout/footer";
import { Suspense } from "react";
import { VideoCardSkeleton } from "@/components/video/video-card";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <main id="main-content" className="container flex-1 w-full px-6 md:px-8">
        <Suspense
          fallback={
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
          }
        >
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
