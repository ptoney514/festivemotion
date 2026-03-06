"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useCart } from "@/lib/cart-context";
import { getCartItemTotal } from "@/lib/cart-types";
import type { CartItem } from "@/lib/cart-types";
import { formatCurrency } from "@/lib/format";

function ConfiguredItemRow({ item, onRemove }: { item: CartItem & { kind: "configured" }; onRemove: () => void }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.productImageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{item.productName}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-white/50">
          {item.selectedOptions.map((o) => o.labels.join(", ")).join(" / ")}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-medium text-white">{formatCurrency(item.totalCents)}</span>
          <button type="button" onClick={onRemove} className="text-xs text-white/40 transition hover:text-[#ff5a1f]">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function AccessoryItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem & { kind: "accessory" };
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
        <Image src={item.imageUrl} alt={item.label} fill className="object-cover" sizes="64px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{item.label}</p>
        <p className="mt-0.5 text-xs text-white/50">{formatCurrency(item.priceCents)} each</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="flex size-6 items-center justify-center rounded-full border border-white/10 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
            >
              -
            </button>
            <span className="min-w-[1.25rem] text-center text-sm text-white">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="flex size-6 items-center justify-center rounded-full border border-white/10 text-xs text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-30"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">{formatCurrency(getCartItemTotal(item))}</span>
            <button type="button" onClick={onRemove} className="text-xs text-white/40 transition hover:text-[#ff5a1f]">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, totalCents, isCartOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, startCheckout] = useTransition();

  function handleCheckout() {
    setCheckoutError(null);

    startCheckout(() => {
      void (async () => {
        try {
          const payload = items.map((item) => {
            if (item.kind === "configured") {
              return { kind: "configured" as const, productSlug: item.productSlug, selections: item.selections };
            }
            return { kind: "accessory" as const, accessorySlug: item.accessorySlug, quantity: item.quantity };
          });

          const res = await fetch("/api/cart-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: payload }),
          });

          const data = (await res.json()) as { url?: string; error?: string };

          if (!res.ok || !data.url) {
            setCheckoutError(data.error ?? "Checkout could not be started.");
            return;
          }

          window.location.assign(data.url);
        } catch {
          setCheckoutError("Checkout could not be started.");
        }
      })();
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-black/60 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-white/10 bg-[rgba(8,8,8,0.96)] backdrop-blur-xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-white">Your Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex size-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-white/50">Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-4 inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-white/20"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) =>
                item.kind === "configured" ? (
                  <ConfiguredItemRow key={item.id} item={item} onRemove={() => removeItem(item.id)} />
                ) : (
                  <AccessoryItemRow
                    key={item.id}
                    item={item}
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  />
                ),
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 ? (
          <div className="border-t border-white/10 px-5 py-4">
            {checkoutError ? (
              <div className="mb-3 rounded-xl border border-[#ff5a1f]/40 bg-[#ff5a1f]/10 px-4 py-2.5 text-sm text-[#ffd4c4]">
                {checkoutError}
              </div>
            ) : null}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-white/55">Total</span>
              <span className="text-xl font-semibold text-white">{formatCurrency(totalCents)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/60"
            >
              {isCheckingOut ? "Redirecting..." : "Proceed to Checkout"}
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 inline-flex w-full items-center justify-center py-2 text-xs text-white/40 transition hover:text-white/60"
            >
              Clear cart
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
