"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { CertificationOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type CertificationSectionProps = {
  certifications: CertificationOutput[];
};

export function CertificationSection({ certifications }: CertificationSectionProps) {
  const t = useTranslations("certificationSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const badgeRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const nodes = headerRef.current.querySelectorAll("[data-animate-cert]");
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      badgeRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 36,
              scale: 0.92,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              delay: 0.15 + i * 0.12,
              ease: "back.out(1.15)",
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
  }, [certifications.length]);

  if (certifications.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <Badge
            data-animate-cert
            variant="secondary"
            className="border-accent/30 bg-accent/15 px-3 py-1 text-sm font-medium text-accent"
          >
            {t("badge")}
          </Badge>
          <h2
            data-animate-cert
            className="mt-3 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </h2>
          <p
            data-animate-cert
            className="mt-4 text-base leading-relaxed text-primary-foreground/95 sm:text-lg"
          >
            {t("description")}
          </p>
        </div>

        <div
          className={cn(
            "mt-12 flex flex-wrap items-center justify-center sm:mt-14 md:mt-16",
            "gap-x-10 gap-y-8 sm:gap-x-14 sm:gap-y-10 md:gap-x-16 lg:gap-x-20"
          )}
        >
          {certifications.map((cert, index) => (
            <div
              key={cert.certificationId}
              ref={(el) => {
                badgeRefs.current[index] = el;
              }}
              className={cn(
                "flex min-w-[7.5rem] items-center justify-center sm:min-w-[8.5rem] md:min-w-[9.5rem]",
                "transition-transform duration-300 ease-out",
                "hover:scale-105 hover:-translate-y-0.5"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cert.image}
                alt={cert.name}
                className="h-24 w-auto max-w-[9.5rem] object-contain sm:h-28 sm:max-w-[11rem] md:h-32 md:max-w-[12.5rem]"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
