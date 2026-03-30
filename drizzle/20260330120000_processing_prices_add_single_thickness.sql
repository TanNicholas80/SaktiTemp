-- processing_prices: dukung ketebalan tunggal (tanpa range)
-- Mode valid:
-- - single: thickness IS NOT NULL, min_thickness & max_thickness IS NULL
-- - range: thickness IS NULL, min_thickness & max_thickness IS NOT NULL

ALTER TABLE "processing_prices"
  ADD COLUMN IF NOT EXISTS "thickness" numeric(12,2);

ALTER TABLE "processing_prices"
  ALTER COLUMN "min_thickness" DROP NOT NULL;

ALTER TABLE "processing_prices"
  ALTER COLUMN "max_thickness" DROP NOT NULL;

ALTER TABLE "processing_prices"
  DROP CONSTRAINT IF EXISTS "processing_prices_thickness_mode_check";

ALTER TABLE "processing_prices"
  ADD CONSTRAINT "processing_prices_thickness_mode_check"
  CHECK (
    (
      "thickness" IS NOT NULL
      AND "min_thickness" IS NULL
      AND "max_thickness" IS NULL
    )
    OR
    (
      "thickness" IS NULL
      AND "min_thickness" IS NOT NULL
      AND "max_thickness" IS NOT NULL
    )
  );

