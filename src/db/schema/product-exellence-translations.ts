import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { productExellence } from "./product-exellence";

export const productExellenceTranslations = pgTable(
  "product_exellence_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productExellenceId: uuid("product_exellence_id")
      .references(() => productExellence.productExellenceId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    productExellenceDescription: text(
      "product_exellence_description"
    ).notNull(),
  },
  (table) => [
    uniqueIndex("product_exellence_tr_unique").on(
      table.productExellenceId,
      table.locale
    ),
    index("product_exellence_tr_locale_idx").on(table.locale),
  ]
);
