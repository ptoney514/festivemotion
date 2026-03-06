import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { configurations, orders } from "@/lib/schema";
import { calculatePrice } from "@/lib/pricing";
import { recordOrderEvent } from "@/lib/orders";
import { checkoutRequestSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const product = await getCatalogProductBySlug(parsed.data.productSlug);

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const priced = calculatePrice(product, parsed.data.selections);

  if (!priced.valid) {
    return NextResponse.json(
      { error: priced.errors.join(" ") || "Configuration is invalid." },
      { status: 400 },
    );
  }

  if (!product?.id) {
    return NextResponse.json(
      { error: "Product catalog is unavailable. Seed the database first." },
      { status: 503 },
    );
  }

  const db = getDb();
  const stripe = getStripe();

  if (!db) {
    return NextResponse.json(
      { error: "Database configuration is missing." },
      { status: 503 },
    );
  }

  const [configuration] = await db
    .insert(configurations)
    .values({
      productId: product.id,
      selections: {
        productSlug: product.slug,
        productName: product.name,
        productImageUrl: product.imageUrl,
        submittedSelections: parsed.data.selections,
        normalizedSelections: priced.normalizedSelections,
        selectedOptions: priced.selectedOptions,
        lineItems: priced.lineItems,
      },
      subtotalCents: priced.subtotalCents,
      totalCents: priced.totalCents,
    })
    .returning();

  const [order] = await db
    .insert(orders)
    .values({
      configurationId: configuration.id,
      status: "pending",
      amountTotalCents: priced.totalCents,
    })
    .returning();

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${getSiteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getSiteUrl()}/cancel`,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: priced.totalCents,
              product_data: {
                name: product.name,
                description: product.shortDescription,
                images: [product.imageUrl].filter((url) => url.startsWith("https://")),
              },
            },
          },
        ],
        metadata: {
          productSlug: product.slug,
          configurationId: configuration.id,
          orderId: order.id,
        },
      });

      await db
        .update(orders)
        .set({
          stripeSessionId: session.id,
        })
        .where(eq(orders.id, order.id));

      await recordOrderEvent(order.id, "checkout_session_created", {
        sessionId: session.id,
        amountTotalCents: priced.totalCents,
      });

      if (!session.url) {
        return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
      }

      return NextResponse.json({ url: session.url });
    } catch (error) {
      await db
        .update(orders)
        .set({
          status: "checkout_failed",
        })
        .where(eq(orders.id, order.id));

      await recordOrderEvent(order.id, "checkout_session_failed", {
        message: error instanceof Error ? error.message : "Unknown Stripe error",
      });

      return NextResponse.json({ error: "Checkout could not be created." }, { status: 500 });
    }
  }

  // Mock checkout fallback when Stripe is unavailable
  const mockSessionId = `mock_${order.id}`;

  await db
    .update(orders)
    .set({ status: "mock_paid", stripeSessionId: mockSessionId })
    .where(eq(orders.id, order.id));

  await recordOrderEvent(order.id, "mock_checkout_completed", {
    mockSessionId,
    amountTotalCents: priced.totalCents,
  });

  return NextResponse.json({ url: `${getSiteUrl()}/success?session_id=${mockSessionId}` });
}
