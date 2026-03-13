"use client";

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

type CardActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  /** Posisi tombol. Default: "top-right" untuk overlay di kartu. */
  position?: "top-right" | "bottom-right";
  /** ClassName untuk wrapper. */
  className?: string;
  /** Label untuk item edit. */
  editLabel?: string;
  /** Label untuk item hapus. */
  deleteLabel?: string;
};

export function CardActionsMenu({
  onEdit,
  onDelete,
  position = "top-right",
  className,
  editLabel = "Edit",
  deleteLabel = "Hapus",
}: CardActionsMenuProps) {
  const positionClass =
    position === "top-right"
      ? "absolute right-3 top-3"
      : "flex items-center justify-end";

  return (
    <div className={positionClass}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon-sm"
            className={
              className ??
              "size-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
            }
            aria-label="Buka menu aksi"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            {editLabel}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2Icon className="mr-2 size-4" />
            {deleteLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
