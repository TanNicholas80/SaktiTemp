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

export type CategoryPortofolio = {
  categoryPortofolioId: string;
  categoryPortofolioName: string;
  categoryPortofolioSlug: string;
  categoryPortofolioIcon?: string;
  categoryPortofolioImage?: string;
  categoryPortofolioDescription?: string;
  createdAt: string;
  updatedAt: string;
};

type CreateColumnsOptions = {
  onEdit: (cat: CategoryPortofolio) => void;
  onDelete: (cat: CategoryPortofolio) => void;
};

export function createCategoryPortofolioColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<CategoryPortofolio>[] {
  return [
    {
      accessorKey: "categoryPortofolioName",
      meta: { label: "Nama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("categoryPortofolioName")}
        </div>
      ),
    },
    {
      accessorKey: "categoryPortofolioSlug",
      meta: { label: "Slug" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground font-mono text-sm">
          {row.getValue("categoryPortofolioSlug")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Dibuat" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dibuat" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <span className="text-muted-foreground text-sm">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const cat = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(cat)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(cat)}
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
