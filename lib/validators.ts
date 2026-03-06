import { z } from "zod";

export const selectionValueSchema = z.union([z.string(), z.array(z.string())]);

export const checkoutRequestSchema = z.object({
  productSlug: z.string().min(1),
  selections: z.record(z.string(), selectionValueSchema).default({}),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// --- Cart checkout schemas ---

const configuredCartItemSchema = z.object({
  kind: z.literal("configured"),
  productSlug: z.string().min(1),
  selections: z.record(z.string(), selectionValueSchema).default({}),
});

const accessoryCartItemSchema = z.object({
  kind: z.literal("accessory"),
  accessorySlug: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
});

export const cartItemSchema = z.discriminatedUnion("kind", [
  configuredCartItemSchema,
  accessoryCartItemSchema,
]);

export const cartCheckoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(20),
});

export type CartCheckoutRequest = z.infer<typeof cartCheckoutRequestSchema>;
