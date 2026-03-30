import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { product } from "./product";

export const productTranslations = pgTable(
  "product_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .references(() => product.productId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    productName: varchar("product_name").notNull(),
    productShortDescription: varchar("product_short_description", {
      length: 500,
    })
      .notNull()
      .default(""),
    productDescription: text("product_description").notNull(),
  },
  (table) => [
    uniqueIndex("product_tr_unique").on(table.productId, table.locale),
    index("product_tr_locale_idx").on(table.locale),
  ]
);
