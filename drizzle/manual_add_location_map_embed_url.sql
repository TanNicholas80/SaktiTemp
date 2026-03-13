-- Run this manually if location_map_embed_url column doesn't exist yet
-- ALTER TABLE "location" ADD COLUMN IF NOT EXISTS "location_map_embed_url" text;

-- If column doesn't exist and the above fails, use:
ALTER TABLE "location" ADD COLUMN "location_map_embed_url" text NOT NULL DEFAULT '';
