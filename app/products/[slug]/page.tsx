import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Configurator } from "@/components/Configurator/Configurator";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCatalogProductBySlug, getRelatedProducts } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | FestiveMotion",
    };
  }

  return {
    title: `${product.name} | FestiveMotion`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.metadata.relatedProductSlugs ?? []);

  return (
    <>
      <SiteHeader />
      <main>
        <Configurator product={product} />

        {relatedProducts.length ? (
          <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffb089]">
                Related products
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em] text-white">
                Build out the full scene.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.slug} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
