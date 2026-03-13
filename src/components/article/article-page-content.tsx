"use client";

import * as React from "react";

import { ArticleHeroWithFilter } from "./article-hero-with-filter";
import { ArticleListSection } from "./article-list-section";
import type { ArticleCardData } from "./article-card";
import type { ArticleFeaturedCardData } from "./article-featured-card";
import type { CategoryOption } from "./article-hero-with-filter";
import type { HeroSectionOutput } from "@/lib/translate";

export type ArticlePageContentProps = {
  hero: HeroSectionOutput;
  categories: CategoryOption[];
  blogs: ArticleCardData[];
  featuredBlog: ArticleFeaturedCardData | null;
  locale: string;
};

export function ArticlePageContent({
  hero,
  categories,
  blogs,
  featuredBlog,
  locale,
}: ArticlePageContentProps) {
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("all");

  return (
    <>
      <ArticleHeroWithFilter
        hero={hero}
        categories={categories}
        search={search}
        categoryId={categoryId}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
      />
      <ArticleListSection
        blogs={blogs}
        featuredBlog={featuredBlog}
        locale={locale}
        search={search}
        categoryId={categoryId}
      />
    </>
  );
}
