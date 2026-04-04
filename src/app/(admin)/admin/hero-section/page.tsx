"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutPanelTop, Plus } from "lucide-react";
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
import { createHeroSectionColumns } from "./columns";
import type { HeroSectionRowData } from "./columns";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function HeroSectionListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<HeroSectionRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] =
    React.useState<HeroSectionRowData | null>(null);

  const columns = React.useMemo(
    () =>
      createHeroSectionColumns({
        onEdit: (row) =>
          router.push(`/admin/hero-section/${row.heroSectionId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/hero-section");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data hero section");
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
      const res = await fetch(
        `/api/admin/hero-section/${deleteItem.heroSectionId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus hero section");
        return;
      }

      toast.success("Hero section berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus hero section");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Section"
        description="Kelola hero section per halaman (contact, products, home)"
        action={
          <Button asChild>
            <Link href="/admin/hero-section/new">
              <Plus className="size-4" />
              Tambah Hero Section
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
              <LayoutPanelTop className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada hero section</EmptyTitle>
            <EmptyDescription>
              Tambahkan hero section pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/hero-section/new">
                <Plus className="size-4" />
                Tambah Hero Section
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
              searchKey="pageKey"
              searchPlaceholder="Cari page key..."
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
        title="Hapus Hero Section"
        description={`Apakah Anda yakin ingin menghapus hero section "${deleteItem?.pageKey}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
