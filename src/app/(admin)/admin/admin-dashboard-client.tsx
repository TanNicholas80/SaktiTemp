"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DashboardStatCards,
  DashboardTopContent,
  DashboardRecentContent,
  DashboardQuickActions,
  DashboardSkeleton,
} from "@/components/dashboard";
import { PageHeader } from "@/components/layout/page-header";

type DashboardStats = {
  counts: { blog: number; product: number; portofolio: number; contact: number };
  totalViews: number;
  topBlogs: { blogId: string; blogTitle: string; blogSlug: string; blogViews: number }[];
  topProducts: {
    productId: string;
    productName: string;
    productSlug: string;
    productViews: number;
  }[];
  topPortofolios: {
    portofolioId: string;
    portofolioName: string;
    portofolioSlug: string;
    portofolioViews: number;
  }[];
  recentBlogs: {
    blogId: string;
    blogTitle: string;
    blogSlug: string;
    blogIsPublishedAt: string | null;
  }[];
  recentProducts: {
    productId: string;
    productName: string;
    productSlug: string;
    productIsPublishedAt: string | null;
  }[];
  recentPortofolios: {
    portofolioId: string;
    portofolioName: string;
    portofolioSlug: string;
    portofolioIsPublishedAt: string | null;
  }[];
};

export function AdminDashboardClient() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data dashboard");
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        setError(err.message ?? "Terjadi kesalahan");
        toast.error(err.message ?? "Gagal memuat data dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Ringkasan statistik konten dan aktivitas terbaru"
        />
        <DashboardSkeleton />
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Ringkasan statistik konten dan aktivitas terbaru"
        />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-sm text-destructive">
            {error ?? "Gagal memuat data dashboard. Silakan coba lagi."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Ringkasan statistik konten dan aktivitas terbaru"
      />

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <DashboardStatCards counts={data.counts} totalViews={data.totalViews} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both xl:col-span-7 [animation-delay:100ms]">
          <DashboardTopContent
            topBlogs={data.topBlogs}
            topProducts={data.topProducts}
            topPortofolios={data.topPortofolios}
          />
        </div>
        <div className="col-span-12 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both xl:col-span-5 [animation-delay:150ms]">
          <DashboardRecentContent
            recentBlogs={data.recentBlogs}
            recentProducts={data.recentProducts}
            recentPortofolios={data.recentPortofolios}
          />
        </div>
      </div>

      <div className="animate-in fade-in duration-500 fill-mode-both [animation-delay:200ms]">
        <DashboardQuickActions />
      </div>
    </section>
  );
}
