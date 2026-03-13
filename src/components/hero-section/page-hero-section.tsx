"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { HeroSectionOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type PageHeroSectionProps = {
  hero: HeroSectionOutput;
};

export function PageHeroSection({ hero }: PageHeroSectionProps) {
  const t = useTranslations("hero");
  const sectionRef = React.useRef<HTMLElement>(null);
  const breadcrumbRef = React.useRef<HTMLElement>(null);
  const preHeadingRef = React.useRef<HTMLParagraphElement>(null);
  const mainHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const subHeadingRef = React.useRef<HTMLParagraphElement>(null);
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollText = hero.scrollIndicatorText ?? t("scroll");
  const breadcrumbItems = hero.breadcrumbItems ?? [];

  // Parse *teks* menjadi <em>teks</em> untuk subHeading (contoh: "Presisi *Dan* Kualitas")
  const renderSubHeading = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        part
      )
    );
  };

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [
        ...(breadcrumbItems.length > 0
          ? [{ ref: breadcrumbRef, y: 16, delay: 0 }]
          : []),
        { ref: preHeadingRef, y: 20, delay: breadcrumbItems.length > 0 ? 0.05 : 0 },
        { ref: mainHeadingRef, y: 28, delay: breadcrumbItems.length > 0 ? 0.13 : 0.08 },
        { ref: subHeadingRef, y: 24, delay: breadcrumbItems.length > 0 ? 0.19 : 0.14 },
        { ref: descRef, y: 20, delay: breadcrumbItems.length > 0 ? 0.25 : 0.2 },
      ] as { ref: React.RefObject<HTMLElement | null>; y: number; delay: number }[];
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
            }
          );
        }
      });

      if (scrollRef.current && hero.scrollIndicatorVisible) {
        gsap.fromTo(
          scrollRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          }
        );
        // Infinite subtle bounce animation for scroll indicator
        const arrow = scrollRef.current.querySelector("[data-scroll-arrow]");
        if (arrow) {
          gsap.to(arrow, {
            y: 4,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: 1,
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hero.scrollIndicatorVisible]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden",
        "aspect-[4/3] min-h-[380px]",
        "sm:aspect-[16/9] sm:min-h-[420px]",
        "md:min-h-[480px]",
        "lg:min-h-[520px]",
        "xl:min-h-[560px]",
        "min-[1920px]:min-h-[620px]",
        "min-[2560px]:min-h-[680px]"
      )}
    >
      {/* Background image or gradient fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-[1.02]"
        style={
          hero.backgroundImageUrl
            ? { backgroundImage: `url(${hero.backgroundImageUrl})` }
            : {
                background:
                  "linear-gradient(135deg, rgba(114,29,29,0.9) 0%, rgba(90,20,20,0.95) 100%)",
              }
        }
        aria-hidden
      />

      {/* Overlay - gradient untuk company (darker kiri), solid untuk lainnya */}
      <div
        className="absolute inset-0"
        style={
          hero.pageKey === "company"
            ? {
                background:
                  "linear-gradient(to right, rgba(74, 23, 15, 0.88) 0%, rgba(114, 29, 29, 0.65) 40%, rgba(114, 29, 29, 0.5) 100%)",
              }
            : { backgroundColor: "rgba(114, 29, 29, 0.72)" }
        }
        aria-hidden
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 min-[1920px]:p-16 min-[2560px]:p-20">
        <div
          className={cn(
            "flex flex-col gap-3 sm:gap-4 md:gap-5",
            "max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[55%] min-[1920px]:max-w-[50%]"
          )}
        >
          {breadcrumbItems.length > 0 && (
            <nav
              ref={breadcrumbRef}
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-sm text-white/90"
            >
              {breadcrumbItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <ChevronRight
                      className="size-3.5 shrink-0 text-white/70"
                      aria-hidden
                    />
                  )}
                  {i < breadcrumbItems.length - 1 ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-accent font-medium">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {hero.preHeading && (
            <p
              ref={preHeadingRef}
              className="text-xs font-medium uppercase tracking-[0.2em] text-accent sm:text-sm"
            >
              {hero.preHeading}
            </p>
          )}

          <h1
            ref={mainHeadingRef}
            className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl min-[1920px]:text-7xl min-[2560px]:text-8xl leading-tight"
          >
            {hero.mainHeading}
          </h1>

          <p
            ref={subHeadingRef}
            className="text-lg font-medium text-accent sm:text-xl md:text-2xl lg:text-3xl xl:text-[2rem] min-[1920px]:text-[2.5rem] transition-colors duration-200 hover:text-accent/90 [&>em]:italic"
          >
            {renderSubHeading(hero.subHeading)}
          </p>

          <p
            ref={descRef}
            className="text-sm leading-relaxed text-white/95 sm:text-base md:text-lg lg:text-xl max-w-xl sm:max-w-2xl md:max-w-3xl"
          >
            {hero.description}
          </p>
        </div>

        {/* Scroll indicator */}
        {hero.scrollIndicatorVisible && (
          <div
            ref={scrollRef}
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-200 hover:opacity-90 sm:bottom-8 md:bottom-10"
            aria-hidden
          >
            <span className="h-8 w-px bg-white/70" aria-hidden />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/90 sm:text-xs">
              {scrollText}
            </span>
            <ChevronDown
              data-scroll-arrow
              className="size-4 text-white/80"
              aria-hidden
            />
          </div>
        )}
      </div>
    </section>
  );
}
