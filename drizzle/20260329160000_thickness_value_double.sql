-- Ketebalan: dukung nilai desimal (mis. 5,5 mm)
ALTER TABLE "thickness" ALTER COLUMN "thickness_value" SET DATA TYPE double precision USING "thickness_value"::double precision;
