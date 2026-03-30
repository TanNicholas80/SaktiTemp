import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { benefit } from "./benefit";

export const benefitTranslations = pgTable(
  "benefit_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    benefitId: uuid("benefit_id")
      .references(() => benefit.benefitId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    benefitName: varchar("benefit_name").notNull(),
    benefitDescription: text("benefit_description").notNull(),
  },
  (table) => [
    uniqueIndex("benefit_tr_unique").on(table.benefitId, table.locale),
    index("benefit_tr_locale_idx").on(table.locale),
  ]
);
