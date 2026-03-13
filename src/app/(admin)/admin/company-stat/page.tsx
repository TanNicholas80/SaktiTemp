"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Plus } from "lucide-react";
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
import { createCompanyStatColumns } from "./columns";
import type { CompanyStatRowData } from "./columns";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function CompanyStatListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<CompanyStatRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] =
    React.useState<CompanyStatRowData | null>(null);

  const columns = React.useMemo(
    () =>
      createCompanyStatColumns({
        onEdit: (row) =>
          router.push(`/admin/company-stat/${row.companyStatId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/company-stat");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data statistik perusahaan");
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
        `/api/admin/company-stat/${deleteItem.companyStatId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus statistik");
        return;
      }

      toast.success("Statistik berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus statistik");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistik Perusahaan"
        description="Kelola statistik perusahaan (tahun pengalaman, proyek, dll)"
        action={
          <Button asChild>
            <Link href="/admin/company-stat/new">
              <Plus className="size-4" />
              Tambah Statistik
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
              <BarChart3 className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada statistik</EmptyTitle>
            <EmptyDescription>
              Tambahkan statistik pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/company-stat/new">
                <Plus className="size-4" />
                Tambah Statistik
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
              searchKey="label"
              searchPlaceholder="Cari label..."
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
        title="Hapus Statistik"
        description={`Apakah Anda yakin ingin menghapus "${deleteItem?.label}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
