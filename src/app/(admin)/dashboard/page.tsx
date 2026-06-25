import { prisma } from "@/lib/db";
import { AdminVideoForm } from "@/components/admin/admin-video-form";
import { VideoList } from "@/components/admin/video-list";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video } from "@prisma/client";
import { ADMIN_PAGE_SIZE } from "@/lib/config";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { cursor } = await searchParams;
  const cursorFilter = cursor ? { id: { lt: cursor } } : {};

  const [rawVideos, totalCount] = await Promise.all([
    prisma.video.findMany({
      where: { ...cursorFilter },
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
      orderBy: { createdAt: "desc" },
      take: ADMIN_PAGE_SIZE + 1,
    }),
    prisma.video.count(),
  ]);

  const hasMore = rawVideos.length > ADMIN_PAGE_SIZE;
  const items = hasMore ? rawVideos.slice(0, ADMIN_PAGE_SIZE) : rawVideos;
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  const videos: Video[] = items as unknown as Video[];

  return (
    <div className="space-y-8 pb-12">
      <header className="border-b border-border/50 pb-6">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Content Studio</h2>
        <p className="text-[15px] text-muted mt-2">Manage your YouTube and Instagram content library.</p>
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
          <CardHeader className="flex flex-row justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground">Recent Content</h3>
            <Badge variant="default">{totalCount} total</Badge>
          </CardHeader>
          <CardBody>
            <VideoList videos={videos} hasMore={hasMore} nextCursor={nextCursor} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
