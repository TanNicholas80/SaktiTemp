import { pgTable, timestamp, varchar, text, integer, boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const carousel = pgTable("carousel", {
    carouselId: uuid("carousel_id").primaryKey().defaultRandom(),
    carouselHeading: varchar("carousel_heading").notNull(),
    carouselSubheading: varchar("carousel_subheading").notNull(),
    carouselDescription: text("carousel_description").notNull(),
    carouselImageUrl: varchar("carousel_image_url").notNull(),
    carouselImagePublicId: varchar("carousel_image_public_id").notNull(),
    carouselOrder: integer("carousel_order").notNull(),
    carouselIsPublished: boolean("carousel_is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})