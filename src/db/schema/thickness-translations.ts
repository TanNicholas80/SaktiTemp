import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { thickness } from "./thickness";

export const thicknessTranslations = pgTable(
  "thickness_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    thicknessId: uuid("thickness_id")
      .references(() => thickness.thicknessId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    thicknessUnit: varchar("thickness_unit", { length: 20 }).notNull(),
  },
  (table) => [
    uniqueIndex("thickness_tr_unique").on(table.thicknessId, table.locale),
    index("thickness_tr_locale_idx").on(table.locale),
  ]
);
