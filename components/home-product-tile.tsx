import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

function getMetaLabel(product: CatalogProduct) {
  return product.metadata.tier ?? product.metadata.category ?? "Animatronic";
}

export function HomeProductTile({
  product,
  priority = false,
  featured = false,
  compact = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
  featured?: boolean;
  compact?: boolean;
}) {
  if (featured) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group grid overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] sm:grid-cols-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.18),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.12))] sm:aspect-auto sm:min-h-[320px]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffd7c5] backdrop-blur-sm">
              {getMetaLabel(product)}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4 p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
            {product.name}
          </h2>
          <p className="text-sm leading-7 text-white/62">{product.shortDescription}</p>
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-lg font-semibold text-white">
              {formatCurrency(product.basePriceCents)}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition group-hover:border-white/20">
              Configure
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (compact) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] sm:rounded-[28px]"
      >
        <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.18),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.12))]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.18em]">
              {formatCurrency(product.basePriceCents)}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-5">
          <h2 className="font-display text-base font-semibold tracking-[-0.03em] text-white sm:text-[1.8rem] sm:tracking-[-0.05em]">
            {product.name.replace("SkullTronix ", "")}
          </h2>
          <p className="mt-1 hidden text-sm leading-7 text-white/62 sm:block">
            {product.shortDescription}
          </p>
          <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 sm:mt-3 sm:pt-4">
            <span className="text-[10px] uppercase tracking-[0.14em] text-white/45 sm:text-xs sm:tracking-[0.16em]">
              Customize
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium text-white transition group-hover:border-white/20 sm:px-4 sm:py-2 sm:text-sm">
              Open
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default — original full-size tile
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="relative aspect-[1.05/1] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.18),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.05),_rgba(0,0,0,0.12))]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffd7c5] backdrop-blur-sm">
            {getMetaLabel(product)}
          </span>
          <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            {formatCurrency(product.basePriceCents)}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h2 className="font-display text-[1.8rem] font-semibold tracking-[-0.05em] text-white">
          {product.name}
        </h2>
        <p className="text-sm leading-7 text-white/62">{product.shortDescription}</p>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-xs uppercase tracking-[0.16em] text-white/45">
            Tap to customize
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition group-hover:border-white/20">
            Open
          </span>
        </div>
      </div>
    </Link>
  );
}
