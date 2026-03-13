"use client";

import { CheckIcon, RulerIcon, Layers } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProductDetailData } from "./types";

type ProductDetailContentProps = {
  product: ProductDetailData;
};

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const portofolioTypes = product.portofolioTypes ?? [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 font-bold text-xl">Deskripsi Produk</h2>
        <div
          className="prose prose-sm dark:prose-invert max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:first:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-0.5"
          dangerouslySetInnerHTML={{ __html: product.productDescription }}
        />
      </section>

      {(product.thicknesses.length > 0 || portofolioTypes.length > 0) && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {product.thicknesses.length > 0 && (
            <section className="rounded-xl bg-muted/60 p-5">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
                <RulerIcon className="size-5 shrink-0 text-[#8B2F2F]" />
                Ketebalan Tersedia
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.thicknesses.map((t, i) => (
                  <span
                    key={i}
                    className={cn(
                      "inline-flex items-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
                    )}
                  >
                    {t.productThicknessValue} {t.productThicknessUnit}
                  </span>
                ))}
              </div>
            </section>
          )}

          {portofolioTypes.length > 0 && (
            <section className="rounded-xl bg-muted/60 p-5">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
                <Layers className="size-5 shrink-0 text-[#8B2F2F]" />
                Aplikasi Penggunaan
              </h2>
              <div className="flex flex-wrap gap-2">
                {portofolioTypes.map((t) => (
                  <span
                    key={t.portofolioTypeId}
                    className={cn(
                      "inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm"
                    )}
                  >
                    {t.portofolioTypeName}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductExcellencesSection({
  excellences,
}: {
  excellences: { productExellenceDescription: string }[];
}) {
  if (excellences.length === 0) return null;

  return (
    <section className="mt-6 rounded-xl bg-muted/60 p-5">
      <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground text-xl">
        <svg
          className="size-5 shrink-0 text-[#8B2F2F]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        Keunggulan Produk
      </h2>
      <ul className="space-y-3">
        {excellences.map((e, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <CheckIcon className="size-3 text-[#8B2F2F]" />
            </span>
            <span className="text-muted-foreground">
              {e.productExellenceDescription}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
