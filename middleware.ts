import { NextRequest, NextResponse } from "next/server";

// --- Upstash rate limiter (production) or in-memory fallback (dev) ---

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

let rateLimiter: {
  limit: (key: string) => Promise<{ success: boolean }>;
} | null = null;
let rateLimiterInitialized = false;

// In-memory fallback for local dev / when Upstash is not configured
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

async function inMemoryLimit(key: string): Promise<{ success: boolean }> {
  const now = Date.now();
  const entry = inMemoryStore.get(key);

  if (!entry || now > entry.resetTime) {
    inMemoryStore.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { success: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false };
  }

  entry.count++;
  return { success: true };
}

// Lazy initialization — avoids top-level await which doesn't work in Edge runtime
async function getRateLimiter() {
  if (!rateLimiterInitialized) {
    rateLimiterInitialized = true;
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const { Ratelimit } = await import("@upstash/ratelimit");
        const { Redis } = await import("@upstash/redis");
        rateLimiter = new Ratelimit({
          redis: Redis.fromEnv(),
          limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "60 s"),
        });
      } catch {
        // Fall through to in-memory fallback
      }
    }
  }
  return rateLimiter ?? { limit: inMemoryLimit };
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  const key = `${ip}:${request.nextUrl.pathname}`;

  const limiter = await getRateLimiter();
  const { success } = await limiter.limit(key);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/cart-checkout", "/api/contact", "/api/health"],
};
