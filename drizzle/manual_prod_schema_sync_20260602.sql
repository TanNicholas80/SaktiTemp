-- Manual production schema sync for Supabase Postgres
-- Targeted tables:
-- blog, category-portofolio, glass_prices, portofolio, product-application, product-exellence, product
--
-- Safe to re-run (idempotent where possible).
-- Always backup production before execution.

BEGIN;

-- Ensure pgcrypto exists for gen_random_uuid usage in this project
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- blog
-- -----------------------------------------------------------------------------
ALTER TABLE public."blog"
  ADD COLUMN IF NOT EXISTS "blog_excerpt" varchar(500) NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS "blog_slug_unique" ON public."blog" ("blog_slug");
CREATE INDEX IF NOT EXISTS "blog_category_blog_id_idx" ON public."blog" ("category_blog_id");
CREATE INDEX IF NOT EXISTS "blog_is_published_at_idx" ON public."blog" ("blog_is_published_at");
CREATE INDEX IF NOT EXISTS "blog_views_idx" ON public."blog" ("blog_views");

ALTER TABLE public."blog" DROP CONSTRAINT IF EXISTS "fk_blog_category_blog_id";
ALTER TABLE public."blog" ADD CONSTRAINT "fk_blog_category_blog_id"
  FOREIGN KEY ("category_blog_id")
  REFERENCES public."category-blog"("category_blog_id")
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

-- -----------------------------------------------------------------------------
-- category-portofolio
-- -----------------------------------------------------------------------------
ALTER TABLE public."category-portofolio"
  ADD COLUMN IF NOT EXISTS "category_portofolio_image" varchar(255) NOT NULL DEFAULT '';

ALTER TABLE public."category-portofolio"
  ADD COLUMN IF NOT EXISTS "category_portofolio_description" text NOT NULL DEFAULT '';

ALTER TABLE public."category-portofolio"
  DROP COLUMN IF EXISTS "category_portofolio_icon";

CREATE UNIQUE INDEX IF NOT EXISTS "category_portofolio_name_unique" ON public."category-portofolio" ("category_portofolio_name");
CREATE UNIQUE INDEX IF NOT EXISTS "category_portofolio_slug_unique" ON public."category-portofolio" ("category_portofolio_slug");
CREATE INDEX IF NOT EXISTS "category_portofolio_created_at_idx" ON public."category-portofolio" ("created_at");

-- -----------------------------------------------------------------------------
-- glass_prices
-- -----------------------------------------------------------------------------
ALTER TABLE public."glass_prices"
  ADD COLUMN IF NOT EXISTS "composition" varchar(100);

ALTER TABLE public."glass_prices"
  ADD COLUMN IF NOT EXISTS "composition_detail" varchar(255);

-- keep type aligned with schema if column already existed with different size
ALTER TABLE public."glass_prices"
  ALTER COLUMN "composition_detail" TYPE varchar(255);

-- -----------------------------------------------------------------------------
-- portofolio
-- -----------------------------------------------------------------------------
ALTER TABLE public."portofolio"
  ADD COLUMN IF NOT EXISTS "portofolio_short_description" varchar(500) NOT NULL DEFAULT '';

ALTER TABLE public."portofolio"
  ADD COLUMN IF NOT EXISTS "portofolio_gallery_images" jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public."portofolio" DROP COLUMN IF EXISTS "portofolio_client";
ALTER TABLE public."portofolio" DROP COLUMN IF EXISTS "portofolio_year";
ALTER TABLE public."portofolio" DROP COLUMN IF EXISTS "portofolio_area_size";
ALTER TABLE public."portofolio" DROP COLUMN IF EXISTS "portofolio_area_size_unit";

CREATE UNIQUE INDEX IF NOT EXISTS "portofolio_slug_unique" ON public."portofolio" ("portofolio_slug");
CREATE INDEX IF NOT EXISTS "portofolio_category_portofolio_id_idx" ON public."portofolio" ("category_portofolio_id");
CREATE INDEX IF NOT EXISTS "portofolio_portofolio_type_id_idx" ON public."portofolio" ("portofolio_type_id");
CREATE INDEX IF NOT EXISTS "portofolio_is_published_at_idx" ON public."portofolio" ("portofolio_is_published_at");
CREATE INDEX IF NOT EXISTS "portofolio_views_idx" ON public."portofolio" ("portofolio_views");

ALTER TABLE public."portofolio" DROP CONSTRAINT IF EXISTS "fk_portofolio_category_portofolio_id";
ALTER TABLE public."portofolio" ADD CONSTRAINT "fk_portofolio_category_portofolio_id"
  FOREIGN KEY ("category_portofolio_id")
  REFERENCES public."category-portofolio"("category_portofolio_id")
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

ALTER TABLE public."portofolio" DROP CONSTRAINT IF EXISTS "fk_portofolio_portofolio_type_id";
ALTER TABLE public."portofolio" ADD CONSTRAINT "fk_portofolio_portofolio_type_id"
  FOREIGN KEY ("portofolio_type_id")
  REFERENCES public."portofolio_type"("portofolio_type_id")
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

-- -----------------------------------------------------------------------------
-- product
-- -----------------------------------------------------------------------------
ALTER TABLE public."product"
  ADD COLUMN IF NOT EXISTS "product_short_description" varchar(500) NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS "product_slug_unique" ON public."product" ("product_slug");
CREATE INDEX IF NOT EXISTS "product_category_product_id_idx" ON public."product" ("category_product_id");
CREATE INDEX IF NOT EXISTS "product_is_published_at_idx" ON public."product" ("product_is_published_at");
CREATE INDEX IF NOT EXISTS "product_views_idx" ON public."product" ("product_views");

ALTER TABLE public."product" DROP CONSTRAINT IF EXISTS "fk_product_category_product_id";
ALTER TABLE public."product" ADD CONSTRAINT "fk_product_category_product_id"
  FOREIGN KEY ("category_product_id")
  REFERENCES public."category-product"("category_product_id")
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

-- -----------------------------------------------------------------------------
-- product-application
-- -----------------------------------------------------------------------------
ALTER TABLE public."product-application"
  ADD COLUMN IF NOT EXISTS "product_application_is_published" boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "product_application_product_id_idx" ON public."product-application" ("product_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'product-application_product_application_slug_unique'
  ) THEN
    ALTER TABLE public."product-application"
      ADD CONSTRAINT "product-application_product_application_slug_unique"
      UNIQUE ("product_application_slug");
  END IF;
END $$;

ALTER TABLE public."product-application" DROP CONSTRAINT IF EXISTS "fk_product_application_product_id";
ALTER TABLE public."product-application" ADD CONSTRAINT "fk_product_application_product_id"
  FOREIGN KEY ("product_id")
  REFERENCES public."product"("product_id")
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

-- -----------------------------------------------------------------------------
-- product-exellence
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "product_exellence_product_id_idx" ON public."product-exellence" ("product_id");

ALTER TABLE public."product-exellence" DROP CONSTRAINT IF EXISTS "fk_product_exellence_product_id";
ALTER TABLE public."product-exellence" ADD CONSTRAINT "fk_product_exellence_product_id"
  FOREIGN KEY ("product_id")
  REFERENCES public."product"("product_id")
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

COMMIT;
