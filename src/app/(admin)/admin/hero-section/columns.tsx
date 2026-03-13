"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, Pencil, Trash2Icon } from "lucide-react";

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
import { DataTableColumnHeader } from "@/components/data-table";
import { HeroSectionPreview } from "@/components/hero-section";

export type HeroSectionRowData = {
  heroSectionId: string;
  pageKey: string;
  preHeading: string | null;
  mainHeading: string;
  subHeading: string;
  description: string;
  backgroundImageUrl: string;
  breadcrumbItems: { label: string; href: string }[] | null;
  scrollIndicatorText: string | null;
  scrollIndicatorVisible: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CreateColumnsOptions = {
  onEdit: (row: HeroSectionRowData) => void;
  onDelete: (row: HeroSectionRowData) => void;
};

export function createHeroSectionColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<HeroSectionRowData>[] {
  return [
    {
      accessorKey: "pageKey",
      meta: { label: "Page Key" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Page Key" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("pageKey")}
        </span>
      ),
    },
    {
      id: "preview",
      header: "Preview",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="w-48">
            <HeroSectionPreview
              preHeading={item.preHeading}
              mainHeading={item.mainHeading}
              subHeading={item.subHeading}
              description={item.description}
              imageUrl={item.backgroundImageUrl}
              breadcrumbItems={item.breadcrumbItems}
              scrollIndicatorText={item.scrollIndicatorText}
              scrollIndicatorVisible={item.scrollIndicatorVisible}
              variant="compact"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "mainHeading",
      meta: { label: "Judul Utama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Main Heading" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("mainHeading")}
        </div>
      ),
    },
    {
      accessorKey: "subHeading",
      meta: { label: "Sub-judul" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sub-heading" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-[150px] truncate">
          {row.getValue("subHeading")}
        </div>
      ),
    },
    {
      accessorKey: "isPublished",
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("isPublished") as boolean;
        return (
          <Badge variant={published ? "primary" : "secondary"}>
            {published ? "Dipublikasi" : "Draft"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(item)}
              >
                <Trash2Icon className="mr-2 size-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
