CREATE TABLE "benefit_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"benefit_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"benefit_name" varchar NOT NULL,
	"benefit_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blog_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"blog_title" varchar NOT NULL,
	"blog_excerpt" varchar(500) DEFAULT '' NOT NULL,
	"blog_content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carousel_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carousel_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"carousel_heading" varchar NOT NULL,
	"carousel_subheading" varchar NOT NULL,
	"carousel_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_blog_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_blog_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"category_blog_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_portofolio_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_portofolio_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"category_portofolio_name" varchar NOT NULL,
	"category_portofolio_description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_product_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_product_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"category_product_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certification_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"certification_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_stat_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_stat_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"label" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"contact_label" varchar(100) NOT NULL,
	"contact_value" text NOT NULL,
	"contact_value_extra" text
);
--> statement-breakpoint
CREATE TABLE "content_cache" (
	"cache_key" varchar(512) PRIMARY KEY NOT NULL,
	"cache_value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glass_prices_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_prices_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"variant" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glass_types_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_type_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"glass_type_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glass_prices" (
	"glass_prices_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_type_id" uuid NOT NULL,
	"thickness_id" uuid NOT NULL,
	"variant" varchar(100) NOT NULL,
	"variant_image_url" varchar NOT NULL,
	"variant_image_public_id" varchar NOT NULL,
	"composition" varchar(100),
	"composition_detail" varchar(255),
	"price_per_sqm" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "glass_types" (
	"glass_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"glass_type_name" varchar NOT NULL,
	"glass_type_image_url" varchar NOT NULL,
	"glass_type_image_public_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_section_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_section_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"pre_heading" varchar(100),
	"main_heading" varchar(200) NOT NULL,
	"sub_heading" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"scroll_indicator_text" varchar(50),
	"breadcrumb_items" jsonb
);
--> statement-breakpoint
CREATE TABLE "location_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"location_city" varchar NOT NULL,
	"location_address" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portofolio_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portofolio_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"portofolio_name" varchar NOT NULL,
	"portofolio_short_description" varchar(500) DEFAULT '' NOT NULL,
	"portofolio_about" text NOT NULL,
	"portofolio_location" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portofolio_type_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portofolio_type_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"portofolio_type_name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_application_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_application_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"product_application_name" varchar NOT NULL,
	"product_application_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_exellence_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_exellence_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"product_exellence_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_thickness" (
	"product_id" uuid NOT NULL,
	"thickness_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_thickness_product_id_thickness_id_pk" PRIMARY KEY("product_id","thickness_id")
);
--> statement-breakpoint
CREATE TABLE "product_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"product_name" varchar NOT NULL,
	"product_short_description" varchar(500) DEFAULT '' NOT NULL,
	"product_description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"service_name" varchar NOT NULL,
	"service_description" text NOT NULL,
	"service_points" jsonb NOT NULL,
	"service_btn_text" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_media_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"social_media_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"platform_name" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thickness_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thickness_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"thickness_unit" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thickness" (
	"thickness_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thickness_value" double precision NOT NULL,
	"thickness_unit" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product-thickness" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "product-thickness" CASCADE;--> statement-breakpoint
ALTER TABLE "blog" DROP CONSTRAINT "blog_category_blog_id_category-blog_category_blog_id_fk";
--> statement-breakpoint
ALTER TABLE "blog" DROP CONSTRAINT "fk_blog_category_blog_id";
--> statement-breakpoint
ALTER TABLE "portofolio" DROP CONSTRAINT "portofolio_category_portofolio_id_category-portofolio_category_portofolio_id_fk";
--> statement-breakpoint
ALTER TABLE "portofolio" DROP CONSTRAINT "portofolio_portofolio_type_id_portofolio_type_portofolio_type_id_fk";
--> statement-breakpoint
ALTER TABLE "portofolio" DROP CONSTRAINT "fk_portofolio_category_portofolio_id";
--> statement-breakpoint
ALTER TABLE "portofolio" DROP CONSTRAINT "fk_portofolio_portofolio_type_id";
--> statement-breakpoint
ALTER TABLE "product-application" DROP CONSTRAINT "product-application_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product-application" DROP CONSTRAINT "fk_product_application_product_id";
--> statement-breakpoint
ALTER TABLE "product-exellence" DROP CONSTRAINT "product-exellence_product_id_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product-exellence" DROP CONSTRAINT "fk_product_exellence_product_id";
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "product_category_product_id_category-product_category_product_id_fk";
--> statement-breakpoint
ALTER TABLE "product" DROP CONSTRAINT "fk_product_category_product_id";
--> statement-breakpoint
DROP INDEX "contact_display_order_idx";--> statement-breakpoint
DROP INDEX "social_media_display_order_idx";--> statement-breakpoint
ALTER TABLE "certification" ALTER COLUMN "display_order" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "company_stat" ALTER COLUMN "display_order" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "portofolio" ADD COLUMN "portofolio_gallery_images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "benefit_translations" ADD CONSTRAINT "benefit_translations_benefit_id_benefit_benefit_id_fk" FOREIGN KEY ("benefit_id") REFERENCES "public"."benefit"("benefit_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_translations" ADD CONSTRAINT "blog_translations_blog_id_blog_blog_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("blog_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carousel_translations" ADD CONSTRAINT "carousel_translations_carousel_id_carousel_carousel_id_fk" FOREIGN KEY ("carousel_id") REFERENCES "public"."carousel"("carousel_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_blog_translations" ADD CONSTRAINT "category_blog_translations_category_blog_id_category-blog_category_blog_id_fk" FOREIGN KEY ("category_blog_id") REFERENCES "public"."category-blog"("category_blog_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_portofolio_translations" ADD CONSTRAINT "category_portofolio_translations_category_portofolio_id_category-portofolio_category_portofolio_id_fk" FOREIGN KEY ("category_portofolio_id") REFERENCES "public"."category-portofolio"("category_portofolio_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_product_translations" ADD CONSTRAINT "category_product_translations_category_product_id_category-product_category_product_id_fk" FOREIGN KEY ("category_product_id") REFERENCES "public"."category-product"("category_product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certification_translations" ADD CONSTRAINT "certification_translations_certification_id_certification_certification_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certification"("certification_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_stat_translations" ADD CONSTRAINT "company_stat_translations_company_stat_id_company_stat_company_stat_id_fk" FOREIGN KEY ("company_stat_id") REFERENCES "public"."company_stat"("company_stat_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_translations" ADD CONSTRAINT "contact_translations_contact_id_contact_contact_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contact"("contact_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glass_prices_translations" ADD CONSTRAINT "glass_prices_translations_glass_prices_id_glass_prices_glass_prices_id_fk" FOREIGN KEY ("glass_prices_id") REFERENCES "public"."glass_prices"("glass_prices_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glass_types_translations" ADD CONSTRAINT "glass_types_translations_glass_type_id_glass_types_glass_type_id_fk" FOREIGN KEY ("glass_type_id") REFERENCES "public"."glass_types"("glass_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glass_prices" ADD CONSTRAINT "glass_prices_glass_type_id_glass_types_glass_type_id_fk" FOREIGN KEY ("glass_type_id") REFERENCES "public"."glass_types"("glass_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "glass_prices" ADD CONSTRAINT "glass_prices_thickness_id_thickness_thickness_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thickness"("thickness_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_section_translations" ADD CONSTRAINT "hero_section_translations_hero_section_id_hero_section_hero_section_id_fk" FOREIGN KEY ("hero_section_id") REFERENCES "public"."hero_section"("hero_section_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_translations" ADD CONSTRAINT "location_translations_location_id_location_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("location_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio_translations" ADD CONSTRAINT "portofolio_translations_portofolio_id_portofolio_portofolio_id_fk" FOREIGN KEY ("portofolio_id") REFERENCES "public"."portofolio"("portofolio_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio_type_translations" ADD CONSTRAINT "portofolio_type_translations_portofolio_type_id_portofolio_type_portofolio_type_id_fk" FOREIGN KEY ("portofolio_type_id") REFERENCES "public"."portofolio_type"("portofolio_type_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_application_translations" ADD CONSTRAINT "product_application_translations_product_application_id_product-application_product_application_id_fk" FOREIGN KEY ("product_application_id") REFERENCES "public"."product-application"("product_application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_exellence_translations" ADD CONSTRAINT "product_exellence_translations_product_exellence_id_product-exellence_product_exellence_id_fk" FOREIGN KEY ("product_exellence_id") REFERENCES "public"."product-exellence"("product_exellence_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_thickness" ADD CONSTRAINT "product_thickness_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_thickness" ADD CONSTRAINT "product_thickness_thickness_id_thickness_thickness_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thickness"("thickness_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_thickness" ADD CONSTRAINT "fk_product_thickness_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_thickness" ADD CONSTRAINT "fk_product_thickness_thickness_id" FOREIGN KEY ("thickness_id") REFERENCES "public"."thickness"("thickness_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_service_id_service_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("service_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_translations" ADD CONSTRAINT "social_media_translations_social_media_id_social_media_social_media_id_fk" FOREIGN KEY ("social_media_id") REFERENCES "public"."social_media"("social_media_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thickness_translations" ADD CONSTRAINT "thickness_translations_thickness_id_thickness_thickness_id_fk" FOREIGN KEY ("thickness_id") REFERENCES "public"."thickness"("thickness_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "benefit_tr_unique" ON "benefit_translations" USING btree ("benefit_id","locale");--> statement-breakpoint
CREATE INDEX "benefit_tr_locale_idx" ON "benefit_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_tr_unique" ON "blog_translations" USING btree ("blog_id","locale");--> statement-breakpoint
CREATE INDEX "blog_tr_locale_idx" ON "blog_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "carousel_tr_unique" ON "carousel_translations" USING btree ("carousel_id","locale");--> statement-breakpoint
CREATE INDEX "carousel_tr_locale_idx" ON "carousel_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "category_blog_tr_unique" ON "category_blog_translations" USING btree ("category_blog_id","locale");--> statement-breakpoint
CREATE INDEX "category_blog_tr_locale_idx" ON "category_blog_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "category_portofolio_tr_unique" ON "category_portofolio_translations" USING btree ("category_portofolio_id","locale");--> statement-breakpoint
CREATE INDEX "category_portofolio_tr_locale_idx" ON "category_portofolio_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "category_product_tr_unique" ON "category_product_translations" USING btree ("category_product_id","locale");--> statement-breakpoint
CREATE INDEX "category_product_tr_locale_idx" ON "category_product_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "certification_tr_unique" ON "certification_translations" USING btree ("certification_id","locale");--> statement-breakpoint
CREATE INDEX "certification_tr_locale_idx" ON "certification_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "company_stat_tr_unique" ON "company_stat_translations" USING btree ("company_stat_id","locale");--> statement-breakpoint
CREATE INDEX "company_stat_tr_locale_idx" ON "company_stat_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "contact_tr_unique" ON "contact_translations" USING btree ("contact_id","locale");--> statement-breakpoint
CREATE INDEX "contact_tr_locale_idx" ON "contact_translations" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "content_cache_expires_idx" ON "content_cache" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "glass_prices_tr_unique" ON "glass_prices_translations" USING btree ("glass_prices_id","locale");--> statement-breakpoint
CREATE INDEX "glass_prices_tr_locale_idx" ON "glass_prices_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "glass_types_tr_unique" ON "glass_types_translations" USING btree ("glass_type_id","locale");--> statement-breakpoint
CREATE INDEX "glass_types_tr_locale_idx" ON "glass_types_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "hero_section_tr_unique" ON "hero_section_translations" USING btree ("hero_section_id","locale");--> statement-breakpoint
CREATE INDEX "hero_section_tr_locale_idx" ON "hero_section_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "location_tr_unique" ON "location_translations" USING btree ("location_id","locale");--> statement-breakpoint
CREATE INDEX "location_tr_locale_idx" ON "location_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "portofolio_tr_unique" ON "portofolio_translations" USING btree ("portofolio_id","locale");--> statement-breakpoint
CREATE INDEX "portofolio_tr_locale_idx" ON "portofolio_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "portofolio_type_tr_unique" ON "portofolio_type_translations" USING btree ("portofolio_type_id","locale");--> statement-breakpoint
CREATE INDEX "portofolio_type_tr_locale_idx" ON "portofolio_type_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "product_application_tr_unique" ON "product_application_translations" USING btree ("product_application_id","locale");--> statement-breakpoint
CREATE INDEX "product_application_tr_locale_idx" ON "product_application_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "product_exellence_tr_unique" ON "product_exellence_translations" USING btree ("product_exellence_id","locale");--> statement-breakpoint
CREATE INDEX "product_exellence_tr_locale_idx" ON "product_exellence_translations" USING btree ("locale");--> statement-breakpoint
CREATE INDEX "product_thickness_product_id_idx" ON "product_thickness" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_thickness_thickness_id_idx" ON "product_thickness" USING btree ("thickness_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_tr_unique" ON "product_translations" USING btree ("product_id","locale");--> statement-breakpoint
CREATE INDEX "product_tr_locale_idx" ON "product_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "service_tr_unique" ON "service_translations" USING btree ("service_id","locale");--> statement-breakpoint
CREATE INDEX "service_tr_locale_idx" ON "service_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "social_media_tr_unique" ON "social_media_translations" USING btree ("social_media_id","locale");--> statement-breakpoint
CREATE INDEX "social_media_tr_locale_idx" ON "social_media_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "thickness_tr_unique" ON "thickness_translations" USING btree ("thickness_id","locale");--> statement-breakpoint
CREATE INDEX "thickness_tr_locale_idx" ON "thickness_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX "thickness_value_unit_unique" ON "thickness" USING btree ("thickness_value","thickness_unit");--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_category_blog_id_category-blog_category_blog_id_fk" FOREIGN KEY ("category_blog_id") REFERENCES "public"."category-blog"("category_blog_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "fk_blog_category_blog_id" FOREIGN KEY ("category_blog_id") REFERENCES "public"."category-blog"("category_blog_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "portofolio_category_portofolio_id_category-portofolio_category_portofolio_id_fk" FOREIGN KEY ("category_portofolio_id") REFERENCES "public"."category-portofolio"("category_portofolio_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "portofolio_portofolio_type_id_portofolio_type_portofolio_type_id_fk" FOREIGN KEY ("portofolio_type_id") REFERENCES "public"."portofolio_type"("portofolio_type_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "fk_portofolio_category_portofolio_id" FOREIGN KEY ("category_portofolio_id") REFERENCES "public"."category-portofolio"("category_portofolio_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "fk_portofolio_portofolio_type_id" FOREIGN KEY ("portofolio_type_id") REFERENCES "public"."portofolio_type"("portofolio_type_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application" ADD CONSTRAINT "product-application_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application" ADD CONSTRAINT "fk_product_application_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-exellence" ADD CONSTRAINT "product-exellence_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-exellence" ADD CONSTRAINT "fk_product_exellence_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_product_id_category-product_category_product_id_fk" FOREIGN KEY ("category_product_id") REFERENCES "public"."category-product"("category_product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "fk_product_category_product_id" FOREIGN KEY ("category_product_id") REFERENCES "public"."category-product"("category_product_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category-portofolio" DROP COLUMN "category_portofolio_icon";--> statement-breakpoint
ALTER TABLE "contact" DROP COLUMN "display_order";--> statement-breakpoint
ALTER TABLE "portofolio" DROP COLUMN "portofolio_client";--> statement-breakpoint
ALTER TABLE "portofolio" DROP COLUMN "portofolio_year";--> statement-breakpoint
ALTER TABLE "portofolio" DROP COLUMN "portofolio_area_size";--> statement-breakpoint
ALTER TABLE "portofolio" DROP COLUMN "portofolio_area_size_unit";--> statement-breakpoint
ALTER TABLE "social_media" DROP COLUMN "display_order";