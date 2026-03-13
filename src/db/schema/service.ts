import { pgTable, timestamp, varchar, text, boolean, jsonb} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const service = pgTable("service", {
    serviceId: uuid("service_id").primaryKey().defaultRandom(),
    serviceName: varchar("service_name").notNull(),
    serviceDescription: text("service_description").notNull(),
    serviceIcon: varchar("service_icon").notNull(),
    serviceIsPublished: boolean("service_is_published").notNull().default(false),
    servicePoints: jsonb("service_points").notNull(),
    serviceBtnText: varchar("service_btn_text").notNull(),
    serviceBtnLink: varchar("service_btn_link").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})