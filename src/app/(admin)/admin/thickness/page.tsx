"use client";

import * as React from "react";
import { Ruler, Plus } from "lucide-react";
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
import { DataTable, DataTablePagination } from "@/components/data-table";
import {
  createThicknessColumns,
  type ThicknessRow,
} from "./columns";
import {
  ThicknessFormDialog,
  type ThicknessFormValues,
} from "@/components/thickness/thickness-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createThicknessSchema,
  updateThicknessSchema,
} from "@/lib/validations/thickness";

export default function ThicknessPage() {
  const [items, setItems] = React.useState<ThicknessRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<ThicknessRow | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<ThicknessRow | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const columns = React.useMemo(
    () =>
      createThicknessColumns({
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
      const res = await fetch("/api/admin/thickness");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Gagal memuat data ketebalan");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreate(values: ThicknessFormValues) {
    setFormErrors({});

    const parsed = createThicknessSchema.safeParse(values);
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
      const res = await fetch("/api/admin/thickness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal membuat ketebalan");
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

      toast.success("Ketebalan berhasil dibuat");
      setCreateOpen(false);
      fetchData();
    } catch {
      toast.error("Gagal membuat ketebalan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: ThicknessFormValues) {
    if (!editItem) return;
    setFormErrors({});

    const parsed = updateThicknessSchema.safeParse(values);
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
        `/api/admin/thickness/${editItem.thicknessId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal memperbarui ketebalan");
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

      toast.success("Ketebalan berhasil diperbarui");
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("Gagal memperbarui ketebalan");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteItem) return;
    try {
      const res = await fetch(
        `/api/admin/thickness/${deleteItem.thicknessId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus ketebalan");
        return;
      }

      toast.success("Ketebalan berhasil dihapus");
      setDeleteItem(null);
      fetchData();
    } catch {
      toast.error("Gagal menghapus ketebalan");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ketebalan"
        description="Kelola ketebalan master untuk produk kaca (bilangan bulat atau desimal, mis. 5, 6,5, 8 mm)"
        action={
          <Button
            onClick={() => {
              setCreateOpen(true);
              setFormErrors({});
            }}
          >
            <Plus className="size-4" />
            Tambah Ketebalan
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Ruler className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada ketebalan</EmptyTitle>
            <EmptyDescription>
              Tambahkan ketebalan seperti 5 mm, 6,5 mm, 8 mm (titik atau koma untuk desimal).
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
              Tambah Ketebalan
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      <ThicknessFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tambah Ketebalan"
        defaultValues={{ thicknessValue: 5, thicknessUnit: "mm" }}
        onSubmit={handleCreate}
        submitting={submitting}
        errors={formErrors}
      />

      <ThicknessFormDialog
        open={!!editItem}
        onOpenChange={(o) => !o && setEditItem(null)}
        title="Edit Ketebalan"
        defaultValues={
          editItem
            ? {
                thicknessValue: editItem.thicknessValue,
                thicknessUnit: editItem.thicknessUnit,
              }
            : { thicknessValue: 5, thicknessUnit: "mm" }
        }
        onSubmit={handleUpdate}
        submitting={submitting}
        errors={formErrors}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onOpenChange={(o) => !o && setDeleteItem(null)}
        title="Hapus Ketebalan"
        description={`Apakah Anda yakin ingin menghapus ketebalan ${deleteItem?.thicknessValue} ${deleteItem?.thicknessUnit}? Produk yang menggunakan ketebalan ini akan terputus relasinya.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
