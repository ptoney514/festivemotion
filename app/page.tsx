import Image from "next/image";
import Link from "next/link";
import { HomeProductChip } from "@/components/home-product-chip";
import { HomeProductTile } from "@/components/home-product-tile";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getCatalogProducts } from "@/lib/catalog";

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
    products.find((product) => product.slug === "skulltronix-skullkin") ??
    showcaseProducts[0];

  const heroHighlights = heroProduct?.metadata.heroHighlights ?? [
    "Skull-pumpkin silhouette",
    "Commercial show-control platform",
    "Built for haunts and demos",
  ];
  const heroImage =
    heroProduct?.metadata.heroImageUrl ??
    heroProduct?.imageUrl ??
    "/products/dancing-pumpkin-hero.webp";
  const heroSummary = heroProduct?.metadata.heroSummary ?? heroProduct?.description ?? "";
  const heroTagline = heroProduct?.metadata.heroTagline ?? "Built to draw a crowd.";
  const heroHref = `/products/${heroProduct?.slug ?? "skulltronix-skullkin"}`;
  const heroActionLabel = heroProduct?.metadata.heroCtaLabel ?? "View Product";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.28),_transparent_58%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,120,60,0.16),_transparent_60%)] blur-3xl" />

          <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
              <div className="relative z-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb089]">
                  {heroProduct?.metadata.heroEyebrow ?? "Featured Animatronic"}
                </p>
                <h1 className="mt-4 max-w-[10ch] font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                  {heroProduct?.name ?? "SkullTronix Skullkin"}
                </h1>
                <p className="mt-3 text-xl font-semibold tracking-[-0.05em] text-[#ffd7c5] sm:text-2xl">
                  {heroTagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={heroHref}
                    className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                  >
                    {heroActionLabel}
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    See All Products
                  </Link>
                </div>

                <p className="mt-5 text-sm text-white/60">
                  Starting at{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(heroProduct?.basePriceCents ?? 149500)}
                  </span>
                </p>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">{heroSummary}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {heroHighlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72 backdrop-blur-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-[12%] bottom-6 h-24 rounded-full bg-[#ff6d39]/30 blur-3xl" />
                <div className="relative mx-auto max-w-[660px] overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(8,8,8,0.16))] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.52)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,119,54,0.14),_transparent_48%),linear-gradient(180deg,#081119,#040404)]">
                    <Image
                      src={heroImage}
                      alt={`${heroProduct?.name ?? "Featured product"} animatronic product photo.`}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 56vw"
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  This microsite is built for live demos. People can scan the entire line
                  here, then tap into any product for the full detail and customization
                  flow.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
                {showcaseProducts.map((product, index) => (
                  <HomeProductChip key={product.slug} product={product} priority={index < 3} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Catalog View
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                Everything for sale, without the extra scrolling.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
                The skull tiers stay grouped up front, and the specialty builds sit right
                alongside them so booth visitors can compare the full line before opening a
                detail page.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              Open full catalog
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {showcaseProducts.map((product, index) => (
              <HomeProductTile key={product.slug} product={product} priority={index < 4} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {venueNotes.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
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
      </main>
      <SiteFooter />
    </>
  );
}
