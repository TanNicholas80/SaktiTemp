import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryPortofolio } from "./category-portofolio";

export const categoryPortofolioTranslations = pgTable(
  "category_portofolio_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryPortofolioId: uuid("category_portofolio_id")
      .references(() => categoryPortofolio.categoryPortofolioId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    categoryPortofolioName: varchar("category_portofolio_name").notNull(),
    categoryPortofolioDescription: text(
      "category_portofolio_description"
    )
      .notNull()
      .default(""),
  },
  (table) => [
    uniqueIndex("category_portofolio_tr_unique").on(
      table.categoryPortofolioId,
      table.locale
    ),
    index("category_portofolio_tr_locale_idx").on(table.locale),
  ]
);
