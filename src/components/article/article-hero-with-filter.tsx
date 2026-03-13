"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeroSection } from "@/components/hero-section";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HeroSectionOutput } from "@/lib/translate";

export type CategoryOption = {
  categoryBlogId: string;
  categoryBlogName: string;
  categoryBlogSlug: string;
};

type ArticleHeroWithFilterProps = {
  hero: HeroSectionOutput;
  categories: CategoryOption[];
  search: string;
  categoryId: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
};

export function ArticleHeroWithFilter({
  hero,
  categories,
  search,
  categoryId,
  onSearchChange,
  onCategoryChange,
}: ArticleHeroWithFilterProps) {
  const t = useTranslations("articleSection");

  return (
    <div className="w-full">
      <PageHeroSection hero={hero} />
      <section
        className="w-full bg-white py-4 sm:py-6 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
        aria-label={t("filterLabel")}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="relative w-full min-w-0 shrink-0 sm:max-w-md lg:max-w-lg">
              <Search
                className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                type="search"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-muted pl-11 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 lg:h-14"
                aria-label={t("searchPlaceholder")}
              />
            </div>
            <Select value={categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger
                className="h-12 min-h-12 w-full rounded-xl border-0 bg-muted text-base text-foreground shadow-none hover:bg-muted/80 focus:ring-2 focus:ring-primary/20 [&>svg]:size-4 sm:w-[200px]"
                aria-label={t("filterCategory")}
              >
                <SelectValue placeholder={t("filterAll")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.categoryBlogId} value={c.categoryBlogId}>
                    {c.categoryBlogName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}
