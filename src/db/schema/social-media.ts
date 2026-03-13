import {
  pgTable,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const socialMedia = pgTable("social_media", {
  socialMediaId: uuid("social_media_id").primaryKey().defaultRandom(),
  platformName: varchar("platform_name", { length: 50 }).notNull(), // Facebook, Instagram, TikTok, dll
  profileUrl: varchar("profile_url", { length: 500 }).notNull(),
  iconName: varchar("icon_name", { length: 50 }).notNull(), // Nama ikon dari library (lucide, dll)
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
