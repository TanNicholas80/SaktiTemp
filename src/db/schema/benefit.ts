import { pgTable, timestamp, varchar, text, boolean } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const benefit = pgTable("benefit", {
    benefitId: uuid("benefit_id").primaryKey().defaultRandom(),
    benefitName: varchar("benefit_name").notNull(),
    benefitDescription: text("benefit_description").notNull(),
    benefitIcon: varchar("benefit_icon").notNull(),
    benefitIsPublished: boolean("benefit_is_published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})