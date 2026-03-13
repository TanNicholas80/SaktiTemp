"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Plus } from "lucide-react";
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
import { LocationCard, type LocationCardData } from "@/components/shared/location-card";
import {
  LocationListToolbar,
  LocationListPagination,
} from "@/components/location";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingState } from "@/components/layout/loading-state";

export default function LocationListPage() {
  const router = useRouter();
  const [locations, setLocations] = React.useState<LocationCardData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(6);
  const [deleteLocation, setDeleteLocation] =
    React.useState<LocationCardData | null>(null);

  const fetchLocations = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/location");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setLocations(data);
    } catch {
      toast.error("Gagal memuat daftar lokasi");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filtered = React.useMemo(() => {
    if (!search.trim()) return locations;
    const q = search.toLowerCase().trim();
    return locations.filter(
      (l) =>
        l.locationCity.toLowerCase().includes(q) ||
        l.locationAddress.toLowerCase().includes(q)
    );
  }, [locations, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  async function handleDelete() {
    if (!deleteLocation) return;
    try {
      const res = await fetch(
        `/api/admin/location/${deleteLocation.locationId}`,
        { method: "DELETE" }
      );
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Gagal menghapus lokasi");
        return;
      }

      toast.success("Lokasi berhasil dihapus");
      setDeleteLocation(null);
      fetchLocations();
    } catch {
      toast.error("Gagal menghapus lokasi");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lokasi Kantor"
        description="Kelola lokasi kantor pusat dan cabang"
        action={
          <Button asChild>
            <Link href="/admin/location/new">
              <Plus className="size-4" />
              Tambah Lokasi
            </Link>
          </Button>
        }
      />

      {loading ? (
        <LoadingState />
      ) : locations.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPin className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Belum ada lokasi</EmptyTitle>
            <EmptyDescription>
              Tambahkan lokasi kantor pertama untuk memulai
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/admin/location/new">
                <Plus className="size-4" />
                Tambah Lokasi
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <LocationListToolbar
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
                {paginated.map((location) => (
                  <LocationCard
                    key={location.locationId}
                    location={location}
                    onEdit={(l) =>
                      router.push(`/admin/location/${l.locationId}/edit`)
                    }
                    onDelete={setDeleteLocation}
                  />
                ))}
              </div>

              <LocationListPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}

      <DeleteConfirmDialog
        open={!!deleteLocation}
        onOpenChange={(o) => !o && setDeleteLocation(null)}
        title="Hapus Lokasi"
        description={`Apakah Anda yakin ingin menghapus lokasi "${deleteLocation?.locationCity}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
