"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type BlogDetailHeroProps = {
  blog: BlogDetailData;
  variant?: "landing" | "admin";
};

function useBlogView(slug: string, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || !slug) return;
    fetch(`/api/article/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug, enabled]);
}

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(
    locale === "id" ? "id-ID" : locale === "zh" ? "zh-CN" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

export function BlogDetailHero({
  blog,
  variant = "admin",
}: BlogDetailHeroProps) {
  const locale = useLocale();
  const t = useTranslations("articleDetailSection");
  const headerRef = React.useRef<HTMLElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useBlogView(blog.blogSlug, variant === "landing");
  const articleHref = variant === "landing" ? "/article" : "/admin/blog";

  React.useEffect(() => {
    if (variant !== "landing") return;
    const ctx = gsap.context(() => {
      const targets = [
        { ref: backRef, y: 12, delay: 0 },
        { ref: contentRef, y: 20, delay: 0.1 },
      ] as const;
      targets.forEach(({ ref, y, delay }) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: "power3.out",
              overwrite: "auto",
            }
          );
        }
      });
    }, headerRef);
    return () => ctx.revert();
  }, [variant]);

  if (variant === "admin") {
    return (
      <header className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={blog.blogImageUrl}
            alt={blog.blogTitle}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            {blog.category && (
              <Badge variant="primary" className="mb-2 w-fit border-0">
                {blog.category.name}
              </Badge>
            )}
            <h1 className="text-2xl font-bold sm:text-3xl">{blog.blogTitle}</h1>
            <div className="mt-2 flex items-center gap-2 text-white/90 text-sm">
              <CalendarIcon className="size-4" />
              <time dateTime={blog.blogIsPublishedAt}>
                {new Date(blog.blogIsPublishedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header ref={headerRef} className="relative w-full overflow-hidden">
      <div className="relative w-full min-h-[420px] bg-muted sm:min-h-[500px]">
        <Image
          src={blog.blogImageUrl}
          alt={blog.blogTitle}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
          <div ref={backRef}>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2 rounded-lg bg-white/90 text-foreground hover:bg-white"
              asChild
            >
              <Link href={articleHref}>
                <ArrowLeft className="size-4" />
                {t("back")}
              </Link>
            </Button>
          </div>
          <div
            ref={contentRef}
            className="flex flex-col gap-3 text-white sm:gap-4"
          >
            {blog.category && (
              <Badge variant="primary" className="w-fit border-0 shadow-sm">
                {blog.category.name}
              </Badge>
            )}
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {blog.blogTitle}
            </h1>
            <div className="flex items-center gap-2 text-white/95 text-sm sm:text-base">
              <CalendarIcon className="size-5 shrink-0" aria-hidden />
              <time dateTime={blog.blogIsPublishedAt}>
                {formatDate(blog.blogIsPublishedAt, locale)}
              </time>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
