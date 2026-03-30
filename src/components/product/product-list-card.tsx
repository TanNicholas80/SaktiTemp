"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { markViewIntent } from "@/lib/utils/view-intent";

const MAX_THICKNESS_BADGES = 5;
const MAX_EXCELLENCE_SHOW = 2;

export type ProductListCardData = {
  productId: string;
  productName: string;
  productSlug: string;
  productShortDescription: string;
  productImageUrl: string;
  categoryProductId: string | null;
  categoryName: string | null;
  thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  excellences: string[];
};

type ProductListCardProps = {
  product: ProductListCardData;
};

export function ProductListCard({ product }: ProductListCardProps) {
  const t = useTranslations("productSection");
  const validThicknesses = product.thicknesses.filter(
    (t) => t.productThicknessValue > 0 && t.productThicknessUnit?.trim()
  );
  const validExcellences = product.excellences.filter((e) => e?.trim());

  const thicknessesToShow = validThicknesses.slice(0, MAX_THICKNESS_BADGES);
  const remainingThickness = validThicknesses.length - MAX_THICKNESS_BADGES;
  const excellencesToShow = validExcellences.slice(0, MAX_EXCELLENCE_SHOW);

  const displayDescription = product.productShortDescription?.trim()
    ? product.productShortDescription.length > 120
      ? product.productShortDescription.slice(0, 120).trim() + "..."
      : product.productShortDescription
    : "";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={product.productImageUrl}
          alt={product.productName || "Produk"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* White overlay default — red on hover */}
        <div
          className="absolute inset-0 bg-white/35 transition-all duration-400 group-hover:bg-primary/50"
          aria-hidden
        />
        {product.categoryName && (
          <Badge
            variant="primary"
            className="absolute left-3 top-3 z-10 border-0 bg-primary text-primary-foreground"
          >
            {product.categoryName}
          </Badge>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-4 transition-colors duration-300",
          "group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        <h3 className="line-clamp-2 font-semibold leading-tight text-foreground group-hover:text-primary-foreground">
          {product.productName || "Nama Produk"}
        </h3>

        {displayDescription && (
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground group-hover:text-primary-foreground/90">
            {displayDescription}
          </p>
        )}

        {excellencesToShow.length > 0 && (
          <ul className="space-y-1">
            {excellencesToShow.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary-foreground/90"
              >
                <Check
                  className="size-4 shrink-0 text-accent group-hover:text-primary-foreground"
                  strokeWidth={2.5}
                />
                <span className="line-clamp-1">{e}</span>
              </li>
            ))}
          </ul>
        )}

        {validThicknesses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {thicknessesToShow.map((th, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="rounded-md border border-border bg-background text-xs font-normal text-foreground transition-colors group-hover:border-primary-foreground/30 group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground"
              >
                {th.productThicknessValue} {th.productThicknessUnit}
              </Badge>
            ))}
            {remainingThickness > 0 && (
              <span className="text-xs text-muted-foreground group-hover:text-primary-foreground/90">
                +{remainingThickness} Lainnya
              </span>
            )}
          </div>
        )}

        <div className="mt-2 border-t border-border pt-3 group-hover:border-primary-foreground/30">
          <Link
            href={`/product/${product.productSlug}`}
            onClick={() => markViewIntent("product", product.productSlug)}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary-foreground hover:group-hover:underline"
          >
            {t("viewDetail")}
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
