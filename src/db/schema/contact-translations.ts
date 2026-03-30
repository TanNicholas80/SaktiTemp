import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { contact } from "./contact";

export const contactTranslations = pgTable(
  "contact_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id")
      .references(() => contact.contactId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    contactLabel: varchar("contact_label", { length: 100 }).notNull(),
    contactValue: text("contact_value").notNull(),
    contactValueExtra: text("contact_value_extra"),
  },
  (table) => [
    uniqueIndex("contact_tr_unique").on(table.contactId, table.locale),
    index("contact_tr_locale_idx").on(table.locale),
  ]
);
