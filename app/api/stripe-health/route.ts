import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const raw = process.env.STRIPE_SECRET_KEY ?? "";
  const trimmed = raw.trim();

  const diagnostics: Record<string, unknown> = {
    keyPresent: raw.length > 0,
    keyLength: raw.length,
    trimmedLength: trimmed.length,
    keyPrefix: trimmed.slice(0, 15) + "...",
    hasWhitespace: raw !== trimmed,
    nodeVersion: process.version,
    region: process.env.VERCEL_REGION ?? "unknown",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "(not set)",
  };

  if (!trimmed) {
    return NextResponse.json({ ...diagnostics, error: "STRIPE_SECRET_KEY is not set" }, { status: 500 });
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(trimmed, {
      appInfo: { name: "FestiveMotion Diagnostics" },
    });

    const start = Date.now();
    const customers = await stripe.customers.list({ limit: 1 });
    const latencyMs = Date.now() - start;

    return NextResponse.json({
      ...diagnostics,
      stripeConnection: "OK",
      latencyMs,
      customerCount: customers.data.length,
    });
  } catch (error) {
    return NextResponse.json({
      ...diagnostics,
      stripeConnection: "FAILED",
      errorType: error instanceof Error ? error.constructor.name : "unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
