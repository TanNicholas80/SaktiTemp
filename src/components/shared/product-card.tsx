"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckIcon,
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
import type { ProductCardData } from "@/components/product/types";

export type { ProductCardData } from "@/components/product/types";

type ProductCardProps = {
  product: ProductCardData;
  onEdit: (product: ProductCardData) => void;
  onDelete: (product: ProductCardData) => void;
};

const MAX_THICKNESS_BADGES = 5;

function stripHtml(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const excellencesToShow = product.excellences.slice(0, 2);
  const thicknessesToShow = product.thicknesses.slice(0, MAX_THICKNESS_BADGES);
  const remainingThickness = product.thicknesses.length - MAX_THICKNESS_BADGES;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={product.productImageUrl}
          alt={product.productName}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.category && (
          <Badge variant="primary" className="absolute left-3 top-3 border-0">
            {product.category.name}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="line-clamp-2 font-semibold leading-tight">
          {product.productName}
        </h2>
        <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
          {product.productShortDescription?.trim() ||
            stripHtml(product.productDescription, 120)}
        </p>
        {excellencesToShow.length > 0 && (
          <ul className="space-y-1">
            {excellencesToShow.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-muted-foreground text-sm"
              >
                <CheckIcon className="size-4 shrink-0 text-primary" />
                <span className="line-clamp-1">{e.productExellenceDescription}</span>
              </li>
            ))}
          </ul>
        )}
        {product.thicknesses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {thicknessesToShow.map((t, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
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
        <div className="mt-auto flex items-center justify-between gap-2">
          <Link
            href={`/admin/product/${product.productSlug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat Detail Produk
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
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(product)}>
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
