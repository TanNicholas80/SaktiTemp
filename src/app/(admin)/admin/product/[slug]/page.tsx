"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import { NotFoundState } from "@/components/layout/not-found-state";
import {
  ProductDetailHero,
  ProductDetailContent,
  ProductDetailBreadcrumb,
  ProductDetailActions,
  ProductExcellencesSection,
  ProductExampleProjects,
} from "@/components/product";
import type { ProductDetailData } from "@/components/product";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = React.useState<ProductDetailData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/product/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (!product) {
    return (
      <NotFoundState
        message="Produk tidak ditemukan"
        backHref="/admin/product"
        backLabel="Kembali ke Daftar Product"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeaderWithBack
        title=""
        backHref="/admin/product"
        action={
          <Button variant="outline" asChild>
            <Link href={`/admin/product/${product.productSlug}/edit`}>
              Edit
            </Link>
          </Button>
        }
      />

      <ProductDetailBreadcrumb productName={product.productName} />

      <h1 className="text-2xl font-bold sm:text-3xl">{product.productName}</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-0">
          <ProductDetailHero product={product} />
          <ProductExcellencesSection excellences={product.excellences} />
        </div>

        <div className="min-w-0 space-y-8">
          <ProductDetailContent product={product} />
          <ProductExampleProjects portofolios={product.portofolios ?? []} />
          <ProductDetailActions />
        </div>
      </div>
    </div>
  );
}
