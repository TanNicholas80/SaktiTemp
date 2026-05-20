"use client";

import { UploadImage } from "@/lib/upload-image";
import { MapPin, Building2, Calendar, Ruler, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProductOption } from "./types";

type PortofolioDetailPreviewProps = {
  portofolioName: string;
  portofolioAbout: string;
  portofolioClient: string;
  portofolioLocation: string;
  portofolioYear: number;
  portofolioAreaSize: number;
  portofolioAreaSizeUnit: string;
  imageUrl: string | null;
  products: ProductOption[];
  variant?: "full" | "compact";
};

export function PortofolioDetailPreview({
  portofolioName,
  portofolioAbout,
  portofolioClient,
  portofolioLocation,
  portofolioYear,
  portofolioAreaSize,
  portofolioAreaSizeUnit,
  imageUrl,
  products,
  variant = "full",
}: PortofolioDetailPreviewProps) {
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <p className="text-muted-foreground mb-2 text-xs font-medium">
          Preview detail portofolio
        </p>
        <div className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
            {imageUrl ? (
              <UploadImage
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
                Gambar
              </div>
            )}
          </div>
          <p className="line-clamp-2 font-medium">{portofolioName || "Nama Proyek"}</p>
          <p className="flex items-center gap-1 text-muted-foreground text-xs">
            <MapPin className="size-3" />
            {portofolioLocation || "Lokasi"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-medium">
        Preview tampilan detail portofolio
      </p>
      <div className="space-y-4">
        {/* Hero */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
          {imageUrl ? (
            <UploadImage
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="400px"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              Gambar proyek
            </div>
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col justify-start p-4 text-white">
            <div className="space-y-3">
              <p className="text-white/80 text-xs">
                Home &gt; Portfolio &gt;{" "}
                <span className="text-[#F9A826] font-medium">
                  {portofolioName || "Nama Proyek"}
                </span>
              </p>
              <div className="space-y-1">
                <h3 className="text-lg font-bold sm:text-xl">
                  {portofolioName || "Nama Proyek"}
                </h3>
                <p className="flex items-center gap-1.5 text-white/95 text-sm">
                  <MapPin className="size-4 shrink-0" />
                  {portofolioLocation || "Lokasi"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h4 className="mb-2 font-semibold">Tentang Proyek</h4>
          <p
            className="text-muted-foreground line-clamp-3 text-sm"
            dangerouslySetInnerHTML={{
              __html: portofolioAbout || "Deskripsi proyek",
            }}
          />
        </div>

        {/* Aplikasi Kaca */}
        {products.length > 0 && (
          <div>
            <h4 className="mb-2 font-semibold">Aplikasi Kaca Yang Digunakan</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {products.slice(0, 3).map((p) => (
                <div
                  key={p.productId}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {p.productImageUrl ? (
                      <UploadImage
                        src={p.productImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-medium text-sm">{p.productName}</p>
                    {p.productDescription && (
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {p.productDescription.replace(/<[^>]*>/g, "").slice(0, 80)}...
                      </p>
                    )}
                    {p.thicknesses && p.thicknesses.length > 0 && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {p.thicknesses[0]?.productThicknessValue}{" "}
                        {p.thicknesses[0]?.productThicknessUnit}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Detail */}
        <div className="overflow-hidden rounded-xl bg-primary px-5 py-5 text-white">
          <h4 className="mb-5 text-xl font-bold">Detail Proyek</h4>
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Building2 className="size-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-sm font-normal">Klien</p>
                <p className="text-white text-base font-semibold">
                  {portofolioClient || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <MapPin className="size-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-sm font-normal">Location</p>
                <p className="text-white text-base font-semibold">
                  {portofolioLocation || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Calendar className="size-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-sm font-normal">Tahun</p>
                <p className="text-white text-base font-semibold">
                  {portofolioYear || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Ruler className="size-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-sm font-normal">Luas Area</p>
                <p className="text-white text-base font-semibold">
                  {portofolioAreaSize
                    ? `${portofolioAreaSize.toLocaleString("id-ID")} ${portofolioAreaSizeUnit}`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 border-t border-white/20 pt-5">
            <Button
              size="sm"
              className="w-full gap-2 rounded-xl bg-accent py-3 font-semibold text-primary-foreground hover:bg-accent/90"
            >
              <MessageCircle className="size-5" />
              Konsultasi Proyek
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
