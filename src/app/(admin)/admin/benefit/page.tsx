"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Plus } from "lucide-react";
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
import { BenefitCard, type BenefitCardData } from "@/components/shared/benefit-card";
import {
  BenefitListToolbar,
  BenefitListPagination,
} from "@/components/benefit";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function BenefitListPage() {
  const router = useRouter();
  const [benefits, setBenefits] = React.useState<BenefitCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deleteBenefit, setDeleteBenefit] =
    React.useState<BenefitCardData | null>(null);

  const fetchBenefits = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/benefit");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setBenefits(data);
    } catch {
      toast.error("Gagal memuat daftar keunggulan");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBenefits();
  }, [fetchBenefits]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return benefits;
    const q = search.toLowerCase().trim();
    return benefits.filter(
      (b) =>
        b.benefitName.toLowerCase().includes(q) ||
        b.benefitDescription.toLowerCase().includes(q)
    );
  }, [benefits, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deleteBenefit) return;
    try {
      const res = await fetch(
        `/api/admin/benefit/${deleteBenefit.benefitId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toastApiValidationError(json, "Gagal menghapus keunggulan");
        return;
      }

      toast.success("Keunggulan berhasil dihapus");
      setDeleteBenefit(null);
      fetchBenefits();
    } catch {
      toast.error("Gagal menghapus keunggulan");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keunggulan"
        description="Kelola keunggulan dan benefit perusahaan"
        action={
          <Button asChild>
            <Link href="/admin/benefit/new">
              <Plus className="size-4" />
              Tambah Keunggulan
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : benefits.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Star className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada keunggulan</EmptyTitle>
            <EmptyDescription>
              Tambahkan keunggulan pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/benefit/new">
                <Plus className="size-4" />
                Tambah Keunggulan
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <BenefitListToolbar
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
                {paginated.map((b) => (
                  <BenefitCard
                    key={b.benefitId}
                    benefit={b}
                    onEdit={(benefit) =>
                      router.push(`/admin/benefit/${benefit.benefitId}/edit`)
                    }
                    onDelete={setDeleteBenefit}
                  />
                ))}
              </div>

              <BenefitListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteBenefit}
        onOpenChange={(o) => !o && setDeleteBenefit(null)}
        title="Hapus Keunggulan"
        description={`Apakah Anda yakin ingin menghapus keunggulan "${deleteBenefit?.benefitName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
