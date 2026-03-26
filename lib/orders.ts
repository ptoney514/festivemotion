import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { configurations, orderEvents, orderItems, orders, products } from "@/lib/schema";
import { getDb } from "@/lib/db";
import { incrementPromoCodeUsage } from "@/lib/promo-codes";
import { getStripe } from "@/lib/stripe";
import { sendCustomerConfirmationEmail, sendOrderEmail } from "@/lib/email";
import type { ConfigurationSnapshot } from "@/lib/types";

type OrderRecord = Awaited<ReturnType<typeof getOrderBySessionId>>;

export async function getOrderBySessionId(sessionId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  // Try with configuration join first (legacy single-item orders)
  const [withConfig] = await db
    .select({
      order: orders,
      configuration: configurations,
      product: products,
    })
    .from(orders)
    .innerJoin(configurations, eq(orders.configurationId, configurations.id))
    .innerJoin(products, eq(configurations.productId, products.id))
    .where(eq(orders.stripeSessionId, sessionId))
    .limit(1);

  if (withConfig) {
    return withConfig;
  }

  // Multi-item order (configurationId is null)
  const [orderOnly] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, sessionId))
    .limit(1);

  if (orderOnly) {
    return { order: orderOnly, configuration: null, product: null };
  }

  return null;
}

