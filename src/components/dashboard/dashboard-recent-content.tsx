import Link from "next/link";
import { Briefcase, FileText, Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RecentBlog = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogIsPublishedAt: string | null;
};

type RecentProduct = {
  productId: string;
  productName: string;
  productSlug: string;
  productIsPublishedAt: string | null;
};

type RecentPortofolio = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioIsPublishedAt: string | null;
};

type DashboardRecentContentProps = {
  recentBlogs: RecentBlog[];
  recentProducts: RecentProduct[];
  recentPortofolios: RecentPortofolio[];
};

function formatDate(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RecentSection<T>({
  icon: Icon,
  title,
  emptyMessage,
  items,
  getLink,
  getName,
  getDate,
  getKey,
}: {
  icon: React.ElementType;
  title: string;
  emptyMessage: string;
  items: T[];
  getLink: (item: T) => string;
  getName: (item: T) => string;
  getDate: (item: T) => string | null;
  getKey: (item: T) => string;
}) {
  return (
    <div>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        {title}
      </h4>
      <ul className="space-y-1">
        {items.length === 0 ? (
          <li className="rounded-lg px-3 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </li>
        ) : (
          items.map((item) => (
            <li key={getKey(item)}>
              <Link
                href={getLink(item)}
                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/60"
              >
                <span className="min-w-0 truncate font-medium hover:text-primary">
                  {getName(item)}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {formatDate(getDate(item))}
                </span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function DashboardRecentContent({
  recentBlogs,
  recentProducts,
  recentPortofolios,
}: DashboardRecentContentProps) {
  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Konten Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
        <RecentSection
          icon={FileText}
          title="Blog Terbaru"
          emptyMessage="Belum ada blog"
          items={recentBlogs}
          getKey={(b) => b.blogId}
          getLink={(b) => `/admin/blog/${b.blogSlug}`}
          getName={(b) => b.blogTitle}
          getDate={(b) => b.blogIsPublishedAt}
        />
        <RecentSection
          icon={Package}
          title="Produk Terbaru"
          emptyMessage="Belum ada produk"
          items={recentProducts}
          getKey={(p) => p.productId}
          getLink={(p) => `/admin/product/${p.productSlug}`}
          getName={(p) => p.productName}
          getDate={(p) => p.productIsPublishedAt}
        />
        <div className="sm:col-span-2 xl:col-span-1">
          <RecentSection
            icon={Briefcase}
            title="Portofolio Terbaru"
            emptyMessage="Belum ada portofolio"
            items={recentPortofolios}
            getKey={(p) => p.portofolioId}
            getLink={(p) => `/admin/portofolio/${p.portofolioSlug}`}
            getName={(p) => p.portofolioName}
            getDate={(p) => p.portofolioIsPublishedAt}
          />
        </div>
      </CardContent>
    </Card>
  );
}
