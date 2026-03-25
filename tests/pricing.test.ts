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
  it("prices the default Bare Bones skull build correctly", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const selections = buildDefaultSelections(product);
    const priced = calculatePrice(product, selections);

    expect(priced.valid).toBe(true);
    expect(priced.totalCents).toBe(54900);
    expect(priced.normalizedSelections.style).toEqual(["basic"]);
    expect(priced.normalizedSelections.base).toEqual(["wood-block"]);
    expect(priced.normalizedSelections["included-routines"]).toHaveLength(4);
  });

  it("keeps the three skull tiers separated by base model price", () => {
    const bareBones = calculatePrice(
      getProduct("skulltronix-skull-bare-bones"),
      buildDefaultSelections(getProduct("skulltronix-skull-bare-bones")),
    );
    const plus = calculatePrice(
      getProduct("skulltronix-skull-plus"),
      buildDefaultSelections(getProduct("skulltronix-skull-plus")),
    );
    const pro = calculatePrice(
      getProduct("skulltronix-skull"),
      buildDefaultSelections(getProduct("skulltronix-skull")),
    );

    expect(bareBones.totalCents).toBe(54900);
    expect(plus.totalCents).toBe(64900);
    expect(pro.totalCents).toBe(119900);
  });

  it("applies matrix pricing and additive upgrades together on the Pro model", () => {
    const product = getProduct("skulltronix-skull");
    const priced = calculatePrice(product, {
      style: "clown",
      base: "black-wood-base",
      "add-ons": ["three-channel-dmx-controller"],
      "premium-routines": ["madman", "swamp-witch"],
    });

    expect(priced.valid).toBe(true);
    expect(priced.totalCents).toBe(158400);
    expect(priced.lineItems.some((item) => item.label.includes("Configured build"))).toBe(
      true,
    );
  });

  it("fails when required selections are missing", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const priced = calculatePrice(product, {});

    expect(priced.valid).toBe(false);
    expect(priced.errors).toContain("Character is required.");
  });

  it("fails when a single-select group receives multiple values", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const priced = calculatePrice(product, {
      style: ["basic", "painted"],
      base: "wood-block",
    });

    expect(priced.valid).toBe(false);
    expect(priced.errors).toContain("Character only allows one selection.");
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

  it("sets displayPriceDeltaCents on non-basic skull character options", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const styleGroup = product.optionGroups.find((g) => g.slug === "style")!;
    const basic = styleGroup.options.find((o) => o.slug === "basic")!;
    const nonBasic = styleGroup.options.filter((o) => o.slug !== "basic");

    expect(basic.metadata?.displayPriceDeltaCents).toBeUndefined();
    for (const option of nonBasic) {
      expect(option.metadata?.displayPriceDeltaCents).toBe(10000);
    }
  });

  it("does not double-count displayPriceDeltaCents in pricing totals", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const priced = calculatePrice(product, {
      style: "painted",
      base: "wood-block",
    });

    expect(priced.valid).toBe(true);
    // painted + wood-block variant = basePriceCents + 10000
    expect(priced.totalCents).toBe(64900);
  });

  it("adds $100 for painted character via variant matrix on all tiers", () => {
    for (const slug of [
      "skulltronix-skull-bare-bones",
      "skulltronix-skull-plus",
      "skulltronix-skull",
    ]) {
      const product = getProduct(slug);
      const defaultPrice = calculatePrice(product, {
        style: "basic",
        base: "wood-block",
      });
      const paintedPrice = calculatePrice(product, {
        style: "painted",
        base: "wood-block",
      });

      expect(paintedPrice.totalCents - defaultPrice.totalCents).toBe(10000);
    }
  });

  it("sets displayPriceDeltaCents on non-default skull base options", () => {
    const product = getProduct("skulltronix-skull-bare-bones");
    const baseGroup = product.optionGroups.find((g) => g.slug === "base")!;
    const woodBlock = baseGroup.options.find((o) => o.slug === "wood-block")!;
    const nonDefault = baseGroup.options.filter((o) => o.slug !== "wood-block");

    expect(woodBlock.metadata?.displayPriceDeltaCents).toBeUndefined();
    for (const option of nonDefault) {
      expect(option.metadata?.displayPriceDeltaCents).toBe(7500);
    }
  });

  it("adds $75 for black-wood-base via variant matrix on all tiers", () => {
    for (const slug of [
      "skulltronix-skull-bare-bones",
      "skulltronix-skull-plus",
      "skulltronix-skull",
    ]) {
      const product = getProduct(slug);
      const defaultPrice = calculatePrice(product, {
        style: "basic",
        base: "wood-block",
      });
      const upgradedPrice = calculatePrice(product, {
        style: "basic",
        base: "black-wood-base",
      });

      expect(upgradedPrice.totalCents - defaultPrice.totalCents).toBe(7500);
    }
  });

  describe("comprehensive character pricing", () => {
    const tierSlugs = [
      "skulltronix-skull-bare-bones",
      "skulltronix-skull-plus",
      "skulltronix-skull",
    ] as const;

    const tierBasePrices: Record<string, number> = {
      "skulltronix-skull-bare-bones": 54900,
      "skulltronix-skull-plus": 64900,
      "skulltronix-skull": 119900,
    };

    const nonBasicCharacters = [
      "painted",
      "witch",
      "pirate",
      "clown",
      "scarecrow",
      "vampire",
    ] as const;

    const nonDefaultBases = [
      "black-wood-base",
      "3d-trophy-base",
      "skeleton-torso",
    ] as const;

    it("every non-basic character adds $100 on every tier (wood-block base)", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const base = tierBasePrices[slug];

        for (const character of nonBasicCharacters) {
          const priced = calculatePrice(product, {
            style: character,
            base: "wood-block",
          });

          expect(priced.valid).toBe(true);
          expect(priced.totalCents).toBe(base + 10000);
        }
      }
    });

    it("every non-default base adds $75 on every tier (basic character)", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const base = tierBasePrices[slug];

        for (const baseName of nonDefaultBases) {
          const priced = calculatePrice(product, {
            style: "basic",
            base: baseName,
          });

          expect(priced.valid).toBe(true);
          expect(priced.totalCents).toBe(base + 7500);
        }
      }
    });

    it("painted + black-wood-base totals basePriceCents + $160 on all tiers", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const priced = calculatePrice(product, {
          style: "painted",
          base: "black-wood-base",
        });

        expect(priced.valid).toBe(true);
        expect(priced.totalCents).toBe(tierBasePrices[slug] + 16000);
      }
    });

    it("painted + skeleton-torso totals basePriceCents + $175 on all tiers", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const priced = calculatePrice(product, {
          style: "painted",
          base: "skeleton-torso",
        });

        expect(priced.valid).toBe(true);
        expect(priced.totalCents).toBe(tierBasePrices[slug] + 17500);
      }
    });

    it("displayPriceDeltaCents metadata is present on all three tiers for characters", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const styleGroup = product.optionGroups.find((g) => g.slug === "style")!;
        const basic = styleGroup.options.find((o) => o.slug === "basic")!;
        const nonBasic = styleGroup.options.filter((o) => o.slug !== "basic");

        expect(basic.metadata?.displayPriceDeltaCents).toBeUndefined();
        expect(nonBasic).toHaveLength(6);

        for (const option of nonBasic) {
          expect(option.metadata?.displayPriceDeltaCents).toBe(10000);
        }
      }
    });

    it("displayPriceDeltaCents metadata is present on all three tiers for bases", () => {
      for (const slug of tierSlugs) {
        const product = getProduct(slug);
        const baseGroup = product.optionGroups.find((g) => g.slug === "base")!;
        const woodBlock = baseGroup.options.find((o) => o.slug === "wood-block")!;
        const nonDefault = baseGroup.options.filter((o) => o.slug !== "wood-block");

        expect(woodBlock.metadata?.displayPriceDeltaCents).toBeUndefined();
        expect(nonDefault).toHaveLength(3);

        for (const option of nonDefault) {
          expect(option.metadata?.displayPriceDeltaCents).toBe(7500);
        }
      }
    });
  });
});
