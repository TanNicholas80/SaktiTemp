import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { glassTypes } from "./glass_types";

export const glassTypesTranslations = pgTable(
  "glass_types_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    glassTypeId: uuid("glass_type_id")
      .references(() => glassTypes.glassTypeId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    glassTypeName: varchar("glass_type_name").notNull(),
  },
  (table) => [
    uniqueIndex("glass_types_tr_unique").on(table.glassTypeId, table.locale),
    index("glass_types_tr_locale_idx").on(table.locale),
  ]
);
