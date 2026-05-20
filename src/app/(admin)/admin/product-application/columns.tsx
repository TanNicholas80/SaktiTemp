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

export type ProductApplicationRowData = {
  productApplicationId: string;
  productApplicationName: string;
  productApplicationSlug: string;
  productApplicationIsPublished: boolean;
  productId: string | null;
  productName: string | null;
};

type CreateColumnsOptions = {
  onEdit: (row: ProductApplicationRowData) => void;
  onDelete: (row: ProductApplicationRowData) => void;
};

export function createProductApplicationColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ProductApplicationRowData>[] {
  return [
    {
      accessorKey: "productApplicationName",
      meta: { label: "Nama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[240px] truncate font-medium">
          {row.getValue("productApplicationName")}
        </div>
      ),
    },
    {
      accessorKey: "productName",
      meta: { label: "Produk" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produk" />
      ),
      cell: ({ row }) => {
        const name = row.getValue("productName") as string | null;
        return (
          <span className="text-muted-foreground">
            {name ?? "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "productApplicationIsPublished",
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("productApplicationIsPublished") as boolean;
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
