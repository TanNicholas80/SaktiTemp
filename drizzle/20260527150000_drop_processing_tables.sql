-- Hapus skema "Additional" (processing) yang sudah tidak dipakai kalkulator
-- (Add-On dihilangkan dari landing kalkulator dan modul admin price-list additional).

DROP TABLE IF EXISTS "processing_prices_translations" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "processing_categories_translations" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "processing_prices" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "processing_categories" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "processing_unit";
