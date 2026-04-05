"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import {
  Check,
  MapPin,
  Calculator,
  Shield,
  Ruler,
  Layers,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { ProductDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

export type ProductDetailSectionProps = {
  product: ProductDetailData;
};

function useProductView(productSlug: string) {
  React.useEffect(() => {
    if (!productSlug) return;
    import("@/lib/utils/view-intent").then(({ consumeViewIntent }) => {
      if (!consumeViewIntent("product", productSlug)) return;
      fetch(`/api/product/${productSlug}/view`, { method: "POST" }).catch(() => {});
    });
  }, [productSlug]);
}

export function ProductDetailSection({ product }: ProductDetailSectionProps) {
  const t = useTranslations("nav");
  const sectionRef = React.useRef<HTMLElement>(null);
  const breadcrumbRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const excellencesRef = React.useRef<HTMLDivElement>(null);
  const descRef = React.useRef<HTMLDivElement>(null);
  const thicknessRef = React.useRef<HTMLDivElement>(null);
  const appRef = React.useRef<HTMLDivElement>(null);
  const portofolioRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useProductView(product.productSlug);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const sequence = [
        { el: breadcrumbRef.current, y: 12, d: 0.5, delay: 0 },
        { el: titleRef.current, y: 20, d: 0.6, delay: 0.05 },
        { el: imageRef.current, y: 28, d: 0.7, delay: 0.1 },
        { el: excellencesRef.current, y: 24, d: 0.65, delay: 0.12 },
        { el: descRef.current, y: 24, d: 0.65, delay: 0.14 },
        { el: thicknessRef.current, y: 20, d: 0.6, delay: 0.16 },
        { el: appRef.current, y: 20, d: 0.6, delay: 0.18 },
        { el: portofolioRef.current, y: 24, d: 0.65, delay: 0.2 },
        { el: ctaRef.current, y: 18, d: 0.55, delay: 0.22 },
      ] as const;

      sequence.forEach(({ el, y, d, delay }) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: d,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      });

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            delay: 0.25 + i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const categoryName = product.category?.name ?? null;
  const thicknesses = product.thicknesses ?? [];
  const excellences = product.excellences ?? [];
  const portofolioTypes = product.portofolioTypes ?? [];
  const portofolios = product.portofolios ?? [];
  const displayPortofolios = portofolios.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-8 sm:py-10 md:py-12 lg:py-16"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Breadcrumb */}
        <nav
          ref={breadcrumbRef}
          aria-label="Breadcrumb"
          className="mb-4 sm:mb-6"
        >
          <Breadcrumb>
            <BreadcrumbList className="flex-wrap gap-1 text-sm text-muted-foreground sm:gap-2">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    {t("home")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/product"
                    className="transition-colors hover:text-foreground"
                  >
                    {t("products")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-accent">
                  {product.productName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        {/* Product Title */}
        <h1
          ref={titleRef}
          className="mb-8 text-2xl font-bold text-foreground sm:mb-10 sm:text-3xl md:text-4xl lg:mb-12"
        >
          {product.productName}
        </h1>

        {/* Two columns: stack on mobile/tablet, side-by-side on lg+ */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Kolom Kiri: Gambar + Keunggulan */}
          <div className="space-y-6 lg:col-span-3">
            <div
              ref={imageRef}
              className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-sm"
            >
              <Image
                src={product.productImageUrl}
                alt={product.productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                priority
              />
              {categoryName && (
                <Badge
                  className="absolute left-4 top-4 border-0 bg-primary text-primary-foreground"
                  aria-hidden
                >
                  {categoryName}
                </Badge>
              )}
            </div>

            {excellences.length > 0 && (
              <div
                ref={excellencesRef}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground text-lg">
                  <Shield className="size-5 shrink-0 text-primary" />
                  Keunggulan Produk
                </h3>
                <ul className="space-y-3">
                  {excellences.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                        <Check
                          className="size-4 text-primary"
                          strokeWidth={2.5}
                        />
                      </span>
                      <span className="text-muted-foreground">
                        {e.productExellenceDescription}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Deskripsi, Ketebalan, Aplikasi, Proyek, CTA */}
          <div className="space-y-6 lg:col-span-2">
            <div ref={descRef}>
              <h2 className="mb-3 font-bold text-foreground text-xl">
                Deskripsi Produk
              </h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground [&_h1]:text-2xl [&_h2]:text-xl [&_ul]:list-disc [&_ol]:list-decimal"
                dangerouslySetInnerHTML={{ __html: product.productDescription }}
              />
            </div>

            {/* Ketebalan & Aplikasi: sesuai product-detail-content */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {thicknesses.length > 0 && (
                <section
                  ref={thicknessRef}
                  className="rounded-xl bg-muted/60 p-5"
                >
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
                    <Ruler className="size-5 shrink-0 text-primary" />
                    Ketebalan Tersedia
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {thicknesses.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                      >
                        {t.productThicknessValue} {t.productThicknessUnit}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {portofolioTypes.length > 0 && (
                <section
                  ref={appRef}
                  className="rounded-xl bg-muted/60 p-5"
                >
                  <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
                    <Layers className="size-5 shrink-0 text-primary" />
                    Aplikasi Penggunaan
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {portofolioTypes.map((t) => (
                      <span
                        key={t.portofolioTypeId}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
                      >
                        {t.portofolioTypeName}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {displayPortofolios.length > 0 && (
              <div ref={portofolioRef}>
                <h2 className="mb-4 font-bold text-xl">
                  Contoh Proyek Menggunakan Produk Ini
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayPortofolios.map((p, i) => (
                    <div
                      key={p.portofolioId}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                    >
                      <Link
                        href={`/portofolio/${p.portofolioSlug}`}
                        className="group block overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                          {p.portofolioImageUrl ? (
                            <Image
                              src={p.portofolioImageUrl}
                              alt={p.portofolioName}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                              —
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 flex min-h-[45%] flex-col justify-end bg-gradient-to-t from-primary/95 via-primary/50 to-transparent px-4 pb-4 pt-8">
                            <h3 className="font-bold text-white text-lg">
                              {p.portofolioName}
                            </h3>
                            {p.portofolioLocation && (
                              <p className="mt-1 flex items-center gap-1.5 text-white/95 text-sm">
                                <MapPin className="size-4 shrink-0" />
                                {p.portofolioLocation}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              ref={ctaRef}
              className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap"
            >
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-xl bg-accent px-6 py-6 font-bold text-primary-foreground shadow-md transition-colors hover:bg-accent/90"
              >
                <a
                  href={WHATSAPP_ME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-5" />
                  Konsultasi Proyek
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 rounded-xl border-2 border-primary bg-white px-6 py-6 font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Link href="/calculator">
                  <Calculator className="size-5" />
                  Hitung Estimasi Harga
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
