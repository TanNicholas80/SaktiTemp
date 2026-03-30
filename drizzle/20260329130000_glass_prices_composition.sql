-- Kolom opsional komposisi kaca per baris harga
ALTER TABLE "glass_prices" ADD COLUMN IF NOT EXISTS "composition" varchar(100);
ALTER TABLE "glass_prices" ADD COLUMN IF NOT EXISTS "composition_detail" varchar(255);

-- Perlebar jika kolom sudah ada dari skema lama (varchar lebih pendek)
ALTER TABLE "glass_prices" ALTER COLUMN "composition_detail" TYPE varchar(255);
