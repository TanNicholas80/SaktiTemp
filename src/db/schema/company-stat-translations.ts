import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { companyStat } from "./company-stat";

export const companyStatTranslations = pgTable(
  "company_stat_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyStatId: uuid("company_stat_id")
      .references(() => companyStat.companyStatId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    label: varchar("label", { length: 100 }).notNull(),
  },
  (table) => [
    uniqueIndex("company_stat_tr_unique").on(
      table.companyStatId,
      table.locale
    ),
    index("company_stat_tr_locale_idx").on(table.locale),
  ]
);
