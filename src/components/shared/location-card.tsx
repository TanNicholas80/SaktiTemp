"use client";

import Link from "next/link";
import {
  MoreHorizontalIcon,
  Pencil,
  Trash2Icon,
  ArrowRightIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LocationCardData } from "@/components/location/types";

export type { LocationCardData } from "@/components/location/types";

type LocationCardProps = {
  location: LocationCardData;
  onEdit: (location: LocationCardData) => void;
  onDelete: (location: LocationCardData) => void;
};

function getOfficeTypeLabel(type: "branch" | "head"): string {
  return type === "head" ? "HEAD OFFICE" : "BRANCH OFFICE";
}

export function LocationCard({
  location,
  onEdit,
  onDelete,
}: LocationCardProps) {
  const officeTypeLabel = getOfficeTypeLabel(location.locationType);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <iframe
          src={location.locationMapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Peta ${location.locationCity}`}
          className="absolute inset-0 h-full w-full grayscale"
        />
        <Badge
          variant="primary"
          className="absolute left-3 top-3 border-0"
        >
          {officeTypeLabel}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute right-3 top-3 size-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-white/90 dark:hover:bg-white"
              aria-label="Buka menu aksi"
            >
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(location)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(location)}
            >
              <Trash2Icon className="mr-2 size-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-2 bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-accent" />
            <span className="text-sm font-medium uppercase text-[#f39c27]">
              {officeTypeLabel}
            </span>
          </div>
          <h2 className="text-lg font-bold uppercase">
            {location.locationCity}
          </h2>
          <p className="text-primary-foreground/90 line-clamp-3 text-sm">
            {location.locationAddress}
          </p>
          <Link
            href={location.locationMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium hover:underline text-[#f39c27]"
          >
            Buka Di Google Maps
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
