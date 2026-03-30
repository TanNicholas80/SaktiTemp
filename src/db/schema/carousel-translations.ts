import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { carousel } from "./carousel";

export const carouselTranslations = pgTable(
  "carousel_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    carouselId: uuid("carousel_id")
      .references(() => carousel.carouselId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    carouselHeading: varchar("carousel_heading").notNull(),
    carouselSubheading: varchar("carousel_subheading").notNull(),
    carouselDescription: text("carousel_description").notNull(),
  },
  (table) => [
    uniqueIndex("carousel_tr_unique").on(table.carouselId, table.locale),
    index("carousel_tr_locale_idx").on(table.locale),
  ]
);
