import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/format";
import { getCatalogProducts } from "@/lib/catalog";

const sellingPoints = [
  "Mobile-friendly browsing and checkout",
  "Apple-style configuration flow",
  "Server-authoritative pricing with Stripe checkout",
];

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
  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b border-white/10">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffb089]">
                Modern storefront rebuild
              </p>
              <h1 className="mt-5 max-w-[12ch] font-display text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                Sell animatronics with more clarity and less friction.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
                FestiveMotion is becoming a marketing and commerce experience built for
                product storytelling, clean mobile browsing, and server-validated custom
                builds. The goal is simple: make it easier for buyers to understand,
                configure, and order complex props.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f0f0f] transition hover:bg-white/90"
                >
                  Shop / Configure
                </Link>
                <a
                  href="mailto:info@festivemotion.com"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  Book a Demo
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {sellingPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.22),_transparent_42%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.12))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
                  <Image
                    src="/figma/hero-pumpkin.png"
                    alt="FestiveMotion hero image showing a premium animatronic pumpkin."
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 48vw"
                  />
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                      Featured Build
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                      Dancing Pumpkin
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/60">
                      An Apple-like product detail page with configurable control and setup
                      options.
                    </p>
                    <p className="mt-4 text-lg font-semibold text-white">
                      {formatCurrency(149500)}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                      Commerce Stack
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">
                      Neon + Stripe
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-white/60">
                      Catalogs and configuration snapshots live in Postgres, while final
                      totals are charged through hosted Stripe Checkout.
                    </p>
                  </div>
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
                Start from the products customers already know.
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
                MVP direction
              </p>
              <h2 className="mt-3 max-w-[14ch] font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                Browse, configure, and check out without sales friction.
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="text-sm leading-7 text-white/65">
                The build now has the right foundation for a real storefront: typed seed
                data, a Neon-ready schema, server-authoritative pricing, and Stripe
                checkout entry points. The next lift after MVP is replacing hard-coded
                seed content with a richer operational catalog.
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
