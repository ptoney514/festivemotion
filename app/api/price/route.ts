import { NextResponse } from "next/server";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { calculatePrice } from "@/lib/pricing";
import { checkoutRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        valid: false,
        errors: ["Invalid request payload."],
      },
      { status: 400 },
    );
  }

  const product = await getCatalogProductBySlug(parsed.data.productSlug);

  if (!product) {
    return NextResponse.json(
      {
        valid: false,
        errors: ["Product not found."],
      },
      { status: 404 },
    );
  }

  const priced = calculatePrice(product, parsed.data.selections);

  return NextResponse.json(priced);
}
