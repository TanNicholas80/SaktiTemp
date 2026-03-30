import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { productApplication } from "./product-application";

export const productApplicationTranslations = pgTable(
  "product_application_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productApplicationId: uuid("product_application_id")
      .references(() => productApplication.productApplicationId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    productApplicationName: varchar("product_application_name").notNull(),
    productApplicationDescription: text(
      "product_application_description"
    ).notNull(),
  },
  (table) => [
    uniqueIndex("product_application_tr_unique").on(
      table.productApplicationId,
      table.locale
    ),
    index("product_application_tr_locale_idx").on(table.locale),
  ]
);
