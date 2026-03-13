"use client";

import { Input } from "@/components/ui/input";

const PAGE_SIZES = [6, 9, 12];

type ServiceListToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
};

export function ServiceListToolbar({
  search,
  onSearchChange,
  pageSize,
  onPageSizeChange,
}: ServiceListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Input
        placeholder="Cari layanan..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
      <div className="flex items-center gap-2 sm:ml-auto">
        <span className="text-muted-foreground text-sm">
          Baris per halaman
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border-input bg-background h-8 w-16 rounded-md border px-2 text-sm"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
