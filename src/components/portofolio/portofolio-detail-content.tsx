"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRightIcon, Box } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { PortofolioDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type PortofolioDetailContentProps = {
  portofolio: PortofolioDetailData;
  /** "landing" = product links to /product/[slug], "admin" = /admin/product/[slug] */
  variant?: "landing" | "admin";
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function PortofolioDetailContent({
  portofolio,
  variant = "admin",
}: PortofolioDetailContentProps) {
  const productHrefPrefix =
    variant === "landing" ? "/product" : "/admin/product";

  const containerRef = React.useRef<HTMLDivElement>(null);
  const aboutRef = React.useRef<HTMLElement>(null);
  const appsRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (variant !== "landing") return;
    const ctx = gsap.context(() => {
      [aboutRef, appsRef].forEach((ref, i) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay: 0.05 + i * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <div ref={containerRef} className="space-y-8">
      <section ref={aboutRef}>
        <h2 className="mb-3 font-bold text-xl">Tentang Proyek</h2>
        <div
          className="prose prose-sm dark:prose-invert max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-0.5"
          dangerouslySetInnerHTML={{ __html: portofolio.portofolioAbout }}
        />
      </section>

      {portofolio.productApplications.length > 0 && (
        <section ref={appsRef}>
          <h2 className="mb-3 font-bold text-xl">Aplikasi Kaca Yang Digunakan</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            Berikut adalah dokumentasi pengaplikasian kaca tempered SAKTITEMP
            pada berbagai area di {portofolio.portofolioName}.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portofolio.productApplications.map((pa) => (
              <article
                key={pa.productApplicationId}
                className="overflow-hidden rounded-xl bg-white"
              >
                <div className="relative aspect-video w-full bg-muted">
                  <Image
                    src={pa.productApplicationImageUrl}
                    alt={pa.productApplicationName}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex min-h-[45%] flex-col justify-end bg-gradient-to-t from-[#8B2F2F]/95 via-[#8B2F2F]/50 to-transparent px-4 pb-4 pt-8 rounded-xl">
                    <h3 className="font-bold text-white text-lg">
                      {pa.productApplicationName}
                    </h3>
                  </div>
                </div>
                <div className="py-4">
                  <p className="line-clamp-3 text-foreground text-sm">
                    {stripHtml(pa.productApplicationDescription)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-foreground text-sm">
                    <Box className="size-4 shrink-0 text-[#8B2F2F]" />
                    <span>{pa.product.productName}</span>
                  </div>
                  {pa.product.productSlug && (
                    <Link
                      href={`${productHrefPrefix}/${pa.product.productSlug}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Lihat Produk
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
