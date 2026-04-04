"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

import { toastApiValidationError } from "@/lib/utils/toast-form";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import {
  DataTable,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/data-table";
import { createCarouselColumns } from "./columns";
import type { CarouselRowData } from "@/components/carousel";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function CarouselListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<CarouselRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] =
    React.useState<CarouselRowData | null>(null);

  const columns = React.useMemo(
    () =>
      createCarouselColumns({
        onEdit: (row) =>
          router.push(`/admin/carousel/${row.carouselId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/carousel");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data carousel");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(`/api/admin/carousel/${deleteItem.carouselId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus slide");
        return;
      }

      toast.success("Slide berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus slide");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Carousel"
        description="Kelola slide carousel homepage"
        action={
          <Button asChild>
            <Link href="/admin/carousel/new">
              <Plus className="size-4" />
              Tambah Slide
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SlidersHorizontal className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada slide carousel</EmptyTitle>
            <EmptyDescription>
              Tambahkan slide pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/carousel/new">
                <Plus className="size-4" />
                Tambah Slide
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="carouselHeading"
              searchPlaceholder="Cari heading..."
            />
          )}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={(o) => !o && setDeleteItem(null)}
        title="Hapus Slide Carousel"
        description={`Apakah Anda yakin ingin menghapus slide "${deleteItem?.carouselHeading}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
