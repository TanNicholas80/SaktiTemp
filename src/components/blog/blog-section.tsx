"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale, useTranslations } from "next-intl";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { BlogOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type BlogSectionProps = {
  blogs: BlogOutput[];
};

function formatBlogDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogSection({ blogs }: BlogSectionProps) {
  const t = useTranslations("blogSection");
  const locale = useLocale();
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const cardRefs = React.useRef<HTMLElement[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              end: "top 45%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (linkRef.current) {
        gsap.fromTo(
          linkRef.current,
          { opacity: 0, x: 12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: linkRef.current,
              start: "top 88%",
              end: "top 45%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.2 + i * 0.12,
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                end: "top 50%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [blogs.length]);

  if (blogs.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-28"
    >
      {/* Header - Maroon band */}
      <div className="bg-primary px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div ref={headerRef} className="space-y-3">
            <Badge
              variant="secondary"
              className="border-accent/30 bg-accent/15 px-3 py-1 text-sm font-medium text-accent"
            >
              {t("badge")}
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              {t("title")}
            </h2>
          </div>
          <Link
            ref={linkRef}
            href="/article"
            className="inline-flex items-center gap-1 text-sm font-medium text-white transition-colors duration-300 hover:text-accent hover:underline hover:underline-offset-2 hover:decoration-accent sm:text-base"
          >
            {t("viewAll")}
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={blog.blogId}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
            >
              <Link href={`/article/${blog.blogSlug}`} className="block h-full">
                <Card
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-white p-0 transition-all duration-500 ease-out gap-4",
                    "hover:-translate-y-1.5 hover:shadow-xl",
                    "hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-t-2xl bg-muted">
                    <Image
                      src={blog.blogImageUrl}
                      alt={blog.blogTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {blog.categoryName && (
                      <Badge
                        variant="default"
                        className="absolute left-3 top-3 border-0 bg-primary/95 px-2.5 py-0.5 text-xs font-medium text-white"
                      >
                        {blog.categoryName}
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="gap-2 px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm transition-colors group-hover:text-white/80">
                      <CalendarIcon className="size-4 shrink-0" />
                      <time dateTime={blog.blogIsPublishedAt}>
                        {formatBlogDate(
                          blog.blogIsPublishedAt,
                          locale
                        )}
                      </time>
                    </div>
                    <CardTitle className="text-base font-bold leading-tight text-foreground transition-colors group-hover:text-white sm:text-lg">
                      {blog.blogTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 pb-3 sm:px-5">
                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-white/90">
                      {blog.blogExcerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 sm:px-5">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-amber-300">
                      {t("readMore")}
                      <ChevronRightIcon className="size-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
