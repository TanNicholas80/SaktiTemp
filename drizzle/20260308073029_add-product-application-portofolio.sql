CREATE TABLE "product-application-portofolio" (
	"product_application_portofolio_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_application_id" uuid,
	"portofolio_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product-application-portofolio" ADD CONSTRAINT "product-application-portofolio_product_application_id_product-application_product_application_id_fk" FOREIGN KEY ("product_application_id") REFERENCES "public"."product-application"("product_application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application-portofolio" ADD CONSTRAINT "product-application-portofolio_portofolio_id_portofolio_portofolio_id_fk" FOREIGN KEY ("portofolio_id") REFERENCES "public"."portofolio"("portofolio_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application-portofolio" ADD CONSTRAINT "fk_product_application_portofolio_product_application_id" FOREIGN KEY ("product_application_id") REFERENCES "public"."product-application"("product_application_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product-application-portofolio" ADD CONSTRAINT "fk_product_application_portofolio_portofolio_id" FOREIGN KEY ("portofolio_id") REFERENCES "public"."portofolio"("portofolio_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_application_portofolio_product_application_id_idx" ON "product-application-portofolio" USING btree ("product_application_id");--> statement-breakpoint
CREATE INDEX "product_application_portofolio_portofolio_id_idx" ON "product-application-portofolio" USING btree ("portofolio_id");