import type { CatalogProduct } from "@/lib/types";

const SKULL_LINEUP_FAMILY = "skulltronix-skull-lineup";

function sortByRank(
  products: CatalogProduct[],
  rankKey: "homeFeaturedRank" | "homeHeroRank" | "productsFlagshipRank",
) {
  return [...products]
    .map((product, index) => ({
      product,
      index,
      rank: product.metadata[rankKey] ?? Number.POSITIVE_INFINITY,
    }))
    .sort((left, right) => {
      if (left.rank !== right.rank) {
        return left.rank - right.rank;
      }

      return left.index - right.index;
    })
    .map(({ product }) => product);
}

function getSkullModels(products: CatalogProduct[]) {
  return products
    .filter((product) => product.metadata.family === SKULL_LINEUP_FAMILY)
    .sort((left, right) => (left.metadata.tierRank ?? 99) - (right.metadata.tierRank ?? 99));
}

function getSpecialtyProducts(products: CatalogProduct[]) {
  return products.filter((product) => product.metadata.family !== SKULL_LINEUP_FAMILY);
}

export function getHomepageCatalogView(products: CatalogProduct[]) {
  const skullModels = getSkullModels(products);
  const specialtyProducts = getSpecialtyProducts(products);
  const defaultShowcaseProducts = [...skullModels, ...specialtyProducts];
  const showcaseProducts = sortByRank(defaultShowcaseProducts, "homeFeaturedRank");
  const heroProduct =
    sortByRank(products, "homeHeroRank")[0] ??
    products.find((product) => product.slug === "skulltronix-skull") ??
    showcaseProducts[0];
  const [featuredProduct, ...remainingProducts] = showcaseProducts;

  return {
    heroProduct,
    showcaseProducts,
    featuredProduct: featuredProduct ?? null,
    remainingProducts,
  };
}

export function getProductsPageCatalogView(products: CatalogProduct[]) {
  const skullModels = getSkullModels(products);
  const specialtyProducts = getSpecialtyProducts(products);
  const rankedFlagshipCandidates = sortByRank(specialtyProducts, "productsFlagshipRank");
  const flagshipProduct =
    rankedFlagshipCandidates.find(
      (product) => product.metadata.productsFlagshipRank !== undefined,
    ) ?? null;
  const otherProducts = specialtyProducts.filter(
    (product) => product.slug !== flagshipProduct?.slug,
  );

  return {
    flagshipProduct,
    otherProducts,
    skullModels,
  };
}
