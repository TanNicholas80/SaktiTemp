"use client";

import Link from "next/link";
import { MessageCircle, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductDetailActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        asChild
        size="lg"
        className="gap-2 rounded-xl bg-accent px-6 py-6 font-bold text-primary-foreground shadow-md transition-colors hover:bg-accent/90"
      >
        <Link href="/#kontak">
          <MessageCircle className="size-5" />
          Konsultasi Proyek
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="gap-2 rounded-xl border-2 border-primary px-6 py-6 font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <Link href="/#kontak">
          <Calculator className="size-5" />
          Hitung Estimasi Harga
        </Link>
      </Button>
    </div>
  );
}
