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

export type GlassTypeRow = {
  glassTypeId: string;
  glassTypeName: string;
  glassTypeImageUrl?: string;
};

type CreateColumnsOptions = {
  onEdit: (row: GlassTypeRow) => void;
  onDelete: (row: GlassTypeRow) => void;
};

export function createGlassTypeColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<GlassTypeRow>[] {
  return [
    {
      accessorKey: "glassTypeImageUrl",
      meta: { label: "Gambar" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gambar" />
      ),
      cell: ({ row }) => {
        const url = row.getValue("glassTypeImageUrl") as string | undefined;
        if (!url) return <span className="text-muted-foreground">—</span>;
        return (
          <img
            src={url}
            alt="Preview"
            className="h-10 w-10 rounded-md object-cover"
          />
        );
      },
    },
    {
      accessorKey: "glassTypeName",
      meta: { label: "Nama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("glassTypeName")}</span>
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

