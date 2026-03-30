"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronRight, ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { markViewIntent } from "@/lib/utils/view-intent";

gsap.registerPlugin(ScrollTrigger);

export type SuggestionCardData = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioImageUrl: string;
  portofolioLocation: string;
  categoryName: string | null;
};

type PortofolioDetailSuggestionsProps = {
  suggestions: SuggestionCardData[];
  title: string;
  viewAllText: string;
  emptyTitle: string;
  emptyDescription?: string;
};

export function PortofolioDetailSuggestions({
  suggestions,
  title,
  viewAllText,
  emptyTitle,
  emptyDescription,
}: PortofolioDetailSuggestionsProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLAnchorElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
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
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.08 + i * 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
      if (buttonRef.current && suggestions.length > 0) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: buttonRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [suggestions.length]);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-muted/30 py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className="mb-8 text-center text-xl font-bold text-foreground sm:text-2xl md:mb-10"
        >
          {title}
        </h2>

        {suggestions.length > 0 ? (
          <>
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {suggestions.map((item, index) => (
                <article
                  key={item.portofolioId}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                >
                  <Link
                    href={`/portofolio/${item.portofolioSlug}`}
                    onClick={() => markViewIntent("portofolio", item.portofolioSlug)}
                    className="group block h-full"
                  >
                    <div
                      className={cn(
                        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
                        "transition-all duration-300 ease-out",
                        "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                      )}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        <Image
                          src={item.portofolioImageUrl}
                          alt={item.portofolioName}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {item.categoryName && (
                          <Badge
                            className="absolute left-3 top-3 border-0 bg-primary text-primary-foreground"
                            aria-hidden
                          >
                            {item.categoryName}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 p-4 sm:p-5">
                        <h3 className="font-bold text-lg text-foreground">
                          {item.portofolioName}
                        </h3>
                        {item.portofolioLocation && (
                          <p className="text-muted-foreground text-sm">
                            @ {item.portofolioLocation}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center sm:mt-12">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-xl bg-primary px-6 hover:bg-primary/90"
              >
                <Link ref={buttonRef} href="/portofolio">
                  {viewAllText}
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <Empty className="border-primary/20 bg-background py-12 md:py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon className="size-6" />
              </EmptyMedia>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              {emptyDescription && (
                <EmptyDescription>{emptyDescription}</EmptyDescription>
              )}
            </EmptyHeader>
            <EmptyContent>
              <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
                <Link href="/portofolio">{viewAllText}</Link>
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </section>
  );
}
