"use client";

import * as React from "react";
import { Layers, Plus } from "lucide-react";
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
  createPortofolioTypeColumns,
  type PortofolioType,
} from "./columns";
import {
  PortofolioTypeFormDialog,
  type PortofolioTypeFormValues,
} from "@/components/portofolio";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createPortofolioTypeSchema,
  updatePortofolioTypeSchema,
} from "@/lib/validations/portofolio-type";

export default function PortofolioTypesPage() {
  const [types, setTypes] = React.useState<PortofolioType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<PortofolioType | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<PortofolioType | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const columns = React.useMemo(
    () =>
      createPortofolioTypeColumns({
        onEdit: (item) => {
          setEditItem(item);
          setFormErrors({});
        },
        onDelete: setDeleteItem,
      }),
    []
  );

  const fetchTypes = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/portofolio/types");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setTypes(data);
    } catch {
      toast.error("Gagal memuat daftar tipe portofolio");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  async function handleCreate(values: PortofolioTypeFormValues) {
    setFormErrors({});

    const parsed = createPortofolioTypeSchema.safeParse({
      portofolioTypeName: values.portofolioTypeName,
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
      const res = await fetch("/api/admin/portofolio/types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat tipe");
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

      toast.success("Tipe portofolio berhasil dibuat");
      setCreateOpen(false);
      fetchTypes();
    } catch {
      toast.error("Gagal membuat tipe");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: PortofolioTypeFormValues) {
    if (!editItem) return;
    setFormErrors({});

    const parsed = updatePortofolioTypeSchema.safeParse({
      portofolioTypeName: values.portofolioTypeName,
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
        `/api/admin/portofolio/types/${editItem.portofolioTypeId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui tipe");
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

      toast.success("Tipe portofolio berhasil diperbarui");
      setEditItem(null);
      fetchTypes();
    } catch {
      toast.error("Gagal memperbarui tipe");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(
        `/api/admin/portofolio/types/${deleteItem.portofolioTypeId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus tipe");
        return;
      }

      toast.success("Tipe portofolio berhasil dihapus");
      setDeleteItem(null);
      fetchTypes();
    } catch {
      toast.error("Gagal menghapus tipe");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tipe Portofolio"
        description="Kelola tipe portofolio (aplikasi penggunaan) untuk ditampilkan di detail produk"
        action={
          <Button
            onClick={() => {
              setCreateOpen(true);
              setFormErrors({});
            }}
          >
            <Plus className="size-4" />
            Tambah Tipe
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : types.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Layers className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada tipe portofolio</EmptyTitle>
            <EmptyDescription>
              Tambahkan tipe seperti Gedung perkantoran, Hotel & apartemen, dll.
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
              Tambah Tipe
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={columns}
          data={types}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="portofolioTypeName"
              searchPlaceholder="Cari nama tipe..."
            />
          )}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      <PortofolioTypeFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tambah Tipe Portofolio"
        defaultValues={{
          portofolioTypeName: "",
        }}
        onSubmit={handleCreate}
        submitting={submitting}
        errors={formErrors}
      />

      <PortofolioTypeFormDialog
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        title="Edit Tipe Portofolio"
        defaultValues={
          editItem
            ? { portofolioTypeName: editItem.portofolioTypeName }
            : { portofolioTypeName: "" }
        }
        onSubmit={handleUpdate}
        submitting={submitting}
        errors={formErrors}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={(o) => !o && setDeleteItem(null)}
        title="Hapus Tipe Portofolio"
        description={`Apakah Anda yakin ingin menghapus tipe "${deleteItem?.portofolioTypeName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
