"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ArticleFeaturedCardData = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  categoryBlogId: string | null;
  categoryName: string | null;
};

type ArticleFeaturedCardProps = {
  blog: ArticleFeaturedCardData;
  locale: string;
  readMoreText: string;
  className?: string;
};

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "id" ? "id-ID" : locale === "zh" ? "zh-CN" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleFeaturedCard({
  blog,
  locale,
  readMoreText,
  className,
}: ArticleFeaturedCardProps) {
  return (
    <Link
      href={`/article/${blog.blogSlug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg lg:flex-row",
        className
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted lg:aspect-auto lg:w-[42%] lg:max-w-[420px]">
        <Image
          src={blog.blogImageUrl}
          alt={blog.blogTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 42vw"
        />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col justify-between p-6 transition-colors duration-300 sm:p-8",
          "bg-white text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <div className="space-y-4">
          {blog.categoryName && (
            <Badge
              variant="primary"
              className="w-fit border-0 shadow-sm"
            >
              {blog.categoryName}
            </Badge>
          )}
          <h2
            className={cn(
              "text-xl font-bold leading-tight transition-colors duration-300 sm:text-2xl lg:text-3xl",
              "text-foreground group-hover:text-primary-foreground"
            )}
          >
            {blog.blogTitle}
          </h2>
          <p
            className={cn(
              "line-clamp-3 text-sm transition-colors duration-300 sm:text-base",
              "text-muted-foreground group-hover:text-primary-foreground/90"
            )}
          >
            {blog.blogExcerpt}
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={cn(
              "flex items-center gap-2 text-sm transition-colors duration-300",
              "text-muted-foreground group-hover:text-primary-foreground/90"
            )}
          >
            <CalendarIcon className="size-4 shrink-0" aria-hidden />
            <time dateTime={blog.blogIsPublishedAt}>
              {formatDate(blog.blogIsPublishedAt, locale)}
            </time>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300",
              "text-primary group-hover:text-primary-foreground"
            )}
          >
            {readMoreText}
            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
