"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
import { PortofolioCard, type PortofolioCardData } from "@/components/shared/portofolio-card";
import {
  PortofolioListToolbar,
  PortofolioListPagination,
} from "@/components/portofolio";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";
import { Briefcase } from "lucide-react";

export default function PortofolioListPage() {
  const router = useRouter();
  const [portofolios, setPortofolios] = React.useState<PortofolioCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deletePortofolio, setDeletePortofolio] =
    React.useState<PortofolioCardData | null>(null);

  const fetchPortofolios = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/portofolio");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setPortofolios(data);
    } catch {
      toast.error("Gagal memuat daftar portofolio");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPortofolios();
  }, [fetchPortofolios]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return portofolios;
    const q = search.toLowerCase().trim();
    return portofolios.filter(
      (p) =>
        p.portofolioName.toLowerCase().includes(q) ||
        p.portofolioSlug.toLowerCase().includes(q) ||
        p.portofolioLocation.toLowerCase().includes(q)
    );
  }, [portofolios, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deletePortofolio) return;
    try {
      const res = await fetch(
        `/api/admin/portofolio/${deletePortofolio.portofolioSlug}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus portofolio");
        return;
      }

      toast.success("Portofolio berhasil dihapus");
      setDeletePortofolio(null);
      fetchPortofolios();
    } catch {
      toast.error("Gagal menghapus portofolio");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Portofolio"
        description="Kelola proyek portofolio"
        action={
          <Button asChild>
            <Link href="/admin/portofolio/new">
              <Plus className="size-4" />
              Tambah Portofolio
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : portofolios.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Briefcase className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada portofolio</EmptyTitle>
            <EmptyDescription>
              Tambahkan proyek pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/portofolio/new">
                <Plus className="size-4" />
                Tambah Portofolio
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <PortofolioListToolbar
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
                {paginated.map((portofolio) => (
                  <PortofolioCard
                    key={portofolio.portofolioId}
                    portofolio={portofolio}
                    onEdit={(p) =>
                      router.push(`/admin/portofolio/${p.portofolioSlug}/edit`)
                    }
                    onDelete={setDeletePortofolio}
                  />
                ))}
              </div>

              <PortofolioListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deletePortofolio}
        onOpenChange={(o) => !o && setDeletePortofolio(null)}
        title="Hapus Portofolio"
        description={`Apakah Anda yakin ingin menghapus portofolio "${deletePortofolio?.portofolioName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
