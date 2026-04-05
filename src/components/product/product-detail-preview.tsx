"use client";

import Image from "next/image";
import { Check, MapPin, Calculator } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import type { PortofolioOption } from "./types";

type ProductDetailPreviewProps = {
  productName: string;
  productDescription: string;
  imageUrl: string | null;
  categoryName?: string | null;
  thicknesses: { productThicknessValue: number; productThicknessUnit: string }[];
  excellences: { productExellenceDescription: string }[];
  portofolios: PortofolioOption[];
  variant?: "full" | "compact";
};

export function ProductDetailPreview({
  productName,
  productDescription,
  imageUrl,
  categoryName,
  thicknesses,
  excellences,
  portofolios,
  variant = "full",
}: ProductDetailPreviewProps) {
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <p className="text-muted-foreground mb-2 text-xs font-medium">
          Preview detail produk
        </p>
        <div className="space-y-2">
          <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
            {imageUrl ? (
              <Image
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
            {categoryName && (
              <Badge className="absolute left-2 top-2 bg-primary">
                {categoryName}
              </Badge>
            )}
          </div>
          <p className="line-clamp-2 font-medium">{productName || "Nama Produk"}</p>
          <div className="flex flex-wrap gap-1">
            {thicknesses.slice(0, 3).map((t, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {t.productThicknessValue} {t.productThicknessUnit}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-medium">
        Preview tampilan detail produk
      </p>
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="400px"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              Gambar produk
            </div>
          )}
          {categoryName && (
            <Badge className="absolute left-3 top-3 bg-primary">
              {categoryName}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="font-bold">{productName || "Nama Produk"}</h3>
          <p
            className="text-muted-foreground mt-1 line-clamp-3 text-sm"
            dangerouslySetInnerHTML={{
              __html: productDescription || "Deskripsi produk",
            }}
          />
        </div>

        {thicknesses.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              Ketebalan Tersedia
            </p>
            <div className="flex flex-wrap gap-1.5">
              {thicknesses.map((t, i) => (
                <Badge key={i} variant="secondary">
                  {t.productThicknessValue} {t.productThicknessUnit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {excellences.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              Keunggulan Produk
            </p>
            <ul className="space-y-1">
              {excellences.slice(0, 4).map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{e.productExellenceDescription || "Keunggulan"}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {portofolios.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              Contoh Proyek
            </p>
            <div className="grid grid-cols-2 gap-2">
              {portofolios.slice(0, 3).map((p) => (
                <div
                  key={p.portofolioId}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="relative aspect-square bg-muted">
                    {p.portofolioImageUrl ? (
                      <Image
                        src={p.portofolioImageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
                        —
                      </div>
                    )}
                  </div>
                  <div className="border-t bg-primary/90 p-2">
                    <p className="truncate text-xs font-medium text-white">
                      {p.portofolioName}
                    </p>
                    {p.portofolioLocation && (
                      <p className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="size-3" />
                        {p.portofolioLocation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
            <a
              href={WHATSAPP_ME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="mr-1.5 size-4" />
              Konsultasi Proyek
            </a>
          </Button>
          <Button size="sm" variant="outline">
            <Calculator className="mr-1.5 size-4" />
            Hitung Estimasi
          </Button>
        </div>
      </div>
    </div>
  );
}
