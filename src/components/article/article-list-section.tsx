"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { ArticleCard } from "./article-card";
import { ArticleFeaturedCard } from "./article-featured-card";
import type { ArticleCardData } from "./article-card";
import type {
  ArticleFeaturedCardData,
} from "./article-featured-card";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type ArticleListSectionProps = {
  blogs: ArticleCardData[];
  featuredBlog: ArticleFeaturedCardData | null;
  locale: string;
  search: string;
  categoryId: string;
};

export function ArticleListSection({
  blogs,
  featuredBlog,
  locale,
  search,
  categoryId,
}: ArticleListSectionProps) {
  const t = useTranslations("articleSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const featuredRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const filteredBlogs = React.useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return blogs.filter((blog) => {
      const matchesSearch =
        !searchLower ||
        blog.blogTitle.toLowerCase().includes(searchLower) ||
        (blog.blogExcerpt && blog.blogExcerpt.toLowerCase().includes(searchLower));
      return matchesSearch;
    });
  }, [blogs, search]);

  const filteredByCategory = React.useMemo(() => {
    if (categoryId === "all") return filteredBlogs;
    return filteredBlogs.filter((b) => b.categoryBlogId === categoryId);
  }, [filteredBlogs, categoryId]);

  const displayBlogs = filteredByCategory;
  const displayFeatured: ArticleFeaturedCardData | null =
    featuredBlog &&
    (categoryId === "all" || featuredBlog.categoryBlogId === categoryId) &&
    (!search.trim() ||
      featuredBlog.blogTitle.toLowerCase().includes(search.trim().toLowerCase()) ||
      featuredBlog.blogExcerpt.toLowerCase().includes(search.trim().toLowerCase()))
      ? featuredBlog
      : null;

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll("[data-article-card]");
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: i * 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [displayBlogs, displayFeatured]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-8 sm:py-10 lg:py-12"
      aria-label={t("filterLabel")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {displayBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-foreground">
              {t("noArticles")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("noArticlesDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-8 lg:space-y-10">
            {displayFeatured && (
              <div ref={featuredRef}>
                <ArticleFeaturedCard
                  blog={displayFeatured}
                  locale={locale}
                  readMoreText={t("readMore")}
                />
              </div>
            )}
            <div
              ref={gridRef}
              className={cn(
                "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
                displayFeatured && "lg:gap-8"
              )}
            >
              {(displayFeatured
                ? displayBlogs.filter((b) => b.blogId !== displayFeatured.blogId)
                : displayBlogs
              ).map((blog) => (
                <div key={blog.blogId} data-article-card>
                  <ArticleCard
                    blog={blog}
                    locale={locale}
                    readMoreText={t("readMore")}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
