"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, DataTablePagination, DataTableToolbar } from "@/components/data-table";

import {
  createModificationColumns,
  type ModificationRow,
} from "./columns";

export default function PriceListModificationPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<ModificationRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] = React.useState<ModificationRow | null>(
    null
  );

  const columns = React.useMemo(
    () =>
      createModificationColumns({
        onEdit: (row) =>
          router.push(
            `/admin/price-list/modification/${row.modificationId}/edit`
          ),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/modifications");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat pricelist modifikasi");
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
        `/api/admin/modifications/${deleteItem.modificationId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus modifikasi");
        return;
      }
      toast.success("Modifikasi berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus modifikasi");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricelist Modifikasi"
        description="Kelola opsi modifikasi kaca (harga per sisi per ketebalan)"
        action={
          <Button asChild>
            <Link href="/admin/price-list/modification/new">
              <Plus className="size-4" />
              Tambah modifikasi
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="name"
              searchPlaceholder="Cari nama modifikasi..."
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
        title="Hapus modifikasi"
        description={`Apakah Anda yakin ingin menghapus modifikasi \"${deleteItem?.name}\"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
