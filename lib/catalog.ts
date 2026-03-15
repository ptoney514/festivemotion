import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import * as Sentry from "@sentry/nextjs";
import { getDb } from "@/lib/db";
import { optionGroups, options, products } from "@/lib/schema";
import { catalogSeed } from "@/lib/catalog-seed";
import type { CatalogOption, CatalogOptionGroup, CatalogProduct } from "@/lib/types";

function sortOptions(items: CatalogOption[]) {
  return [...items].sort((left, right) => left.sortOrder - right.sortOrder);
}

function sortGroups(items: CatalogOptionGroup[]) {
  return [...items]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((group) => ({
      ...group,
      options: sortOptions(group.options),
    }));
}

function sortProducts(items: CatalogProduct[]) {
  return [...items].map((product) => ({
    ...product,
    optionGroups: sortGroups(product.optionGroups),
  }));
}

async function loadCatalogFromDatabase() {
  const db = getDb();

  if (!db) {
    return null;
  }

  try {
    const productRows = await db
      .select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(asc(products.name));

    if (productRows.length === 0) {
      return [];
    }

    const productIds = productRows.map((product) => product.id);

    const groupRows = await db
      .select()
      .from(optionGroups)
      .where(inArray(optionGroups.productId, productIds))
      .orderBy(asc(optionGroups.sortOrder));

    const groupIds = groupRows.map((group) => group.id);
    const optionRows =
      groupIds.length > 0
        ? await db
            .select()
            .from(options)
            .where(inArray(options.groupId, groupIds))
            .orderBy(asc(options.sortOrder))
        : [];

    const optionsByGroup = new Map<string, CatalogOption[]>();

    for (const option of optionRows) {
      const current = optionsByGroup.get(option.groupId) ?? [];
      current.push({
        id: option.id,
        groupId: option.groupId,
        slug: option.slug,
        label: option.label,
        description: option.description ?? undefined,
        priceDeltaCents: option.priceDeltaCents,
        sortOrder: option.sortOrder,
        isDefault: option.isDefault,
        metadata: option.metadata,
      });
      optionsByGroup.set(option.groupId, current);
    }

    const groupsByProduct = new Map<string, CatalogOptionGroup[]>();

    for (const group of groupRows) {
      const current = groupsByProduct.get(group.productId) ?? [];
      current.push({
        id: group.id,
        productId: group.productId,
        slug: group.slug,
        name: group.name,
        description: group.description ?? undefined,
        required: group.required,
        selectionType: group.selectionType,
        sortOrder: group.sortOrder,
        metadata: group.metadata,
        options: optionsByGroup.get(group.id) ?? [],
      });
      groupsByProduct.set(group.productId, current);
    }

    return sortProducts(
      productRows.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        basePriceCents: product.basePriceCents,
        imageUrl: product.imageUrl,
        active: product.active,
        metadata: product.metadata,
        optionGroups: groupsByProduct.get(product.id) ?? [],
      })),
    );
  } catch (error) {
    Sentry.captureException(error);
    console.warn("Falling back to local catalog seed because the database lookup failed.", error);
    return null;
  }
}

export const getCatalogProducts = cache(async () => {
  const fromDatabase = await loadCatalogFromDatabase();

  if (fromDatabase && fromDatabase.length > 0) {
    return fromDatabase;
  }

  return sortProducts(catalogSeed);
});

export const getCatalogProductBySlug = cache(async (slug: string) => {
  const catalog = await getCatalogProducts();
  return catalog.find((product) => product.slug === slug) ?? null;
});

export async function getRelatedProducts(slugs: string[]) {
  const catalog = await getCatalogProducts();
  return slugs
    .map((slug) => catalog.find((product) => product.slug === slug) ?? null)
    .filter((product): product is CatalogProduct => Boolean(product));
}
