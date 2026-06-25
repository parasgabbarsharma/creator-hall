import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { assertSameOrigin, handleRouteError } from "@/lib/security";
import { isValidVideoId } from "@/lib/video-url";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
    const { id } = await params;
    if (!isValidVideoId(id)) {
      return NextResponse.json({ error: "Invalid video id" }, { status: 400 });
    }
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const code =
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (code) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
    return handleRouteError(error, "Failed to delete video");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
    const { id } = await params;
    if (!isValidVideoId(id)) {
      return NextResponse.json({ error: "Invalid video id" }, { status: 400 });
    }
    const body = await request.json();
    const published = body.published;

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published must be a boolean" },
        { status: 400 }
      );
    }

    const video = await prisma.video.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json(video);
  } catch (error) {
    const code =
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2025";
    if (code) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
    return handleRouteError(error, "Failed to update video");
  }
}
