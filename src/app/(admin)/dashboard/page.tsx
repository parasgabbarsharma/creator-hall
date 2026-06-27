import { prisma } from "@/lib/db";
import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { SyncYouTubeButton } from "@/components/admin/sync-youtube-button";
import { VideoList } from "@/components/admin/video-list";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "@prisma/client";
import { ADMIN_PAGE_SIZE } from "@/lib/config";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ cursor?: string; tab?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { cursor, tab } = await searchParams;
  const activeTab = tab || "all";
  
  const platformFilter = activeTab === "youtube" ? { platform: "YOUTUBE" as const } : activeTab === "instagram" ? { platform: "INSTAGRAM" as const } : {};
  const whereFilter = platformFilter;

  const [rawVideos, totalCount] = await Promise.all([
    prisma.video.findMany({
      where: whereFilter,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        url: true,
        platform: true,
        title: true,
        description: true,
        thumbnail: true,
        duration: true,
        creatorName: true,
        creatorAvatar: true,
        createdAt: true,
        published: true,
        tags: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: ADMIN_PAGE_SIZE + 1,
    }),
    prisma.video.count({ where: platformFilter }),
  ]);

  const hasMore = rawVideos.length > ADMIN_PAGE_SIZE;
  const items = hasMore ? rawVideos.slice(0, ADMIN_PAGE_SIZE) : rawVideos;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  const videos: Video[] = items as unknown as Video[];

  return (
    <div className="space-y-8 pb-12">
      <header className="border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Content Studio</h2>
          <p className="text-[15px] text-muted mt-2">Manage your YouTube and Instagram content library.</p>
        </div>
        <SyncYouTubeButton />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className="lg:col-span-4 sticky top-24">
          <CardHeader>
            <h3 className="text-[17px] font-heading font-semibold text-foreground">Add New Content</h3>
          </CardHeader>
          <CardBody>
            <AdminVideoForm />
          </CardBody>
        </Card>

        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Content</h3>
            <div className="flex bg-surface rounded-lg p-1 border border-border">
              <Link href="?tab=all" className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", activeTab === "all" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground")}>All</Link>
              <Link href="?tab=youtube" className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", activeTab === "youtube" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground")}>YouTube</Link>
              <Link href="?tab=instagram" className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-colors", activeTab === "instagram" ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground")}>Instagram</Link>
            </div>
            <Badge variant="default">{totalCount} total</Badge>
          </CardHeader>
          <CardBody>
            <VideoList videos={videos} hasMore={hasMore} nextCursor={nextCursor} activeTab={activeTab} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
