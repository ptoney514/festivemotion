"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { getCartItemTotal } from "@/lib/cart-types";
import type { CartItem } from "@/lib/cart-types";
import { SHIPPING_FEE_CENTS, TAX_RATE } from "@/lib/checkout-constants";
import { formatCurrency } from "@/lib/format";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const inputBase =
  "w-full rounded-2xl border bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition";
const inputNormal = `${inputBase} border-white/10`;
const inputError = `${inputBase} border-red-500/50`;

const trustBadges = [
  { src: "/figma/trust-warranty.svg", label: "Warranty" },
  { src: "/figma/trust-shipping.svg", label: "Shipping" },
  { src: "/figma/trust-support.svg", label: "Support" },
];

// --- Validation helpers ---

type FormFields = {
  name: string;
  email: string;
  phone: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  shipStreet: string;
  shipApt: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  orderNotes: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const PHONE_RE = /^[\d\s().+\-]{7,20}$/;

function validateField(field: keyof FormFields, value: string): string {
  switch (field) {
    case "name":
      if (!value.trim()) return "Full name is required";
      if (value.length > 100) return "Name must be under 100 characters";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!EMAIL_RE.test(value)) return "Please enter a valid email address";
      return "";
    case "phone":
      if (value.trim() && !PHONE_RE.test(value)) return "Please enter a valid phone number";
      return "";
    case "street":
    case "shipStreet":
      if (!value.trim()) return "Street address is required";
      if (value.length > 200) return "Street must be under 200 characters";
      return "";
    case "city":
    case "shipCity":
      if (!value.trim()) return "City is required";
      if (value.length > 100) return "City must be under 100 characters";
      return "";
    case "state":
    case "shipState":
      if (!value) return "Please select a state";
      return "";
    case "zip":
    case "shipZip":
      if (!value.trim()) return "ZIP code is required";
      if (!ZIP_RE.test(value)) return "Enter a valid ZIP code (e.g. 12345)";
      return "";
    default:
      return "";
  }
}

const OPTIONAL_FIELDS = new Set<string>(["apt", "shipApt", "orderNotes", "phone"]);
const SHIP_FIELDS = new Set<string>(["shipStreet", "shipApt", "shipCity", "shipState", "shipZip"]);

function validateAll(fields: FormFields, shipToDifferent: boolean): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of Object.keys(fields) as (keyof FormFields)[]) {
    if (OPTIONAL_FIELDS.has(key)) continue;
    if (SHIP_FIELDS.has(key) && !shipToDifferent) continue;
    const err = validateField(key, fields[key]);
    if (err) errors[key] = err;
  }
  return errors;
}

// --- Components ---

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

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-400">
      {message}
    </p>
  );
}

