import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.16),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(0,0,0,0.04))]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            {product.metadata.category ?? "Animatronics"}
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
            {product.name}
          </h2>
          <p className="text-sm leading-7 text-white/65">{product.shortDescription}</p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/45">Starting at</p>
            <p className="text-xl font-semibold text-white">
              {formatCurrency(product.basePriceCents)}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition group-hover:border-white/20">
            Configure
          </span>
        </div>
      </div>
    </Link>
  );
}
