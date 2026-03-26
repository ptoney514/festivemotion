import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { promoCodes } from "@/lib/schema";
import { getAdminSession } from "@/lib/admin";

const updateSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(50)
    .transform((s) => s.toUpperCase())
    .optional(),
  discountType: z.enum(["fixed_amount", "percentage"]).optional(),
  discountValue: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  validFrom: z.string().datetime().nullable().optional(),
  validTo: z.string().datetime().nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const { id } = await params;
  const [code] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.id, id))
    .limit(1);

  if (!code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(code);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Build the update object dynamically — only include provided fields
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.code !== undefined) updates.code = data.code;
  if (data.discountType !== undefined) updates.discountType = data.discountType;
  if (data.discountValue !== undefined) updates.discountValue = data.discountValue;
  if (data.isActive !== undefined) updates.isActive = data.isActive;
  if ("validFrom" in data) updates.validFrom = data.validFrom ? new Date(data.validFrom) : null;
  if ("validTo" in data) updates.validTo = data.validTo ? new Date(data.validTo) : null;
  if ("maxUses" in data) updates.maxUses = data.maxUses ?? null;

  const [updated] = await db
    .update(promoCodes)
    .set(updates)
    .where(eq(promoCodes.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  }

  const { id } = await params;
  const [deleted] = await db
    .delete(promoCodes)
    .where(eq(promoCodes.id, id))
    .returning({ id: promoCodes.id });

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
