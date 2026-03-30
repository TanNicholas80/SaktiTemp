-- processing_unit: dukung nilai "none" untuk item tanpa satuan (mis. sandblast)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'processing_unit') THEN
    BEGIN
      ALTER TYPE "processing_unit" ADD VALUE IF NOT EXISTS 'none';
    EXCEPTION
      WHEN duplicate_object THEN
        NULL;
    END;
  END IF;
END $$;

