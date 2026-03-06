import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getCatalogProducts } from "@/lib/catalog";

const verticals = [
  {
    title: "Haunted Attractions",
    description: "Commercial props designed to hold up under repeated nightly use.",
  },
  {
    title: "Escape Rooms",
    description: "Flexible trigger and control options for tightly staged moments.",
  },
  {
    title: "Trade Shows",
    description: "High-impact conversation starters that demo well on a crowded floor.",
  },
];

export default async function HomePage() {
  const products = await getCatalogProducts();
  const heroProduct =
    products.find((product) => product.slug === "skulltronix-dancing-pumpkin") ?? products[0];
  const featuredProducts = products
    .filter((product) => product.slug !== heroProduct?.slug)
    .slice(0, 3);
  const heroHighlights = heroProduct?.metadata.heroHighlights ?? [
    "4 routines included",
    "Internal multi-color glow",
    "Trade show and haunt ready",
  ];
  const heroImage =
    heroProduct?.metadata.heroImageUrl ??
    heroProduct?.imageUrl ??
    "/products/dancing-pumpkin-hero.webp";
  const heroSummary = heroProduct?.metadata.heroSummary ?? heroProduct?.description ?? "";
  const heroTagline = heroProduct?.metadata.heroTagline ?? "Built to draw a crowd.";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.28),_transparent_58%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,120,60,0.16),_transparent_60%)] blur-3xl" />
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:gap-12 lg:px-8 lg:py-20">
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb089]">
                {heroProduct?.metadata.heroEyebrow ?? "Featured Animatronic"}
              </p>
              <h1 className="mt-5 max-w-[11ch] font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                {heroProduct?.name ?? "SkullTronix Dancing Pumpkin"}
              </h1>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-[#ffd7c5] sm:text-3xl">
                {heroTagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products/skulltronix-dancing-pumpkin"
                  className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                >
                  Build Your Pumpkin
                </Link>
                <Link
                  href="/products/skulltronix-dancing-pumpkin"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  View Details
                </Link>
              </div>

              <p className="mt-5 text-sm text-white/60">
                Starting at{" "}
                <span className="font-semibold text-white">
                  {formatCurrency(heroProduct?.basePriceCents ?? 149500)}
                </span>
              </p>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/68">{heroSummary}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/72 backdrop-blur-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-x-[12%] bottom-6 h-24 rounded-full bg-[#ff6d39]/30 blur-3xl" />
              <div className="relative mx-auto max-w-[720px] overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(8,8,8,0.16))] p-4 shadow-[0_35px_100px_rgba(0,0,0,0.52)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,119,54,0.14),_transparent_48%),linear-gradient(180deg,#081119,#040404)]">
                  <Image
                    src={heroImage}
                    alt="SkullTronix Dancing Pumpkin animatronic with glowing eyes and carved grin."
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 56vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Featured catalog
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                Keep browsing once the pumpkin hooks them.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              View all products
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {verticals.map((vertical) => (
              <article
                key={vertical.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Audience
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                  {vertical.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/60">{vertical.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                The new storefront direction
              </p>
              <h2 className="mt-3 max-w-[14ch] font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                Product-first storytelling with a cleaner path to checkout.
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="text-sm leading-7 text-white/65">
                FestiveMotion now opens on a buyer-facing hero instead of internal rebuild
                language, then moves into guided browsing, Apple-style configuration, and
                server-validated checkout. The foundation is in place for richer product
                storytelling without losing pricing control.
              </p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                >
                  Explore the catalog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
