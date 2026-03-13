CREATE TABLE "portofolio_type" (
	"portofolio_type_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portofolio_type_name" varchar(100) NOT NULL,
	"portofolio_type_slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "portofolio" ADD COLUMN "portofolio_type_id" uuid;--> statement-breakpoint
CREATE UNIQUE INDEX "portofolio_type_name_unique" ON "portofolio_type" USING btree ("portofolio_type_name");--> statement-breakpoint
CREATE UNIQUE INDEX "portofolio_type_slug_unique" ON "portofolio_type" USING btree ("portofolio_type_slug");--> statement-breakpoint
CREATE INDEX "portofolio_type_created_at_idx" ON "portofolio_type" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "portofolio_portofolio_type_id_portofolio_type_portofolio_type_id_fk" FOREIGN KEY ("portofolio_type_id") REFERENCES "public"."portofolio_type"("portofolio_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portofolio" ADD CONSTRAINT "fk_portofolio_portofolio_type_id" FOREIGN KEY ("portofolio_type_id") REFERENCES "public"."portofolio_type"("portofolio_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portofolio_portofolio_type_id_idx" ON "portofolio" USING btree ("portofolio_type_id");