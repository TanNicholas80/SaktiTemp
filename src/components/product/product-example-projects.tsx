"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import type { PortofolioOption } from "./types";

type ProductExampleProjectsProps = {
  portofolios: PortofolioOption[];
};

export function ProductExampleProjects({
  portofolios,
}: ProductExampleProjectsProps) {
  if (portofolios.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-bold text-xl">
        Contoh Proyek Menggunakan Produk Ini
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portofolios.map((p) => (
          <Link
            key={p.portofolioId}
            href={`/admin/portofolio/${p.portofolioSlug}`}
            className="group block overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full bg-muted">
              <Image
                src={p.portofolioImageUrl}
                alt={p.portofolioName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 flex min-h-[45%] flex-col justify-end bg-gradient-to-t from-[#8B2F2F]/95 via-[#8B2F2F]/50 to-transparent px-4 pb-4 pt-8">
                <h3 className="font-bold text-white text-lg">
                  {p.portofolioName}
                </h3>
                {p.portofolioLocation && (
                  <p className="mt-1 flex items-center gap-1.5 text-white/95 text-sm">
                    <MapPin className="size-4 shrink-0" />
                    {p.portofolioLocation}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
