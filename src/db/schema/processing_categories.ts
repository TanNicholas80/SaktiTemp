import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * Kategori proses pengolahan kaca (mis. Edging Lurus, Bevel & Verstek, dll).
 */
export const processingCategories = pgTable("processing_categories", {
  processingCategoryId: uuid("processing_category_id")
    .primaryKey()
    .defaultRandom(),

  categoryName: varchar("category_name", { length: 200 }).notNull(),
  categoryImageUrl: varchar("category_image_url").notNull(),
  categoryImagePublicId: varchar("category_image_public_id").notNull(),
});
