import {
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const certification = pgTable("certification", {
  certificationId: uuid("certification_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  displayOrder: integer("display_order").notNull().default(1),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("certification_display_order_idx").on(table.displayOrder),
]);
