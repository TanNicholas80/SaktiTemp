-- Translation tables for pre-computed i18n content

CREATE TABLE IF NOT EXISTS "benefit_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "benefit_id" uuid NOT NULL REFERENCES "benefit"("benefit_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "benefit_name" varchar NOT NULL,
  "benefit_description" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "benefit_tr_unique" ON "benefit_translations" ("benefit_id", "locale");
CREATE INDEX IF NOT EXISTS "benefit_tr_locale_idx" ON "benefit_translations" ("locale");

CREATE TABLE IF NOT EXISTS "blog_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "blog_id" uuid NOT NULL REFERENCES "blog"("blog_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "blog_title" varchar NOT NULL,
  "blog_excerpt" varchar(500) NOT NULL DEFAULT '',
  "blog_content" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "blog_tr_unique" ON "blog_translations" ("blog_id", "locale");
CREATE INDEX IF NOT EXISTS "blog_tr_locale_idx" ON "blog_translations" ("locale");

CREATE TABLE IF NOT EXISTS "carousel_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "carousel_id" uuid NOT NULL REFERENCES "carousel"("carousel_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "carousel_heading" varchar NOT NULL,
  "carousel_subheading" varchar NOT NULL,
  "carousel_description" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "carousel_tr_unique" ON "carousel_translations" ("carousel_id", "locale");
CREATE INDEX IF NOT EXISTS "carousel_tr_locale_idx" ON "carousel_translations" ("locale");

