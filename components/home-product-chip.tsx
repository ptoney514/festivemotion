import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { CatalogProduct } from "@/lib/types";

function getChipLabel(product: CatalogProduct) {
  if (product.metadata.tier) {
    return product.metadata.tier;
  }

  return product.name
    .replace("SkullTronix ", "")
    .replace("Dancing ", "")
    .replace("Pumpkins Trio", "Pumpkin Trio");
}

export function HomeProductChip({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col items-center gap-3 rounded-[24px] px-2 py-2 text-center transition hover:bg-white/[0.04]"
    >
      <div className="relative size-[86px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.18),_transparent_52%),linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(0,0,0,0.12))] sm:size-[100px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority={priority}
          className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 86px, 100px"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{getChipLabel(product)}</p>
        <p className="text-xs text-white/45">{formatCurrency(product.basePriceCents)}</p>
      </div>
    </Link>
  );
}
