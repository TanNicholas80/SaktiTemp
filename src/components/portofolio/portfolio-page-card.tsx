"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PortfolioPageCardData = {
  portofolioId: string;
  portofolioName: string;
  portofolioSlug: string;
  portofolioShortDescription: string;
  portofolioLocation: string;
  portofolioImageUrl: string;
  categoryName: string | null;
  categorySlug: string | null;
};

type PortfolioPageCardProps = {
  item: PortfolioPageCardData;
  viewDetailText: string;
};

export function PortfolioPageCard({ item, viewDetailText }: PortfolioPageCardProps) {
  const desc = item.portofolioShortDescription
    ? item.portofolioShortDescription.length > 120
      ? item.portofolioShortDescription.slice(0, 120).trim() + "..."
      : item.portofolioShortDescription
    : "";

  return (
    <article className="group h-full">
      <Link href={`/portofolio/${item.portofolioSlug}`} className="block h-full">
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
          )}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={item.portofolioImageUrl}
              alt={item.portofolioName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {item.categoryName && (
              <Badge
                className="absolute left-3 top-3 border-0 bg-primary text-primary-foreground"
                aria-hidden
              >
                {item.categoryName}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "flex flex-1 flex-col gap-3 p-4 transition-all duration-300 sm:p-5",
              "bg-white group-hover:bg-primary",
              "text-foreground group-hover:text-primary-foreground"
            )}
          >
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary-foreground">
              {item.portofolioName}
            </h3>
            {item.portofolioLocation && (
              <p className="flex items-center gap-1.5 text-muted-foreground text-sm group-hover:text-primary-foreground/90">
                <MapPin className="size-4 shrink-0" />
                <span>{item.portofolioLocation}</span>
              </p>
            )}
            {desc && (
              <p className="line-clamp-2 flex-1 text-sm text-muted-foreground group-hover:text-primary-foreground/90">
                {desc}
              </p>
            )}
            <span
              className={cn(
                "mt-1 inline-flex w-fit items-center gap-1 rounded-lg px-3 py-2 -ml-1 text-sm font-medium transition-colors duration-300",
                "text-foreground",
                "group-hover:bg-accent group-hover:text-white"
              )}
            >
              {viewDetailText}
              <ChevronRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
