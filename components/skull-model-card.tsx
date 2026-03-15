import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

export function SkullModelCard({
  product,
  current = false,
  ctaLabel = "Configure Model",
  showImage = true,
}: {
  product: CatalogProduct;
  current?: boolean;
  ctaLabel?: string;
  showImage?: boolean;
}) {
  const capabilities = product.metadata.capabilities ?? [];

  return (
    <article
      className={`overflow-hidden rounded-[28px] border transition ${
        current
          ? "border-[#ff5a1f]/80 bg-[linear-gradient(180deg,rgba(255,90,31,0.16),rgba(255,255,255,0.04))] shadow-[0_24px_80px_rgba(255,90,31,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      {showImage ? (
        <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.16),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.08))]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 30vw"
          />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            {product.metadata.tier ?? "Skull Model"}
          </p>
          {current ? (
            <span className="rounded-full border border-[#ff8a63]/40 bg-[#ff5a1f]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffd7c5]">
              Current
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/65">{product.shortDescription}</p>

        <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">Starting at</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {formatCurrency(product.basePriceCents)}
          </p>
        </div>

        {capabilities.length ? (
          <div className="mt-6 space-y-3">
            {capabilities.map((capability) => (
              <div
                key={capability.label}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <span
                  className={`text-sm ${
                    capability.included ? "text-white/80" : "text-white/40"
                  }`}
                >
                  {capability.label}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    capability.included
                      ? "bg-[#ff5a1f]/12 text-[#ffd7c5]"
                      : "bg-white/5 text-white/45"
                  }`}
                >
                  {capability.included ? "Included" : "Not Included"}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          {current ? (
            <span className="inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/60">
              Current Model
            </span>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="button-light inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
