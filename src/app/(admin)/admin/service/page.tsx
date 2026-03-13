"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, Plus } from "lucide-react";
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
import { ServiceCard, type ServiceCardData } from "@/components/shared/service-card";
import {
  ServiceListToolbar,
  ServiceListPagination,
} from "@/components/service";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function ServiceListPage() {
  const router = useRouter();
  const [services, setServices] = React.useState<ServiceCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deleteService, setDeleteService] =
    React.useState<ServiceCardData | null>(null);

  const fetchServices = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/service");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setServices(data);
    } catch {
      toast.error("Gagal memuat daftar layanan");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase().trim();
    return services.filter(
      (s) =>
        s.serviceName.toLowerCase().includes(q) ||
        s.serviceDescription.toLowerCase().includes(q)
    );
  }, [services, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deleteService) return;
    try {
      const res = await fetch(
        `/api/admin/service/${deleteService.serviceId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus layanan");
        return;
      }

      toast.success("Layanan berhasil dihapus");
      setDeleteService(null);
      fetchServices();
    } catch {
      toast.error("Gagal menghapus layanan");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Layanan"
        description="Kelola layanan jasa temper dan order kaca"
        action={
          <Button asChild>
            <Link href="/admin/service/new">
              <Plus className="size-4" />
              Tambah Layanan
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : services.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Wrench className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada layanan</EmptyTitle>
            <EmptyDescription>
              Tambahkan layanan pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/service/new">
                <Plus className="size-4" />
                Tambah Layanan
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <ServiceListToolbar
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
              <div className="grid gap-6 sm:grid-cols-2">
                {paginated.map((svc) => (
                  <ServiceCard
                    key={svc.serviceId}
                    service={svc}
                    onEdit={(s) =>
                      router.push(`/admin/service/${s.serviceId}/edit`)
                    }
                    onDelete={setDeleteService}
                  />
                ))}
              </div>

              <ServiceListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteService}
        onOpenChange={(o) => !o && setDeleteService(null)}
        title="Hapus Layanan"
        description={`Apakah Anda yakin ingin menghapus layanan "${deleteService?.serviceName}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
