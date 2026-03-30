"use client";

import * as React from "react";
import gsap from "gsap";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnimatedErrorPageProps = {
  code: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onRetry?: () => void;
};

export function AnimatedErrorPage({
  code,
  title,
  description,
  primaryLabel = "Kembali ke Beranda",
  primaryHref = "/",
  secondaryLabel,
  secondaryHref,
  onRetry,
}: AnimatedErrorPageProps) {
  const params = useParams();
  const localeParam = typeof params?.locale === "string" ? params.locale : undefined;

  const withLocale = React.useCallback(
    (href: string) => {
      if (!localeParam || localeParam === "id") return href;
      if (!href.startsWith("/")) return href;
      if (href.startsWith(`/${localeParam}`)) return href;
      return `/${localeParam}${href}`;
    },
    [localeParam]
  );

  const sectionRef = React.useRef<HTMLElement>(null);
  const codeRef = React.useRef<HTMLDivElement>(null);
  const sheenRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const items = gsap.utils.toArray<HTMLElement>("[data-animate='in']");

      if (codeRef.current) {
        tl.fromTo(
          codeRef.current,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 }
        );
      }

      if (items.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.25"
        );
      }

      if (!prefersReduced && codeRef.current) {
        gsap.to(codeRef.current, {
          y: 10,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (!prefersReduced && sheenRef.current) {
        gsap.fromTo(
          sheenRef.current,
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 120,
            opacity: 1,
            duration: 1.35,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 1.9,
          }
        );
      }

      if (!prefersReduced && contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { filter: "blur(2px)" },
          { filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-background px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <div ref={codeRef} className="relative mx-auto inline-block">
          <div
            className={cn(
              "select-none text-[8rem] font-black leading-none tracking-tight sm:text-[10rem] md:text-[12rem]",
              "bg-gradient-to-b from-amber-400 via-orange-500 to-amber-700 bg-clip-text text-transparent"
            )}
            aria-hidden
          >
            {code}
          </div>
          <div
            ref={sheenRef}
            className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0"
            aria-hidden
            style={{ transform: "skewX(-12deg)" }}
          />
        </div>

        <div ref={contentRef} className="mx-auto mt-3 max-w-2xl">
          <h1
            data-animate="in"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </h1>
          <p
            data-animate="in"
            className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {description}
          </p>

          <div data-animate="in" className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-primary px-6 hover:bg-primary/90">
              <NextLink href={withLocale(primaryHref)}>
                <Home className="size-4" />
                {primaryLabel}
              </NextLink>
            </Button>

            {secondaryLabel && secondaryHref ? (
              <Button asChild variant="outline" size="lg" className="px-6">
                <NextLink href={withLocale(secondaryHref)}>
                  <ArrowLeft className="size-4" />
                  {secondaryLabel}
                </NextLink>
              </Button>
            ) : null}

            {onRetry ? (
              <Button type="button" variant="secondary" size="lg" onClick={onRetry}>
                <RefreshCw className="size-4" />
                Coba Lagi
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

