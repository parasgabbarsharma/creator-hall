"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getAdminPasswordHash, getSessionSecret } from "@/lib/env";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
} from "@/lib/session-token";

export async function verifyPassword(password: string): Promise<boolean> {
  if (password.length === 0) return false;
  return bcrypt.compare(password, getAdminPasswordHash());
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = await createSessionToken(getSessionSecret());
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) return false;
  try {
    return verifySessionToken(session.value, getSessionSecret());
  } catch {
    return false;
  }
}
