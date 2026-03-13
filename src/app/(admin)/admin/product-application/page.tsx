"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Plus } from "lucide-react";
import { toast } from "sonner";

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
import { createProductApplicationColumns } from "./columns";
import type { ProductApplicationRowData } from "./columns";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function ProductApplicationListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<ProductApplicationRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] =
    React.useState<ProductApplicationRowData | null>(null);

  const columns = React.useMemo(
    () =>
      createProductApplicationColumns({
        onEdit: (row) =>
          router.push(`/admin/product-application/${row.productApplicationId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/product-application");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data aplikasi produk");
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
        `/api/admin/product-application/${deleteItem.productApplicationId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus aplikasi produk");
        return;
      }

      toast.success("Aplikasi produk berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus aplikasi produk");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Aplikasi Produk"
        description="Kelola aplikasi kaca per produk (e.g. Glass Railing, Storefront)"
        action={
          <Button asChild>
            <Link href="/admin/product-application/new">
              <Plus className="size-4" />
              Tambah Aplikasi
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Layers className="text-muted-foreground size-12" />
            </EmptyMedia>
            <EmptyTitle>Tidak ada aplikasi produk</EmptyTitle>
            <EmptyDescription>
              Mulai dengan menambahkan aplikasi produk pertama.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/product-application/new">
                <Plus className="size-4" />
                Tambah Aplikasi
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
              searchKey="productApplicationName"
              searchPlaceholder="Cari aplikasi..."
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
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Hapus Aplikasi Produk"
        description={`Apakah Anda yakin ingin menghapus "${deleteItem?.productApplicationName}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
