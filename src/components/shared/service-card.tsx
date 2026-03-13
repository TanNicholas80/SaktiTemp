"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  MoreHorizontalIcon,
  Package,
  Pencil,
  Ruler,
  Scissors,
  ShieldCheck,
  Trash2Icon,
  Truck,
  type LucideIcon,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ServiceCardData } from "@/components/service/types";
import React from "react";

export type { ServiceCardData } from "@/components/service/types";

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
  Scissors,
};

function getServiceIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Package;
}

type ServiceCardProps = {
  service: ServiceCardData;
  onEdit: (service: ServiceCardData) => void;
  onDelete: (service: ServiceCardData) => void;
};

function parseServicePoints(servicePoints: unknown): string[] {
  if (Array.isArray(servicePoints)) {
    return servicePoints.filter((x): x is string => typeof x === "string");
  }
  return [];
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  const IconComponent = getServiceIcon(service.serviceIcon);
  const points = parseServicePoints(service.servicePoints);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex">
          <div className="flex size-14 items-center justify-center rounded-lg bg-primary/10">
            {React.createElement(IconComponent, { className: "size-7 text-primary" })}
          </div>
        </div>

        <h2 className="mb-2 text-lg font-bold">
          {service.serviceName}
        </h2>

        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
          {service.serviceDescription}
        </p>

        {points.length > 0 && (
          <ul className="mb-4 space-y-2">
            {points.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
              >
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-orange-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}

        <Link
          href={service.serviceBtnLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto"
        >
          <Button className="w-full">
            {service.serviceBtnText}
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-end border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-8 w-8">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(service)}>
              <Pencil className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(service)}
            >
              <Trash2Icon className="mr-2 size-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
