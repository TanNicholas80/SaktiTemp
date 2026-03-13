"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { ChevronRightIcon, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { PortofolioOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type PortofolioSectionProps = {
  portofolios: PortofolioOutput[];
  categories: { name: string; slug: string }[];
};

export function PortofolioSection({
  portofolios,
  categories,
}: PortofolioSectionProps) {
  const t = useTranslations("portofolioSection");
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const filtersRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<HTMLElement[]>([]);
  const buttonRef = React.useRef<HTMLAnchorElement>(null);

  const filtered = React.useMemo(() => {
    if (activeFilter === "all") return portofolios;
    return portofolios.filter((p) => p.categorySlug === activeFilter);
  }, [portofolios, activeFilter]);

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
      if (filtersRef.current) {
        gsap.fromTo(
          filtersRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.12,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: filtersRef.current,
              start: "top 90%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              delay: 0.18 + i * 0.08,
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
      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.35,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: buttonRef.current,
              start: "top 92%",
              end: "top 55%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [portofolios.length, categories.length]);

  if (portofolios.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-muted/40 py-16 sm:py-20 md:py-24 lg:py-28"
    >
      {/* Header - Maroon band */}
      <div className="bg-primary px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 border-accent/30 bg-accent/15 px-3 py-1 text-sm font-medium text-accent"
          >
            {t("badge")}
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm text-white/90 sm:text-base md:mt-4">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div
          ref={filtersRef}
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          <Button
            variant={activeFilter === "all" ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={cn(
              activeFilter === "all"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {t("all")}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={activeFilter === cat.slug ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFilter(cat.slug)}
              className={cn(
                activeFilter === cat.slug
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Portfolio grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filtered.map((item, index) => (
            <article
              key={item.portofolioId}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
            >
              <Link
                href={`/portofolio/${item.portofolioSlug}`}
                className="block h-full"
              >
                <div
                  className={cn(
                    "group relative aspect-[4/3] overflow-hidden rounded-2xl transition-all duration-500 ease-out",
                    "hover:-translate-y-1.5 hover:shadow-xl"
                  )}
                >
                  <Image
                    src={item.portofolioImageUrl}
                    alt={item.portofolioName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Default: bottom gradient + category + name */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 sm:p-5">
                    {item.categoryName && (
                      <Badge
                        variant="default"
                        className="mb-2 border-0 bg-primary/95 text-white"
                      >
                        {item.categoryName}
                      </Badge>
                    )}
                    <h3 className="text-lg font-bold text-white sm:text-xl">
                      {item.portofolioName}
                    </h3>
                  </div>
                  {/* Hover overlay: maroon + full content */}
                  <div
                    className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 transition-opacity duration-300",
                      "bg-primary/90 opacity-0 group-hover:opacity-100 sm:gap-4"
                    )}
                  >
                    {item.categoryName && (
                      <Badge
                        variant="secondary"
                        className="border-0 bg-accent text-white"
                      >
                        {item.categoryName}
                      </Badge>
                    )}
                    <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
                      {item.portofolioName}
                    </h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="size-4 shrink-0" />
                      <span>{item.portofolioLocation}</span>
                    </div>
                    <p className="line-clamp-2 text-center text-sm text-white/85">
                      {item.portofolioShortDescription}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-flex items-center gap-1 rounded-lg border-2 border-primary bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors duration-300",
                        "group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                      )}
                    >
                      {t("viewDetail")}
                      <ChevronRightIcon className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All button */}
        <div className="mt-10 flex justify-center sm:mt-12">
          <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            <Link ref={buttonRef} href="/portofolio">
              {t("viewAll")}
              <ChevronRightIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
