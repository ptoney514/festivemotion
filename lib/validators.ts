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

const addressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(200),
  apt: z.string().max(50).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().length(2, "Please select a state"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "ZIP must be 5 digits or ZIP+4"),
  country: z.string().max(2).default("US"),
});

export const cartCheckoutRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(20),
  customerEmail: z.string().email("Please enter a valid email"),
  customerName: z.string().min(1, "Name is required").max(100),
  customerPhone: z.string().max(20).optional().or(z.literal("")),
  promoCode: z.string().max(50).optional(),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
  orderNotes: z.string().max(500).optional(),
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
