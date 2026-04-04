"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Plus } from "lucide-react";
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
import { ProductCard, type ProductCardData } from "@/components/shared/product-card";
import {
  ProductListToolbar,
  ProductListPagination,
} from "@/components/product";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = React.useState<ProductCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deleteProduct, setDeleteProduct] =
    React.useState<ProductCardData | null>(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/product");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setProducts(data);
    } catch {
      toast.error("Gagal memuat daftar produk");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.productSlug.toLowerCase().includes(q)
    );
  }, [products, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deleteProduct) return;
    try {
      const res = await fetch(
        `/api/admin/product/${deleteProduct.productSlug}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus produk");
        return;
      }

      toast.success("Produk berhasil dihapus");
      setDeleteProduct(null);
      fetchProducts();
    } catch {
      toast.error("Gagal menghapus produk");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Product"
        description="Kelola produk"
        action={
          <Button asChild>
            <Link href="/admin/product/new">
              <Plus className="size-4" />
              Tambah Product
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada produk</EmptyTitle>
            <EmptyDescription>
              Tambahkan produk pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/product/new">
                <Plus className="size-4" />
                Tambah Product
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <ProductListToolbar
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
                {paginated.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onEdit={(p) =>
                      router.push(`/admin/product/${p.productSlug}/edit`)
                    }
                    onDelete={setDeleteProduct}
                  />
                ))}
              </div>

              <ProductListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(o) => !o && setDeleteProduct(null)}
        title="Hapus Product"
        description={`Apakah Anda yakin ingin menghapus produk "${deleteProduct?.productName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
