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

export type GlassPriceRow = {
  glassPricesId: string;
  glassTypeId: string;
  thicknessId: string;
  variant: string;
  variantImageUrl?: string;
  composition?: string | null;
  compositionDetail?: string | null;
  pricePerSqm: number;
  glassTypeName: string;
  thicknessValue: number;
  thicknessUnit: string;
};

type CreateColumnsOptions = {
  onEdit: (row: GlassPriceRow) => void;
  onDelete: (row: GlassPriceRow) => void;
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

export function createGlassPriceColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<GlassPriceRow>[] {
  return [
    {
      accessorKey: "variantImageUrl",
      meta: { label: "Gambar" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gambar" />
      ),
      cell: ({ row }) => {
        const url = row.getValue("variantImageUrl") as string | undefined;
        if (!url) return <span className="text-muted-foreground">—</span>;
        return (
          <img
            src={url}
            alt="Variant"
            className="h-10 w-10 rounded-md object-cover"
          />
        );
      },
    },
    {
      accessorKey: "glassTypeName",
      meta: { label: "Tipe" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipe" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("glassTypeName")}</span>
      ),
    },
    {
      id: "thickness",
      meta: { label: "Ketebalan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ketebalan" />
      ),
      accessorFn: (row) => `${row.thicknessValue} ${row.thicknessUnit}`,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.getValue("thickness")}</span>
      ),
    },
    {
      accessorKey: "variant",
      meta: { label: "Variant" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Variant" />
      ),
    },
    {
      id: "composition",
      meta: { label: "Komposisi" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Komposisi" />
      ),
      accessorFn: (row) =>
        [row.composition, row.compositionDetail].filter(Boolean).join(" · ") ||
        "—",
      cell: ({ row }) => (
        <span className="text-muted-foreground max-w-[200px] truncate text-sm">
          {row.getValue("composition")}
        </span>
      ),
    },
    {
      accessorKey: "pricePerSqm",
      meta: { label: "Harga / m²" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harga / m²" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatRupiah(row.getValue("pricePerSqm"))}
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

