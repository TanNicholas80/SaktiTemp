"use client";

import * as React from "react";
import { Award, Plus } from "lucide-react";
import { toast } from "sonner";

import { toastApiValidationError, toastClientValidationErrors } from "@/lib/utils/toast-form";

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
import {
  createProductExcellenceColumns,
  type ProductExcellenceRow,
} from "./columns";
import {
  ProductExcellenceFormDialog,
  type ProductExcellenceFormValues,
} from "@/components/product";
import type { ProductOption } from "@/components/product";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createProductExcellenceSchema,
  updateProductExcellenceSchema,
} from "@/lib/validations/product-excellence";

export default function ProductExcellencePage() {
  const [items, setItems] = React.useState<ProductExcellenceRow[]>([]);
  const [products, setProducts] = React.useState<ProductOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<ProductExcellenceRow | null>(
    null
  );
  const [deleteItem, setDeleteItem] =
    React.useState<ProductExcellenceRow | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const columns = React.useMemo(
    () =>
      createProductExcellenceColumns({
        onEdit: (row) => {
          setEditItem(row);
          setFormErrors({});
        },
        onDelete: setDeleteItem,
      }),
    []
  );

  const fetchData = React.useCallback(async () => {
    try {
      const [itemsRes, productsRes] = await Promise.all([
        fetch("/api/admin/product/excellence"),
        fetch("/api/admin/product"),
      ]);
      if (!itemsRes.ok) throw new Error("Gagal mengambil data keunggulan");
      if (!productsRes.ok) throw new Error("Gagal mengambil data produk");
      const itemsData = await itemsRes.json();
      const productsData = await productsRes.json();
      setItems(itemsData);
      setProducts(
        productsData.map((p: { productId: string; productName: string; productSlug: string }) => ({
          productId: p.productId,
          productName: p.productName,
          productSlug: p.productSlug,
        }))
      );
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreate(values: ProductExcellenceFormValues) {
    setFormErrors({});

    const parsed = createProductExcellenceSchema.safeParse({
      productId: values.productId,
      productExellenceDescription: values.productExellenceDescription,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);

      toastClientValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/product/excellence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat keunggulan");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("Keunggulan berhasil dibuat");
      setCreateOpen(false);
      fetchData();
    } catch {
      toast.error("Gagal membuat keunggulan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: ProductExcellenceFormValues) {
    if (!editItem) return;
    setFormErrors({});

    const parsed = updateProductExcellenceSchema.safeParse({
      productExellenceDescription: values.productExellenceDescription,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);

      toastClientValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/product/excellence/${editItem.productExellenceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui keunggulan");
        if (json.details?.fieldErrors) {
          setFormErrors(
            Object.fromEntries(
              Object.entries(json.details.fieldErrors).map(([k, v]) => [
                k,
                Array.isArray(v) ? v[0] : String(v),
              ])
            )
          );
        }
        return;
      }

      toast.success("Keunggulan berhasil diperbarui");
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("Gagal memperbarui keunggulan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(
        `/api/admin/product/excellence/${deleteItem.productExellenceId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus keunggulan");
        return;
      }

      toast.success("Keunggulan berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus keunggulan");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keunggulan Product"
        description="Kelola keunggulan untuk tiap product"
        action={
          <Button
            onClick={() => {
              setCreateOpen(true);
              setFormErrors({});
            }}
          >
            <Plus className="size-4" />
            Tambah Keunggulan
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Award className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada keunggulan</EmptyTitle>
            <EmptyDescription>
              Tambahkan keunggulan pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => {
                setCreateOpen(true);
                setFormErrors({});
              }}
            >
              <Plus className="size-4" />
              Tambah Keunggulan
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
              searchKey="productName"
              searchPlaceholder="Cari nama produk..."
            />
          )}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      <ProductExcellenceFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tambah Keunggulan"
        defaultValues={{
          productId: "",
          productExellenceDescription: "",
        }}
        onSubmit={handleCreate}
        submitting={submitting}
        errors={formErrors}
        products={products}
      />

      <ProductExcellenceFormDialog
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        title="Edit Keunggulan"
        defaultValues={
          editItem
            ? {
                productId: editItem.productId ?? "",
                productExellenceDescription: editItem.productExellenceDescription,
              }
            : { productId: "", productExellenceDescription: "" }
        }
        onSubmit={handleUpdate}
        submitting={submitting}
        errors={formErrors}
        products={products}
        disableProductSelect
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={(o) => !o && setDeleteItem(null)}
        title="Hapus Keunggulan"
        description={`Apakah Anda yakin ingin menghapus keunggulan "${deleteItem?.productExellenceDescription}" untuk ${deleteItem?.productName ?? "produk ini"}?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
