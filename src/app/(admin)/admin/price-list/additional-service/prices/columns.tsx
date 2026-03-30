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

export type ProcessingPriceRow = {
  processingPricesId: string;
  categoryId: string;
  thickness: number | null;
  minThickness: number | null;
  maxThickness: number | null;
  serviceName: string;
  unit: "m1" | "pcs" | "sqm" | "none";
  price: number;
  categoryName: string;
};

type CreateColumnsOptions = {
  onEdit: (row: ProcessingPriceRow) => void;
  onDelete: (row: ProcessingPriceRow) => void;
};

function formatRupiah(value: number): string {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return String(value);
  }
}

const UNIT_LABEL: Record<ProcessingPriceRow["unit"], string> = {
  m1: "m¹",
  pcs: "pcs",
  sqm: "m²",
  none: "-",
};

export function createProcessingPriceColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ProcessingPriceRow>[] {
  return [
    {
      accessorKey: "categoryName",
      meta: { label: "Kategori" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Kategori" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("categoryName")}</span>
      ),
    },
    {
      id: "ketebalan",
      meta: { label: "Ketebalan (mm)" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ketebalan (mm)" />
      ),
      accessorFn: (r) =>
        r.thickness != null
          ? String(r.thickness)
          : `${r.minThickness ?? ""} – ${r.maxThickness ?? ""}`,
    },
    {
      accessorKey: "serviceName",
      meta: { label: "Layanan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Layanan" />
      ),
    },
    {
      accessorKey: "unit",
      meta: { label: "Satuan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Satuan" />
      ),
      cell: ({ row }) => UNIT_LABEL[row.original.unit],
    },
    {
      accessorKey: "price",
      meta: { label: "Harga" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harga" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatRupiah(row.getValue("price"))}
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
