import "server-only";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { promoCodes } from "@/lib/schema";

export type PromoCodeRecord = typeof promoCodes.$inferSelect;

type ValidationResult =
  | { valid: true; promoCode: PromoCodeRecord }
  | { valid: false; error: string };

export async function validatePromoCode(code: string): Promise<ValidationResult> {
  const db = getDb();
  if (!db) return { valid: false, error: "Service unavailable" };

  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, error: "Please enter a promo code" };

  const [promo] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, normalized))
    .limit(1);

  if (!promo) return { valid: false, error: "Invalid promo code" };
  if (!promo.isActive) return { valid: false, error: "This promo code is no longer active" };

  const now = new Date();
  if (promo.validFrom && now < promo.validFrom) {
    return { valid: false, error: "This promo code is not yet active" };
  }
  if (promo.validTo && now > promo.validTo) {
    return { valid: false, error: "This promo code has expired" };
  }
  if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
    return { valid: false, error: "This promo code has reached its usage limit" };
  }

  return { valid: true, promoCode: promo };
}

export function calculateDiscount(
  promoCode: PromoCodeRecord,
  subtotalCents: number,
): number {
  if (subtotalCents <= 0) return 0;

  if (promoCode.discountType === "percentage") {
    const discount = Math.round((subtotalCents * promoCode.discountValue) / 100);
    return Math.min(discount, subtotalCents);
  }

  // fixed_amount — value is in cents
  return Math.min(promoCode.discountValue, subtotalCents);
}

export async function incrementPromoCodeUsage(promoCodeId: string): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db
    .update(promoCodes)
    .set({
      currentUses: sql`${promoCodes.currentUses} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(promoCodes.id, promoCodeId));
}
