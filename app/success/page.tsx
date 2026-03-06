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
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">Total</p>
                  <p className="mt-2 text-xl font-semibold text-white">
                    {summary.amountTotalCents
                      ? formatCurrency(summary.amountTotalCents)
                      : "Unavailable"}
                  </p>
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
              ) : summary.snapshot?.selectedOptions?.length ? (
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
                Stripe has the checkout session, but the webhook may still be writing the
                final order status into Neon. Refresh this page in a few seconds if the
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
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-white/90"
            >
              Back to catalog
            </Link>
            <a
              href="mailto:info@festivemotion.com"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
            >
              Contact the team
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
