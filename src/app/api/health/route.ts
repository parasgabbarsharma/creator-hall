import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

let lastDbCheck = 0;
let dbHealthy = false;

export async function GET() {
  const now = Date.now();
  if (now - lastDbCheck > 15000) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbHealthy = true;
      lastDbCheck = now;
    } catch (error) {
      dbHealthy = false;
      lastDbCheck = now;
      logger.error({ err: error }, "Health check failed: Database connection issue");
    }
  }

  const health = {
    status: dbHealthy ? "ok" : "error",
    db: dbHealthy ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: now,
    version: process.env.npm_package_version || "1.0.0",
  };

  return NextResponse.json(health, { status: dbHealthy ? 200 : 503 });
}
