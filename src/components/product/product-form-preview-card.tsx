"use client";

import { UploadImage } from "@/lib/upload-image";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const MAX_THICKNESS_BADGES = 5;
const MAX_EXCELLENCE_SHOW = 2;

type ProductFormPreviewCardProps = {
  productName: string;
  shortDescription: string;
  imageUrl: string | null;
  categoryName: string | null;
  thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  excellences: { productExellenceDescription: string }[];
  productSlug?: string;
};


export function ProductFormPreviewCard({
  productName,
  shortDescription,
  imageUrl,
  categoryName,
  thicknesses,
  excellences,
  productSlug,
}: ProductFormPreviewCardProps) {
  const validThicknesses = thicknesses.filter(
    (t) => t.productThicknessValue > 0 && t.productThicknessUnit.trim()
  );
  const validExcellences = excellences.filter((e) =>
    e.productExellenceDescription.trim()
  );

  const thicknessesToShow = validThicknesses.slice(0, MAX_THICKNESS_BADGES);
  const remainingThickness = validThicknesses.length - MAX_THICKNESS_BADGES;
  const excellencesToShow = validExcellences.slice(0, MAX_EXCELLENCE_SHOW);

  const displayDescription = shortDescription.trim()
    ? shortDescription.length > 120
      ? shortDescription.slice(0, 120).trim() + "..."
      : shortDescription
    : "Deskripsi singkat produk akan tampil di sini";

  const detailLink = productSlug ? `/admin/product/${productSlug}` : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <UploadImage
            src={imageUrl}
            alt={productName || "Preview produk"}
            fill
            className="object-cover"
            sizes="400px"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8">
              <span className="text-sm">Gambar Produk</span>
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
          {productName || "Nama Produk"}
        </h3>

        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {displayDescription}
        </p>

        {excellencesToShow.length > 0 && (
          <ul className="space-y-1">
            {excellencesToShow.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-muted-foreground text-sm"
              >
                <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                <span className="line-clamp-1">{e.productExellenceDescription}</span>
              </li>
            ))}
          </ul>
        )}

        {validThicknesses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {thicknessesToShow.map((t, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="rounded-md border border-border bg-background text-xs font-normal"
              >
                {t.productThicknessValue} {t.productThicknessUnit}
              </Badge>
            ))}
            {remainingThickness > 0 && (
              <span className="text-muted-foreground text-xs">
                +{remainingThickness} Lainnya
              </span>
            )}
          </div>
        )}

        <div className="mt-2 border-t border-border pt-3">
          {detailLink ? (
            <Link
              href={detailLink}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat Detail Produk
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Lihat Detail Produk
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
