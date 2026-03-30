import {
  pgTable,
  varchar,
  text,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { heroSection } from "./hero-section";

export const heroSectionTranslations = pgTable(
  "hero_section_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    heroSectionId: uuid("hero_section_id")
      .references(() => heroSection.heroSectionId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    preHeading: varchar("pre_heading", { length: 100 }),
    mainHeading: varchar("main_heading", { length: 200 }).notNull(),
    subHeading: varchar("sub_heading", { length: 200 }).notNull(),
    description: text("description").notNull(),
    scrollIndicatorText: varchar("scroll_indicator_text", { length: 50 }),
    breadcrumbItems: jsonb("breadcrumb_items"),
  },
  (table) => [
    uniqueIndex("hero_section_tr_unique").on(
      table.heroSectionId,
      table.locale
    ),
    index("hero_section_tr_locale_idx").on(table.locale),
  ]
);
