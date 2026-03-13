"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Medal, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
type TopBlog = {
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  blogViews: number;
};

type TopProduct = {
  productId: string;
  productName: string;
  productSlug: string;
  productViews: number;
};

type TopPortofolio = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioViews: number;
};

type DashboardTopContentProps = {
  topBlogs: TopBlog[];
  topProducts: TopProduct[];
  topPortofolios: TopPortofolio[];
};

type TabType = "blog" | "product" | "portofolio";

const tabs: { id: TabType; label: string }[] = [
  { id: "blog", label: "Blog" },
  { id: "product", label: "Produk" },
  { id: "portofolio", label: "Portofolio" },
];

export function DashboardTopContent({
  topBlogs,
  topProducts,
  topPortofolios,
}: DashboardTopContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("blog");

  const items =
    activeTab === "blog"
      ? topBlogs
      : activeTab === "product"
        ? topProducts
        : topPortofolios;

  const getLink = (item: TopBlog | TopProduct | TopPortofolio) => {
    if ("blogSlug" in item) return `/admin/blog/${item.blogSlug}`;
    if ("productSlug" in item) return `/admin/product/${item.productSlug}`;
    return `/admin/portofolio/${(item as TopPortofolio).portofolioSlug}`;
  };

  const getName = (item: TopBlog | TopProduct | TopPortofolio) => {
    if ("blogTitle" in item) return item.blogTitle;
    if ("productName" in item) return item.productName;
    return (item as TopPortofolio).portofolioName;
  };

  const getViews = (item: TopBlog | TopProduct | TopPortofolio) => {
    if ("blogViews" in item) return item.blogViews;
    if ("productViews" in item) return item.productViews;
    return (item as TopPortofolio).portofolioViews;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="size-4 text-amber-500" />;
    if (index === 1) return <Medal className="size-4 text-slate-400" />;
    if (index === 2) return <Medal className="size-4 text-amber-700" />;
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
        {index + 1}
      </span>
    );
  };

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Top 5 Konten Paling Dilihat</CardTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 hover:bg-muted"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/80 hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="w-24 text-right">Views</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  Belum ada data
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={
                    "blogId" in item
                      ? item.blogId
                      : "productId" in item
                        ? item.productId
                        : (item as TopPortofolio).portofolioId
                  }
                  className="group transition-colors duration-150"
                >
                  <TableCell className="align-middle">
                    {getRankIcon(index)}
                  </TableCell>
                  <TableCell className="font-medium">{getName(item)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="font-medium tabular-nums"
                    >
                      {getViews(item).toLocaleString()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={getLink(item)}
                      className="inline-flex items-center gap-1 text-sm text-primary opacity-70 transition-opacity group-hover:opacity-100"
                    >
                      Lihat
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
