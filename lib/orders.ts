import "server-only";
import { eq } from "drizzle-orm";
import { configurations, orderEvents, orders, products } from "@/lib/schema";
import { getDb } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import type { ConfigurationSnapshot } from "@/lib/types";

type OrderRecord = Awaited<ReturnType<typeof getOrderBySessionId>>;

export async function getOrderBySessionId(sessionId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const [row] = await db
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

  return row ?? null;
}

export async function getOrderById(orderId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const [row] = await db
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

  return row ?? null;
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
  if (!record) {
    return null;
  }

  return record.configuration.selections as ConfigurationSnapshot;
}

export async function getSuccessSummary(sessionId: string) {
  const fromDatabase = await getOrderBySessionId(sessionId);

  if (fromDatabase) {
    return {
      state:
        fromDatabase.order.status === "paid" ? ("paid" as const) : ("processing" as const),
      orderId: fromDatabase.order.id,
      email: fromDatabase.order.customerEmail,
      amountTotalCents: fromDatabase.order.amountTotalCents,
      productName: fromDatabase.product.name,
      snapshot: getConfigurationSnapshot(fromDatabase),
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
