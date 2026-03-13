import {
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const contactTypeEnum = pgEnum("contact_type", [
  "phone",
  "email",
  "address",
  "operational_hours",
]);

export const contact = pgTable("contact", {
  contactId: uuid("contact_id").primaryKey().defaultRandom(),
  contactType: contactTypeEnum("contact_type").notNull(),
  contactLabel: varchar("contact_label", { length: 100 }).notNull(), // Telepon, Email, Jam Operasional
  contactValue: text("contact_value").notNull(), // Nilai utama: nomor, email, atau baris pertama jam
  contactValueExtra: text("contact_value_extra"), // Baris kedua (mis. Sabtu: 08:00 - 14:00 WIB)
  contactIcon: varchar("contact_icon", { length: 50 }).notNull(), // phone, mail, clock, map-pin
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
