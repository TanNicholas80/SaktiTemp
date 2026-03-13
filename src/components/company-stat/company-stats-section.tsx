"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { AnimatedStatValue } from "@/components/shared/animated-stat-value";
import { cn } from "@/lib/utils";

import type { CompanyStatOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type CompanyStatsSectionProps = {
  stats: CompanyStatOutput[];
};

export function CompanyStatsSection({ stats }: CompanyStatsSectionProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      itemRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.1 + i * 0.1,
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
  }, [stats.length]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-4 md:gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.companyStatId}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn(
                "flex flex-col items-center justify-center text-center",
                "rounded-xl px-4 py-6 transition-all duration-300",
                "hover:scale-105 hover:bg-primary/90"
              )}
            >
              <AnimatedStatValue
                value={stat.value}
                delay={0.3 + index * 0.1}
                scrollStart="top 90%"
                scrollEnd="top 50%"
                className="text-3xl font-bold tracking-tight text-accent sm:text-4xl md:text-[2.5rem] lg:text-5xl"
              />
              <span className="mt-2 text-sm font-medium text-primary-foreground/95 sm:text-base">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
