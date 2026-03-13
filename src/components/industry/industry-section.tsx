"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  Building2,
  Factory,
  FolderOpen,
  Home,
  Landmark,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { CategoryPortofolioOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

const INDUSTRY_ICON_MAP: Record<string, LucideIcon> = {
  FolderOpen,
  Briefcase,
  Building2,
  Home,
  Landmark,
  Factory,
};

function getIndustryIcon(iconName: string): LucideIcon {
  return INDUSTRY_ICON_MAP[iconName] ?? Building2;
}

type IndustrySectionProps = {
  industries: CategoryPortofolioOutput[];
};

export function IndustrySection({ industries }: IndustrySectionProps) {
  const t = useTranslations("industrySection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const headerTargets = headerRef.current?.querySelectorAll(
        "[data-animate-industry]"
      );
      if (headerTargets?.length) {
        gsap.fromTo(
          headerTargets,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
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
              delay: 0.15 + i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [industries.length]);

  if (industries.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="max-w-3xl text-left"
        >
          <Badge
            data-animate-industry
            variant="secondary"
            className="mb-4 border-accent/30 bg-accent/15 px-3 py-1 text-sm font-medium uppercase tracking-wider text-accent"
          >
            {t("badge")}
          </Badge>
          <h2
            data-animate-industry
            className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </h2>
        </div>

        {/* Industry Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
          {industries.map((industry, index) => {
            const Icon = getIndustryIcon(industry.categoryPortofolioIcon);
            const hasImage = !!industry.categoryPortofolioImage?.trim();
            const imageUrl = industry.categoryPortofolioImage?.trim() || "/logo_saktitemp.png";

            return (
              <div
                key={industry.categoryPortofolioId}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <Card
                  className={cn(
                    "group overflow-hidden rounded-2xl border-0 bg-transparent shadow-none",
                    "transition-all duration-500 ease-out",
                    "hover:-translate-y-2 hover:shadow-black/30"
                  )}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary sm:aspect-square">
                    {hasImage ? (
                      <Image
                        src={imageUrl}
                        alt={industry.categoryPortofolioName}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary/70">
                        <Icon className="size-24 text-primary-foreground/30" strokeWidth={1} aria-hidden />
                      </div>
                    )}
                    {/* Reddish-brown semi-transparent overlay - full card */}
                    <div
                      className="absolute inset-0 bg-primary/60"
                      aria-hidden
                    />
                    {/* Content: icon, title, subtitle - stacked left-aligned at bottom */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 sm:p-6">
                      {/* Icon - rounded square outline, transparent fill */}
                      <div
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-lg",
                          "border-2 border-accent bg-transparent",
                          "transition-transform duration-300 group-hover:scale-105"
                        )}
                      >
                        <Icon
                          className="size-6 text-accent"
                          strokeWidth={2}
                          fill="none"
                          aria-hidden
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {industry.categoryPortofolioName}
                      </h3>
                      {industry.categoryPortofolioDescription && (
                        <p className="text-sm font-normal text-white/95 sm:text-base">
                          {industry.categoryPortofolioDescription}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
