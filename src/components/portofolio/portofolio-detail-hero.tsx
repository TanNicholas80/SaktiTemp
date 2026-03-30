"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { MapPin } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import type { PortofolioDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type PortofolioDetailHeroProps = {
  portofolio: PortofolioDetailData;
  /** "landing" = public page with i18n links, "admin" = admin page */
  variant?: "landing" | "admin";
};

function usePortofolioView(slug: string, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || !slug) return;
    import("@/lib/utils/view-intent").then(({ consumeViewIntent }) => {
      if (!consumeViewIntent("portofolio", slug)) return;
      fetch(`/api/portofolio/${slug}/view`, { method: "POST" }).catch(() => {});
    });
  }, [slug, enabled]);
}

export function PortofolioDetailHero({
  portofolio,
  variant = "admin",
}: PortofolioDetailHeroProps) {
  usePortofolioView(portofolio.portofolioSlug, variant === "landing");

  const homeHref = variant === "landing" ? "/" : "/admin";
  const portofolioHref =
    variant === "landing" ? "/portofolio" : "/admin/portofolio";

  const headerRef = React.useRef<HTMLElement>(null);
  const breadcrumbRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (variant !== "landing") return;
    const ctx = gsap.context(() => {
      const targets = [
        { ref: breadcrumbRef, y: 16, delay: 0 },
        { ref: titleRef, y: 24, delay: 0.08 },
      ] as const;
      targets.forEach(({ ref, y, delay }) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: "power3.out",
              overwrite: "auto",
            }
          );
        }
      });
    }, headerRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <header ref={headerRef} className="relative overflow-hidden">
      <div className="relative w-full min-h-[420px] bg-muted sm:min-h-[500px]">
        <Image
          src={portofolio.portofolioImageUrl}
          alt={portofolio.portofolioName}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 text-white sm:p-8 md:p-10">
          <div className="space-y-4">
            <div ref={breadcrumbRef}>
            <Breadcrumb>
              <BreadcrumbList className="gap-1.5 text-sm text-white/80 sm:gap-2">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={homeHref}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60">
                  &gt;
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={portofolioHref}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      Portfolio
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60">
                  &gt;
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-accent font-medium">
                    {portofolio.portofolioName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>

            <div ref={titleRef} className="space-y-2 pl-0.5">
              <h1
                ref={titleRef}
                className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
              >
                {portofolio.portofolioName}
              </h1>
              <div className="flex items-center gap-2 text-white/95 text-base sm:text-lg">
                <MapPin className="size-5 shrink-0" />
                <span>{portofolio.portofolioLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
