import { pgTable, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { categoryBlog } from "./category-blog";

export const categoryBlogTranslations = pgTable(
  "category_blog_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryBlogId: uuid("category_blog_id")
      .references(() => categoryBlog.categoryBlogId, { onDelete: "cascade" })
      .notNull(),
    locale: varchar("locale", { length: 10 }).notNull(),
    categoryBlogName: varchar("category_blog_name").notNull(),
  },
  (table) => [
    uniqueIndex("category_blog_tr_unique").on(
      table.categoryBlogId,
      table.locale
    ),
    index("category_blog_tr_locale_idx").on(table.locale),
  ]
);
