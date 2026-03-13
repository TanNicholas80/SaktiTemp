CREATE TYPE "public"."contact_type" AS ENUM('phone', 'email', 'address', 'operational_hours');--> statement-breakpoint
CREATE TABLE "company_stat" (
	"company_stat_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" varchar(50) NOT NULL,
	"label" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"contact_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_type" "contact_type" NOT NULL,
	"contact_label" varchar(100) NOT NULL,
	"contact_value" text NOT NULL,
	"contact_value_extra" text,
	"contact_icon" varchar(50) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_section" (
	"hero_section_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_key" varchar(50) NOT NULL,
	"pre_heading" varchar(100),
	"main_heading" varchar(200) NOT NULL,
	"sub_heading" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"background_image_url" varchar(500) NOT NULL,
	"background_image_public_id" varchar(255),
	"breadcrumb_items" jsonb,
	"scroll_indicator_text" varchar(50) DEFAULT 'SCROLL',
	"scroll_indicator_visible" boolean DEFAULT true NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hero_section_page_key_unique" UNIQUE("page_key")
);
--> statement-breakpoint
CREATE TABLE "social_media" (
	"social_media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_name" varchar(50) NOT NULL,
	"profile_url" varchar(500) NOT NULL,
	"icon_name" varchar(50) NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
