import { and, eq, notInArray } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { catalogSeed } from "../lib/catalog-seed";
import * as schema from "../lib/schema";
import { loadProjectEnv } from "./load-project-env";

const { optionGroups, options, products } = schema;

export type SeedMode = "additive" | "full-sync";

export function getSeedModeConfig(mode: SeedMode) {
  if (mode === "additive") {
    return {
      deleteStaleEntries: false,
      updateExistingEntries: false,
    };
  }

  return {
    deleteStaleEntries: true,
    updateExistingEntries: true,
  };
}

export function shouldDeleteStaleEntries(mode: SeedMode) {
  return getSeedModeConfig(mode).deleteStaleEntries;
}

export function getSeedCompletionMessage(mode: SeedMode) {
  return mode === "additive"
    ? "Catalog additive seed complete."
    : "Catalog seed complete.";
}

function getProductValues(product: (typeof catalogSeed)[number]) {
  return {
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    basePriceCents: product.basePriceCents,
    imageUrl: product.imageUrl,
    active: product.active,
    metadata: product.metadata,
  };
}

function getGroupValues(productId: string, group: (typeof catalogSeed)[number]["optionGroups"][number]) {
  return {
    productId,
    slug: group.slug,
    name: group.name,
    description: group.description,
    sortOrder: group.sortOrder,
    required: group.required,
    selectionType: group.selectionType,
    metadata: group.metadata ?? {},
  };
}

function getOptionValues(groupId: string, option: (typeof catalogSeed)[number]["optionGroups"][number]["options"][number]) {
  return {
    groupId,
    slug: option.slug,
    label: option.label,
    description: option.description,
    priceDeltaCents: option.priceDeltaCents,
    sortOrder: option.sortOrder,
    isDefault: option.isDefault ?? false,
    metadata: option.metadata ?? {},
  };
}

export async function seedCatalog(mode: SeedMode) {
  loadProjectEnv();

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required before seeding.");
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });
  const config = getSeedModeConfig(mode);

  for (const product of catalogSeed) {
    const productInsert = db.insert(products).values(getProductValues(product));

    const upsertedProduct = config.updateExistingEntries
      ? await productInsert
          .onConflictDoUpdate({
            target: products.slug,
            set: getProductValues(product),
          })
          .returning({ id: products.id, slug: products.slug })
          .then((rows) => rows[0])
      : await productInsert
          .onConflictDoNothing()
          .returning({ id: products.id, slug: products.slug })
          .then((rows) => rows[0] ?? null);

    if (!upsertedProduct) {
      console.info(`Skipped existing ${product.name}`);
      continue;
    }

    const productGroupSlugs = product.optionGroups.map((group) => group.slug);

    if (config.deleteStaleEntries) {
      const existingGroups = await db
        .select({ id: optionGroups.id, slug: optionGroups.slug })
        .from(optionGroups)
        .where(eq(optionGroups.productId, upsertedProduct.id));

      if (existingGroups.length > 0) {
        const staleGroupSlugs = existingGroups
          .map((group) => group.slug)
          .filter((slug) => !productGroupSlugs.includes(slug));

        if (staleGroupSlugs.length > 0) {
          await db
            .delete(optionGroups)
            .where(
              and(
                eq(optionGroups.productId, upsertedProduct.id),
                notInArray(optionGroups.slug, productGroupSlugs),
              ),
            );
        }
      }
    }

    for (const group of product.optionGroups) {
      const groupInsert = db
        .insert(optionGroups)
        .values(getGroupValues(upsertedProduct.id, group));

      const upsertedGroup = config.updateExistingEntries
        ? await groupInsert
            .onConflictDoUpdate({
              target: [optionGroups.productId, optionGroups.slug],
              set: getGroupValues(upsertedProduct.id, group),
            })
            .returning({ id: optionGroups.id, slug: optionGroups.slug })
            .then((rows) => rows[0])
        : await groupInsert
            .onConflictDoNothing()
            .returning({ id: optionGroups.id, slug: optionGroups.slug })
            .then((rows) => rows[0] ?? null);

      if (!upsertedGroup) {
        console.info(`Skipped existing group ${product.name} / ${group.name}`);
        continue;
      }

      const optionSlugs = group.options.map((option) => option.slug);

      if (config.deleteStaleEntries) {
        const existingOptions = await db
          .select({ slug: options.slug })
          .from(options)
          .where(eq(options.groupId, upsertedGroup.id));

        if (existingOptions.length > 0) {
          const staleOptionSlugs = existingOptions
            .map((option) => option.slug)
            .filter((slug) => !optionSlugs.includes(slug));

          if (staleOptionSlugs.length > 0) {
            await db
              .delete(options)
              .where(
                and(
                  eq(options.groupId, upsertedGroup.id),
                  notInArray(options.slug, optionSlugs),
                ),
              );
          }
        }
      }

      for (const option of group.options) {
        const optionInsert = db.insert(options).values(getOptionValues(upsertedGroup.id, option));

        if (config.updateExistingEntries) {
          await optionInsert.onConflictDoUpdate({
            target: [options.groupId, options.slug],
            set: getOptionValues(upsertedGroup.id, option),
          });
          continue;
        }

        await optionInsert.onConflictDoNothing();
      }
    }

    console.info(
      config.updateExistingEntries ? `Seeded ${product.name}` : `Added ${product.name}`,
    );
  }

  console.info(getSeedCompletionMessage(mode));
}
