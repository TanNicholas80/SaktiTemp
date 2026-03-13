"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedStatValue } from "@/components/shared/animated-stat-value";
import { getBenefitIcon } from "@/components/shared/icon-preview-card";
import { cn } from "@/lib/utils";

import type { BenefitOutput, CompanyStatOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type BenefitSectionProps = {
  benefits: BenefitOutput[];
  stats: CompanyStatOutput[];
};

export function BenefitSection({ benefits, stats }: BenefitSectionProps) {
  const t = useTranslations("benefitSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<HTMLDivElement[]>([]);
  const statRefs = React.useRef<HTMLDivElement[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        { ref: badgeRef, y: 20, delay: 0 },
        { ref: titleRef, y: 28, delay: 0.06 },
        { ref: subtitleRef, y: 20, delay: 0.12 },
      ];
      targets.forEach(({ ref, y, delay }) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay,
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 88%",
                end: "top 45%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              delay: 0.18 + i * 0.1,
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

      statRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.35 + i * 0.08,
              ease: "power3.out",
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 55%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [benefits.length, stats.length]);

  if (benefits.length === 0 && stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div ref={badgeRef} className="mb-4">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              {t("badge")}
            </Badge>
          </div>
          <h2
            ref={titleRef}
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-[2.5rem]"
          >
            {t("title")}
          </h2>
          <p
            ref={subtitleRef}
            className="mt-4 text-base text-muted-foreground sm:text-lg md:mt-5"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Benefit Cards + Stats (stat di bawah tiap card, center) */}
        {benefits.length > 0 && (
          <div
            ref={cardsRef}
            className="mt-12 grid grid-cols-1 gap-8 sm:mt-14 sm:grid-cols-2 md:mt-16 lg:mt-20 lg:grid-cols-4 lg:gap-10"
          >
            {benefits.map((benefit, index) => {
              const Icon = getBenefitIcon(benefit.benefitIcon);
              const stat = stats[index];

              return (
                <div
                  key={benefit.benefitId}
                  className="flex min-h-0 flex-col items-center"
                >
                  <Card
                    ref={(el) => {
                      if (el) cardRefs.current[index] = el;
                    }}
                    className={cn(
                      "group flex h-full w-full flex-1 flex-col rounded-2xl transition-all duration-500 ease-out",
                      "hover:-translate-y-1.5 hover:shadow-xl",
                      "border-border/60 bg-white hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    )}
                  >
                    <CardHeader className="gap-4 pb-2">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-white/20 sm:size-14">
                        <Icon className="size-6 text-primary transition-colors duration-300 group-hover:text-white sm:size-7" />
                      </div>
                      <CardTitle className="text-base font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-white sm:text-lg">
                        {benefit.benefitName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col px-6 pb-6 pt-0">
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-white/90">
                        {benefit.benefitDescription}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Stat di bawah card, center */}
                  {stat && (
                    <div
                      ref={(el) => {
                        if (el) statRefs.current[index] = el;
                      }}
                      className="mt-6 flex flex-col items-center text-center"
                    >
                      <AnimatedStatValue
                        value={stat.value}
                        delay={0.35 + index * 0.08}
                        className="text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-[1.75rem] lg:text-4xl"
                      />
                      <span className="mt-1 text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats tambahan jika jumlah stat lebih banyak dari benefit */}
        {stats.length > benefits.length && benefits.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            {stats.slice(benefits.length).map((stat, index) => (
              <div
                key={stat.companyStatId}
                ref={(el) => {
                  if (el) statRefs.current[benefits.length + index] = el;
                }}
                className="flex flex-col items-center text-center"
              >
                <AnimatedStatValue
                  value={stat.value}
                  delay={0.35 + (benefits.length + index) * 0.08}
                  className="text-2xl font-bold tracking-tight text-primary sm:text-3xl"
                />
                <span className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
