-- Create thickness master table
CREATE TABLE IF NOT EXISTS "thickness" (
	"thickness_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thickness_value" integer NOT NULL,
	"thickness_unit" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "thickness_value_unit_unique" ON "thickness" USING btree ("thickness_value","thickness_unit");--> statement-breakpoint
-- Migrate data to thickness master (or seed defaults if old table empty)
INSERT INTO "thickness" ("thickness_value", "thickness_unit")
SELECT DISTINCT pt."product_thickness_value", pt."product_thickness_unit"
FROM "product-thickness" pt
ON CONFLICT (thickness_value, thickness_unit) DO NOTHING;--> statement-breakpoint
-- Create product_thickness junction table with constraints
CREATE TABLE IF NOT EXISTS "product_thickness" (
	"product_id" uuid NOT NULL REFERENCES "public"."product"("product_id") ON DELETE cascade,
	"thickness_id" uuid NOT NULL REFERENCES "public"."thickness"("thickness_id") ON DELETE cascade,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	PRIMARY KEY ("product_id","thickness_id")
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_thickness_product_id_idx" ON "product_thickness" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_thickness_thickness_id_idx" ON "product_thickness" USING btree ("thickness_id");--> statement-breakpoint
-- Migrate junction data
INSERT INTO "product_thickness" ("product_id", "thickness_id")
SELECT pt."product_id", t."thickness_id"
FROM "product-thickness" pt
JOIN "thickness" t ON t."thickness_value" = pt."product_thickness_value" AND t."thickness_unit" = pt."product_thickness_unit"
WHERE pt."product_id" IS NOT NULL
ON CONFLICT (product_id, thickness_id) DO NOTHING;--> statement-breakpoint
-- Drop old table
DROP TABLE IF EXISTS "product-thickness";
