import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { portofolioType } from "./portofolio-type";

export const portofolioTypeTranslations = pgTable(
  "portofolio_type_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portofolioTypeId: uuid("portofolio_type_id")
      .references(() => portofolioType.portofolioTypeId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    portofolioTypeName: varchar("portofolio_type_name", {
      length: 100,
    }).notNull(),
  },
  (table) => [
    uniqueIndex("portofolio_type_tr_unique").on(
      table.portofolioTypeId,
      table.locale
    ),
    index("portofolio_type_tr_locale_idx").on(table.locale),
  ]
);
