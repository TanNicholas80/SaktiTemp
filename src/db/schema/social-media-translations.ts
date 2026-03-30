import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { socialMedia } from "./social-media";

export const socialMediaTranslations = pgTable(
  "social_media_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    socialMediaId: uuid("social_media_id")
      .references(() => socialMedia.socialMediaId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    platformName: varchar("platform_name", { length: 50 }).notNull(),
  },
  (table) => [
    uniqueIndex("social_media_tr_unique").on(
      table.socialMediaId,
      table.locale
    ),
    index("social_media_tr_locale_idx").on(table.locale),
  ]
);
