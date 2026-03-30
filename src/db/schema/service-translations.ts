import { pgTable, varchar, text, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { service } from "./service";

export const serviceTranslations = pgTable(
  "service_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .references(() => service.serviceId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    serviceName: varchar("service_name").notNull(),
    serviceDescription: text("service_description").notNull(),
    servicePoints: jsonb("service_points").notNull(),
    serviceBtnText: varchar("service_btn_text").notNull(),
  },
  (table) => [
    uniqueIndex("service_tr_unique").on(table.serviceId, table.locale),
    index("service_tr_locale_idx").on(table.locale),
  ]
);
