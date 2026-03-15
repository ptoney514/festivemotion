import Image from "next/image";
import Link from "next/link";
import { HomeProductChip } from "@/components/home-product-chip";
import { HomeProductTile } from "@/components/home-product-tile";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getCatalogProducts } from "@/lib/catalog";

export const revalidate = 3600;

const venueNotes = [
  {
    title: "Haunted Attractions",
    description: "Durable enough for repeat nightly use and quick resets between groups.",
  },
  {
    title: "Escape Rooms",
    description: "Simple trigger paths for tightly staged moments and controlled reveals.",
  },
  {
    title: "Trade Shows",
    description: "Big visual impact with fast demo setup for short booth conversations.",
  },
];

export default async function HomePage() {
  const products = await getCatalogProducts();
  const skullModels = products
    .filter((product) => product.metadata.family === "skulltronix-skull-lineup")
    .sort((left, right) => (left.metadata.tierRank ?? 99) - (right.metadata.tierRank ?? 99));
  const specialtyProducts = products.filter(
    (product) => product.metadata.family !== "skulltronix-skull-lineup",
  );
  const showcaseProducts = [...skullModels, ...specialtyProducts];

  const heroProduct =
    products.find((product) => product.slug === "skulltronix-skull") ??
    showcaseProducts[0];

  const heroImage =
    heroProduct?.metadata.heroImageUrl ??
    heroProduct?.imageUrl ??
    "/products/dancing-pumpkin-hero.webp";
  const heroTagline = heroProduct?.metadata.heroTagline ?? "Full-motion. Show-ready. Built to perform.";
  const heroHref = `/products/${heroProduct?.slug ?? "skulltronix-skull"}`;
  const heroActionLabel = heroProduct?.metadata.heroCtaLabel ?? "Build Your Skull Pro";

  const [featuredProduct, ...remainingProducts] = showcaseProducts;

  return (
    <>
      <SiteHeader />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.28),_transparent_58%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,120,60,0.20),_transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 right-[10%] h-[60%] w-[40%] bg-[radial-gradient(ellipse_at_center,_rgba(255,90,31,0.22),_transparent_70%)] blur-3xl" />

          <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto] lg:grid-cols-2 lg:gap-10">
              {/* Hero text */}
              <div className="relative z-10">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb089]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#ff5a1f]" />
                  {heroProduct?.metadata.heroEyebrow ?? "Featured Animatronic"}
                </p>
                <h1 className="mt-4 max-w-[10ch] font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                  {heroProduct?.name ?? "SkullTronix Skull Pro"}
                </h1>
                <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-[#ffd7c5] sm:text-2xl">
                  {heroTagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={heroHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                  >
                    {heroActionLabel}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8h9m0 0L9 4.5M12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    See All Products
                  </Link>
                  <span className="text-sm text-white/60">
                    From{" "}
                    <span className="font-semibold text-white">
                      {formatCurrency(heroProduct?.basePriceCents ?? 149500)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Hero image — glassmorphism card */}
              <div className="relative mx-auto sm:mx-0 lg:w-full">
                <div className="absolute inset-x-[8%] bottom-4 h-28 rounded-full bg-[#ff6d39]/35 blur-3xl" />
                <div className="relative w-[120px] sm:w-[180px] lg:w-full lg:max-w-[520px] overflow-hidden rounded-[24px] lg:rounded-[28px] border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl p-2 lg:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <div className="relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-[20px] lg:rounded-[24px] bg-[radial-gradient(circle_at_top,_rgba(255,119,54,0.18),_transparent_52%),linear-gradient(180deg,#081119,#040404)]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,_rgba(255,90,31,0.12),_transparent_60%)]" />
                    <Image
                      src={heroImage}
                      alt={`${heroProduct?.name ?? "Featured product"} animatronic product photo.`}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(min-width: 1024px) 40vw, 180px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Shop the Floor — horizontal scroll on mobile ── */}
            <div className="mt-8 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.12))] p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                    Shop The Floor
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-white">
                    Every product, one quick scan.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-white/58">
                  Browse the complete product line, configure to your exact specs, and
                  order directly.
                </p>
              </div>

              {/* Wrapping grid — 3 cols mobile, 4 cols sm, 7 cols lg */}
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
                {showcaseProducts.map((product, index) => (
                  <div key={product.slug}>
                    <HomeProductChip product={product} priority={index < 3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Venue cards — moved above catalog ── */}
        <section className="mx-auto max-w-[1280px] px-4 pt-12 sm:px-6 lg:px-8">
          <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {venueNotes.map((item) => (
              <article
                key={item.title}
                className="min-w-[260px] flex-shrink-0 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:min-w-0 sm:flex-shrink"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Demo Fit
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Catalog ── */}
        <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Catalog
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                The full lineup.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              Open full catalog
            </Link>
          </div>

          {/* Featured first product — full width */}
          {featuredProduct && (
            <div className="mt-8">
              <HomeProductTile product={featuredProduct} priority featured />
            </div>
          )}

          {/* Remaining products — 2-col on mobile, 3-col on lg */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {remainingProducts.map((product, index) => (
              <HomeProductTile key={product.slug} product={product} priority={index < 4} compact />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
