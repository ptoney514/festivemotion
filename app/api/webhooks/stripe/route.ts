import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email";
import { getDb } from "@/lib/db";
import { getOrderById, getOrderBySessionId, getOrderItemsByOrderId, getConfigurationSnapshot, recordOrderEvent } from "@/lib/orders";
import { orders } from "@/lib/schema";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const db = getDb();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !db || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ error: "Webhook configuration is incomplete." }, { status: 400 });
  }

  const payload = await request.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature." },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const orderRecord = orderId
      ? await getOrderById(orderId)
      : await getOrderBySessionId(session.id);

    if (!orderRecord) {
      return NextResponse.json({ received: true });
    }

    const amountTotalCents = session.amount_total ?? 0;
    const nextStatus =
      amountTotalCents === orderRecord.order.amountTotalCents ? "paid" : "amount_mismatch";

    await db
      .update(orders)
      .set({
        status: nextStatus,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        customerEmail: session.customer_details?.email ?? null,
      })
      .where(eq(orders.id, orderRecord.order.id));

    await recordOrderEvent(orderRecord.order.id, event.type, event.data.object);

    if (nextStatus === "paid") {
      const snapshot = getConfigurationSnapshot(orderRecord);
      const items = await getOrderItemsByOrderId(orderRecord.order.id);
      await sendOrderEmail({
        orderId: orderRecord.order.id,
        amountTotalCents,
        customerEmail: session.customer_details?.email ?? null,
        productName: snapshot?.productName ?? orderRecord.product?.name ?? "FestiveMotion order",
        items: items.map((i) => ({
          label: i.label,
          quantity: i.quantity,
          totalCents: i.totalCents,
        })),
      });
    }
  } else if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      await recordOrderEvent(orderId, event.type, paymentIntent);
    }
  }

  return NextResponse.json({ received: true });
}
