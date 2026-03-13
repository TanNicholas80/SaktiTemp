"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type PortofolioFormPreviewCardProps = {
  portofolioName: string;
  shortDescription: string;
  imageUrl: string | null;
  categoryName: string | null;
  portofolioLocation: string;
  portofolioSlug?: string;
};

export function PortofolioFormPreviewCard({
  portofolioName,
  shortDescription,
  imageUrl,
  categoryName,
  portofolioLocation,
  portofolioSlug,
}: PortofolioFormPreviewCardProps) {
  const displayDescription = shortDescription.trim()
    ? shortDescription.length > 120
      ? shortDescription.slice(0, 120).trim() + "..."
      : shortDescription
    : "Deskripsi singkat proyek akan tampil di sini";

  const detailLink = portofolioSlug
    ? `/admin/portofolio/${portofolioSlug}`
    : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={portofolioName || "Preview portofolio"}
            fill
            className="object-cover"
            sizes="400px"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8">
              <span className="text-sm">Gambar Portofolio</span>
            </div>
            <p className="text-xs">Unggah gambar di form</p>
          </div>
        )}
        {categoryName && (
          <Badge
            variant="primary"
            className="absolute left-3 top-3 border-0 bg-primary"
          >
            {categoryName}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-semibold leading-tight">
          {portofolioName || "Nama Proyek"}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="size-4 shrink-0" />
          <span>{portofolioLocation || "Lokasi"}</span>
        </div>

        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {displayDescription}
        </p>

        <div className="mt-2 border-t border-border pt-3">
          {detailLink ? (
            <Link
              href={detailLink}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat Detail
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Lihat Detail
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
