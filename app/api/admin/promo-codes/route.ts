import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { promoCodes } from "@/lib/schema";
import { getAdminSession } from "@/lib/admin";

const createSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(50)
    .transform((s) => s.toUpperCase()),
  discountType: z.enum(["fixed_amount", "percentage"]),
  discountValue: z.number().int().min(0),
  isActive: z.boolean().default(true),
  validFrom: z.string().datetime().nullable().optional(),
  validTo: z.string().datetime().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const codes = await db
    .select()
    .from(promoCodes)
    .orderBy(desc(promoCodes.createdAt));

  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { code, discountType, discountValue, isActive, validFrom, validTo, maxUses } =
    parsed.data;

  // Check for duplicate code
  const existing = await db
    .select({ id: promoCodes.id })
    .from(promoCodes)
    .where(eq(promoCodes.code, code))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: `Promo code "${code}" already exists` },
      { status: 409 },
    );
  }

  const [created] = await db
    .insert(promoCodes)
    .values({
      code,
      discountType,
      discountValue,
      isActive,
      validFrom: validFrom ? new Date(validFrom) : null,
      validTo: validTo ? new Date(validTo) : null,
      maxUses: maxUses ?? null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
