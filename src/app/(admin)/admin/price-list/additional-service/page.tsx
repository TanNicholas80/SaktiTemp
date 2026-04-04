"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toastApiValidationError } from "@/lib/utils/toast-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { DataTable, DataTablePagination, DataTableToolbar } from "@/components/data-table";

import {
  createProcessingCategoryColumns,
  type ProcessingCategoryRow,
} from "./categories/columns";
import {
  createProcessingPriceColumns,
  type ProcessingPriceRow,
} from "./prices/columns";

type ViewMode = "categories" | "prices";

export default function PriceListAdditionalServicePage() {
  const router = useRouter();
  const [view, setView] = React.useState<ViewMode>("categories");

  const [categories, setCategories] = React.useState<ProcessingCategoryRow[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [deleteCategory, setDeleteCategory] =
    React.useState<ProcessingCategoryRow | null>(null);

  const [prices, setPrices] = React.useState<ProcessingPriceRow[]>([]);
  const [loadingPrices, setLoadingPrices] = React.useState(false);
  const [deletePrice, setDeletePrice] =
    React.useState<ProcessingPriceRow | null>(null);

  const categoryColumns = React.useMemo(
    () =>
      createProcessingCategoryColumns({
        onEdit: (row) =>
          router.push(
            `/admin/price-list/additional-service/categories/${row.processingCategoryId}/edit`
          ),
        onDelete: setDeleteCategory,
      }),
    [router]
  );

  const fetchCategories = React.useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch("/api/admin/processing-categories");
      if (!res.ok) throw new Error("Gagal");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Gagal memuat kategori layanan tambahan");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const priceColumns = React.useMemo(
    () =>
      createProcessingPriceColumns({
        onEdit: (row) =>
          router.push(
            `/admin/price-list/additional-service/prices/${row.processingPricesId}/edit`
          ),
        onDelete: setDeletePrice,
      }),
    [router]
  );

  const fetchPrices = React.useCallback(async () => {
    setLoadingPrices(true);
    try {
      const res = await fetch("/api/admin/processing-prices");
      if (!res.ok) throw new Error("Gagal");
      const data = await res.json();
      setPrices(data);
    } catch {
      toast.error("Gagal memuat pricelist layanan tambahan");
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    if (view === "prices") {
      fetchPrices();
    }
  }, [view, fetchPrices]);

  async function handleDeleteCategory() {
    if (!deleteCategory) return;
    try {
      const res = await fetch(
        `/api/admin/processing-categories/${deleteCategory.processingCategoryId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus kategori");
        return;
      }
      toast.success("Kategori berhasil dihapus");
      setDeleteCategory(null);
      fetchCategories();
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  }

  async function handleDeletePrice() {
    if (!deletePrice) return;
    try {
      const res = await fetch(
        `/api/admin/processing-prices/${deletePrice.processingPricesId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus pricelist");
        return;
      }
      toast.success("Pricelist berhasil dihapus");
      setDeletePrice(null);
      fetchPrices();
    } catch {
      toast.error("Gagal menghapus pricelist");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricelist Layanan Tambahan"
        description="Kelola kategori proses dan harga pengolahan kaca"
        action={
          view === "categories" ? (
            <Button asChild>
              <Link href="/admin/price-list/additional-service/categories/new">
                <Plus className="size-4" />
                Tambah kategori
              </Link>
            </Button>
          ) : categories.length === 0 ? (
            <Button
              type="button"
              disabled
              title="Buat minimal satu kategori layanan tambahan dulu"
            >
              <Plus className="size-4" />
              Tambah harga
            </Button>
          ) : (
            <Button asChild>
              <Link href="/admin/price-list/additional-service/prices/new">
                <Plus className="size-4" />
                Tambah harga
              </Link>
            </Button>
          )
        }
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={view === "categories" ? "default" : "outline"}
          onClick={() => setView("categories")}
        >
          Kategori
        </Button>
        <Button
          type="button"
          variant={view === "prices" ? "default" : "outline"}
          onClick={() => setView("prices")}
        >
          Harga proses
        </Button>
      </div>

      {view === "categories" ? (
        loadingCategories ? (
          <LoadingState />
        ) : (
          <DataTable
            columns={categoryColumns}
            data={categories}
            renderToolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchKey="categoryName"
                searchPlaceholder="Cari kategori..."
              />
            )}
            renderPagination={(table) => (
              <div className="py-4">
                <DataTablePagination table={table} />
              </div>
            )}
          />
        )
      ) : loadingPrices ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={priceColumns}
          data={prices}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="serviceName"
              searchPlaceholder="Cari layanan..."
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
        open={!!deleteCategory}
        onOpenChange={(o) => !o && setDeleteCategory(null)}
        title="Hapus kategori"
        description={`Apakah Anda yakin ingin menghapus kategori \"${deleteCategory?.categoryName}\"?`}
        onConfirm={handleDeleteCategory}
      />

      <DeleteConfirmDialog
        open={!!deletePrice}
        onOpenChange={(o) => !o && setDeletePrice(null)}
        title="Hapus pricelist"
        description={`Hapus layanan \"${deletePrice?.serviceName}\" pada kategori \"${deletePrice?.categoryName}\"?`}
        onConfirm={handleDeletePrice}
      />
    </div>
  );
}
