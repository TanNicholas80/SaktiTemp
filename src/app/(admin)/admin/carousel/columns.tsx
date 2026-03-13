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
import { CarouselSlidePreview } from "@/components/carousel";
import type { CarouselRowData } from "@/components/carousel";

type CreateColumnsOptions = {
  onEdit: (row: CarouselRowData) => void;
  onDelete: (row: CarouselRowData) => void;
};

export function createCarouselColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<CarouselRowData>[] {
  return [
    {
      accessorKey: "carouselOrder",
      meta: { label: "Urutan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Urutan" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("carouselOrder")}</span>
      ),
    },
    {
      id: "preview",
      header: "Preview",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="w-48">
            <CarouselSlidePreview
              heading={item.carouselHeading}
              subheading={item.carouselSubheading}
              description={item.carouselDescription}
              imageUrl={item.carouselImageUrl}
              variant="compact"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "carouselHeading",
      meta: { label: "Heading" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Heading" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("carouselHeading")}
        </div>
      ),
    },
    {
      accessorKey: "carouselSubheading",
      meta: { label: "Subheading" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Subheading" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-[150px] truncate">
          {row.getValue("carouselSubheading")}
        </div>
      ),
    },
    {
      accessorKey: "carouselIsPublished",
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("carouselIsPublished") as boolean;
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
