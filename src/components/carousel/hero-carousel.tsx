"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calculator } from "lucide-react";
import gsap from "gsap";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroCarouselSlide = {
  carouselId: string;
  carouselHeading: string;
  carouselSubheading: string;
  carouselDescription: string;
  carouselImageUrl: string;
  carouselOrder: number;
};

type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
};

const AUTOPLAY_DELAY = 5000;
const FADE_DURATION = 0.7;
const SWIPE_THRESHOLD = 50;

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const t = useTranslations("hero");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const slideRefs = React.useRef<HTMLDivElement[]>([]);
  const [current, setCurrent] = React.useState(0);
  const autoplayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimatingRef = React.useRef(false);
  const touchStartRef = React.useRef<number>(0);
  const touchCurrentRef = React.useRef<number>(0);

  const totalSlides = slides.length;

  const goTo = React.useCallback(
    (index: number, immediate = false) => {
      if (isAnimatingRef.current || totalSlides <= 0) return;
      const next = ((index % totalSlides) + totalSlides) % totalSlides;
      if (next === current && !immediate) return;

      isAnimatingRef.current = true;
      const prevIdx = current;
      const slidesEl = slideRefs.current;

      if (!slidesEl[prevIdx] || !slidesEl[next]) {
        isAnimatingRef.current = false;
        return;
      }

      const dur = immediate ? 0 : FADE_DURATION;
      const ease = "power2.inOut" as const;

      gsap.set(slidesEl[next], { zIndex: 2 });
      gsap.set(slidesEl[prevIdx], { zIndex: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrent(next);
          slidesEl.forEach((el, i) => {
            if (el) gsap.set(el, { zIndex: i === next ? 2 : 0 });
          });
          isAnimatingRef.current = false;
        },
      });

      tl.to(slidesEl[prevIdx], { opacity: 0, duration: dur, ease }, 0)
        .fromTo(slidesEl[next], { opacity: 0 }, { opacity: 1, duration: dur, ease }, 0);
    },
    [current, totalSlides]
  );

  const goToNext = React.useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const goToPrev = React.useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  const resetAutoplay = React.useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    if (totalSlides > 1) {
      autoplayTimerRef.current = setInterval(goToNext, AUTOPLAY_DELAY);
    }
  }, [goToNext, totalSlides]);

  React.useEffect(() => {
    if (totalSlides <= 0) return;
    slideRefs.current = slideRefs.current.slice(0, totalSlides);
    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === current ? 1 : 0, zIndex: i === current ? 2 : 0 });
    });
  }, [totalSlides, current]);

  React.useEffect(() => {
    if (totalSlides <= 1) return;
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [totalSlides, resetAutoplay]);

  const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
    touchStartRef.current = e.clientX;
    touchCurrentRef.current = e.clientX;
  }, []);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    touchCurrentRef.current = e.clientX;
  }, []);

  const handlePointerUp = React.useCallback(() => {
    const delta = touchStartRef.current - touchCurrentRef.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) goToNext();
      else goToPrev();
      resetAutoplay();
    }
  }, [goToNext, goToPrev, resetAutoplay]);

  const handlePaginationClick = React.useCallback(
    (idx: number) => {
      goTo(idx);
      resetAutoplay();
    },
    [goTo, resetAutoplay]
  );

  if (!slides.length) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        /* Tinggi responsif via aspect-ratio + min-height:
           mobile  : 4/3  ≈ tinggi cukup untuk konten
           sm      : 16/9
           md+     : 21/9 (sinematik) */
        "aspect-[4/3] min-h-[320px]",
        "sm:aspect-[16/9] sm:min-h-[420px]",
        "md:aspect-[21/9] md:min-h-[480px]",
        "xl:min-h-[560px]",
        "min-[1920px]:min-h-[640px]",
        "min-[2560px]:min-h-[720px]"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.carouselId}
          ref={(el) => {
            if (el) slideRefs.current[index] = el;
          }}
          className={cn(
            "absolute inset-0",
            index === current ? "z-[2] opacity-100" : "z-0 opacity-0"
          )}
          aria-hidden={index !== current}
        >
          {/* Gambar latar */}
          <Image
            src={slide.carouselImageUrl}
            alt={slide.carouselHeading}
            fill
            className="object-cover pointer-events-none"
            sizes="100vw"
            priority={index === 0}
            draggable={false}
          />

          {/* Overlay warna */}
          <div className="absolute inset-0 bg-primary/80" aria-hidden />

          {/* Konten slide */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 min-[1920px]:p-16">

            {/* ── Area teks & tombol CTA ── */}
            <div
              className={cn(
                "flex flex-col gap-2 sm:gap-3 md:gap-4 xl:gap-5 min-[1920px]:gap-6 min-[2560px]:gap-8",
                "w-full sm:max-w-[70%] md:max-w-[58%] lg:max-w-[52%] xl:max-w-[48%] min-[1920px]:max-w-[44%] min-[2560px]:max-w-[40%]"
              )}
            >
              {/* Nomor slide */}
              <div className="flex items-center gap-2 min-[2560px]:gap-3">
                <span className="font-bold text-accent text-2xl sm:text-3xl md:text-4xl xl:text-5xl min-[1920px]:text-6xl min-[2560px]:text-7xl min-[2560px]:leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-4 sm:w-6 xl:w-8 min-[2560px]:w-10 shrink-0 bg-white/50" aria-hidden />
                <span className="font-light text-white/70 text-xs sm:text-sm md:text-base xl:text-lg min-[1920px]:text-xl min-[2560px]:text-2xl">
                  /{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Heading & subheading */}
              <div className="space-y-0.5 sm:space-y-1 min-[2560px]:space-y-2">
                <h2 className="font-bold uppercase tracking-wide text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] min-[1920px]:text-[3.5rem] min-[2560px]:text-[4.5rem] leading-tight">
                  {slide.carouselHeading}
                </h2>
                <p className="font-medium italic text-accent text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl min-[1920px]:text-3xl min-[2560px]:text-4xl">
                  {slide.carouselSubheading}
                </p>
              </div>

              {/* Deskripsi — disembunyikan di layar sangat kecil */}
              <p className="hidden sm:block line-clamp-2 leading-relaxed text-white/90 text-xs sm:text-sm md:text-base xl:text-lg min-[1920px]:text-xl min-[2560px]:text-2xl max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl min-[1920px]:max-w-2xl min-[2560px]:max-w-3xl">
                {slide.carouselDescription}
              </p>

              {/* Tombol CTA */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-0.5 sm:pt-1 xl:pt-2 xl:gap-4 min-[2560px]:gap-6 min-[2560px]:pt-3">
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "gap-1.5 rounded-lg border-0 bg-accent text-primary-foreground shadow-md hover:bg-accent/90",
                    "sm:h-10 sm:px-4 sm:text-sm",
                    "md:h-11 md:px-5",
                    "xl:h-12 xl:px-8 xl:text-lg",
                    "min-[1920px]:h-14 min-[1920px]:px-10 min-[1920px]:text-xl",
                    "min-[2560px]:h-16 min-[2560px]:px-12 min-[2560px]:text-2xl"
                  )}
                >
                  <a
                    href={WHATSAPP_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-3.5 sm:size-4 xl:size-5 min-[1920px]:size-6 min-[2560px]:size-8" />
                    {t("consultation")}
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className={cn(
                    "gap-1.5 rounded-lg border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
                    "sm:h-10 sm:px-4 sm:text-sm",
                    "md:h-11 md:px-5",
                    "xl:h-12 xl:px-8 xl:text-lg",
                    "min-[1920px]:h-14 min-[1920px]:px-10 min-[1920px]:text-xl",
                    "min-[2560px]:h-16 min-[2560px]:px-12 min-[2560px]:text-2xl"
                  )}
                >
                  <Link href="/calculator">
                    <Calculator className="size-3.5 sm:size-4 xl:size-5 min-[1920px]:size-6 min-[2560px]:size-8" />
                    {t("calculateGlass")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── Bar bawah: paginasi · indikator scroll · tombol navigasi ── */}
            <div className="flex items-end justify-between gap-4">

              {/* Dot paginasi vertikal */}
              <div className="flex flex-col gap-1.5 sm:gap-2 xl:gap-2.5 min-[1920px]:gap-3 min-[2560px]:gap-4">
                {slides.map((_, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaginationClick(idx);
                    }}
                    className={cn(
                      "h-6 w-1 rounded-full p-0 hover:opacity-80 sm:h-8 md:h-10 md:w-1.5 xl:h-12 xl:w-2 min-[1920px]:h-14 min-[1920px]:w-2.5 min-[2560px]:h-20 min-[2560px]:w-3",
                      idx === current ? "bg-accent" : "bg-white/40"
                    )}
                    aria-label={`Slide ${idx + 1}`}
                    aria-current={idx === current ? "true" : undefined}
                  />
                ))}
              </div>

              {/* Indikator scroll — hanya tampil ab sm ke atas */}
              <div className="absolute bottom-3 left-1/2 hidden sm:flex -translate-x-1/2 flex-col items-center gap-1 sm:bottom-4 xl:bottom-6 min-[1920px]:bottom-8 min-[2560px]:bottom-10 min-[2560px]:gap-1.5">
                <span className="h-3 sm:h-4 xl:h-5 min-[1920px]:h-6 min-[2560px]:h-8 w-px bg-accent" aria-hidden />
                <span className="font-medium uppercase tracking-[0.2em] text-white/80 text-[9px] sm:text-[10px] xl:text-xs min-[1920px]:text-sm min-[2560px]:text-base">
                  {t("scroll")}
                </span>
              </div>

              {/* Tombol prev / next */}
              <div className="relative z-10 ml-auto flex gap-1 sm:gap-1.5 xl:gap-2 min-[1920px]:gap-3 min-[2560px]:gap-4">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    "rounded-md border-white/80 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                    "size-7 sm:size-8 md:size-9 xl:size-11 min-[1920px]:size-12 min-[2560px]:size-14",
                    "xl:rounded-lg min-[2560px]:rounded-xl"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                    resetAutoplay();
                  }}
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft className="size-4 sm:size-5 xl:size-6 min-[1920px]:size-7 min-[2560px]:size-8" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    "rounded-md border-white/80 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                    "size-7 sm:size-8 md:size-9 xl:size-11 min-[1920px]:size-12 min-[2560px]:size-14",
                    "xl:rounded-lg min-[2560px]:rounded-xl"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                    resetAutoplay();
                  }}
                  aria-label="Slide berikutnya"
                >
                  <ChevronRight className="size-4 sm:size-5 xl:size-6 min-[1920px]:size-7 min-[2560px]:size-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
