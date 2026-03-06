import "dotenv/config";
import { and, eq, notInArray } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { catalogSeed } from "../lib/catalog-seed";
import * as schema from "../lib/schema";

const { optionGroups, options, products } = schema;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required before seeding.");
  }
  const sql = neon(url);
  const db = drizzle(sql, { schema });

  for (const product of catalogSeed) {
    const [upsertedProduct] = await db
      .insert(products)
      .values({
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        basePriceCents: product.basePriceCents,
        imageUrl: product.imageUrl,
        active: product.active,
        metadata: product.metadata,
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          basePriceCents: product.basePriceCents,
          imageUrl: product.imageUrl,
          active: product.active,
          metadata: product.metadata,
        },
      })
      .returning({ id: products.id, slug: products.slug });

    const productGroupSlugs = product.optionGroups.map((group) => group.slug);

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

    for (const group of product.optionGroups) {
      const [upsertedGroup] = await db
        .insert(optionGroups)
        .values({
          productId: upsertedProduct.id,
          slug: group.slug,
          name: group.name,
          description: group.description,
          sortOrder: group.sortOrder,
          required: group.required,
          selectionType: group.selectionType,
          metadata: group.metadata ?? {},
        })
        .onConflictDoUpdate({
          target: [optionGroups.productId, optionGroups.slug],
          set: {
            name: group.name,
            description: group.description,
            sortOrder: group.sortOrder,
            required: group.required,
            selectionType: group.selectionType,
            metadata: group.metadata ?? {},
          },
        })
        .returning({ id: optionGroups.id, slug: optionGroups.slug });

      const optionSlugs = group.options.map((option) => option.slug);

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

      for (const option of group.options) {
        await db
          .insert(options)
          .values({
            groupId: upsertedGroup.id,
            slug: option.slug,
            label: option.label,
            description: option.description,
            priceDeltaCents: option.priceDeltaCents,
            sortOrder: option.sortOrder,
            isDefault: option.isDefault ?? false,
            metadata: option.metadata ?? {},
          })
          .onConflictDoUpdate({
            target: [options.groupId, options.slug],
            set: {
              label: option.label,
              description: option.description,
              priceDeltaCents: option.priceDeltaCents,
              sortOrder: option.sortOrder,
              isDefault: option.isDefault ?? false,
              metadata: option.metadata ?? {},
            },
          });
      }
    }

    console.info(`Seeded ${product.name}`);
  }

  console.info("Catalog seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
