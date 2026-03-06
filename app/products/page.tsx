import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Products | FestiveMotion",
  description: "Browse the FestiveMotion catalog and configure each product.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
            Product catalog
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.06em] text-white">
            Configure the current FestiveMotion lineup.
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/65">
            This catalog uses the five live products from the current site as the MVP
            launch set. Some products have more configuration depth than others, but the
            flow is consistent: choose options, see the server-validated total, and move
            directly into checkout.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
