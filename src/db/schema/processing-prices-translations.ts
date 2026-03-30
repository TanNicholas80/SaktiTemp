import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { processingPrices } from "./processing_prices";

export const processingPricesTranslations = pgTable(
  "processing_prices_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    processingPricesId: uuid("processing_prices_id")
      .references(() => processingPrices.processingPricesId, {
        onDelete: "cascade",
      })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    serviceName: varchar("service_name", { length: 200 }).notNull(),
  },
  (table) => [
    uniqueIndex("processing_prices_tr_unique").on(
      table.processingPricesId,
      table.locale
    ),
    index("processing_prices_tr_locale_idx").on(table.locale),
  ]
);
