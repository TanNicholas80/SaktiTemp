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

export type CompanyStatRowData = {
  companyStatId: string;
  value: string;
  label: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CreateColumnsOptions = {
  onEdit: (row: CompanyStatRowData) => void;
  onDelete: (row: CompanyStatRowData) => void;
};

export function createCompanyStatColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<CompanyStatRowData>[] {
  return [
    {
      accessorKey: "displayOrder",
      meta: { label: "Urutan" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Urutan" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("displayOrder")}</span>
      ),
    },
    {
      accessorKey: "value",
      meta: { label: "Nilai" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nilai" />
      ),
      cell: ({ row }) => (
        <span className="font-bold text-accent">
          {row.getValue("value")}
        </span>
      ),
    },
    {
      accessorKey: "label",
      meta: { label: "Label" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("label")}
        </div>
      ),
    },
    {
      accessorKey: "isPublished",
      meta: { label: "Status" },
      header: "Status",
      cell: ({ row }) => {
        const published = row.getValue("isPublished") as boolean;
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
