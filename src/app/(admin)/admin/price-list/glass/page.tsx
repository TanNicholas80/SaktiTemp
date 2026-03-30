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

import { createGlassTypeColumns, type GlassTypeRow } from "./types/columns";
import { createGlassPriceColumns, type GlassPriceRow } from "./prices/columns";

type ViewMode = "types" | "prices";

export default function PriceListGlassPage() {
  const router = useRouter();
  const [view, setView] = React.useState<ViewMode>("types");

  const [types, setTypes] = React.useState<GlassTypeRow[]>([]);
  const [loadingTypes, setLoadingTypes] = React.useState(true);
  const [deleteType, setDeleteType] = React.useState<GlassTypeRow | null>(null);

  const [prices, setPrices] = React.useState<GlassPriceRow[]>([]);
  const [loadingPrices, setLoadingPrices] = React.useState(false);
  const [deletePrice, setDeletePrice] = React.useState<GlassPriceRow | null>(
    null
  );

  const typeColumns = React.useMemo(
    () =>
      createGlassTypeColumns({
        onEdit: (row) => router.push(`/admin/price-list/glass/types/${row.glassTypeId}/edit`),
        onDelete: setDeleteType,
      }),
    [router]
  );

  const fetchTypes = React.useCallback(async () => {
    setLoadingTypes(true);
    try {
      const res = await fetch("/api/admin/glass-types");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setTypes(data);
    } catch {
      toast.error("Gagal memuat master tipe kaca");
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  const priceColumns = React.useMemo(
    () =>
      createGlassPriceColumns({
        onEdit: (row) =>
          router.push(
            `/admin/price-list/glass/prices/${row.glassPricesId}/edit`
          ),
        onDelete: setDeletePrice,
      }),
    [router]
  );

  const fetchPrices = React.useCallback(async () => {
    setLoadingPrices(true);
    try {
      const res = await fetch("/api/admin/glass-prices");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setPrices(data);
    } catch {
      toast.error("Gagal memuat pricelist kaca");
    } finally {
      setLoadingPrices(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  React.useEffect(() => {
    if (view === "prices") {
      fetchPrices();
    }
  }, [view, fetchPrices]);

  async function handleDeleteType() {
    if (!deleteType) return;
    try {
      const res = await fetch(`/api/admin/glass-types/${deleteType.glassTypeId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus tipe kaca");
        return;
      }
      toast.success("Tipe kaca berhasil dihapus");
      setDeleteType(null);
      fetchTypes();
    } catch {
      toast.error("Gagal menghapus tipe kaca");
    }
  }

  async function handleDeletePrice() {
    if (!deletePrice) return;
    try {
      const res = await fetch(
        `/api/admin/glass-prices/${deletePrice.glassPricesId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus pricelist kaca");
        return;
      }
      toast.success("Pricelist kaca berhasil dihapus");
      setDeletePrice(null);
      fetchPrices();
    } catch {
      toast.error("Gagal menghapus pricelist kaca");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricelist Kaca"
        description="Kelola master tipe kaca dan pricelist kaca"
        action={
          view === "types" ? (
            <Button asChild>
              <Link href="/admin/price-list/glass/types/new">
                <Plus className="size-4" />
                Tambah Tipe Kaca
              </Link>
            </Button>
          ) : (
            <Button asChild disabled={types.length === 0} title={types.length === 0 ? "Buat minimal 1 tipe kaca dulu" : undefined}>
              <Link href="/admin/price-list/glass/prices/new">
                <Plus className="size-4" />
                Tambah Harga Kaca
              </Link>
            </Button>
          )
        }
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant={view === "types" ? "default" : "outline"}
          onClick={() => setView("types")}
        >
          Glass Types
        </Button>
        <Button
          type="button"
          variant={view === "prices" ? "default" : "outline"}
          onClick={() => setView("prices")}
        >
          Glass Prices
        </Button>
      </div>

      {view === "types" ? (
        loadingTypes ? (
          <LoadingState />
        ) : (
          <DataTable
            columns={typeColumns}
            data={types}
            renderToolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchKey="glassTypeName"
                searchPlaceholder="Cari tipe kaca..."
              />
            )}
            renderPagination={(table) => (
              <div className="py-4">
                <DataTablePagination table={table} />
              </div>
            )}
          />
        )
      ) : (
        loadingPrices ? (
          <LoadingState />
        ) : (
          <DataTable
            columns={priceColumns}
            data={prices}
            renderToolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchKey="variant"
                searchPlaceholder="Cari variant..."
              />
            )}
            renderPagination={(table) => (
              <div className="py-4">
                <DataTablePagination table={table} />
              </div>
            )}
          />
        )
      )}

      <DeleteConfirmDialog
        open={!!deleteType}
        onOpenChange={(o) => !o && setDeleteType(null)}
        title="Hapus Tipe Kaca"
        description={`Apakah Anda yakin ingin menghapus tipe kaca \"${deleteType?.glassTypeName}\"? Pastikan tidak ada pricelist yang masih menggunakannya.`}
        onConfirm={handleDeleteType}
      />

      <DeleteConfirmDialog
        open={!!deletePrice}
        onOpenChange={(o) => !o && setDeletePrice(null)}
        title="Hapus Pricelist Kaca"
        description={`Apakah Anda yakin ingin menghapus pricelist kaca variant \"${deletePrice?.variant}\"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDeletePrice}
      />
    </div>
  );
}

