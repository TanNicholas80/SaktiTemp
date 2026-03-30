import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { processingCategories } from "./processing_categories";

export const processingCategoriesTranslations = pgTable(
  "processing_categories_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    processingCategoryId: uuid("processing_category_id")
      .references(() => processingCategories.processingCategoryId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    categoryName: varchar("category_name", { length: 200 }).notNull(),
  },
  (table) => [
    uniqueIndex("processing_categories_tr_unique").on(
      table.processingCategoryId,
      table.locale
    ),
    index("processing_categories_tr_locale_idx").on(table.locale),
  ]
);
