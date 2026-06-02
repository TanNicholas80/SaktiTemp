import { pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";
import { glassTypes } from "./glass_types";
import { thickness } from "./thickness";

/**
 * Master harga kaca berdasarkan kombinasi tipe kaca + ketebalan + variant.
 */
export const glassPrices = pgTable("glass_prices", {
  glassPricesId: uuid("glass_prices_id").primaryKey().defaultRandom(),

  glassTypeId: uuid("glass_type_id")
    .references(() => glassTypes.glassTypeId, { onDelete: "cascade" })
    .notNull(),

  thicknessId: uuid("thickness_id")
    .references(() => thickness.thicknessId, { onDelete: "cascade" })
    .notNull(),

  variant: varchar("variant", { length: 100 }).notNull(),
  variantImageUrl: varchar("variant_image_url").notNull(),
  variantImagePublicId: varchar("variant_image_public_id").notNull(),

  composition: varchar("composition", { length: 100 }),
  compositionDetail: varchar("composition_detail", { length: 255 }),

  pricePerSqm: decimal("price_per_sqm", {
    precision: 12,
    scale: 2,
    mode: "number",
  }).notNull(),
});
