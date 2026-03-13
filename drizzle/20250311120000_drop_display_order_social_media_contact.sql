-- Drop display_order from social_media and contact (indexes are dropped automatically with column)
ALTER TABLE "social_media" DROP COLUMN IF EXISTS "display_order";--> statement-breakpoint
ALTER TABLE "contact" DROP COLUMN IF EXISTS "display_order";
