"use client";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ConsultationCard() {
  return (
    <Card className="sticky top-4 overflow-hidden border-0 bg-primary">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-white">
          Butuh Konsultasi?
        </h2>
        <p className="max-w-sm text-base leading-relaxed text-white">
          Tim ahli SAKTITEMP siap membantu Anda memilih solusi kaca tempered
          terbaik untuk proyek Anda.
        </p>
        <Button
          asChild
          className="w-full max-w-[200px] gap-2 rounded-xl bg-accent px-6 py-6 font-bold text-primary-foreground shadow-md transition-colors hover:bg-accent/90"
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
      </CardContent>
    </Card>
  );
}
