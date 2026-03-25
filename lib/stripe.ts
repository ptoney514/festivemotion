import "server-only";
import Stripe from "stripe";

declare global {
  var __festiveMotionStripe: Stripe | undefined;
}

export function hasStripeServerEnv() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return null;
  }

  if (!globalThis.__festiveMotionStripe) {
    globalThis.__festiveMotionStripe = new Stripe(key, {
      appInfo: {
        name: "FestiveMotion Storefront",
      },
    });
  }

  return globalThis.__festiveMotionStripe;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
}
