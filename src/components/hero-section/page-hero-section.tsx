"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import type { HeroBreadcrumbItem, HeroSectionOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type PageHeroSectionProps = {
  hero: HeroSectionOutput;
  /** Konten opsional di bawah deskripsi (mis. CTA kalkulator) — dianimasikan bersama hero */
  afterDescription?: React.ReactNode;
};

export function PageHeroSection({ hero, afterDescription }: PageHeroSectionProps) {
  const t = useTranslations("hero");
  const sectionRef = React.useRef<HTMLElement>(null);
  const breadcrumbRef = React.useRef<HTMLElement>(null);
  const preHeadingRef = React.useRef<HTMLParagraphElement>(null);
  const mainHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const subHeadingRef = React.useRef<HTMLParagraphElement>(null);
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollText = hero.scrollIndicatorText ?? t("scroll");
  const rawBreadcrumbs = hero.breadcrumbItems;
  const breadcrumbItems: HeroBreadcrumbItem[] = Array.isArray(rawBreadcrumbs)
    ? (rawBreadcrumbs as HeroBreadcrumbItem[])
    : [];
  const isCalculatorHero =
    hero.pageKey === "calculator";

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
      const baseDel = breadcrumbItems.length > 0 ? 0.25 : 0.2;
      const targets = [
        ...(breadcrumbItems.length > 0
          ? [{ ref: breadcrumbRef, y: 16, delay: 0 }]
          : []),
        { ref: preHeadingRef, y: 20, delay: breadcrumbItems.length > 0 ? 0.05 : 0 },
        { ref: mainHeadingRef, y: 28, delay: breadcrumbItems.length > 0 ? 0.13 : 0.08 },
        { ref: subHeadingRef, y: 24, delay: breadcrumbItems.length > 0 ? 0.19 : 0.14 },
        { ref: descRef, y: 20, delay: breadcrumbItems.length > 0 ? 0.25 : 0.2 },
        ...(afterDescription
          ? [{ ref: ctaRef, y: 20, delay: baseDel + 0.08 }]
          : []),
      ] as { ref: React.RefObject<HTMLElement | null>; y: number; delay: number }[];
      targets.forEach(({ ref, y, delay }) => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(
          el,
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
  }, [hero.scrollIndicatorVisible, afterDescription, breadcrumbItems.length]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full overflow-hidden",
        "aspect-[16/9] min-h-[260px]",
        "sm:aspect-[21/9] sm:min-h-[300px]",
        "lg:aspect-[24/9]",
        "md:min-h-[340px]",
        "lg:min-h-[380px]",
        "xl:min-h-[420px]",
        "min-[1920px]:min-h-[500px]",
        "min-[2560px]:min-h-[560px]",
        afterDescription &&
          "max-[475px]:aspect-[4/3] max-[475px]:min-h-[250px] max-[360px]:aspect-[5/4] max-[360px]:min-h-[320px]"
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
      <div className="absolute inset-0 flex flex-col justify-between p-4 max-[475px]:pb-4 max-[360px]:p-3 max-[360px]:pb-3 sm:p-5 sm:pb-6 md:p-8 lg:p-10 xl:p-12 min-[1920px]:p-14 min-[2560px]:p-16">
        <div
          className={cn(
            "flex flex-col gap-2 max-[475px]:gap-1.5 max-[360px]:gap-1 sm:gap-3 md:gap-4",
            "max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[55%] min-[1920px]:max-w-[50%]",
            isCalculatorHero &&
              "sm:max-w-[88%] md:max-w-[74%] lg:max-w-[62%] xl:max-w-[56%]"
          )}
        >
          {breadcrumbItems.length > 0 && (
            <nav
              ref={breadcrumbRef}
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-[11px] text-white/90 max-[360px]:hidden sm:text-xs md:text-sm"
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
              className="text-[11px] font-medium uppercase tracking-[0.16em] text-accent sm:text-xs md:text-sm"
            >
              {hero.preHeading}
            </p>
          )}

          <h1
            ref={mainHeadingRef}
            className={cn(
              "text-xl font-bold uppercase tracking-tight text-white leading-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl min-[1920px]:text-7xl min-[2560px]:text-8xl",
              isCalculatorHero &&
                "text-lg max-[360px]:text-base max-[360px]:leading-snug sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl min-[1920px]:text-6xl min-[2560px]:text-7xl"
            )}
          >
            {hero.mainHeading}
          </h1>

          <p
            ref={subHeadingRef}
            className={cn(
              "text-sm font-medium text-accent sm:text-base md:text-lg lg:text-xl xl:text-2xl min-[1920px]:text-[2rem] transition-colors duration-200 hover:text-accent/90 [&>em]:italic",
              isCalculatorHero &&
                "text-[13px] max-[360px]:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl min-[1920px]:text-[1.75rem]"
            )}
          >
            {renderSubHeading(hero.subHeading)}
          </p>

          <p
            ref={descRef}
            className={cn(
              "text-[11px] leading-relaxed text-white/95 sm:text-xs md:text-sm lg:text-base xl:text-lg max-w-lg sm:max-w-xl md:max-w-2xl",
              isCalculatorHero &&
                "text-[10px] max-[360px]:text-[9px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base max-w-md sm:max-w-lg md:max-w-xl line-clamp-2 sm:line-clamp-none"
            )}
          >
            {hero.description}
          </p>

          {afterDescription ? (
            <div
              ref={ctaRef}
              className="flex flex-col gap-1.5 pt-0.5 max-[475px]:gap-1.5 max-[360px]:gap-1 max-[360px]:pt-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:pt-1"
            >
              {afterDescription}
            </div>
          ) : null}
        </div>

        {/* Scroll indicator */}
        {hero.scrollIndicatorVisible && (
          <div
            ref={scrollRef}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 transition-opacity duration-200 hover:opacity-90 max-[360px]:hidden sm:bottom-6 md:bottom-8"
            aria-hidden
          >
            <span className="h-6 w-px bg-white/70 sm:h-7" aria-hidden />
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/90 sm:text-[10px] md:text-xs">
              {scrollText}
            </span>
            <ChevronDown
              data-scroll-arrow
              className="size-3.5 text-white/80 sm:size-4"
              aria-hidden
            />
          </div>
        )}
      </div>
    </section>
  );
}
