import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

/**
 * Hero section per halaman (contact, products, home, dll).
 * breadcrumbItems: [{ label: "Home", href: "/" }, { label: "Products", href: "/products" }]
 */
export const heroSection = pgTable("hero_section", {
  heroSectionId: uuid("hero_section_id").primaryKey().defaultRandom(),
  pageKey: varchar("page_key", { length: 50 }).notNull().unique(), // contact, products, home, dll
  preHeading: varchar("pre_heading", { length: 100 }), // CONTACT US (opsional)
  mainHeading: varchar("main_heading", { length: 200 }).notNull(), // Hubungi Kami, Kaca Tempered Berkualitas
  subHeading: varchar("sub_heading", { length: 200 }).notNull(), // Untuk Pertanyaan Dan Dukungan (italic)
  description: text("description").notNull(),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }).notNull(),
  backgroundImagePublicId: varchar("background_image_public_id", { length: 255 }),
  breadcrumbItems: jsonb("breadcrumb_items"), // [{ label: string, href: string }]
  scrollIndicatorText: varchar("scroll_indicator_text", { length: 50 }).default("SCROLL"),
  scrollIndicatorVisible: boolean("scroll_indicator_visible").notNull().default(true),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
