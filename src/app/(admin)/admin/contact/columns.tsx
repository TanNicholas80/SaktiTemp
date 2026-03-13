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
import { ContactItemPreview } from "@/components/contact";

export type ContactRowData = {
  contactId: string;
  contactType: string;
  contactLabel: string;
  contactValue: string;
  contactValueExtra: string | null;
  contactIcon: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const CONTACT_TYPE_LABELS: Record<string, string> = {
  phone: "Telepon",
  email: "Email",
  address: "Alamat",
  operational_hours: "Jam Operasional",
};

type CreateColumnsOptions = {
  onEdit: (row: ContactRowData) => void;
  onDelete: (row: ContactRowData) => void;
};

export function createContactColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<ContactRowData>[] {
  return [
    {
      id: "preview",
      header: "Preview",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="w-48">
            <ContactItemPreview
              iconName={item.contactIcon}
              label={item.contactLabel}
              value={item.contactValue}
              valueExtra={item.contactValueExtra}
              variant="compact"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "contactLabel",
      meta: { label: "Label" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate font-medium">
          {row.getValue("contactLabel")}
        </div>
      ),
    },
    {
      accessorKey: "contactType",
      meta: { label: "Jenis" },
      header: "Jenis",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {CONTACT_TYPE_LABELS[(row.getValue("contactType") as string) ?? ""] ??
            row.getValue("contactType")}
        </span>
      ),
    },
    {
      accessorKey: "contactValue",
      meta: { label: "Nilai" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nilai" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-[180px] truncate text-sm">
          {row.getValue("contactValue")}
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
