"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Share2, Plus } from "lucide-react";
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
import { createSocialMediaColumns } from "./columns";
import type { SocialMediaRowData } from "./columns";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function SocialMediaListPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<SocialMediaRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteItem, setDeleteItem] =
    React.useState<SocialMediaRowData | null>(null);

  const columns = React.useMemo(
    () =>
      createSocialMediaColumns({
        onEdit: (row) =>
          router.push(`/admin/social-media/${row.socialMediaId}/edit`),
        onDelete: setDeleteItem,
      }),
    [router]
  );

  const fetchData = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/social-media");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data media sosial");
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
        `/api/admin/social-media/${deleteItem.socialMediaId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus media sosial");
        return;
      }

      toast.success("Media sosial berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus media sosial");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Sosial"
        description="Kelola tautan media sosial perusahaan"
        action={
          <Button asChild>
            <Link href="/admin/social-media/new">
              <Plus className="size-4" />
              Tambah Media Sosial
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
              <Share2 className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada media sosial</EmptyTitle>
            <EmptyDescription>
              Tambahkan media sosial pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/social-media/new">
                <Plus className="size-4" />
                Tambah Media Sosial
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
              searchKey="platformName"
              searchPlaceholder="Cari platform..."
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
        title="Hapus Media Sosial"
        description={`Apakah Anda yakin ingin menghapus "${deleteItem?.platformName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
