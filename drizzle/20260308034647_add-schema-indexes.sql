CREATE TABLE "product-application" (
	"product_application_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"product_application_image_url" varchar NOT NULL,
	"product_application_image_public_id" varchar NOT NULL,
	"product_application_name" varchar NOT NULL,
	"product_application_description" text NOT NULL,
	"product_application_slug" varchar NOT NULL,
	"product_application_is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product-application_product_application_slug_unique" UNIQUE("product_application_slug")
);
--> statement-breakpoint
ALTER TABLE "product-application" ADD CONSTRAINT "product-application_product_id_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application" ADD CONSTRAINT "fk_product_application_product_id" FOREIGN KEY ("product_id") REFERENCES "public"."product"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_application_product_id_idx" ON "product-application" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rate_limit_key_idx" ON "rate_limit" USING btree ("key");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_at_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "blog_category_blog_id_idx" ON "blog" USING btree ("category_blog_id");--> statement-breakpoint
CREATE INDEX "blog_is_published_at_idx" ON "blog" USING btree ("blog_is_published_at");--> statement-breakpoint
CREATE INDEX "blog_views_idx" ON "blog" USING btree ("blog_views");--> statement-breakpoint
CREATE INDEX "carousel_order_idx" ON "carousel" USING btree ("carousel_order");--> statement-breakpoint
CREATE INDEX "category_portofolio_created_at_idx" ON "category-portofolio" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "certification_display_order_idx" ON "certification" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "company_stat_display_order_idx" ON "company_stat" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "contact_display_order_idx" ON "contact" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "portofolio_category_portofolio_id_idx" ON "portofolio" USING btree ("category_portofolio_id");--> statement-breakpoint
CREATE INDEX "portofolio_is_published_at_idx" ON "portofolio" USING btree ("portofolio_is_published_at");--> statement-breakpoint
CREATE INDEX "portofolio_views_idx" ON "portofolio" USING btree ("portofolio_views");--> statement-breakpoint
CREATE INDEX "product_exellence_product_id_idx" ON "product-exellence" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_portofolio_product_id_idx" ON "product-portofolio" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_portofolio_portofolio_id_idx" ON "product-portofolio" USING btree ("portofolio_id");--> statement-breakpoint
CREATE INDEX "product_thickness_product_id_idx" ON "product-thickness" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_category_product_id_idx" ON "product" USING btree ("category_product_id");--> statement-breakpoint
CREATE INDEX "product_is_published_at_idx" ON "product" USING btree ("product_is_published_at");--> statement-breakpoint
CREATE INDEX "product_views_idx" ON "product" USING btree ("product_views");--> statement-breakpoint
CREATE INDEX "social_media_display_order_idx" ON "social_media" USING btree ("display_order");