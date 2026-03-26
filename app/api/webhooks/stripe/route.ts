import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendCustomerConfirmationEmail, sendOrderEmail } from "@/lib/email";
import { getDb } from "@/lib/db";
import { getOrderById, getOrderBySessionId, getOrderItemsByOrderId, getConfigurationSnapshot, recordOrderEvent } from "@/lib/orders";
import { incrementPromoCodeUsage } from "@/lib/promo-codes";
import { orders } from "@/lib/schema";
import { getStripe } from "@/lib/stripe";
import * as Sentry from "@sentry/nextjs";

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
  } catch {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
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

    // Idempotency guard — skip if already processed
    if (orderRecord.order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    const amountTotalCents = session.amount_total ?? 0;
    const nextStatus =
      amountTotalCents === orderRecord.order.amountTotalCents ? "paid" : "amount_mismatch";

    if (nextStatus === "amount_mismatch") {
      console.error(
        `Amount mismatch for order ${orderRecord.order.id}: expected ${orderRecord.order.amountTotalCents}, got ${amountTotalCents}`,
      );
      Sentry.captureMessage("Stripe amount mismatch", {
        level: "error",
        extra: {
          orderId: orderRecord.order.id,
          stripeAmount: amountTotalCents,
          storedAmount: orderRecord.order.amountTotalCents,
        },
      });
    }

    // Parse addresses from Stripe metadata (backfill safety net)
    let shippingAddress = null;
    try {
      const raw = session.metadata?.shippingAddress;
      if (raw) shippingAddress = JSON.parse(raw);
    } catch { /* ignore malformed JSON */ }

    let billingAddress = null;
    try {
      const raw = session.metadata?.billingAddress;
      if (raw) billingAddress = JSON.parse(raw);
    } catch { /* ignore malformed JSON */ }

    await db
      .update(orders)
      .set({
        status: nextStatus,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
        customerEmail: session.customer_details?.email ?? null,
        customerName: session.metadata?.customerName || null,
        customerPhone: session.metadata?.customerPhone || null,
        shippingAddress,
        billingAddress,
        orderNotes: session.metadata?.orderNotes || null,
      })
      .where(eq(orders.id, orderRecord.order.id));

    await recordOrderEvent(orderRecord.order.id, event.type, event.data.object);

    // Increment promo code usage on successful payment
    if (nextStatus === "paid" && orderRecord.order.promoCodeId) {
      try {
        await incrementPromoCodeUsage(orderRecord.order.promoCodeId);
      } catch (err) {
        console.error("Failed to increment promo code usage:", err);
      }
    }

    if (nextStatus === "paid" || nextStatus === "amount_mismatch") {
      const snapshot = getConfigurationSnapshot(orderRecord);
      const items = await getOrderItemsByOrderId(orderRecord.order.id);
      const customerEmail = session.customer_details?.email ?? null;

      // Store owner notification — failure doesn't block customer email
      try {
        await sendOrderEmail({
          orderId: orderRecord.order.id,
          amountTotalCents,
          customerEmail,
          customerName: session.metadata?.customerName || null,
          customerPhone: session.metadata?.customerPhone || null,
          productName: snapshot?.productName ?? orderRecord.product?.name ?? "FestiveMotion order",
          items: items.map((i) => ({
            label: i.label,
            quantity: i.quantity,
            totalCents: i.totalCents,
          })),
          shippingAddress,
          billingAddress,
          orderNotes: orderRecord.order.orderNotes ?? null,
          promoCode: orderRecord.order.promoCode ?? null,
          discountAmountCents: orderRecord.order.discountAmountCents ?? null,
          subtotalCents: orderRecord.order.subtotalCents ?? null,
          shippingFeeCents: orderRecord.order.shippingFeeCents ?? null,
          taxAmountCents: orderRecord.order.taxAmountCents ?? null,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        });
      } catch (err) {
        Sentry.captureException(err);
        console.error("Store notification email failed:", err);
      }

      // Customer confirmation email — only for successful payments
      if (customerEmail && nextStatus === "paid") {
        try {
          await sendCustomerConfirmationEmail({
            orderId: orderRecord.order.id,
            amountTotalCents,
            customerEmail,
            customerName: session.metadata?.customerName || null,
            shippingAddress,
            billingAddress,
            orderNotes: orderRecord.order.orderNotes ?? null,
            items: items.map((i) => ({
              label: i.label,
              quantity: i.quantity,
              totalCents: i.totalCents,
            })),
            promoCode: orderRecord.order.promoCode ?? null,
            discountAmountCents: orderRecord.order.discountAmountCents ?? null,
            subtotalCents: orderRecord.order.subtotalCents ?? null,
            shippingFeeCents: orderRecord.order.shippingFeeCents ?? null,
            taxAmountCents: orderRecord.order.taxAmountCents ?? null,
          });
        } catch (err) {
          Sentry.captureException(err);
          console.error("Customer confirmation email failed:", err);
        }
      }
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
