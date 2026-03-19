import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getOrdersByUserId } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders | FestiveMotion",
  description: "View and track your FestiveMotion purchases.",
};

function statusBadge(status: string) {
  const paid = ["paid", "mock_paid"].includes(status);
  const pending = status === "pending";

  const color = paid
    ? "bg-emerald-500/15 text-emerald-400"
    : pending
      ? "bg-amber-500/15 text-amber-400"
      : "bg-red-500/15 text-red-400";

  const label = paid ? "Paid" : pending ? "Pending" : "Failed";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {paid && <span>&#10003;</span>}
      {label}
    </span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          {orders.length === 0 ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                My Orders
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                No orders yet.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                Once you place an order, it will appear here.
              </p>
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a]"
                >
                  Browse products
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                My Orders
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                Order History
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/65">
                View and track your FestiveMotion purchases.
              </p>

              <div className="mt-8 space-y-4">
                {orders.map((order) => {
                  const itemCount = order.items.length;
                  const shortId = order.id.slice(0, 8).toUpperCase();
                  const shipping = order.shippingAddress as {
                    street?: string;
                    apt?: string;
                    city?: string;
                    state?: string;
                    zip?: string;
                  } | null;

                  return (
                    <details
                      key={order.id}
                      className="group rounded-[24px] border border-white/10 bg-black/20"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="text-xs text-white/40 transition group-open:rotate-90">
                            &#9654;
                          </span>
                          <span className="text-sm font-medium text-white">
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="font-mono text-xs text-white/40">
                            #{shortId}
                          </span>
                          {statusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(order.amountTotalCents)}
                          </span>
                        </div>
                      </summary>

                      <div className="border-t border-white/10 px-6 py-5">
                        <p className="text-xs text-white/40">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>

                        {order.items.length > 0 && (
                          <div className="mt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                              Order Items
                            </p>
                            <div className="mt-2 space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-white/80">
                                    {item.label}
                                    {item.quantity > 1 && (
                                      <span className="text-white/40"> x{item.quantity}</span>
                                    )}
                                  </span>
                                  <span className="font-medium text-white">
                                    {formatCurrency(item.totalCents)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          {order.customerName && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                                Customer
                              </p>
                              <p className="mt-1 text-sm text-white/70">
                                {order.customerName}
                              </p>
                            </div>
                          )}
                          {shipping?.street && (
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                                Ships To
                              </p>
                              <p className="mt-1 text-sm text-white/70">
                                {shipping.street}
                                {shipping.apt && `, ${shipping.apt}`}
                              </p>
                              <p className="text-sm text-white/70">
                                {shipping.city}, {shipping.state} {shipping.zip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a]"
                >
                  Browse products
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
                >
                  Contact the team
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
