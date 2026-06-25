import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = {
    status: "ok",
    db: "disconnected",
    uptime: process.uptime(),
    timestamp: Date.now(),
    version: process.env.npm_package_version || "1.0.0",
  };

  try {
    // Ping DB to ensure connection is healthy
    await prisma.$queryRaw`SELECT 1`;
    health.db = "connected";
    return NextResponse.json(health);
  } catch (error) {
    health.status = "error";
    logger.error({ err: error }, "Health check failed: Database connection issue");
    return NextResponse.json(health, { status: 503 });
  }
}
