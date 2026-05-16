ALTER TABLE "orders" DROP CONSTRAINT "orders_sku_unique";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "sku" DROP NOT NULL;