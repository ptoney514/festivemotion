import "server-only";
import Stripe from "stripe";

declare global {
  var __festiveMotionStripe: Stripe | undefined;
}

export function hasStripeServerEnv() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  if (!globalThis.__festiveMotionStripe) {
    globalThis.__festiveMotionStripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      appInfo: {
        name: "FestiveMotion Storefront",
      },
    });
  }

  return globalThis.__festiveMotionStripe;
}

export function getSiteUrl(request?: Request) {
  if (request) {
    const host = request.headers.get("host");
    if (host) {
      const proto = request.headers.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    }
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
