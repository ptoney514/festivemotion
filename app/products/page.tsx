import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SkullModelCard } from "@/components/skull-model-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProductsPageCatalogView } from "@/lib/catalog-editorial";
import { getCatalogProducts } from "@/lib/catalog";
import { formatCurrency } from "@/lib/format";

export const revalidate = 3600;

export const metadata = {
  title: "Products | FestiveMotion",
  description: "Browse the FestiveMotion catalog and configure each product.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  const { flagshipProduct, otherProducts, skullModels } = getProductsPageCatalogView(products);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        {flagshipProduct ? (
          <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,90,31,0.18),rgba(255,255,255,0.03))] p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,120,60,0.24),_transparent_65%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Featured product
                </p>
                <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
                  {flagshipProduct.name}
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-8 text-white/68">
                  {flagshipProduct.metadata.heroSummary ?? flagshipProduct.description}
                </p>

                {flagshipProduct.metadata.heroHighlights?.length ? (
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {flagshipProduct.metadata.heroHighlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/72"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/products/${flagshipProduct.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#ff5a1f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6d39]"
                  >
                    View Product
                  </Link>
                  <span className="text-sm text-white/60">
                    Starting at{" "}
                    <span className="font-semibold text-white">
                      {formatCurrency(flagshipProduct.basePriceCents)}
                    </span>
                  </span>
                </div>
              </div>

              <Link
                href={`/products/${flagshipProduct.slug}`}
                className="group relative mx-auto block w-full max-w-[420px] overflow-hidden rounded-[30px] border border-white/10 bg-black/20"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={flagshipProduct.metadata.heroImageUrl ?? flagshipProduct.imageUrl}
                    alt={flagshipProduct.name}
                    fill
                    priority
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 34vw"
                  />
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section
          id="skull-models"
          className="relative mt-12 overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,90,31,0.14),rgba(255,255,255,0.03))] p-8 sm:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(255,120,60,0.22),_transparent_65%)]" />
          <div className="relative">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Skull lineup
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
                Three motion packages. Same SkullTronix characters.
              </h1>
              <p className="mt-5 text-sm leading-8 text-white/68">
                The skulls now break into three separate products: Bare Bones, Plus, and
                Pro. Pick the motion level first, then customize the same character
                finishes, bases, routines, and add-ons inside that model.
              </p>
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/72">
                Same character configurations across all three models, including Pirate,
                Vampire, Witch, Clown, Scarecrow, and Classic White.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/72">
                Base options, routine packs, and add-ons stay available on every skull tier.
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/72">
                The price difference comes from movement capability and internal components,
                not from hiding options behind a higher tier.
              </div>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-3">
              {skullModels.map((product) => (
                <SkullModelCard
                  key={product.slug}
                  product={product}
                  ctaLabel="Customize Model"
                />
              ))}
            </div>
          </div>
        </section>

        {otherProducts.length ? (
          <section className="mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                  Other products
                </p>
                <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                  Pumpkins and specialty builds stay on their own track.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-white/60">
                The new tiered models only apply to the white skull platform. Skullkin,
                pumpkins, and other listed products keep their existing configuration
                flow.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {otherProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
