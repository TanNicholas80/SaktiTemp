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

export type ProductExcellenceRow = {
  productExellenceId: string;
  productId: string | null;
  productName: string | null;
  productExellenceDescription: string;
  createdAt: string;
  updatedAt: string;
};

type CreateColumnsOptions = {
  onEdit: (row: ProductExcellenceRow) => void;
  onDelete: (row: ProductExcellenceRow) => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createProductExcellenceColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ProductExcellenceRow>[] {
  return [
    {
      accessorKey: "productName",
      meta: { label: "Produk" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produk" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] font-medium">
          {row.original.productName?.trim() || (
            <span className="text-muted-foreground">Produk tidak ditemukan</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "productExellenceDescription",
      meta: { label: "Deskripsi" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deskripsi" />
      ),
      cell: ({ row }) => {
        const text = row.original.productExellenceDescription;
        return (
          <div
            className="max-w-md truncate text-muted-foreground"
            title={text}
          >
            {text}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Dibuat" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dibuat" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground whitespace-nowrap text-sm">
          {formatDate(row.original.createdAt)}
        </span>
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
