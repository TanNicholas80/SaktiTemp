"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import { BlogCard, type BlogCardData } from "@/components/shared/blog-card";
import {
  BlogListToolbar,
  BlogListPagination,
} from "@/components/blog";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import { FileTextIcon } from "lucide-react";

export default function BlogListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = React.useState<BlogCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deleteBlog, setDeleteBlog] = React.useState<BlogCardData | null>(null);

  const fetchBlogs = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setBlogs(data);
    } catch {
      toast.error("Gagal memuat daftar blog");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return blogs;
    const q = search.toLowerCase().trim();
    return blogs.filter(
      (b) =>
        b.blogTitle.toLowerCase().includes(q) ||
        b.blogSlug.toLowerCase().includes(q)
    );
  }, [blogs, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deleteBlog) return;
    try {
      const res = await fetch(`/api/admin/blog/${deleteBlog.blogSlug}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus blog");
        return;
      }

      toast.success("Blog berhasil dihapus");
      setDeleteBlog(null);
      fetchBlogs();
    } catch {
      toast.error("Gagal menghapus blog");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Blog"
        description="Kelola artikel blog"
        action={
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="size-4" />
              Tambah Blog
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : blogs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada blog</EmptyTitle>
            <EmptyDescription>
              Tambahkan artikel pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/blog/new">
                <Plus className="size-4" />
                Tambah Blog
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <BlogListToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            pageSize={pageSize}
            onPageSizeChange={(v) => {
              setPageSize(v);
              setPage(1);
            }}
          />

          {paginated.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground text-sm">
              Tidak ada hasil
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((blog) => (
                  <BlogCard
                    key={blog.blogId}
                    blog={blog}
                    onEdit={(b) =>
                      router.push(`/admin/blog/${b.blogSlug}/edit`)
                    }
                    onDelete={setDeleteBlog}
                  />
                ))}
              </div>

              <BlogListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteBlog}
        onOpenChange={(o) => !o && setDeleteBlog(null)}
        title="Hapus Blog"
        description={`Apakah Anda yakin ingin menghapus blog "${deleteBlog?.blogTitle}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
