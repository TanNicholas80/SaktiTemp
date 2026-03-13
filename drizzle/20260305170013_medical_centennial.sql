CREATE TYPE "public"."location_type" AS ENUM('branch', 'head');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"last_request" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benefit" (
	"benefit_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"benefit_name" varchar NOT NULL,
	"benefit_description" text NOT NULL,
	"benefit_icon" varchar NOT NULL,
	"benefit_is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog" (
	"blog_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_blog_id" uuid,
	"blog_title" varchar NOT NULL,
	"blog_slug" varchar NOT NULL,
	"blog_content" text NOT NULL,
	"blog_image_url" varchar NOT NULL,
	"blog_image_public_id" varchar NOT NULL,
	"blog_views" integer DEFAULT 0 NOT NULL,
	"blog_is_published" boolean DEFAULT false NOT NULL,
	"blog_is_published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carousel" (
	"carousel_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"carousel_heading" varchar NOT NULL,
	"carousel_subheading" varchar NOT NULL,
	"carousel_description" text NOT NULL,
	"carousel_image_url" varchar NOT NULL,
	"carousel_image_public_id" varchar NOT NULL,
	"carousel_order" integer NOT NULL,
	"carousel_is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category-blog" (
	"category_blog_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_blog_name" varchar NOT NULL,
	"category_blog_slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category-portofolio" (
	"category_portofolio_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_portofolio_name" varchar NOT NULL,
	"category_portofolio_slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category-product" (
	"category_product_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_product_name" varchar NOT NULL,
	"category_product_slug" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location" (
	"location_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_city" varchar NOT NULL,
	"location_type" "location_type" NOT NULL,
	"location_address" text NOT NULL,
	"location_map_url" text NOT NULL,
	"location_is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portofolio" (
	"portofolio_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_portofolio_id" uuid,
	"portofolio_name" varchar NOT NULL,
	"portofolio_slug" varchar NOT NULL,
	"portofolio_about" text NOT NULL,
	"portofolio_client" varchar NOT NULL,
	"portofolio_location" varchar NOT NULL,
	"portofolio_year" integer DEFAULT 0 NOT NULL,
	"portofolio_area_size" integer DEFAULT 0 NOT NULL,
	"portofolio_area_size_unit" varchar NOT NULL,
	"portofolio_image_url" varchar NOT NULL,
	"portofolio_image_public_id" varchar NOT NULL,
	"portofolio_views" integer DEFAULT 0 NOT NULL,
	"portofolio_is_published" boolean DEFAULT false NOT NULL,
	"portofolio_is_published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product-exellence" (
	"product_exellence_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"product_exellence_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product-portofolio" (
	"product_portofolio_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"portofolio_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product-thickness" (
	"product_thickness_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"product_thickness_value" integer NOT NULL,
	"product_thickness_unit" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product-usage" (
	"product_usage_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"usage_label" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"product_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_product_id" uuid,
	"product_name" varchar NOT NULL,
	"product_slug" varchar NOT NULL,
	"product_description" text NOT NULL,
	"product_image_url" varchar NOT NULL,
	"product_image_public_id" varchar NOT NULL,
	"product_views" integer DEFAULT 0 NOT NULL,
	"product_is_published" boolean DEFAULT false NOT NULL,
	"product_is_published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service" (
	"service_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_name" varchar NOT NULL,
	"service_description" text NOT NULL,
	"service_icon" varchar NOT NULL,
	"service_is_published" boolean DEFAULT false NOT NULL,
	"service_points" jsonb NOT NULL,
	"service_btn_text" varchar NOT NULL,
	"service_btn_link" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_category_blog_id_category-blog_category_blog_id_fk" FOREIGN KEY ("category_blog_id") REFERENCES "public"."category-blog"("category_blog_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "fk_blog_category_blog_id" FOREIGN KEY ("category_blog_id") REFERENCES "public"."category-blog"("category_blog_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "portofolio_category_portofolio_id_category-portofolio_category_portofolio_id_fk" FOREIGN KEY ("category_portofolio_id") REFERENCES "public"."category-portofolio"("category_portofolio_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "fk_portofolio_category_portofolio_id" FOREIGN KEY ("category_portofolio_id") REFERENCES "public"."category-portofolio"("category_portofolio_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-exellence" ADD CONSTRAINT "product-exellence_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-exellence" ADD CONSTRAINT "fk_product_exellence_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-portofolio" ADD CONSTRAINT "product-portofolio_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-portofolio" ADD CONSTRAINT "product-portofolio_portofolio_id_portofolio_portofolio_id_fk" FOREIGN KEY ("portofolio_id") REFERENCES "public"."portofolio"("portofolio_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-portofolio" ADD CONSTRAINT "fk_product_portofolio_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-portofolio" ADD CONSTRAINT "fk_product_portofolio_portofolio_id" FOREIGN KEY ("portofolio_id") REFERENCES "public"."portofolio"("portofolio_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-thickness" ADD CONSTRAINT "product-thickness_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-thickness" ADD CONSTRAINT "fk_product_thickness_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-usage" ADD CONSTRAINT "product-usage_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-usage" ADD CONSTRAINT "fk_product_usage_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_product_id_category-product_category_product_id_fk" FOREIGN KEY ("category_product_id") REFERENCES "public"."category-product"("category_product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "fk_product_category_product_id" FOREIGN KEY ("category_product_id") REFERENCES "public"."category-product"("category_product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique" ON "session" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique" ON "user" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "verification_identifier_value_unique" ON "verification" USING btree ("identifier","value");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_slug_unique" ON "blog" USING btree ("blog_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "category_blog_name_unique" ON "category-blog" USING btree ("category_blog_name");--> statement-breakpoint
CREATE UNIQUE INDEX "category_blog_slug_unique" ON "category-blog" USING btree ("category_blog_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "category_portofolio_name_unique" ON "category-portofolio" USING btree ("category_portofolio_name");--> statement-breakpoint
CREATE UNIQUE INDEX "category_portofolio_slug_unique" ON "category-portofolio" USING btree ("category_portofolio_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "category_product_name_unique" ON "category-product" USING btree ("category_product_name");--> statement-breakpoint
CREATE UNIQUE INDEX "category_product_slug_unique" ON "category-product" USING btree ("category_product_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "portofolio_slug_unique" ON "portofolio" USING btree ("portofolio_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "product_slug_unique" ON "product" USING btree ("product_slug");