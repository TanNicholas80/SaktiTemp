import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { glassPrices } from "./glass_prices";

export const glassPricesTranslations = pgTable(
  "glass_prices_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    glassPricesId: uuid("glass_prices_id")
      .references(() => glassPrices.glassPricesId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    variant: varchar("variant", { length: 100 }).notNull(),
  },
  (table) => [
    uniqueIndex("glass_prices_tr_unique").on(
      table.glassPricesId,
      table.locale
    ),
    index("glass_prices_tr_locale_idx").on(table.locale),
  ]
);
