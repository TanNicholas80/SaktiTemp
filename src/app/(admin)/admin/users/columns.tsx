"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

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

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type CreateColumnsOptions = {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function createUserColumns({
  onEdit,
  onDelete,
}: CreateColumnsOptions): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      meta: { label: "Nama" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      meta: { label: "Email" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      meta: { label: "Role" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const label =
          role === "blog_editor"
            ? "Editor Blog"
            : role === "admin"
              ? "Admin"
              : role === "user"
                ? "User"
                : role;
        return (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
              role === "admin"
                ? "bg-primary/10 text-primary"
                : role === "blog_editor"
                  ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {label}
          </span>
        );
      },
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
        const user = row.original;
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
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(user)}
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