// --- Main form ---

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, totalCents, hydrated, openCart } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    shipStreet: "",
    shipApt: "",
    shipCity: "",
    shipState: "",
    shipZip: "",
    orderNotes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [shipToDifferent, setShipToDifferent] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmountCents: number;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      const user = session.user;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-filling form fields from async session data on login
      setFields((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [session]);

  // Pre-fill phone + shipping from last order
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/last-order-info")
      .then((r) => (r.ok ? r.json() : null))
      .then((info) => {
        if (!info) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-filling form fields from async API data
        const addr = info.billingAddress ?? info.shippingAddress;
        setFields((prev) => ({
          ...prev,
          phone: prev.phone || info.customerPhone || "",
          street: prev.street || addr?.street || "",
          apt: prev.apt || addr?.apt || "",
          city: prev.city || addr?.city || "",
          state: prev.state || addr?.state || "",
          zip: prev.zip || addr?.zip || "",
        }));
      })
      .catch(() => {});
  }, [session?.user]);

  // Redirect if empty cart
  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/products");
    }
  }, [hydrated, items.length, router]);

  const setField = useCallback(
    (field: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }));
      // Clear error optimistically on change if field already has an error
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (field: keyof FormFields) => {
      if (OPTIONAL_FIELDS.has(field)) return;
      const err = validateField(field, fields[field]);
      setErrors((prev) => {
        if (!err) {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        }
        return { ...prev, [field]: err };
      });
    },
    [fields],
  );

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoError("");
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotalCents: totalCents }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoError(data.error ?? "Invalid promo code");
      } else {
        setAppliedPromo({
          code: data.code,
          discountAmountCents: data.discountAmountCents,
          discountType: data.discountType,
          discountValue: data.discountValue,
        });
        setPromoInput("");
        setPromoError("");
      }
    } catch {
      setPromoError("Could not validate promo code");
    } finally {
      setPromoLoading(false);
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  }

  const discountCents = appliedPromo?.discountAmountCents ?? 0;
  const subtotalAfterDiscount = Math.max(0, totalCents - discountCents);
  const shippingFeeCents = SHIPPING_FEE_CENTS;
  const taxableAmount = subtotalAfterDiscount + shippingFeeCents;
  const taxAmountCents = Math.round(taxableAmount * TAX_RATE);
  const grandTotal = subtotalAfterDiscount + shippingFeeCents + taxAmountCents;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutError("");

    const fieldErrors = validateAll(fields, shipToDifferent);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      // Focus first invalid field
      const firstKey = Object.keys(fieldErrors)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
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
        customerEmail: fields.email,
        customerName: fields.name,
        customerPhone: fields.phone || undefined,
        promoCode: appliedPromo?.code || undefined,
        billingAddress: {
          street: fields.street,
          apt: fields.apt || undefined,
          city: fields.city,
          state: fields.state,
          zip: fields.zip,
          country: "US",
        },
        orderNotes: fields.orderNotes || undefined,
      };

      if (shipToDifferent) {
        payload.shippingAddress = {
          street: fields.shipStreet,
          apt: fields.shipApt || undefined,
          city: fields.shipCity,
          state: fields.shipState,
          zip: fields.shipZip,
          country: "US",
        };
      }

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

  const inputClassName = (field: string) => (errors[field] ? inputError : inputNormal);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Review your order and enter your details to complete your purchase.
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 gap-8 lg:grid lg:grid-cols-[1fr_400px]"
      >
        {/* Left Column — Form Sections */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Contact
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Contact information
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-medium text-white/70">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  className={inputClassName("name")}
                />
                <FieldError id="err-name" message={errors.name} />
              </div>
              <div>
                <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-medium text-white/70">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={fields.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={inputClassName("email")}
                />
                <FieldError id="err-email" message={errors.email} />
              </div>
              <div>
                <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-medium text-white/70">
                  Phone <span className="text-white/30">(optional)</span>
                </label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={fields.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                  className={inputClassName("phone")}
                />
                <FieldError id="err-phone" message={errors.phone} />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Billing
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Billing address
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="checkout-street" className="mb-1.5 block text-sm font-medium text-white/70">
                  Street address <span className="text-red-400">*</span>
                </label>
                <input
                  id="checkout-street"
                  name="street"
                  type="text"
                  autoComplete="address-line1"
                  value={fields.street}
                  onChange={(e) => setField("street", e.target.value)}
                  onBlur={() => handleBlur("street")}
                  aria-invalid={!!errors.street}
                  aria-describedby={errors.street ? "err-street" : undefined}
                  className={inputClassName("street")}
                />
                <FieldError id="err-street" message={errors.street} />
              </div>
              <div>
                <label htmlFor="checkout-apt" className="mb-1.5 block text-sm font-medium text-white/70">
                  Apt / Suite <span className="text-white/30">(optional)</span>
                </label>
                <input
                  id="checkout-apt"
                  name="apt"
                  type="text"
                  autoComplete="address-line2"
                  value={fields.apt}
                  onChange={(e) => setField("apt", e.target.value)}
                  className={inputNormal}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="checkout-city" className="mb-1.5 block text-sm font-medium text-white/70">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    value={fields.city}
                    onChange={(e) => setField("city", e.target.value)}
                    onBlur={() => handleBlur("city")}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? "err-city" : undefined}
                    className={inputClassName("city")}
                  />
                  <FieldError id="err-city" message={errors.city} />
                </div>
                <div>
                  <label htmlFor="checkout-state" className="mb-1.5 block text-sm font-medium text-white/70">
                    State <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="checkout-state"
                    name="state"
                    autoComplete="address-level1"
                    value={fields.state}
                    onChange={(e) => setField("state", e.target.value)}
                    onBlur={() => handleBlur("state")}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? "err-state" : undefined}
                    className={inputClassName("state")}
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FieldError id="err-state" message={errors.state} />
                </div>
                <div>
                  <label htmlFor="checkout-zip" className="mb-1.5 block text-sm font-medium text-white/70">
                    ZIP code <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-zip"
                    name="zip"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={fields.zip}
                    onChange={(e) => setField("zip", e.target.value)}
                    onBlur={() => handleBlur("zip")}
                    aria-invalid={!!errors.zip}
                    aria-describedby={errors.zip ? "err-zip" : undefined}
                    className={inputClassName("zip")}
                  />
                  <FieldError id="err-zip" message={errors.zip} />
                </div>
              </div>
            </div>
          </div>

          {/* Ship to different address */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <label className="flex cursor-pointer items-center gap-3">
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition ${
                  shipToDifferent
                    ? "border-[#ff5a1f] bg-[#ff5a1f]"
                    : "border-white/20 bg-white/[0.04]"
                }`}
              >
                {shipToDifferent && (
                  <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-white">
                Ship to a different address?
              </span>
            </label>
            <input
              type="checkbox"
              checked={shipToDifferent}
              onChange={(e) => setShipToDifferent(e.target.checked)}
              className="sr-only"
              aria-label="Ship to a different address"
            />

            {shipToDifferent && (
              <div className="mt-6 space-y-3">
                <div>
                  <label htmlFor="checkout-shipStreet" className="mb-1.5 block text-sm font-medium text-white/70">
                    Street address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-shipStreet"
                    name="shipStreet"
                    type="text"
                    autoComplete="shipping address-line1"
                    value={fields.shipStreet}
                    onChange={(e) => setField("shipStreet", e.target.value)}
                    onBlur={() => handleBlur("shipStreet")}
                    aria-invalid={!!errors.shipStreet}
                    aria-describedby={errors.shipStreet ? "err-shipStreet" : undefined}
                    className={inputClassName("shipStreet")}
                  />
                  <FieldError id="err-shipStreet" message={errors.shipStreet} />
                </div>
                <div>
                  <label htmlFor="checkout-shipApt" className="mb-1.5 block text-sm font-medium text-white/70">
                    Apt / Suite <span className="text-white/30">(optional)</span>
                  </label>
                  <input
                    id="checkout-shipApt"
                    name="shipApt"
                    type="text"
                    autoComplete="shipping address-line2"
                    value={fields.shipApt}
                    onChange={(e) => setField("shipApt", e.target.value)}
                    className={inputNormal}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="checkout-shipCity" className="mb-1.5 block text-sm font-medium text-white/70">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="checkout-shipCity"
                      name="shipCity"
                      type="text"
                      autoComplete="shipping address-level2"
                      value={fields.shipCity}
                      onChange={(e) => setField("shipCity", e.target.value)}
                      onBlur={() => handleBlur("shipCity")}
                      aria-invalid={!!errors.shipCity}
                      aria-describedby={errors.shipCity ? "err-shipCity" : undefined}
                      className={inputClassName("shipCity")}
                    />
                    <FieldError id="err-shipCity" message={errors.shipCity} />
                  </div>
                  <div>
                    <label htmlFor="checkout-shipState" className="mb-1.5 block text-sm font-medium text-white/70">
                      State <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="checkout-shipState"
                      name="shipState"
                      autoComplete="shipping address-level1"
                      value={fields.shipState}
                      onChange={(e) => setField("shipState", e.target.value)}
                      onBlur={() => handleBlur("shipState")}
                      aria-invalid={!!errors.shipState}
                      aria-describedby={errors.shipState ? "err-shipState" : undefined}
                      className={inputClassName("shipState")}
                    >
                      <option value="">State</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <FieldError id="err-shipState" message={errors.shipState} />
                  </div>
                  <div>
                    <label htmlFor="checkout-shipZip" className="mb-1.5 block text-sm font-medium text-white/70">
                      ZIP code <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="checkout-shipZip"
                      name="shipZip"
                      type="text"
                      inputMode="numeric"
                      autoComplete="shipping postal-code"
                      value={fields.shipZip}
                      onChange={(e) => setField("shipZip", e.target.value)}
                      onBlur={() => handleBlur("shipZip")}
                      aria-invalid={!!errors.shipZip}
                      aria-describedby={errors.shipZip ? "err-shipZip" : undefined}
                      className={inputClassName("shipZip")}
                    />
                    <FieldError id="err-shipZip" message={errors.shipZip} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
              Notes
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
              Order notes
            </h2>
            <p className="mt-1 text-xs text-white/40">
              Special delivery instructions or requests (optional)
            </p>
            <textarea
              name="orderNotes"
              value={fields.orderNotes}
              onChange={(e) => setField("orderNotes", e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="e.g. Leave at front door, gift wrapping requests..."
              className={`${inputNormal} mt-3 resize-none`}
            />
            <p className="mt-1 text-right text-xs text-white/30">
              {fields.orderNotes.length}/500
            </p>
          </div>

          {/* Mobile-only order summary */}
          <div className="lg:hidden">
            <OrderSummaryCard
              items={items}
              totalCents={totalCents}
              isSubmitting={isSubmitting}
              onEditCart={openCart}
              promoInput={promoInput}
              onPromoInputChange={setPromoInput}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              appliedPromo={appliedPromo}
              promoLoading={promoLoading}
              promoError={promoError}
              discountCents={discountCents}
              shippingFeeCents={shippingFeeCents}
              taxAmountCents={taxAmountCents}
              grandTotal={grandTotal}
            />
          </div>
        </div>

        {/* Right Column — Sticky Order Summary (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <OrderSummaryCard
              items={items}
              totalCents={totalCents}
              isSubmitting={isSubmitting}
              onEditCart={openCart}
              promoInput={promoInput}
              onPromoInputChange={setPromoInput}
              onApplyPromo={handleApplyPromo}
              onRemovePromo={handleRemovePromo}
              appliedPromo={appliedPromo}
              promoLoading={promoLoading}
              promoError={promoError}
              discountCents={discountCents}
              shippingFeeCents={shippingFeeCents}
              taxAmountCents={taxAmountCents}
              grandTotal={grandTotal}
            />
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
  onEditCart,
  promoInput,
  onPromoInputChange,
  onApplyPromo,
  onRemovePromo,
  appliedPromo,
  promoLoading,
  promoError,
  discountCents,
  shippingFeeCents,
  taxAmountCents,
  grandTotal,
}: {
  items: CartItem[];
  totalCents: number;
  isSubmitting: boolean;
  onEditCart: () => void;
  promoInput: string;
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  appliedPromo: { code: string; discountAmountCents: number } | null;
  promoLoading: boolean;
  promoError: string;
  discountCents: number;
  shippingFeeCents: number;
  taxAmountCents: number;
  grandTotal: number;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
          Order Summary
        </p>
        <button
          type="button"
          onClick={onEditCart}
          className="text-xs font-medium text-white/40 transition hover:text-[#ff5a1f]"
        >
          Edit cart
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Promo Code Input */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {appliedPromo ? (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <svg className="size-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-emerald-400">{appliedPromo.code}</span>
              <span className="text-sm text-emerald-400/70">-{formatCurrency(appliedPromo.discountAmountCents)}</span>
            </div>
            <button
              type="button"
              onClick={onRemovePromo}
              className="text-white/40 transition hover:text-white"
              aria-label="Remove promo code"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => onPromoInputChange(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onApplyPromo();
                  }
                }}
                className={`flex-1 rounded-2xl border bg-black/20 px-4 py-2.5 text-sm text-white uppercase placeholder:text-white/30 placeholder:normal-case focus:border-[#ff5a1f] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f] transition ${promoError ? "border-red-500/50" : "border-white/10"}`}
              />
              <button
                type="button"
                onClick={onApplyPromo}
                disabled={promoLoading || !promoInput.trim()}
                className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-40"
              >
                {promoLoading ? "..." : "Apply"}
              </button>
            </div>
            {promoError && (
              <p className="mt-1.5 text-xs text-red-400">{promoError}</p>
            )}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/55">Subtotal</span>
          <span className="text-white">{formatCurrency(totalCents)}</span>
        </div>
        {discountCents > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-emerald-400">Discount ({appliedPromo?.code})</span>
            <span className="text-emerald-400">-{formatCurrency(discountCents)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/55">Shipping</span>
          <span className="text-white">Flat rate: {formatCurrency(shippingFeeCents)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/55">Sales Tax — 7%</span>
          <span className="text-white">{formatCurrency(taxAmountCents)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm font-semibold text-white">Total</span>
          <span className="text-xl font-semibold text-white">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ff5a1f] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(255,90,31,0.35)] transition hover:bg-[#e04f1a] disabled:opacity-60"
      >
        {isSubmitting && (
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {isSubmitting ? "Redirecting to Stripe..." : "Continue to Payment"}
      </button>

      <p className="mt-3 text-center text-xs text-white/30">
        You&apos;ll be redirected to Stripe&apos;s secure checkout to complete payment.
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
