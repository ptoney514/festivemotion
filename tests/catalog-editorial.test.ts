import { describe, expect, it } from "vitest";
import { catalogSeed } from "@/lib/catalog-seed";
import {
  getHomepageCatalogView,
  getProductsPageCatalogView,
} from "@/lib/catalog-editorial";

describe("catalog editorial ordering", () => {
  it("picks Blackbeard's Chest as the homepage hero and featured tile", () => {
    const view = getHomepageCatalogView(catalogSeed);

    expect(view.heroProduct.slug).toBe("blackbeards-chest");
    expect(view.featuredProduct?.slug).toBe("blackbeards-chest");
    expect(view.showcaseProducts[0]?.slug).toBe("blackbeards-chest");
  });

  it("keeps the skull lineup grouped after the editorially featured product", () => {
    const view = getHomepageCatalogView(catalogSeed);

    expect(view.showcaseProducts.slice(1, 4).map((product) => product.slug)).toEqual([
      "skulltronix-skull-bare-bones",
      "skulltronix-skull-plus",
      "skulltronix-skull",
    ]);
  });

  it("surfaces Blackbeard's Chest in the products flagship section and removes the duplicate lower card", () => {
    const view = getProductsPageCatalogView(catalogSeed);

    expect(view.flagshipProduct?.slug).toBe("blackbeards-chest");
    expect(view.otherProducts.some((product) => product.slug === "blackbeards-chest")).toBe(
      false,
    );
  });
});
