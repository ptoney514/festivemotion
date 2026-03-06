import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/schema";

declare global {
  var __festiveMotionDb:
    | ReturnType<typeof drizzle<typeof schema>>
    | undefined;
}

export function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? null;
}

export function hasDatabase() {
  return Boolean(getDatabaseUrl());
}

export function getDb() {
  const url = getDatabaseUrl();

  if (!url) {
    return null;
  }

  if (!globalThis.__festiveMotionDb) {
    const sql = neon(url);
    globalThis.__festiveMotionDb = drizzle(sql, { schema });
  }

  return globalThis.__festiveMotionDb;
}
