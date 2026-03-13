ALTER TABLE "blog" ADD COLUMN "blog_excerpt" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "category-portofolio" ADD COLUMN "category_portofolio_icon" varchar(50) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "category-portofolio" ADD COLUMN "category_portofolio_image" varchar(255) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "category-portofolio" ADD COLUMN "category_portofolio_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "portofolio" ADD COLUMN "portofolio_short_description" varchar(500) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "product_short_description" varchar(500) DEFAULT '' NOT NULL;