import { pgTable, timestamp, varchar, text, pgEnum, boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const locationType = pgEnum("location_type", ["branch", "head"]);

export const location = pgTable("location", {
    locationId: uuid("location_id").primaryKey().defaultRandom(),
    locationCity: varchar("location_city").notNull(),
    locationType: locationType("location_type").notNull(),
    locationAddress: text("location_address").notNull(),
    locationMapUrl: text("location_map_url").notNull(),
    locationIsPublished: boolean("location_is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})