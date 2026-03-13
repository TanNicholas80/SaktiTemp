"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import type { ProductDetailData } from "./types";

type ProductDetailHeroProps = {
  product: ProductDetailData;
};

export function ProductDetailHero({ product }: ProductDetailHeroProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
      <Image
        src={product.productImageUrl}
        alt={product.productName}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      {product.category && (
        <Badge
          variant="primary"
          className="absolute left-4 top-4 rounded-full border-0"
        >
          {product.category.name}
        </Badge>
      )}
    </div>
  );
}
