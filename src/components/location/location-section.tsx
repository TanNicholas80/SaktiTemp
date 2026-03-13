"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { LocationOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type LocationSectionProps = {
  locations: LocationOutput[];
};

function getOfficeTypeLabel(type: "branch" | "head", t: (k: string) => string): string {
  return type === "head" ? t("headOffice") : t("branchOffice");
}

export function LocationSection({ locations }: LocationSectionProps) {
  const t = useTranslations("locationSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    if (locations.length === 0) return;
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              delay: i * 0.1,
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
  }, [locations.length]);

  if (locations.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {locations.map((loc, index) => {
            const officeLabel = getOfficeTypeLabel(loc.locationType, t);
            return (
              <article
                key={loc.locationId}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <iframe
                    src={loc.locationMapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${officeLabel} ${loc.locationCity}`}
                    className="absolute inset-0 h-full w-full grayscale transition-all duration-300 group-hover:grayscale-0"
                  />
                  <Badge
                    variant="primary"
                    className="absolute left-3 top-3 border-0"
                  >
                    {officeLabel}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col">
                  <CardContent className="flex flex-1 flex-col gap-2 bg-primary p-4 text-primary-foreground sm:p-5">
                    <div className="flex items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-accent" />
                      <span className="text-sm font-medium uppercase text-accent">
                        {officeLabel}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold uppercase">
                      {loc.locationCity}
                    </h3>
                    <p className="text-primary-foreground/90 line-clamp-3 text-sm">
                      {loc.locationAddress}
                    </p>
                    <Link
                      href={loc.locationMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "mt-2 inline-flex w-fit items-center gap-1 text-sm font-medium hover:underline text-[#f39c27]",
                        "transition-colors duration-200"
                      )}
                    >
                      {t("openGoogleMaps")}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  </CardContent>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
