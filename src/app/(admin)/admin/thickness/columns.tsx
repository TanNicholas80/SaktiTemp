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

export type ThicknessRow = {
  thicknessId: string;
  thicknessValue: number;
  thicknessUnit: string;
};

type CreateColumnsOptions = {
  onEdit: (row: ThicknessRow) => void;
  onDelete: (row: ThicknessRow) => void;
};

export function createThicknessColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ThicknessRow>[] {
  return [
    {
      accessorKey: "thicknessValue",
      meta: { label: "Nilai" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nilai" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("thicknessValue")}</span>
      ),
    },
    {
      accessorKey: "thicknessUnit",
      meta: { label: "Unit" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("thicknessUnit")}
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
