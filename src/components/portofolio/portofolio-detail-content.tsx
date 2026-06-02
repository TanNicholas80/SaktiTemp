"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { ArrowRightIcon, Box, ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const galleryRef = React.useRef<HTMLElement>(null);
  const appsRef = React.useRef<HTMLElement>(null);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const galleryImages = portofolio.portofolioGalleryImages ?? [];

  function openLightboxAt(index: number) {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  }

  function showPrevImage() {
    setActiveImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }

  React.useEffect(() => {
    if (variant !== "landing") return;
    const ctx = gsap.context(() => {
      [galleryRef, appsRef].forEach((ref, i) => {
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

  React.useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, galleryImages.length]);

  return (
    <div ref={containerRef} className="space-y-8">
      {galleryImages.length > 0 && (
        <section ref={galleryRef}>
          <h2 className="mb-3 text-xl font-bold">Galeri Proyek</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Klik gambar untuk memperbesar dan lihat detail proyek.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, idx) => (
              <button
                key={`${img.publicId}-${idx}`}
                type="button"
                onClick={() => openLightboxAt(idx)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted text-left"
              >
                <Image
                  src={img.url}
                  alt={`${portofolio.portofolioName} - Galeri ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </button>
            ))}
          </div>
        </section>
      )}

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

      {lightboxOpen && galleryImages[activeImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
          <button
            type="button"
            aria-label="Tutup galeri"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          {galleryImages.length > 1 && (
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={showPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          <div className="relative h-[78vh] w-full max-w-6xl overflow-hidden rounded-xl">
            <Image
              src={galleryImages[activeImageIndex].url}
              alt={`${portofolio.portofolioName} - Galeri ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {galleryImages.length > 1 && (
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={showNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
