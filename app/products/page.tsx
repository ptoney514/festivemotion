import { ProductCard } from "@/components/product-card";
import { SkullModelCard } from "@/components/skull-model-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";

export const revalidate = 3600;

export const metadata = {
  title: "Products | FestiveMotion",
  description: "Browse the FestiveMotion catalog and configure each product.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  const skullModels = products
    .filter((product) => product.metadata.family === "skulltronix-skull-lineup")
    .sort((left, right) => (left.metadata.tierRank ?? 99) - (right.metadata.tierRank ?? 99));
  const otherProducts = products.filter(
    (product) => product.metadata.family !== "skulltronix-skull-lineup",
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <section
          id="skull-models"
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,90,31,0.14),rgba(255,255,255,0.03))] p-8 sm:p-10"
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
