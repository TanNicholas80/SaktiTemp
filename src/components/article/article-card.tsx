"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ArticleCardData = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
  categoryBlogId: string | null;
  categoryName: string | null;
};

type ArticleCardProps = {
  blog: ArticleCardData;
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

export function ArticleCard({
  blog,
  locale,
  readMoreText,
  className,
}: ArticleCardProps) {
  return (
    <Link
      href={`/article/${blog.blogSlug}`}
      className={cn(
        "group block transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <Card
        className={cn(
          "h-full overflow-hidden border-0 shadow-sm transition-all duration-300 group-hover:shadow-md",
          "bg-white group-hover:bg-primary"
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={blog.blogImageUrl}
            alt={blog.blogTitle}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {blog.categoryName && (
            <Badge
              variant="primary"
              className="absolute left-3 top-3 border-0 shadow-sm"
            >
              {blog.categoryName}
            </Badge>
          )}
        </div>
        <CardHeader
          className={cn(
            "gap-1 pb-2 transition-colors duration-300",
            "group-hover:text-primary-foreground"
          )}
        >
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
          <CardTitle
            className={cn(
              "line-clamp-2 text-base font-semibold leading-tight transition-colors duration-300",
              "text-foreground group-hover:text-primary-foreground"
            )}
          >
            {blog.blogTitle}
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            "pb-2 pt-0 transition-colors duration-300",
            "group-hover:text-primary-foreground"
          )}
        >
          <CardDescription
            className={cn(
              "line-clamp-2 text-sm transition-colors duration-300",
              "text-muted-foreground group-hover:text-primary-foreground/90"
            )}
          >
            {blog.blogExcerpt}
          </CardDescription>
        </CardContent>
        <CardFooter
          className={cn(
            "pt-0 transition-colors duration-300",
            "group-hover:text-primary-foreground"
          )}
        >
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium transition-colors duration-300",
              "text-primary group-hover:text-primary-foreground"
            )}
          >
            {readMoreText}
            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
