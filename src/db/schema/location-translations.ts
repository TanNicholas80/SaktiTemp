import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { location } from "./location";

export const locationTranslations = pgTable(
  "location_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    locationId: uuid("location_id")
      .references(() => location.locationId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    locationCity: varchar("location_city").notNull(),
    locationAddress: text("location_address").notNull(),
  },
  (table) => [
    uniqueIndex("location_tr_unique").on(table.locationId, table.locale),
    index("location_tr_locale_idx").on(table.locale),
  ]
);
