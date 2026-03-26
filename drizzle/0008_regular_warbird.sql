ALTER TABLE "orders" ADD COLUMN "billing_address" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_notes" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subtotal_cents" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_fee_cents" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tax_amount_cents" integer;