"use client";

import { useCart } from "@/lib/cart-context";

export function CartButton() {
  const { itemCount, openCart, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative inline-flex size-10 items-center justify-center rounded-full border border-white/10 transition hover:border-white/20"
      aria-label={`Shopping cart${hydrated && itemCount > 0 ? `, ${itemCount} items` : ""}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white/80"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {hydrated && itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ff5a1f] text-[10px] font-bold text-white">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
