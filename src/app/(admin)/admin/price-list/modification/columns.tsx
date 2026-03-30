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

export type ModificationRow = {
  modificationId: string;
  name: string;
  thicknessId: string;
  modificationImageUrl?: string;
  pricePerSide: number;
  thicknessValue: number;
  thicknessUnit: string;
};

type CreateColumnsOptions = {
  onEdit: (row: ModificationRow) => void;
  onDelete: (row: ModificationRow) => void;
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

export function createModificationColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ModificationRow>[] {
  return [
    {
      accessorKey: "modificationImageUrl",
      meta: { label: "Gambar" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gambar" />
      ),
      cell: ({ row }) => {
        const url = row.getValue("modificationImageUrl") as string | undefined;
        if (!url) return <span className="text-muted-foreground">—</span>;
        return (
          <img
            src={url}
            alt=""
            className="h-10 w-10 rounded-md object-cover"
          />
        );
      },
    },
    {
      accessorKey: "name",
      meta: { label: "Nama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("name")}</span>
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
      accessorKey: "pricePerSide",
      meta: { label: "Harga / sisi" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Harga / sisi" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">
          {formatRupiah(row.getValue("pricePerSide"))}
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
