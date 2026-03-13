"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ORANGE_ACCENT = "#F9A826";

type ProductDetailBreadcrumbProps = {
  productName: string;
};

export function ProductDetailBreadcrumb({
  productName,
}: ProductDetailBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-1.5 text-sm text-muted-foreground sm:gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/70">
          &gt;
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/admin/product"
              className="transition-colors hover:text-foreground"
            >
              Products
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-muted-foreground/70">
          &gt;
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage
            className="font-medium"
            style={{ color: ORANGE_ACCENT }}
          >
            {productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
