import type {
  CatalogOption,
  CatalogOptionGroup,
  CatalogProduct,
  PricedConfiguration,
  PricedLineItem,
  SelectionMap,
} from "@/lib/types";

function getDefaultSelections(group: CatalogOptionGroup) {
  const defaults = group.options.filter((option) => option.isDefault).map((option) => option.slug);

  if (group.metadata?.display === "included-list") {
    return defaults;
  }

  if (group.selectionType === "single") {
    if (defaults.length > 0) {
      return [defaults[0]];
    }

    return group.options.length > 0 ? [group.options[0].slug] : [];
  }

  return defaults;
}

function buildOptionLookup(group: CatalogOptionGroup) {
  return new Map(group.options.map((option) => [option.slug, option]));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

export function buildDefaultSelections(product: CatalogProduct): SelectionMap {
  const selections: SelectionMap = {};

  for (const group of product.optionGroups) {
    const defaults = getDefaultSelections(group);

    if (defaults.length === 0) {
      continue;
    }

    selections[group.slug] =
      group.selectionType === "single" ? defaults[0] : defaults;
  }

  return selections;
}

function getSelectionArray(group: CatalogOptionGroup, value: SelectionMap[string] | undefined) {
  if (group.metadata?.display === "included-list") {
    return getDefaultSelections(group);
  }

  if (value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return unique(value.filter(Boolean));
  }

  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  return [];
}

function findVariantPrice(product: CatalogProduct, normalizedSelections: Record<string, string[]>) {
  const pricing = product.metadata.pricing;

  if (!pricing?.variantGroups?.length || !pricing.variants?.length) {
    return null;
  }

  return (
    pricing.variants.find((variant) =>
      pricing.variantGroups?.every((groupSlug) => {
        const selected = normalizedSelections[groupSlug]?.[0];
        return selected === variant.match[groupSlug];
      }),
    ) ?? null
  );
}

function getOptionLabel(option: CatalogOption) {
  const badge = option.metadata?.badge ? ` (${option.metadata.badge})` : "";
  return `${option.label}${badge}`;
}

export function getConfiguredImage(product: CatalogProduct, selections: SelectionMap) {
  const priced = calculatePrice(product, selections);
  const variant = findVariantPrice(product, priced.normalizedSelections);

  if (variant?.imageUrl) {
    return variant.imageUrl;
  }

  for (const group of product.optionGroups) {
    const selected = priced.normalizedSelections[group.slug];

    if (!selected?.length) {
      continue;
    }

    const option = group.options.find((candidate) => candidate.slug === selected[0]);

    if (option?.metadata?.imageUrl) {
      return option.metadata.imageUrl;
    }
  }

  return product.imageUrl;
}

export function calculatePrice(
  product: CatalogProduct,
  selections: SelectionMap,
): PricedConfiguration {
  const errors: string[] = [];
  const normalizedSelections: Record<string, string[]> = {};
  const selectedOptions: PricedConfiguration["selectedOptions"] = [];
  const variantGroupSet = new Set(product.metadata.pricing?.variantGroups ?? []);
  const lineItems: PricedLineItem[] = [
    {
      label: product.name,
      amountCents: product.basePriceCents,
    },
  ];

  for (const group of product.optionGroups) {
    const rawSelection = getSelectionArray(group, selections[group.slug]);
    const optionLookup = buildOptionLookup(group);
    const validSelections = rawSelection.filter((selection) => optionLookup.has(selection));

    if (rawSelection.length !== validSelections.length) {
      errors.push(`Invalid option selected for ${group.name}.`);
    }

    if (group.selectionType === "single" && validSelections.length > 1) {
      errors.push(`${group.name} only allows one selection.`);
    }

    if (group.required && validSelections.length === 0) {
      errors.push(`${group.name} is required.`);
    }

    normalizedSelections[group.slug] =
      group.selectionType === "single" ? validSelections.slice(0, 1) : validSelections;

    if (validSelections.length > 0) {
      selectedOptions.push({
        groupName: group.name,
        groupSlug: group.slug,
        labels: validSelections
          .map((selection) => optionLookup.get(selection))
          .filter((option): option is CatalogOption => Boolean(option))
          .map((option) => getOptionLabel(option)),
      });
    }
  }

  let subtotalCents = product.basePriceCents;
  const variant = findVariantPrice(product, normalizedSelections);

  if (product.metadata.pricing?.variantGroups?.length) {
    if (!variant) {
      errors.push("The selected build is not available.");
    } else {
      subtotalCents = variant.priceCents;

      if (variant.priceCents !== product.basePriceCents) {
        const label =
          variant.label ??
          `Configured build: ${product.metadata.pricing.variantGroups
            .map((groupSlug) => {
              const summary = selectedOptions.find((group) => group.groupSlug === groupSlug);
              return summary?.labels[0];
            })
            .filter(Boolean)
            .join(" / ")}`;

        lineItems.push({
          label,
          amountCents: variant.priceCents - product.basePriceCents,
        });
      }
    }
  }

  for (const group of product.optionGroups) {
    if (variantGroupSet.has(group.slug)) {
      continue;
    }

    const optionLookup = buildOptionLookup(group);

    for (const optionSlug of normalizedSelections[group.slug] ?? []) {
      const option = optionLookup.get(optionSlug);

      if (!option) {
        continue;
      }

      subtotalCents += option.priceDeltaCents;

      if (option.priceDeltaCents !== 0) {
        lineItems.push({
          label: option.label,
          amountCents: option.priceDeltaCents,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    normalizedSelections,
    selectedOptions,
    lineItems,
    subtotalCents,
    totalCents: subtotalCents,
  };
}
