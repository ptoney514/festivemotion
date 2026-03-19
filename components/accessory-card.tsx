"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Accessory } from "@/lib/accessories";
import { formatCurrency } from "@/lib/format";

export function AccessoryCard({ accessory }: { accessory: Accessory }) {
  const { addAccessory, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

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
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAdded(false), 1500);
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
          className="button-light inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
