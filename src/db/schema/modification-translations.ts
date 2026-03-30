import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { modification } from "./modification";

export const modificationTranslations = pgTable(
  "modification_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    modificationId: uuid("modification_id")
      .references(() => modification.modificationId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    name: varchar("name", { length: 150 }).notNull(),
  },
  (table) => [
    uniqueIndex("modification_tr_unique").on(
      table.modificationId,
      table.locale
    ),
    index("modification_tr_locale_idx").on(table.locale),
  ]
);
