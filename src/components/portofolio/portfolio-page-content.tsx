"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

import { PortfolioPageCard, type PortfolioPageCardData } from "./portfolio-page-card";

gsap.registerPlugin(ScrollTrigger);

type CategoryFilter = {
  categoryPortofolioId: string;
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
};

type PortfolioPageContentProps = {
  portofolios: PortfolioPageCardData[];
  categories: CategoryFilter[];
  viewDetailText: string;
  allText: string;
  noProjectsText: string;
  noProjectsDescription?: string;
  noFilterMatchText?: string;
  noFilterMatchDescription?: string;
};

export function PortfolioPageContent({
  portofolios,
  categories,
  viewDetailText,
  allText,
  noProjectsText,
  noProjectsDescription,
  noFilterMatchText,
  noFilterMatchDescription,
}: PortfolioPageContentProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const sectionRef = React.useRef<HTMLElement>(null);
  const filtersRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  const filtered = React.useMemo(() => {
    if (activeFilter === "all") return portofolios;
    return portofolios.filter((p) => p.categorySlug === activeFilter);
  }, [portofolios, activeFilter]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (filtersRef.current) {
        gsap.fromTo(
          filtersRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
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
              delay: 0.1 + (i % 10) * 0.08,
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 45%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filtered.length]);

  if (portofolios.length === 0) {
    return (
      <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Empty className="border-primary/20 bg-muted/30 py-12 md:py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>{noProjectsText}</EmptyTitle>
              {noProjectsDescription && (
                <EmptyDescription>{noProjectsDescription}</EmptyDescription>
              )}
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div
          ref={filtersRef}
          className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:mb-10"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={cn(
              "rounded-full border-2 transition-colors",
              activeFilter === "all"
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "border-muted-foreground/30 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {allText}
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.categoryPortofolioSlug}
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter(cat.categoryPortofolioSlug)}
              className={cn(
                "rounded-full border-2 transition-colors",
                activeFilter === cat.categoryPortofolioSlug
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "border-muted-foreground/30 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat.categoryPortofolioName}
            </Button>
          ))}
        </div>

        {/* Grid atau Empty state filter */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filtered.map((item, index) => (
              <div
                key={item.portofolioId}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <PortfolioPageCard item={item} viewDetailText={viewDetailText} />
              </div>
            ))}
          </div>
        ) : (
          <Empty className="border-primary/20 bg-muted/30 py-12 md:py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>{noFilterMatchText ?? noProjectsText}</EmptyTitle>
              {noFilterMatchDescription && (
                <EmptyDescription>{noFilterMatchDescription}</EmptyDescription>
              )}
            </EmptyHeader>
            <EmptyContent />
          </Empty>
        )}
      </div>
    </section>
  );
}
