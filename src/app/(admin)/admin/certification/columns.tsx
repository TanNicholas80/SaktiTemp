"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
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

export type CertificationRowData = {
  certificationId: string;
  name: string;
  image: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CreateColumnsOptions = {
  onEdit: (row: CertificationRowData) => void;
  onDelete: (row: CertificationRowData) => void;
};

export function createCertificationColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<CertificationRowData>[] {
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
      accessorKey: "image",
      meta: { label: "Logo" },
      header: "Logo",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        if (!image) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="relative size-12 overflow-hidden rounded-md border bg-muted">
            <Image
              src={image}
              alt=""
              fill
              className="object-contain"
              sizes="48px"
            />
          </div>
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
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("name")}
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
