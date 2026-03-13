import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type DashboardStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href?: string;
  iconVariant?: "default" | "primary" | "accent" | "chart";
};

const iconBgClasses = {
  default: "bg-muted text-muted-foreground group-hover:bg-muted/80",
  primary: "bg-primary/10 text-primary group-hover:bg-primary/20",
  accent: "bg-accent/20 text-accent group-hover:bg-accent/30",
  chart: "bg-chart-1/10 text-chart-1 group-hover:bg-chart-1/20",
};

export function DashboardStatCard({
  icon: Icon,
  label,
  value,
  href,
  iconVariant = "default",
}: DashboardStatCardProps) {
  const content = (
    <Card
      className={`
        group rounded-xl border bg-card shadow-sm
        transition-all duration-300 ease-out
        hover:shadow-md hover:border-primary/20
        ${href ? "cursor-pointer hover:-translate-y-0.5" : ""}
      `}
    >
      <CardContent className="flex flex-col gap-4 pt-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${iconBgClasses[iconVariant]}`}
        >
          <Icon className="size-6 shrink-0" />
        </div>
        <div className="flex flex-1 items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight">
              {value}
            </p>
          </div>
          {href && (
            <span
              className={`flex shrink-0 items-center gap-0.5 text-sm text-primary transition-all duration-200 ${href ? "opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5" : ""}`}
            >
              Kelola
              <ChevronRight className="size-4" />
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
