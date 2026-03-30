import { pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";
import { thickness } from "./thickness";

/**
 * Modifikasi/opsi tambahan pada kaca (mis. Deco-Lami, Stopsol, dll).
 */
export const modification = pgTable("modification", {
  modificationId: uuid("modification_id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 150 }).notNull(),

  thicknessId: uuid("thickness_id")
    .references(() => thickness.thicknessId)
    .notNull(),

  modificationImageUrl: varchar("modification_image_url").notNull(),
  modificationImagePublicId: varchar("modification_image_public_id").notNull(),

  pricePerSide: decimal("price_per_side", {
    precision: 12,
    scale: 2,
    mode: "number",
  }).notNull(),
});
