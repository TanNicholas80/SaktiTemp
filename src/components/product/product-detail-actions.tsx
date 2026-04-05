"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";

export function ProductDetailActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        asChild
        size="lg"
        className="gap-2 rounded-xl bg-accent px-6 py-6 font-bold text-primary-foreground shadow-md transition-colors hover:bg-accent/90"
      >
        <a
          href={WHATSAPP_ME_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="size-5" />
          Konsultasi Proyek
        </a>
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
