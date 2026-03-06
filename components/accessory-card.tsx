"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Accessory } from "@/lib/accessories";
import { formatCurrency } from "@/lib/format";

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  const { addAccessory, openCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addAccessory({
      accessorySlug: accessory.slug,
      label: accessory.label,
      description: accessory.description,
      imageUrl: accessory.imageUrl,
      priceCents: accessory.priceCents,
      quantity: 1,
    });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
      <div className="relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-white/5">
        <Image
          src={accessory.imageUrl}
          alt={accessory.label}
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-[-0.03em] text-white">
        {accessory.label}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-6 text-white/55">{accessory.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-white">{formatCurrency(accessory.priceCents)}</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={added}
          className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f0f0f] transition hover:bg-white/90 disabled:bg-white/30 disabled:text-white/60"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
