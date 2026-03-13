"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleIcon,
  CalculatorIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CarouselSlidePreviewProps = {
  heading: string;
  subheading: string;
  description: string;
  imageUrl: string | null;
  slideIndex?: number;
  totalSlides?: number;
  /** Nomor urutan yang ditampilkan (1-based). Jika ada, dipakai langsung dari input user. */
  displayOrder?: number;
  variant?: "full" | "compact";
};

export function CarouselSlidePreview({
  heading,
  subheading,
  description,
  imageUrl,
  slideIndex = 0,
  totalSlides = 1,
  displayOrder,
  variant = "full",
}: CarouselSlidePreviewProps) {
  const isCompact = variant === "compact";
  const currentNum =
    displayOrder !== undefined
      ? Math.max(1, displayOrder)
      : slideIndex + 1;
  const slideNum = String(currentNum).padStart(2, "0");

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${
        isCompact ? "aspect-video min-h-[120px]" : "aspect-video min-h-[280px]"
      }`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes={isCompact ? "200px" : "800px"}
        />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}

      {/* Overlay gelap (ungu-cokelat) untuk keterbacaan teks */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(114, 29, 29, 0.85)" }}
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        {/* Konten utama kiri */}
        <div className="flex max-w-[55%] flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-accent sm:text-4xl">
              {slideNum}
            </span>
            <span className="h-px w-6 shrink-0 bg-white/50" aria-hidden />
            <span className="text-base font-light text-white/70">
              /{slideNum}
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl md:text-3xl">
              {heading || "Heading"}
            </h2>
            <p className="font-medium italic text-accent sm:text-xl md:text-2xl">
              {subheading || "Subheading"}
            </p>
          </div>

          <p className="line-clamp-2 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base">
            {description || "Deskripsi slide"}
          </p>

          {!isCompact && (
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                size="lg"
                className="rounded-lg border-0 bg-accent px-5 py-2.5 text-primary-foreground shadow-md hover:bg-accent/90"
              >
                <MessageCircleIcon className="mr-1.5 size-4" strokeWidth={1.5} />
                Konsultasi Proyek
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-white/90 shadow-sm backdrop-blur-md hover:bg-white/20 hover:text-white"
              >
                <CalculatorIcon className="mr-1.5 size-4" />
                Hitung Kebutuhan Kaca
              </Button>
            </div>
          )}
        </div>

        {/* Footer: Progress kiri | SCROLL tengah | Navigasi kanan */}
        <div className="flex items-end justify-between gap-4">
          {/* Indikator progress vertikal kiri */}
          <div className="flex h-14 w-px flex-col justify-end overflow-hidden rounded-full bg-white/40">
            <div
              className="w-full min-h-[4px] bg-accent transition-all"
              style={{
                height: `${Math.max(8, (currentNum / Math.max(totalSlides, currentNum)) * 100)}%`,
              }}
            />
          </div>

          {/* Teks SCROLL tengah */}
          {!isCompact && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
              <span className="h-px w-6 bg-white/60" aria-hidden />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
                Scroll
              </span>
            </div>
          )}

          {/* Tombol navigasi kanan */}
          {!isCompact && totalSlides > 1 && (
            <div className="relative z-10 ml-auto flex gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                className="size-9 rounded-md border-white/80 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="size-9 rounded-md border-white/80 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
