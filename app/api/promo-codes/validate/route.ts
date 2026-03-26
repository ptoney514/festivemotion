import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validatePromoCode, calculateDiscount } from "@/lib/promo-codes";
import { formatCurrency } from "@/lib/format";

const schema = z.object({
  code: z.string().min(1).max(50),
  subtotalCents: z.number().int().min(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, error: "Invalid request" },
      { status: 400 },
    );
  }

  const { code, subtotalCents } = parsed.data;
  const result = await validatePromoCode(code);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
  }

  const { promoCode } = result;
  const discountAmountCents = calculateDiscount(promoCode, subtotalCents);

  return NextResponse.json({
    valid: true,
    code: promoCode.code,
    discountType: promoCode.discountType,
    discountValue: promoCode.discountValue,
    discountAmountCents,
    displayText: `${promoCode.code} — -${formatCurrency(discountAmountCents)}`,
  });
}
