"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  MessageCircle,
  Package,
  Ruler,
  Scissors,
  ShieldCheck,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ServiceOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Scissors,
};

function getServiceIcon(iconName: string): LucideIcon {
  return SERVICE_ICON_MAP[iconName] ?? Package;
}

type ServiceSectionProps = {
  services: ServiceOutput[];
  /** Sembunyikan CTA banner (untuk halaman product) */
  hideCtaBanner?: boolean;
  /** Variant background: default (putih) | gray-white (abu-abu & putih) */
  variant?: "default" | "gray-white";
};

export function ServiceSection({
  services,
  hideCtaBanner = false,
  variant = "default",
}: ServiceSectionProps) {
  const t = useTranslations("serviceSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const published = React.useMemo(
    () => services.filter((s) => s.serviceIsPublished !== false),
    [services]
  );

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      if (ctaRef.current && !hideCtaBanner) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hideCtaBanner]);

  if (published.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full py-16 sm:py-20 lg:py-24",
        variant === "gray-white"
          ? "bg-muted"
          : "bg-background"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="mb-10 flex flex-col items-center gap-3 text-center sm:mb-14"
        >
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            {t("badge")}
          </Badge>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]">
            {t("title")}
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Service Cards Grid */}
        <div
          ref={gridRef}
          className={cn(
            "grid gap-6 sm:gap-8",
            published.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : published.length === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {published.map((service, i) => {
            const Icon = getServiceIcon(service.serviceIcon);
            return (
              <div
                key={service.serviceId}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <ServiceCard service={service} Icon={Icon} />
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        {!hideCtaBanner && (
        <div ref={ctaRef} className="mt-10 sm:mt-14">
          <Card className="overflow-hidden border-0 bg-primary shadow-xl">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center sm:py-14 lg:gap-5">
              <h3 className="text-2xl font-bold text-primary-foreground sm:text-3xl lg:text-4xl">
                {t("ctaTitle")}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                {t("ctaDesc")}
              </p>
              <Button
                asChild
                size="lg"
                className="mt-2 gap-2 bg-accent px-8 font-bold text-white hover:bg-accent/90"
              >
                <Link href="/#kontak">
                  <MessageCircle className="size-5" />
                  {t("ctaBtn")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        )}
      </div>
    </section>
  );
}

/* ─── Service Card ─── */
type ServiceCardProps = {
  service: ServiceOutput;
  Icon: LucideIcon;
};

function ServiceCard({ service, Icon }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60",
        "shadow-sm transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
        {/* Icon */}
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors duration-300 group-hover:bg-primary/10">
          <Icon
            className="size-7 text-muted-foreground transition-colors duration-300 group-hover:text-primary"
            strokeWidth={1.5}
          />
        </div>

        {/* Name & Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            {service.serviceName}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.serviceDescription}
          </p>
        </div>

        {/* Points */}
        {service.servicePoints && service.servicePoints.length > 0 && (
          <ul className="flex flex-col gap-2.5">
            {service.servicePoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle
                  className="mt-0.5 size-4 shrink-0 fill-accent/15 text-accent"
                  strokeWidth={2}
                />
                <span className="text-sm leading-relaxed text-foreground sm:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Button */}
        {service.serviceBtnLink && service.serviceBtnText && (
          <Button
            asChild
            className="mt-2 w-full gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href={service.serviceBtnLink}>
              {service.serviceBtnText}
              <span aria-hidden>→</span>
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
