import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { certification } from "./certification";

export const certificationTranslations = pgTable(
  "certification_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    certificationId: uuid("certification_id")
      .references(() => certification.certificationId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (table) => [
    uniqueIndex("certification_tr_unique").on(
      table.certificationId,
      table.locale
    ),
    index("certification_tr_locale_idx").on(table.locale),
  ]
);
