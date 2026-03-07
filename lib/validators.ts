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
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(100).optional(),
  shippingAddress: z.object({
    street: z.string().max(200),
    apt: z.string().max(50).optional(),
    city: z.string().max(100),
    state: z.string().max(50),
    zip: z.string().max(20),
    country: z.string().max(2).default("US"),
  }).optional(),
});

export type CartCheckoutRequest = z.infer<typeof cartCheckoutRequestSchema>;

// --- Contact form schema ---

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.enum(["general", "order-support", "custom-project", "technical-support"]).default("general"),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
