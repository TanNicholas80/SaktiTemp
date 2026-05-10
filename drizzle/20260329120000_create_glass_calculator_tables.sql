-- Baseline kalkulator kaca: tabel ini hilang dari rantai migrasi awal (sering hanya ada lewat push lokal / dump).
-- Harus jalan sebelum 20260329130000_glass_prices_composition.

CREATE TABLE IF NOT EXISTS "glass_types" (
	"glass_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_type_name" varchar NOT NULL,
	"glass_type_image_url" varchar NOT NULL,
	"glass_type_image_public_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "thickness" (
	"thickness_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thickness_value" double precision NOT NULL,
	"thickness_unit" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "thickness_value_unit_unique" ON "thickness" USING btree ("thickness_value", "thickness_unit");

CREATE TABLE IF NOT EXISTS "glass_prices" (
	"glass_prices_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_type_id" uuid NOT NULL,
	"thickness_id" uuid NOT NULL,
	"variant" varchar(100) NOT NULL,
	"variant_image_url" varchar NOT NULL,
	"variant_image_public_id" varchar NOT NULL,
	"composition" varchar(100),
	"composition_detail" varchar(255),
	"price_per_sqm" numeric(12, 2) NOT NULL,
	CONSTRAINT "glass_prices_glass_type_id_glass_types_glass_type_id_fk" FOREIGN KEY ("glass_type_id") REFERENCES "public"."glass_types"("glass_type_id") ON DELETE no action ON UPDATE no action,
	CONSTRAINT "glass_prices_thickness_id_thickness_thickness_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thickness"("thickness_id") ON DELETE no action ON UPDATE no action
);
