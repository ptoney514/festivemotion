import { describe, expect, it } from "vitest";
import { catalogSeed } from "@/lib/catalog-seed";
import { buildDefaultSelections, calculatePrice } from "@/lib/pricing";

function getProduct(slug: string) {
  const product = catalogSeed.find((candidate) => candidate.slug === slug);

  if (!product) {
    throw new Error(`Missing product seed for ${slug}`);
  }

  return product;
}

describe("calculatePrice", () => {
  it("prices the default SkullTronix Skull build correctly", () => {
    const product = getProduct("skulltronix-skull");
    const selections = buildDefaultSelections(product);
    const priced = calculatePrice(product, selections);

    expect(priced.valid).toBe(true);
    expect(priced.totalCents).toBe(139500);
    expect(priced.normalizedSelections.style).toEqual(["basic"]);
    expect(priced.normalizedSelections.base).toEqual(["wood-block"]);
    expect(priced.normalizedSelections["included-routines"]).toHaveLength(4);
  });

  it("applies matrix pricing and additive upgrades together", () => {
    const product = getProduct("skulltronix-skull");
    const priced = calculatePrice(product, {
      style: "clown",
      base: "black-wood-base",
      "add-ons": ["three-channel-dmx-controller"],
      "premium-routines": ["madman", "swamp-witch"],
    });

    expect(priced.valid).toBe(true);
    expect(priced.totalCents).toBe(170500);
    expect(priced.lineItems.some((item) => item.label.includes("Configured build"))).toBe(
      true,
    );
  });

  it("fails when required selections are missing", () => {
    const product = getProduct("skulltronix-dancing-pumpkin");
    const priced = calculatePrice(product, {});

    expect(priced.valid).toBe(false);
    expect(priced.errors).toContain("Controller is required.");
  });

  it("fails when a single-select group receives multiple values", () => {
    const product = getProduct("skulltronix-skull");
    const priced = calculatePrice(product, {
      style: ["basic", "painted"],
      base: "wood-block",
    });

    expect(priced.valid).toBe(false);
    expect(priced.errors).toContain("Style only allows one selection.");
  });

  it("fails when an invalid option slug is submitted", () => {
    const product = getProduct("skulltronix-skullkin");
    const priced = calculatePrice(product, {
      base: "wood-block",
      "premium-routines": ["bogus-option"],
    });

    expect(priced.valid).toBe(false);
    expect(priced.errors).toContain("Invalid option selected for Premium routines.");
  });
});
