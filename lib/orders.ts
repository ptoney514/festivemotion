import "server-only";
import { desc, eq, inArray } from "drizzle-orm";
import { configurations, orderEvents, orderItems, orders, products } from "@/lib/schema";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
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
  if (!sessionId.startsWith("mock_") && !STRIPE_SESSION_RE.test(sessionId)) {
    return { state: "not_found" as const };
  }

  const fromDatabase = await getOrderBySessionId(sessionId);

  if (fromDatabase) {
    const items = await getOrderItemsByOrderId(fromDatabase.order.id);

    return {
      state:
        ["paid", "mock_paid"].includes(fromDatabase.order.status) ? ("paid" as const) : ("processing" as const),
      orderId: fromDatabase.order.id,
      email: fromDatabase.order.customerEmail,
      customerName: fromDatabase.order.customerName ?? null,
      shippingAddress: fromDatabase.order.shippingAddress ?? null,
      amountTotalCents: fromDatabase.order.amountTotalCents,
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
    })
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (!lastOrder) return null;

  return lastOrder;
}