export async function getOrderById(orderId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  // Try with configuration join first (legacy single-item orders)
  const [withConfig] = await db
    .select({
      order: orders,
      configuration: configurations,
      product: products,
    })
    .from(orders)
    .innerJoin(configurations, eq(orders.configurationId, configurations.id))
    .innerJoin(products, eq(configurations.productId, products.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  if (withConfig) {
    return withConfig;
  }

  // Multi-item order
  const [orderOnly] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (orderOnly) {
    return { order: orderOnly, configuration: null, product: null };
  }

  return null;
}

export async function getOrderItemsByOrderId(orderId: string) {
  const db = getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

export async function recordOrderEvent(
  orderId: string,
  type: string,
  payload: unknown,
) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.insert(orderEvents).values({
    orderId,
    type,
    payload,
  });
}

export function getConfigurationSnapshot(
  record: OrderRecord,
): ConfigurationSnapshot | null {
  if (!record || !record.configuration) {
    return null;
  }

  return record.configuration.selections as ConfigurationSnapshot;
}

export type OrderItemSummary = {
  itemType: string;
  label: string;
  slug: string;
  unitPriceCents: number;
  quantity: number;
  totalCents: number;
  metadata: unknown;
};

export async function getSuccessSummary(sessionId: string) {
  const STRIPE_SESSION_RE = /^cs_(test|live)_[a-zA-Z0-9]+$/;
  if (!sessionId.startsWith("mock_") && !sessionId.startsWith("free_") && !STRIPE_SESSION_RE.test(sessionId)) {
    return { state: "not_found" as const };
  }

  const fromDatabase = await getOrderBySessionId(sessionId);

  if (fromDatabase) {
    const items = await getOrderItemsByOrderId(fromDatabase.order.id);

    // If order is still pending, check Stripe and confirm payment + send emails
    if (fromDatabase.order.status === "pending") {
      const stripe = getStripe();
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (session.payment_status === "paid") {
            const db = getDb();
            if (db) {
              const amountTotalCents = session.amount_total ?? 0;
              const nextStatus =
                amountTotalCents === fromDatabase.order.amountTotalCents ? "paid" : "amount_mismatch";

              await db
                .update(orders)
                .set({
                  status: nextStatus,
                  stripePaymentIntentId:
                    typeof session.payment_intent === "string" ? session.payment_intent : null,
                })
                .where(eq(orders.id, fromDatabase.order.id));

              await recordOrderEvent(fromDatabase.order.id, "checkout.session.completed_via_success_page", {
                sessionId: session.id,
                amountTotalCents,
              });

              // Increment promo code usage
              if (nextStatus === "paid" && fromDatabase.order.promoCodeId) {
                try {
                  await incrementPromoCodeUsage(fromDatabase.order.promoCodeId);
                } catch (err) {
                  console.error("Failed to increment promo code usage:", err);
                }
              }

              // Send confirmation emails
              const customerEmail = fromDatabase.order.customerEmail;
              const snapshot = getConfigurationSnapshot(fromDatabase);

              try {
                await sendOrderEmail({
                  orderId: fromDatabase.order.id,
                  amountTotalCents,
                  customerEmail,
                  customerName: fromDatabase.order.customerName ?? null,
                  customerPhone: fromDatabase.order.customerPhone ?? null,
                  productName: snapshot?.productName ?? fromDatabase.product?.name ?? "FestiveMotion order",
                  items: items.map((i) => ({
                    label: i.label,
                    quantity: i.quantity,
                    totalCents: i.totalCents,
                  })),
                  shippingAddress: fromDatabase.order.shippingAddress as { street: string; apt?: string; city: string; state: string; zip: string; country: string } | null,
                  billingAddress: fromDatabase.order.billingAddress as { street: string; apt?: string; city: string; state: string; zip: string; country: string } | null,
                  orderNotes: fromDatabase.order.orderNotes ?? null,
                  promoCode: fromDatabase.order.promoCode ?? null,
                  discountAmountCents: fromDatabase.order.discountAmountCents ?? null,
                  subtotalCents: fromDatabase.order.subtotalCents ?? null,
                  shippingFeeCents: fromDatabase.order.shippingFeeCents ?? null,
                  taxAmountCents: fromDatabase.order.taxAmountCents ?? null,
                  stripePaymentIntentId:
                    typeof session.payment_intent === "string" ? session.payment_intent : null,
                });
              } catch (err) {
                console.error("Store notification email failed:", err);
              }

              if (customerEmail && nextStatus === "paid") {
                try {
                  await sendCustomerConfirmationEmail({
                    orderId: fromDatabase.order.id,
                    amountTotalCents,
                    customerEmail,
                    customerName: fromDatabase.order.customerName ?? null,
                    shippingAddress: fromDatabase.order.shippingAddress as { street: string; apt?: string; city: string; state: string; zip: string; country: string } | null,
                    billingAddress: fromDatabase.order.billingAddress as { street: string; apt?: string; city: string; state: string; zip: string; country: string } | null,
                    orderNotes: fromDatabase.order.orderNotes ?? null,
                    items: items.map((i) => ({
                      label: i.label,
                      quantity: i.quantity,
                      totalCents: i.totalCents,
                    })),
                    promoCode: fromDatabase.order.promoCode ?? null,
                    discountAmountCents: fromDatabase.order.discountAmountCents ?? null,
                    subtotalCents: fromDatabase.order.subtotalCents ?? null,
                    shippingFeeCents: fromDatabase.order.shippingFeeCents ?? null,
                    taxAmountCents: fromDatabase.order.taxAmountCents ?? null,
                  });
                } catch (err) {
                  console.error("Customer confirmation email failed:", err);
                }
              }

              fromDatabase.order.status = nextStatus;
            }
          }
        } catch {
          // Stripe retrieval failed — show processing state
        }
      }
    }

    return {
      state:
        ["paid", "mock_paid"].includes(fromDatabase.order.status) ? ("paid" as const) : ("processing" as const),
      orderId: fromDatabase.order.id,
      email: fromDatabase.order.customerEmail,
      customerName: fromDatabase.order.customerName ?? null,
      shippingAddress: fromDatabase.order.shippingAddress ?? null,
      billingAddress: fromDatabase.order.billingAddress ?? null,
      orderNotes: fromDatabase.order.orderNotes ?? null,
      amountTotalCents: fromDatabase.order.amountTotalCents,
      subtotalCents: fromDatabase.order.subtotalCents ?? null,
      shippingFeeCents: fromDatabase.order.shippingFeeCents ?? null,
      taxAmountCents: fromDatabase.order.taxAmountCents ?? null,
      promoCode: fromDatabase.order.promoCode ?? null,
      discountAmountCents: fromDatabase.order.discountAmountCents ?? null,
      productName: fromDatabase.product?.name ?? "FestiveMotion order",
      snapshot: getConfigurationSnapshot(fromDatabase),
      items: items.map((i) => ({
        itemType: i.itemType,
        label: i.label,
        slug: i.slug,
        unitPriceCents: i.unitPriceCents,
        quantity: i.quantity,
        totalCents: i.totalCents,
        metadata: i.metadata,
      })) as OrderItemSummary[],
    };
  }

  const stripe = getStripe();

  if (!stripe) {
    return {
      state: "not_found" as const,
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return {
        state: "processing" as const,
        orderId: session.metadata?.orderId ?? null,
        email: session.customer_details?.email ?? null,
        amountTotalCents: session.amount_total ?? null,
        productName: session.metadata?.productSlug ?? "FestiveMotion build",
        snapshot: null,
        items: [] as OrderItemSummary[],
      };
    }

    return {
      state: "not_found" as const,
    };
  } catch {
    return {
      state: "not_found" as const,
    };
  }
}

export async function getOrdersByUserId(userId: string) {
  const db = getDb();
  if (!db) return [];

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  if (userOrders.length === 0) return [];

  const orderIds = userOrders.map((o) => o.id);
  const allItems = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrder = new Map<string, (typeof allItems)[number][]>();
  for (const item of allItems) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return userOrders.map((order) => ({
    ...order,
    items: itemsByOrder.get(order.id) ?? [],
  }));
}

export async function getLastOrderInfo(userId: string) {
  const db = getDb();
  if (!db) return null;

  const [lastOrder] = await db
    .select({
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      shippingAddress: orders.shippingAddress,
      billingAddress: orders.billingAddress,
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (!lastOrder) return null;

  return lastOrder;
}
