"use client";

import Image from "next/image";
import Link from "next/link";

type BreadcrumbItem = { label: string; href: string };

type HeroSectionPreviewProps = {
  preHeading?: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  imageUrl: string | null;
  breadcrumbItems?: BreadcrumbItem[] | null;
  scrollIndicatorText?: string | null;
  scrollIndicatorVisible?: boolean;
  variant?: "full" | "compact";
};

export function HeroSectionPreview({
  preHeading,
  mainHeading,
  subHeading,
  description,
  imageUrl,
  breadcrumbItems,
  scrollIndicatorText = "SCROLL",
  scrollIndicatorVisible = true,
  variant = "full",
}: HeroSectionPreviewProps) {
  const isCompact = variant === "compact";

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

      {/* Overlay gelap untuk keterbacaan teks */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(114, 29, 29, 0.75)" }}
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
        {/* Konten utama kiri */}
        <div className="flex max-w-[55%] flex-col gap-3 sm:gap-4">
          {breadcrumbItems && breadcrumbItems.length > 0 && !isCompact && (
            <nav className="text-sm" aria-label="Breadcrumb">
              {breadcrumbItems.map((item, i) => (
                <span key={i}>
                  {i > 0 && (
                    <span className="text-white/60 mx-1">/</span>
                  )}
                  {i === breadcrumbItems.length - 1 ? (
                    <span className="font-medium text-accent">
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-white/90 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}

          {preHeading && !isCompact && (
            <p className="text-xs font-medium uppercase tracking-widest text-white/90">
              {preHeading}
            </p>
          )}

          <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl md:text-3xl">
              {mainHeading || "Main Heading"}
            </h2>
            <p className="font-medium italic text-accent sm:text-xl md:text-2xl">
              {subHeading || "Sub-heading"}
            </p>
          </div>

          <p
            className={`max-w-sm text-sm leading-relaxed text-white/90 sm:text-base ${
              isCompact ? "line-clamp-1" : "line-clamp-2"
            }`}
          >
            {description || "Deskripsi hero section"}
          </p>
        </div>

        {/* Scroll indicator di tengah bawah */}
        {scrollIndicatorVisible && !isCompact && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
            <span className="h-px w-6 bg-white/60" aria-hidden />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
              {scrollIndicatorText || "SCROLL"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
