import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getSuccessSummary } from "@/lib/orders";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export const metadata = {
  title: "Order Success | FestiveMotion",
  description: "View the status of your FestiveMotion order.",
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  const summary = sessionId ? await getSuccessSummary(sessionId) : null;

  return (
    <>
      <SiteHeader />
      {sessionId ? <ClearCartOnMount /> : null}
      <main className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          {!sessionId || !summary ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Order lookup
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                We couldn’t find that checkout session.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                If you completed payment, the webhook may still be processing. Give it a
                moment, or return to the catalog and start another build.
              </p>
            </>
          ) : summary.state === "paid" ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Payment received
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                Your order is confirmed.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                Order <span className="font-semibold text-white">{summary.orderId}</span> is
                recorded. FestiveMotion can now use the stored configuration snapshot to
                fulfill the build you paid for.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                    {summary.items && summary.items.length > 0 ? "Items" : "Product"}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {summary.items && summary.items.length > 0
                      ? `${summary.items.length} item${summary.items.length > 1 ? "s" : ""}`
                      : summary.productName}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Pricing</p>
                  <div className="mt-3 space-y-1.5">
                    {summary.subtotalCents != null ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Subtotal</span>
                        <span className="text-white">{formatCurrency(summary.subtotalCents)}</span>
                      </div>
                    ) : null}
                    {summary.promoCode && summary.discountAmountCents ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400">Promo {summary.promoCode}</span>
                        <span className="text-emerald-400">-{formatCurrency(summary.discountAmountCents)}</span>
                      </div>
                    ) : null}
                    {summary.shippingFeeCents != null ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Shipping</span>
                        <span className="text-white">{formatCurrency(summary.shippingFeeCents)}</span>
                      </div>
                    ) : null}
                    {summary.taxAmountCents != null ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Sales Tax (7%)</span>
                        <span className="text-white">{formatCurrency(summary.taxAmountCents)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between border-t border-white/10 pt-2 text-base">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-semibold text-white">
                        {summary.amountTotalCents != null
                          ? formatCurrency(summary.amountTotalCents)
                          : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {summary.items && summary.items.length > 0 ? (
                <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Order items</p>
                  <div className="mt-4 space-y-3">
                    {summary.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-white/50">
                          {item.label}
                          {item.quantity > 1 ? ` x${item.quantity}` : ""}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(item.totalCents)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {(summary.customerName || summary.shippingAddress || summary.billingAddress) ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {summary.customerName ? (
                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Customer</p>
                      <p className="mt-2 text-base font-semibold text-white">{summary.customerName}</p>
                    </div>
                  ) : null}
                  {summary.billingAddress ? (
                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Billing address</p>
                      <p className="mt-2 text-sm leading-6 text-white">
                        {summary.billingAddress.street}
                        {summary.billingAddress.apt ? `, ${summary.billingAddress.apt}` : ""}
                        <br />
                        {summary.billingAddress.city}, {summary.billingAddress.state}{" "}
                        {summary.billingAddress.zip}
                        <br />
                        {summary.billingAddress.country}
                      </p>
                    </div>
                  ) : null}
                  {summary.shippingAddress ? (
                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Ships to</p>
                      <p className="mt-2 text-sm leading-6 text-white">
                        {summary.shippingAddress.street}
                        {summary.shippingAddress.apt ? `, ${summary.shippingAddress.apt}` : ""}
                        <br />
                        {summary.shippingAddress.city}, {summary.shippingAddress.state}{" "}
                        {summary.shippingAddress.zip}
                        <br />
                        {summary.shippingAddress.country}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {summary.orderNotes ? (
                <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Order Notes</p>
                  <p className="mt-2 text-sm text-white/70">{summary.orderNotes}</p>
                </div>
              ) : null}

              {summary.snapshot?.selectedOptions?.length ? (
                <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Build summary</p>
                  <div className="mt-4 space-y-3">
                    {summary.snapshot.selectedOptions.map((group) => (
                      <div key={group.groupSlug} className="flex items-start justify-between gap-4">
                        <span className="text-sm text-white/50">{group.groupName}</span>
                        <span className="max-w-[65%] text-right text-sm font-medium text-white">
                          {group.labels.join(", ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : summary.state === "processing" ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Payment processing
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                Your payment went through. We’re finishing the order record.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                Your order is being finalized. Refresh this page in a few seconds if the
                summary doesn’t appear immediately.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Order lookup
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                We couldn’t find that checkout session.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                If you completed payment, the webhook may still be processing. Give it a
                moment, or return to the catalog and start another build.
              </p>
            </>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="button-light inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              Back to catalog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
            >
              Contact the team
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
