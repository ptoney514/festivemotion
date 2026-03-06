import { z } from "zod";

export const selectionValueSchema = z.union([z.string(), z.array(z.string())]);

export const checkoutRequestSchema = z.object({
  productSlug: z.string().min(1),
  selections: z.record(z.string(), selectionValueSchema).default({}),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
