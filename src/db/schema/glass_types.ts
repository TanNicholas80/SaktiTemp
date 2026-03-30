import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const glassTypes = pgTable("glass_types", {
  glassTypeId: uuid("glass_type_id").primaryKey().defaultRandom(),
  glassTypeName: varchar("glass_type_name").notNull(),
  glassTypeImageUrl: varchar("glass_type_image_url").notNull(),
  glassTypeImagePublicId: varchar("glass_type_image_public_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
