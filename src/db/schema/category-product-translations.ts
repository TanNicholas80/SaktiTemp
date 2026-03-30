import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryProduct } from "./category-product";

export const categoryProductTranslations = pgTable(
  "category_product_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryProductId: uuid("category_product_id")
      .references(() => categoryProduct.categoryProductId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    categoryProductName: varchar("category_product_name").notNull(),
  },
  (table) => [
    uniqueIndex("category_product_tr_unique").on(
      table.categoryProductId,
      table.locale
    ),
    index("category_product_tr_locale_idx").on(table.locale),
  ]
);
