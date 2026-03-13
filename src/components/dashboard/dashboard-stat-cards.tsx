import { Briefcase, Eye, FileText, Package } from "lucide-react";

import { DashboardStatCard } from "./dashboard-stat-card";

type DashboardStatCardsProps = {
  counts: {
    blog: number;
    product: number;
    portofolio: number;
    contact: number;
  };
  totalViews: number;
};

export function DashboardStatCards({ counts, totalViews }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        icon={FileText}
        label="Blog"
        value={counts.blog}
        href="/admin/blog"
        iconVariant="primary"
      />
      <DashboardStatCard
        icon={Package}
        label="Produk"
        value={counts.product}
        href="/admin/product"
        iconVariant="accent"
      />
      <DashboardStatCard
        icon={Briefcase}
        label="Portofolio"
        value={counts.portofolio}
        href="/admin/portofolio"
        iconVariant="chart"
      />
      <DashboardStatCard
        icon={Eye}
        label="Total Views"
        value={totalViews.toLocaleString()}
        iconVariant="primary"
      />
    </div>
  );
}
