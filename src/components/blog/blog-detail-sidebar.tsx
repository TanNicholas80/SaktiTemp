"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { useLocale } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { Link as I18nLink } from "@/i18n/navigation";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export type BlogDetailSidebarArticle = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogImageUrl: string;
  blogIsPublishedAt: string;
};

type BlogDetailSidebarProps = {
  otherArticles: BlogDetailSidebarArticle[];
};

function formatDate(dateStr: string, locale: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(
    locale === "id" ? "id-ID" : locale === "zh" ? "zh-CN" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

export function BlogDetailSidebar({ otherArticles }: BlogDetailSidebarProps) {
  const locale = useLocale();
  const t = useTranslations("articleDetailSection");
  const asideRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (asideRef.current) {
        gsap.fromTo(
          asideRef.current,
          { opacity: 0, x: 24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: asideRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, asideRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside ref={asideRef} className="space-y-6">
      <div className="overflow-hidden rounded-xl bg-primary px-5 py-6 text-primary-foreground">
        <h2 className="mb-3 text-xl font-bold">{t("consultationTitle")}</h2>
        <p className="mb-5 text-sm text-primary-foreground/90">
          {t("consultationDesc")}
        </p>
        <Button
          className="w-full gap-2 rounded-xl bg-accent py-4 font-semibold text-accent-foreground hover:bg-accent/90"
          asChild
        >
          <a
            href={WHATSAPP_ME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-5" />
            {t("consultationCta")}
          </a>
        </Button>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">
          {t("otherArticles")}
        </h2>
        {otherArticles.length === 0 ? (
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("otherArticlesEmpty")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("otherArticlesEmptyDesc")}
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <I18nLink href="/article">{t("viewAllArticles")}</I18nLink>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {otherArticles.map((article) => (
              <li key={article.blogId}>
                <I18nLink
                  href={`/article/${article.blogSlug}`}
                  className={cn(
                    "group flex gap-3 overflow-hidden rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/30 hover:shadow-sm"
                  )}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={article.blogImageUrl}
                      alt={article.blogTitle}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">
                      {article.blogTitle}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-muted-foreground text-xs">
                      <CalendarIcon className="size-3.5 shrink-0" aria-hidden />
                      <time dateTime={article.blogIsPublishedAt}>
                        {formatDate(article.blogIsPublishedAt, locale)}
                      </time>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary group-hover:underline">
                      {t("readMore")}
                      <ChevronRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </I18nLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
