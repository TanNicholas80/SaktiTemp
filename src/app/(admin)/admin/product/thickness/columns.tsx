"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, Pencil, Trash2Icon } from "lucide-react";

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

export type ProductThicknessRow = {
  productThicknessId: string;
  productId: string | null;
  productName: string | null;
  productThicknessValue: number;
  productThicknessUnit: string;
  createdAt: string;
  updatedAt: string;
};

type CreateColumnsOptions = {
  onEdit: (row: ProductThicknessRow) => void;
  onDelete: (row: ProductThicknessRow) => void;
};

export function createProductThicknessColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ProductThicknessRow>[] {
  return [
    {
      accessorKey: "productName",
      meta: { label: "Produk" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produk" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("productName") ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "productThicknessValue",
      meta: { label: "Nilai" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nilai" />
      ),
      cell: ({ row }) => (
        <div>{row.getValue("productThicknessValue")}</div>
      ),
    },
    {
      accessorKey: "productThicknessUnit",
      meta: { label: "Unit" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("productThicknessUnit")}
        </div>
      ),
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
