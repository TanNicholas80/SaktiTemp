"use client";

import {
  Package,
  Ruler,
  Scissors,
  ShieldCheck,
  Star,
  Target,
  Truck,
  type LucideIcon,
  Users,
  Wrench,
} from "lucide-react";

const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Scissors,
};

export const BENEFIT_ICON_MAP: Record<string, LucideIcon> = {
  Target,
  ShieldCheck,
  Users,
  Star,
  Wrench,
  Package,
};

export function getBenefitIcon(iconName: string): LucideIcon {
  return BENEFIT_ICON_MAP[iconName] ?? Star;
}

type IconPreviewCardProps = {
  iconName: string;
  title: string;
  description: string;
  variant?: "service" | "benefit";
};

export function IconPreviewCard({
  iconName,
  title,
  description,
  variant = "benefit",
}: IconPreviewCardProps) {
  const iconMap = variant === "service" ? SERVICE_ICON_MAP : BENEFIT_ICON_MAP;
  const IconComponent = iconMap[iconName] ?? (variant === "service" ? Package : Star);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-medium">
        Preview tampilan card
      </p>
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10">
          <IconComponent className="size-7 text-primary" />
        </div>
        <div className="w-full text-center">
          <p className="font-bold">
            {title || "Judul"}
          </p>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description || "Deskripsi"}
          </p>
        </div>
      </div>
    </div>
  );
}
