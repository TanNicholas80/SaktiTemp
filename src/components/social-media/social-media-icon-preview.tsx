"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
} from "lucide-react";

import { TiktokIcon } from "@/components/icons/tiktok-icon";

type IconComponent = React.ComponentType<{ className?: string }>;

const SOCIAL_MEDIA_ICON_MAP: Record<string, IconComponent> = {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  Tiktok: TiktokIcon,
};

type SocialMediaIconPreviewProps = {
  iconName: string;
  platformName: string;
  variant?: "default" | "compact";
};

export function SocialMediaIconPreview({
  iconName,
  platformName,
  variant = "default",
}: SocialMediaIconPreviewProps) {
  const IconComponent =
    SOCIAL_MEDIA_ICON_MAP[iconName] ?? Share2;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-primary/80 backdrop-blur-sm">
          <IconComponent className="size-5 text-white" />
        </div>
        <span className="truncate text-sm font-medium">{platformName || "Platform"}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-medium">
        Preview tampilan ikon
      </p>
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-lg border border-white/20 bg-primary/80 backdrop-blur-sm">
          <IconComponent className="size-7 text-white" />
        </div>
        <p className="text-center font-medium">{platformName || "Platform"}</p>
      </div>
    </div>
  );
}
