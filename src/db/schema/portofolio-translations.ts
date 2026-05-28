import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { portofolio } from "./portofolio";

export const portofolioTranslations = pgTable(
  "portofolio_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portofolioId: uuid("portofolio_id")
      .references(() => portofolio.portofolioId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    portofolioName: varchar("portofolio_name").notNull(),
    portofolioShortDescription: varchar("portofolio_short_description", {
      length: 500,
    })
      .notNull()
      .default(""),
    portofolioAbout: text("portofolio_about").notNull(),
    portofolioLocation: varchar("portofolio_location").notNull(),
  },
  (table) => [
    uniqueIndex("portofolio_tr_unique").on(
      table.portofolioId,
      table.locale
    ),
    index("portofolio_tr_locale_idx").on(table.locale),
  ]
);
