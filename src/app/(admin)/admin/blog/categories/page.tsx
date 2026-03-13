"use client";

import * as React from "react";
import { FolderOpen, Plus } from "lucide-react";
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
import {
  createCategoryColumns,
  type CategoryBlog,
} from "./columns";
import {
  CategoryFormDialog,
  type CategoryFormValues,
} from "@/components/blog";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import {
  createCategoryBlogSchema,
  updateCategoryBlogSchema,
} from "@/lib/validations/category-blog";

export default function CategoriesBlogPage() {
  const [categories, setCategories] = React.useState<CategoryBlog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editCat, setEditCat] = React.useState<CategoryBlog | null>(null);
  const [deleteCat, setDeleteCat] = React.useState<CategoryBlog | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {}
  );

  const columns = React.useMemo(
    () =>
      createCategoryColumns({
        onEdit: (cat) => {
          setEditCat(cat);
          setFormErrors({});
        },
        onDelete: setDeleteCat,
      }),
    []
  );

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/categories");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Gagal memuat daftar kategori");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function handleCreate(values: CategoryFormValues) {
    setFormErrors({});

    const parsed = createCategoryBlogSchema.safeParse({
      categoryBlogName: values.categoryBlogName,
      categoryBlogSlug: values.categoryBlogSlug || undefined,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal membuat kategori");
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

      toast.success("Kategori berhasil dibuat");
      setCreateOpen(false);
      fetchCategories();
    } catch {
      toast.error("Gagal membuat kategori");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: CategoryFormValues) {
    if (!editCat) return;
    setFormErrors({});

    const parsed = updateCategoryBlogSchema.safeParse({
      categoryBlogName: values.categoryBlogName,
      categoryBlogSlug: values.categoryBlogSlug || undefined,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? "");
        if (path && !errors[path]) errors[path] = issue.message;
      }
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/admin/blog/categories/${editCat.categoryBlogId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal memperbarui kategori");
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

      toast.success("Kategori berhasil diperbarui");
      setEditCat(null);
      fetchCategories();
    } catch {
      toast.error("Gagal memperbarui kategori");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteCat) return;
    try {
      const res = await fetch(
        `/api/admin/blog/categories/${deleteCat.categoryBlogId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus kategori");
        return;
      }

      toast.success("Kategori berhasil dihapus");
      setDeleteCat(null);
      fetchCategories();
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Blog"
        description="Kelola kategori untuk blog"
        action={
          <Button
            onClick={() => {
              setCreateOpen(true);
              setFormErrors({});
            }}
          >
            <Plus className="size-4" />
            Tambah Kategori
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : categories.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada kategori</EmptyTitle>
            <EmptyDescription>
              Tambahkan kategori pertama untuk memulai
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
              Tambah Kategori
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          renderToolbar={(table) => (
            <DataTableToolbar
              table={table}
              searchKey="categoryBlogName"
              searchPlaceholder="Cari nama kategori..."
            />
          )}
          renderPagination={(table) => (
            <div className="py-4">
              <DataTablePagination table={table} />
            </div>
          )}
        />
      )}

      <CategoryFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tambah Kategori"
        defaultValues={{ categoryBlogName: "", categoryBlogSlug: "" }}
        onSubmit={handleCreate}
        submitting={submitting}
        errors={formErrors}
      />

      <CategoryFormDialog
        open={!!editCat}
        onOpenChange={(o) => !o && setEditCat(null)}
        title="Edit Kategori"
        defaultValues={
          editCat
            ? {
                categoryBlogName: editCat.categoryBlogName,
                categoryBlogSlug: editCat.categoryBlogSlug,
              }
            : { categoryBlogName: "", categoryBlogSlug: "" }
        }
        onSubmit={handleUpdate}
        submitting={submitting}
        errors={formErrors}
      />

      <DeleteConfirmDialog
        open={!!deleteCat}
        onOpenChange={(o) => !o && setDeleteCat(null)}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteCat?.categoryBlogName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
