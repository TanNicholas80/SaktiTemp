import { pgTable, varchar, text, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { blog } from "./blog";

export const blogTranslations = pgTable(
  "blog_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    blogId: uuid("blog_id")
      .references(() => blog.blogId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    blogTitle: varchar("blog_title").notNull(),
    blogExcerpt: varchar("blog_excerpt", { length: 500 }).notNull().default(""),
    blogContent: text("blog_content").notNull(),
  },
  (table) => [
    uniqueIndex("blog_tr_unique").on(table.blogId, table.locale),
    index("blog_tr_locale_idx").on(table.locale),
  ]
);
