import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { getAccessoryBySlug } from "@/lib/accessories";
import { getCatalogProductBySlug } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { recordOrderEvent } from "@/lib/orders";
import { calculatePrice } from "@/lib/pricing";
import { configurations, orderItems, orders } from "@/lib/schema";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { cartCheckoutRequestSchema } from "@/lib/validators";
import * as Sentry from "@sentry/nextjs";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = cartCheckoutRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const { customerEmail, customerName, customerPhone, shippingAddress } = parsed.data;

  const db = getDb();
  const stripe = getStripe();

  if (!db) {
    return NextResponse.json(
      { error: "Database configuration is missing." },
      { status: 503 },
    );
  }

  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItemValues: {
    configurationId: string | null;
    itemType: string;
    label: string;
    slug: string;
    unitPriceCents: number;
    quantity: number;
    totalCents: number;
    metadata: unknown;
  }[] = [];

  let cartTotalCents = 0;

  for (const item of parsed.data.items) {
    if (item.kind === "configured") {
      const product = await getCatalogProductBySlug(item.productSlug);

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productSlug}" not found.` },
          { status: 404 },
        );
      }

      if (!product.id) {
        return NextResponse.json(
          { error: "Product catalog is unavailable. Seed the database first." },
          { status: 503 },
        );
      }

      const priced = calculatePrice(product, item.selections);

      if (!priced.valid) {
        return NextResponse.json(
          { error: priced.errors.join(" ") || "Configuration is invalid." },
          { status: 400 },
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
            submittedSelections: item.selections,
            normalizedSelections: priced.normalizedSelections,
            selectedOptions: priced.selectedOptions,
            lineItems: priced.lineItems,
          },
          subtotalCents: priced.subtotalCents,
          totalCents: priced.totalCents,
        })
        .returning();

      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: priced.totalCents,
          product_data: {
            name: product.name,
            description: priced.selectedOptions
              .map((opt) => `${opt.groupName}: ${opt.labels.join(", ")}`)
              .join(" | ")
              .slice(0, 500) || product.shortDescription,
            images: [product.imageUrl].filter((url) => url.startsWith("https://")),
          },
        },
      });

      orderItemValues.push({
        configurationId: configuration.id,
        itemType: "configured",
        label: product.name,
        slug: product.slug,
        unitPriceCents: priced.totalCents,
        quantity: 1,
        totalCents: priced.totalCents,
        metadata: {
          selectedOptions: priced.selectedOptions,
          lineItems: priced.lineItems,
        },
      });

      cartTotalCents += priced.totalCents;
    } else {
      // accessory
      const accessory = getAccessoryBySlug(item.accessorySlug);

      if (!accessory) {
        return NextResponse.json(
          { error: `Accessory "${item.accessorySlug}" not found.` },
          { status: 404 },
        );
      }

      const itemTotal = accessory.priceCents * item.quantity;

      stripeLineItems.push({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: accessory.priceCents,
          product_data: {
            name: accessory.label,
            description: accessory.description,
          },
        },
      });

      orderItemValues.push({
        configurationId: null,
        itemType: "accessory",
        label: accessory.label,
        slug: accessory.slug,
        unitPriceCents: accessory.priceCents,
        quantity: item.quantity,
        totalCents: itemTotal,
        metadata: {},
      });

      cartTotalCents += itemTotal;
    }
  }

  // Create a Stripe Customer for order history / Customer Portal support
  let stripeCustomerId: string | null = null;
  if (stripe) {
    try {
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        phone: customerPhone ?? undefined,
        address: {
          line1: shippingAddress.street,
          line2: shippingAddress.apt ?? undefined,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zip,
          country: shippingAddress.country,
        },
        shipping: {
          name: customerName,
          address: {
            line1: shippingAddress.street,
            line2: shippingAddress.apt ?? undefined,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country: shippingAddress.country,
          },
        },
        metadata: { source: "festivemotion-checkout" },
      });
      stripeCustomerId = customer.id;
    } catch (err) {
      console.error("Failed to create Stripe Customer:", err);
    }
  }

  // Link order to authenticated user if available
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const [order] = await db
    .insert(orders)
    .values({
      configurationId: null,
      userId,
      status: "pending",
      amountTotalCents: cartTotalCents,
      customerEmail,
      customerName,
      customerPhone: customerPhone ?? null,
      shippingAddress,
      stripeCustomerId,
    })
    .returning();

  await db.insert(orderItems).values(
    orderItemValues.map((oi) => ({
      orderId: order.id,
      configurationId: oi.configurationId,
      itemType: oi.itemType,
      label: oi.label,
      slug: oi.slug,
      unitPriceCents: oi.unitPriceCents,
      quantity: oi.quantity,
      totalCents: oi.totalCents,
      metadata: oi.metadata,
    })),
  );

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create(
        {
        mode: "payment",
        success_url: `${getSiteUrl()}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getSiteUrl()}/cancel`,
        line_items: stripeLineItems,
        ...(stripeCustomerId
          ? { customer: stripeCustomerId }
          : { customer_email: customerEmail }),
        metadata: {
          orderId: order.id,
          customerName: customerName ?? "",
          customerPhone: customerPhone ?? "",
          shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : "",
          itemCount: String(orderItemValues.length),
          itemSummary: orderItemValues
            .map((oi) => `${oi.quantity}x ${oi.label}`)
            .join(", ")
            .slice(0, 500),
        },
        },
        { idempotencyKey: `checkout-${order.id}` },
      );

      await db
        .update(orders)
        .set({ stripeSessionId: session.id })
        .where(eq(orders.id, order.id));

      await recordOrderEvent(order.id, "checkout_session_created", {
        sessionId: session.id,
        amountTotalCents: cartTotalCents,
        itemCount: orderItemValues.length,
      });

      if (!session.url) {
        return NextResponse.json(
          { error: "Stripe did not return a checkout URL." },
          { status: 500 },
        );
      }

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout session creation failed:", error);
      Sentry.captureException(error);

      await db
        .update(orders)
        .set({ status: "checkout_failed" })
        .where(eq(orders.id, order.id));

      await recordOrderEvent(order.id, "checkout_session_failed", {
        message: error instanceof Error ? error.message : "Unknown Stripe error",
      });

      return NextResponse.json(
        { error: "Checkout could not be created." },
        { status: 500 },
      );
    }
  }

  // Mock checkout fallback when Stripe is unavailable
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable." },
      { status: 503 },
    );
  }

  const mockSessionId = `mock_${order.id}`;

  await db
    .update(orders)
    .set({ status: "mock_paid", stripeSessionId: mockSessionId })
    .where(eq(orders.id, order.id));

  await recordOrderEvent(order.id, "mock_checkout_completed", {
    mockSessionId,
    amountTotalCents: cartTotalCents,
    itemCount: orderItemValues.length,
  });

  return NextResponse.json({ url: `${getSiteUrl()}/success?session_id=${mockSessionId}` });
}
