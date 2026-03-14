ALTER TABLE "orders" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address" jsonb;