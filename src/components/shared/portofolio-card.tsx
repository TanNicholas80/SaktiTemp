"use client";

import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ChevronRightIcon,
  MoreHorizontalIcon,
  Pencil,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PortofolioCardData } from "@/components/portofolio/types";

export type { PortofolioCardData } from "@/components/portofolio/types";

type PortofolioCardProps = {
  portofolio: PortofolioCardData;
  onEdit: (portofolio: PortofolioCardData) => void;
  onDelete: (portofolio: PortofolioCardData) => void;
};

function stripHtml(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function PortofolioCard({
  portofolio,
  onEdit,
  onDelete,
}: PortofolioCardProps) {
  const excerpt = portofolio.portofolioShortDescription?.trim()
    ? portofolio.portofolioShortDescription
    : stripHtml(portofolio.portofolioAbout, 120);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={portofolio.portofolioImageUrl}
          alt={portofolio.portofolioName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {portofolio.category && (
          <Badge
            variant="primary"
            className="absolute left-3 top-3 border-0"
          >
            {portofolio.category.name}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="line-clamp-2 font-semibold leading-tight">
          {portofolio.portofolioName}
        </h2>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="size-4 shrink-0" />
          <span>{portofolio.portofolioLocation}</span>
        </div>
        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`/admin/portofolio/${portofolio.portofolioSlug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat Detail
            <ChevronRightIcon className="size-4" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(portofolio)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(portofolio)}
              >
                <Trash2Icon className="mr-2 size-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
