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
        "aspect-[4/3] min-h-[380px]",
        "sm:aspect-[16/9] sm:min-h-[420px]",
        "md:min-h-[480px]",
        "lg:min-h-[520px]",
        "xl:min-h-[560px]",
        "min-[1920px]:min-h-[620px]",
        "min-[2560px]:min-h-[680px]",
        afterDescription &&
          "max-[475px]:aspect-[5/6] max-[475px]:min-h-[320px]"
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
      <div className="absolute inset-0 flex flex-col justify-between p-4 max-[475px]:pb-5 sm:p-6 sm:pb-8 md:p-10 lg:p-12 xl:p-14 min-[1920px]:p-16 min-[2560px]:p-20">
        <div
          className={cn(
            "flex flex-col gap-2.5 max-[475px]:gap-2 sm:gap-4 md:gap-5",
            "max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[55%] min-[1920px]:max-w-[50%]"
          )}
        >
          {breadcrumbItems.length > 0 && (
            <nav
              ref={breadcrumbRef}
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 text-xs text-white/90 sm:text-sm"
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
            className="text-2xl font-bold uppercase tracking-tight text-white leading-tight sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl min-[1920px]:text-7xl min-[2560px]:text-8xl"
          >
            {hero.mainHeading}
          </h1>

          <p
            ref={subHeadingRef}
            className="text-base font-medium text-accent sm:text-lg md:text-lg lg:text-xl xl:text-2xl min-[1920px]:text-[2rem] transition-colors duration-200 hover:text-accent/90 [&>em]:italic"
          >
            {renderSubHeading(hero.subHeading)}
          </p>

          <p
            ref={descRef}
            className="text-xs leading-relaxed text-white/95 sm:text-sm md:text-sm lg:text-base xl:text-lg max-w-xl sm:max-w-2xl md:max-w-3xl"
          >
            {hero.description}
          </p>

          {afterDescription ? (
            <div
              ref={ctaRef}
              className="flex flex-col gap-2 pt-0.5 max-[475px]:gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:pt-1"
            >
              {afterDescription}
            </div>
          ) : null}
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