CREATE TABLE IF NOT EXISTS "category_blog_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_blog_id" uuid NOT NULL REFERENCES "category-blog"("category_blog_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "category_blog_name" varchar NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "category_blog_tr_unique" ON "category_blog_translations" ("category_blog_id", "locale");
CREATE INDEX IF NOT EXISTS "category_blog_tr_locale_idx" ON "category_blog_translations" ("locale");

CREATE TABLE IF NOT EXISTS "category_portofolio_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_portofolio_id" uuid NOT NULL REFERENCES "category-portofolio"("category_portofolio_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "category_portofolio_name" varchar NOT NULL,
  "category_portofolio_description" text NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX IF NOT EXISTS "category_portofolio_tr_unique" ON "category_portofolio_translations" ("category_portofolio_id", "locale");
CREATE INDEX IF NOT EXISTS "category_portofolio_tr_locale_idx" ON "category_portofolio_translations" ("locale");

CREATE TABLE IF NOT EXISTS "category_product_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_product_id" uuid NOT NULL REFERENCES "category-product"("category_product_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "category_product_name" varchar NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "category_product_tr_unique" ON "category_product_translations" ("category_product_id", "locale");
CREATE INDEX IF NOT EXISTS "category_product_tr_locale_idx" ON "category_product_translations" ("locale");

CREATE TABLE IF NOT EXISTS "company_stat_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_stat_id" uuid NOT NULL REFERENCES "company_stat"("company_stat_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "label" varchar(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "company_stat_tr_unique" ON "company_stat_translations" ("company_stat_id", "locale");
CREATE INDEX IF NOT EXISTS "company_stat_tr_locale_idx" ON "company_stat_translations" ("locale");

CREATE TABLE IF NOT EXISTS "contact_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "contact_id" uuid NOT NULL REFERENCES "contact"("contact_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "contact_label" varchar(100) NOT NULL,
  "contact_value" text NOT NULL,
  "contact_value_extra" text
);
CREATE UNIQUE INDEX IF NOT EXISTS "contact_tr_unique" ON "contact_translations" ("contact_id", "locale");
CREATE INDEX IF NOT EXISTS "contact_tr_locale_idx" ON "contact_translations" ("locale");

CREATE TABLE IF NOT EXISTS "hero_section_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "hero_section_id" uuid NOT NULL REFERENCES "hero_section"("hero_section_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "pre_heading" varchar(100),
  "main_heading" varchar(200) NOT NULL,
  "sub_heading" varchar(200) NOT NULL,
  "description" text NOT NULL,
  "scroll_indicator_text" varchar(50),
  "breadcrumb_items" jsonb
);
CREATE UNIQUE INDEX IF NOT EXISTS "hero_section_tr_unique" ON "hero_section_translations" ("hero_section_id", "locale");
CREATE INDEX IF NOT EXISTS "hero_section_tr_locale_idx" ON "hero_section_translations" ("locale");

CREATE TABLE IF NOT EXISTS "location_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "location_id" uuid NOT NULL REFERENCES "location"("location_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "location_city" varchar NOT NULL,
  "location_address" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "location_tr_unique" ON "location_translations" ("location_id", "locale");
CREATE INDEX IF NOT EXISTS "location_tr_locale_idx" ON "location_translations" ("locale");

CREATE TABLE IF NOT EXISTS "portofolio_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "portofolio_id" uuid NOT NULL REFERENCES "portofolio"("portofolio_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "portofolio_name" varchar NOT NULL,
  "portofolio_short_description" varchar(500) NOT NULL DEFAULT '',
  "portofolio_about" text NOT NULL,
  "portofolio_client" varchar NOT NULL,
  "portofolio_location" varchar NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "portofolio_tr_unique" ON "portofolio_translations" ("portofolio_id", "locale");
CREATE INDEX IF NOT EXISTS "portofolio_tr_locale_idx" ON "portofolio_translations" ("locale");

CREATE TABLE IF NOT EXISTS "portofolio_type_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "portofolio_type_id" uuid NOT NULL REFERENCES "portofolio_type"("portofolio_type_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "portofolio_type_name" varchar(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "portofolio_type_tr_unique" ON "portofolio_type_translations" ("portofolio_type_id", "locale");
CREATE INDEX IF NOT EXISTS "portofolio_type_tr_locale_idx" ON "portofolio_type_translations" ("locale");

CREATE TABLE IF NOT EXISTS "product_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL REFERENCES "product"("product_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "product_name" varchar NOT NULL,
  "product_short_description" varchar(500) NOT NULL DEFAULT '',
  "product_description" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_tr_unique" ON "product_translations" ("product_id", "locale");
CREATE INDEX IF NOT EXISTS "product_tr_locale_idx" ON "product_translations" ("locale");

CREATE TABLE IF NOT EXISTS "product_application_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_application_id" uuid NOT NULL REFERENCES "product-application"("product_application_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "product_application_name" varchar NOT NULL,
  "product_application_description" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_application_tr_unique" ON "product_application_translations" ("product_application_id", "locale");
CREATE INDEX IF NOT EXISTS "product_application_tr_locale_idx" ON "product_application_translations" ("locale");

CREATE TABLE IF NOT EXISTS "product_exellence_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_exellence_id" uuid NOT NULL REFERENCES "product-exellence"("product_exellence_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "product_exellence_description" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_exellence_tr_unique" ON "product_exellence_translations" ("product_exellence_id", "locale");
CREATE INDEX IF NOT EXISTS "product_exellence_tr_locale_idx" ON "product_exellence_translations" ("locale");

CREATE TABLE IF NOT EXISTS "service_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "service_id" uuid NOT NULL REFERENCES "service"("service_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "service_name" varchar NOT NULL,
  "service_description" text NOT NULL,
  "service_points" jsonb NOT NULL,
  "service_btn_text" varchar NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "service_tr_unique" ON "service_translations" ("service_id", "locale");
CREATE INDEX IF NOT EXISTS "service_tr_locale_idx" ON "service_translations" ("locale");

CREATE TABLE IF NOT EXISTS "certification_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "certification_id" uuid NOT NULL REFERENCES "certification"("certification_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "name" varchar(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "certification_tr_unique" ON "certification_translations" ("certification_id", "locale");
CREATE INDEX IF NOT EXISTS "certification_tr_locale_idx" ON "certification_translations" ("locale");

CREATE TABLE IF NOT EXISTS "glass_types_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "glass_type_id" uuid NOT NULL REFERENCES "glass_types"("glass_type_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "glass_type_name" varchar NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "glass_types_tr_unique" ON "glass_types_translations" ("glass_type_id", "locale");
CREATE INDEX IF NOT EXISTS "glass_types_tr_locale_idx" ON "glass_types_translations" ("locale");

CREATE TABLE IF NOT EXISTS "glass_prices_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "glass_prices_id" uuid NOT NULL REFERENCES "glass_prices"("glass_prices_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "variant" varchar(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "glass_prices_tr_unique" ON "glass_prices_translations" ("glass_prices_id", "locale");
CREATE INDEX IF NOT EXISTS "glass_prices_tr_locale_idx" ON "glass_prices_translations" ("locale");

CREATE TABLE IF NOT EXISTS "processing_categories_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "processing_category_id" uuid NOT NULL REFERENCES "processing_categories"("processing_category_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "category_name" varchar(200) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "processing_categories_tr_unique" ON "processing_categories_translations" ("processing_category_id", "locale");
CREATE INDEX IF NOT EXISTS "processing_categories_tr_locale_idx" ON "processing_categories_translations" ("locale");

CREATE TABLE IF NOT EXISTS "processing_prices_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "processing_prices_id" uuid NOT NULL REFERENCES "processing_prices"("processing_prices_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "service_name" varchar(200) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "processing_prices_tr_unique" ON "processing_prices_translations" ("processing_prices_id", "locale");
CREATE INDEX IF NOT EXISTS "processing_prices_tr_locale_idx" ON "processing_prices_translations" ("locale");

CREATE TABLE IF NOT EXISTS "social_media_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "social_media_id" uuid NOT NULL REFERENCES "social_media"("social_media_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "platform_name" varchar(50) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "social_media_tr_unique" ON "social_media_translations" ("social_media_id", "locale");
CREATE INDEX IF NOT EXISTS "social_media_tr_locale_idx" ON "social_media_translations" ("locale");

CREATE TABLE IF NOT EXISTS "thickness_translations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "thickness_id" uuid NOT NULL REFERENCES "thickness"("thickness_id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "thickness_unit" varchar(20) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "thickness_tr_unique" ON "thickness_translations" ("thickness_id", "locale");
CREATE INDEX IF NOT EXISTS "thickness_tr_locale_idx" ON "thickness_translations" ("locale");
