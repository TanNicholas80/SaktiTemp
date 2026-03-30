import { pgEnum, pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";
import { processingCategories } from "./processing_categories";

export const processingUnitEnum = pgEnum("processing_unit", [
  "m1",
  "pcs",
  "sqm",
  "none",
]);

/**
 * Harga proses pengolahan berdasarkan kategori + ketebalan.
 *
 * Support 2 mode:
 * - range: minThickness + maxThickness
 * - single: thickness (tanpa min/max)
 */
export const processingPrices = pgTable("processing_prices", {
  processingPricesId: uuid("processing_prices_id")
    .primaryKey()
    .defaultRandom(),

  categoryId: uuid("category_id")
    .references(() => processingCategories.processingCategoryId)
    .notNull(),

  thickness: decimal("thickness", {
    precision: 12,
    scale: 2,
    mode: "number",
  }),

  minThickness: decimal("min_thickness", {
    precision: 12,
    scale: 2,
    mode: "number",
  }),

  maxThickness: decimal("max_thickness", {
    precision: 12,
    scale: 2,
    mode: "number",
  }),

  serviceName: varchar("service_name", { length: 200 }).notNull(),

  unit: processingUnitEnum("unit").notNull(),

  price: decimal("price", { precision: 12, scale: 2, mode: "number" }).notNull(),
});
