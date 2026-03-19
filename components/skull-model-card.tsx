import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

/* ── Compact horizontal row (used in Skull Lineup) ─────────────────── */
function SkullModelRow({
  product,
  current,
}: {
  product: CatalogProduct;
  current: boolean;
}) {
  const inner = (
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        {/* radio-style marker */}
        <span
          className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border ${
            current
              ? "border-[#ff5a1f] bg-[#ff5a1f]"
              : "border-white/20 bg-white/[0.04]"
          }`}
        >
          {current ? <span className="size-2 rounded-full bg-white" /> : null}
        </span>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-white">{product.name}</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
              {product.metadata.tier ?? "Skull Model"}
            </span>
            {current ? (
              <span className="rounded-full border border-[#ff8a63]/40 bg-[#ff5a1f]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ffd7c5]">
                Current
              </span>
            ) : null}
          </div>
          <p className="text-sm text-white/55">{product.shortDescription}</p>
        </div>
      </div>

      <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-white">
        {formatCurrency(product.basePriceCents)}
      </span>
    </div>
  );

  if (current) {
    return (
      <div className="w-full rounded-2xl border border-[#ff5a1f] bg-[rgba(255,90,31,0.08)] px-4 py-4 text-left">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left transition hover:border-white/20 hover:bg-black/30"
    >
      {inner}
    </Link>
  );
}

/* ── Full vertical card (used on Products listing page) ────────────── */
export function SkullModelCard({
  product,
  current = false,
  ctaLabel = "Configure Model",
  showImage = true,
  compact = false,
}: {
  product: CatalogProduct;
  current?: boolean;
  ctaLabel?: string;
  showImage?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return <SkullModelRow product={product} current={current} />;
  }

  const capabilities = product.metadata.capabilities ?? [];

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group overflow-hidden rounded-[28px] border transition hover:-translate-y-1 ${
        current
          ? "border-[#ff5a1f]/80 bg-[linear-gradient(180deg,rgba(255,90,31,0.16),rgba(255,255,255,0.04))] shadow-[0_24px_80px_rgba(255,90,31,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      {showImage ? (
        <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.16),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.08))]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
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

        <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-white xl:text-3xl">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/65">{product.shortDescription}</p>

        <div className="flex items-end justify-between gap-4 border-t border-white/10 mt-6 pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Starting at</p>
            <p className="text-xl font-semibold text-white">
              {formatCurrency(product.basePriceCents)}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition group-hover:border-white/20">
            {ctaLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
