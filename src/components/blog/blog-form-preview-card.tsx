"use client";

import { UploadImage } from "@/lib/upload-image";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type BlogFormPreviewCardProps = {
  blogTitle: string;
  excerpt: string;
  imageUrl: string | null;
  categoryName: string | null;
  publishedAt: string | null;
  blogSlug?: string;
};

function formatDate(iso: string | null): string {
  if (!iso) return "Belum dipublikasikan";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogFormPreviewCard({
  blogTitle,
  excerpt,
  imageUrl,
  categoryName,
  publishedAt,
  blogSlug,
}: BlogFormPreviewCardProps) {
  const displayExcerpt = excerpt.trim()
    ? excerpt.length > 120
      ? excerpt.slice(0, 120).trim() + "..."
      : excerpt
    : "Konten singkat artikel akan tampil di sini";

  const detailLink = blogSlug ? `/admin/blog/${blogSlug}` : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <UploadImage
            src={imageUrl}
            alt={blogTitle || "Preview blog"}
            fill
            className="object-cover"
            sizes="400px"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8">
              <span className="text-sm">Gambar Blog</span>
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
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="size-4 shrink-0" />
          <time dateTime={publishedAt ?? undefined}>
            {formatDate(publishedAt)}
          </time>
        </div>

        <h3 className="line-clamp-2 font-semibold leading-tight">
          {blogTitle || "Judul Artikel"}
        </h3>

        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {displayExcerpt}
        </p>

        <div className="mt-2 border-t border-border pt-3">
          {detailLink ? (
            <Link
              href={detailLink}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Baca Selengkapnya
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Baca Selengkapnya
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
