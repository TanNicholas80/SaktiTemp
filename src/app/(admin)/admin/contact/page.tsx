"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Plus } from "lucide-react";
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
import { createContactColumns } from "./columns";
import type { ContactRowData } from "./columns";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function ContactListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<ContactRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] = React.useState<ContactRowData | null>(
    null
  );

  const columns = React.useMemo(
    () =>
      createContactColumns({
        onEdit: (row) => router.push(`/admin/contact/${row.contactId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data kontak");
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
      const res = await fetch(`/api/admin/contact/${deleteItem.contactId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus kontak");
        return;
      }

      toast.success("Kontak berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus kontak");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kontak"
        description="Kelola informasi kontak perusahaan"
        action={
          <Button asChild>
            <Link href="/admin/contact/new">
              <Plus className="size-4" />
              Tambah Kontak
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
              <Phone className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada kontak</EmptyTitle>
            <EmptyDescription>
              Tambahkan kontak pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/contact/new">
                <Plus className="size-4" />
                Tambah Kontak
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
              searchKey="contactLabel"
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
        title="Hapus Kontak"
        description={`Apakah Anda yakin ingin menghapus "${deleteItem?.contactLabel}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
