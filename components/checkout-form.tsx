"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { getCartItemTotal } from "@/lib/cart-types";
import type { CartItem } from "@/lib/cart-types";
import { formatCurrency } from "@/lib/format";

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f]";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

function CartItemRow({ item }: { item: CartItem }) {
  const isConfigured = item.kind === "configured";
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={isConfigured ? item.productImageUrl : item.imageUrl}
          alt={isConfigured ? item.productName : item.label}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {isConfigured ? item.productName : item.label}
        </p>
        {isConfigured && (
          <p className="mt-0.5 line-clamp-2 text-xs text-white/50">
            {item.selectedOptions.map((o) => o.labels.join(", ")).join(" / ")}
          </p>
        )}
        {!isConfigured && item.quantity > 1 && (
          <p className="mt-0.5 text-xs text-white/50">Qty: {item.quantity}</p>
        )}
        <p className="mt-1 text-sm font-medium text-white">
          {formatCurrency(getCartItemTotal(item))}
        </p>
      </div>
    </div>
  );
}

const trustBadges = [
  { src: "/figma/trust-warranty.svg", label: "Warranty" },
  { src: "/figma/trust-shipping.svg", label: "Shipping" },
  { src: "/figma/trust-support.svg", label: "Support" },
];

export function CheckoutForm() {
  const router = useRouter();
  const auth = useAuth();
  const { items, totalCents, hydrated } = useCart();

  // Account section state
  const [accountTab, setAccountTab] = useState<"create" | "guest">("guest");
  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountError, setAccountError] = useState("");

  // Contact info
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Shipping
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  // Checkout
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Redirect if empty cart
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/products");
    }
  }, [hydrated, items.length, router]);

  // Pre-fill contact info when auth user loads
  useEffect(() => {
    if (auth.user) {
      setContactName(auth.user.name);
      setContactEmail(auth.user.email);
    }
  }, [auth.user]);

  function handleCreateAccount() {
    setAccountError("");
    if (!accountEmail || !accountName || !accountPassword) {
      setAccountError("All fields are required.");
      return;
    }
    auth.createAccount(accountEmail, accountName, accountPassword);
    setContactName(accountName);
    setContactEmail(accountEmail);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError("");

    const email = contactEmail || accountEmail;
    if (!email) {
      setCheckoutError("Email is required.");
      return;
    }
    if (!street || !city || !state || !zip) {
      setCheckoutError("Please fill in all required shipping fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => {
          if (item.kind === "configured") {
            return {
              kind: "configured" as const,
              productSlug: item.productSlug,
              selections: item.selections,
            };
          }
          return {
            kind: "accessory" as const,
            accessorySlug: item.accessorySlug,
            quantity: item.quantity,
          };
        }),
        customerEmail: email,
        customerName: contactName,
        shippingAddress: {
          street,
          apt: apt || undefined,
          city,
          state,
          zip,
          country: "US",
        },
      };

      const res = await fetch("/api/cart-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        setCheckoutError(data.error ?? "Checkout could not be started.");
        setIsSubmitting(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      setCheckoutError("Checkout could not be started.");
      setIsSubmitting(false);
    }
  }

  if (!hydrated || items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Review your order and enter your details to complete your purchase.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 gap-8 lg:grid lg:grid-cols-[1fr_400px]">
        {/* Left Column — Form Sections */}
        <div className="space-y-6">
          {/* Section A: Account */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Account
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Sign in or continue as guest
            </h2>

            {auth.isLoading ? (
              <div className="mt-4 text-sm text-white/40">Loading...</div>
            ) : auth.user ? (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-white">
                  Signed in as <span className="font-semibold">{auth.user.email}</span>
                </span>
                <button
                  type="button"
                  onClick={auth.logout}
                  className="text-xs text-white/40 transition hover:text-[#ff5a1f]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountTab("guest")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      accountTab === "guest"
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Continue as Guest
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountTab("create")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      accountTab === "create"
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {accountError && (
                  <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {accountError}
                  </div>
                )}

                {accountTab === "guest" ? (
                  <div className="mt-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className={inputClass}
                    />
                    <p className="mt-2 text-xs text-white/30">
                      We'll use this for your order confirmation.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={handleCreateAccount}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/20"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Section B: Contact Information */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Contact
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Contact information
            </h2>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Section C: Shipping Address */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Shipping
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Shipping address
            </h2>
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Apt / Suite (optional)"
                value={apt}
                onChange={(e) => setApt(e.target.value)}
                className={inputClass}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className={inputClass}
                />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">State</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="ZIP code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Mobile-only order summary */}
          <div className="lg:hidden">
            <OrderSummaryCard items={items} totalCents={totalCents} isSubmitting={isSubmitting} />
          </div>
        </div>

        {/* Right Column — Sticky Order Summary (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <OrderSummaryCard items={items} totalCents={totalCents} isSubmitting={isSubmitting} />
          </div>
        </div>

        {/* Checkout error at bottom */}
        {checkoutError && (
          <div className="col-span-full mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {checkoutError}
          </div>
        )}
      </form>
    </div>
  );
}

function OrderSummaryCard({
  items,
  totalCents,
  isSubmitting,
}: {
  items: CartItem[];
  totalCents: number;
  isSubmitting: boolean;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
        Order Summary
      </p>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/55">Subtotal</span>
          <span className="text-white">{formatCurrency(totalCents)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/55">Shipping</span>
          <span className="text-white/55">Calculated at payment</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-xl font-semibold text-white">{formatCurrency(totalCents)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a] disabled:opacity-60"
      >
        {isSubmitting ? "Redirecting to Stripe..." : "Pay with Stripe"}
      </button>

      <p className="mt-3 text-center text-xs text-white/30">
        You'll be redirected to Stripe's secure checkout to complete payment.
      </p>

      <div className="mt-6 flex items-center justify-center gap-6 border-t border-white/10 pt-5">
        {trustBadges.map((badge) => (
          <div key={badge.label} className="flex flex-col items-center gap-1.5">
            <Image src={badge.src} alt={badge.label} width={24} height={24} className="opacity-50" />
            <span className="text-[10px] text-white/30">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
