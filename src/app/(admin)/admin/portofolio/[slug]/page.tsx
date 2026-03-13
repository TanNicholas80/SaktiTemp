"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back";
import { LoadingState } from "@/components/layout/loading-state";
import {
  PortofolioDetailHero,
  PortofolioDetailContent,
  PortofolioDetailSidebar,
} from "@/components/portofolio";
import type { PortofolioDetailData } from "@/components/portofolio";

export default function PortofolioDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [portofolio, setPortofolio] =
    React.useState<PortofolioDetailData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/portofolio/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setPortofolio)
      .catch(() => setPortofolio(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingState />;
  }

  if (!portofolio) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">Portofolio tidak ditemukan</p>
        <Button asChild>
          <Link href="/admin/portofolio">← Kembali ke Daftar Portofolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeaderWithBack
        title=""
        backHref="/admin/portofolio"
        action={
          <Button variant="outline" asChild>
            <Link href={`/admin/portofolio/${portofolio.portofolioSlug}/edit`}>
              Edit
            </Link>
          </Button>
        }
      />

      <PortofolioDetailHero portofolio={portofolio} />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <PortofolioDetailContent portofolio={portofolio} />
        </div>

        <PortofolioDetailSidebar portofolio={portofolio} />
      </div>
    </div>
  );
}
