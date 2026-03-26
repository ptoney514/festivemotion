import "server-only";

import { cookies } from "next/headers";
import { createHmac } from "crypto";

const COOKIE_NAME = "fm_admin";

function getAdminCode(): string {
  return process.env.ADMIN_ACCESS_CODE ?? "";
}

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "festivemotion-admin-fallback";
}

/** Create an HMAC token from the access code so the cookie can't be forged */
export function createAdminToken(): string {
  return createHmac("sha256", getSecret())
    .update(getAdminCode())
    .digest("hex");
}

/** Verify a submitted code matches the env var */
export function verifyAccessCode(code: string): boolean {
  const expected = getAdminCode();
  if (!expected) return false;
  return code.trim() === expected.trim();
}

/** Check if the current request has a valid admin cookie */
export async function isAdminAuthenticated(): Promise<boolean> {
  const adminCode = getAdminCode();
  if (!adminCode) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return token === createAdminToken();
}

/** Alias used by API routes */
export async function getAdminSession(): Promise<{ authenticated: true } | null> {
  const isAdmin = await isAdminAuthenticated();
  return isAdmin ? { authenticated: true } : null;
}
