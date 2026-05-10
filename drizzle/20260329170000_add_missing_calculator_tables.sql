-- Baseline tabel kalkulator yang sebelumnya hanya dibuat lewat `drizzle-kit push`
-- (sehingga tidak pernah ter-commit sebagai migration). Migration ini idempoten
-- (semua pakai IF NOT EXISTS) sehingga aman dijalankan di DB yang sudah punya
-- tabel tersebut maupun yang masih kosong.

-- 1) Enum unit untuk processing_prices
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'processing_unit') THEN
    CREATE TYPE "processing_unit" AS ENUM ('m1', 'pcs', 'sqm', 'none');
  END IF;
END $$;

-- 2) Kategori proses pengolahan kaca
CREATE TABLE IF NOT EXISTS "processing_categories" (
	"processing_category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" varchar(200) NOT NULL,
	"category_image_url" varchar NOT NULL,
	"category_image_public_id" varchar NOT NULL
);

-- 3) Harga proses (mendukung mode single thickness atau range)
CREATE TABLE IF NOT EXISTS "processing_prices" (
	"processing_prices_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"thickness" numeric(12, 2),
	"min_thickness" numeric(12, 2),
	"max_thickness" numeric(12, 2),
	"service_name" varchar(200) NOT NULL,
	"unit" "processing_unit" NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	CONSTRAINT "processing_prices_category_id_fk"
		FOREIGN KEY ("category_id")
		REFERENCES "public"."processing_categories"("processing_category_id")
		ON DELETE no action ON UPDATE no action
);
