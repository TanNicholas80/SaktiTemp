"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import {
  loadCalculatorRincianPayload,
  buildCalculatorWhatsAppLines,
} from "./calculator-payload";
import { EstimateSummary } from "./estimate-summary";
import { createCalculatorRincianEntrance } from "./calculator-gsap";

export function CalculatorRincianView() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [payload, setPayload] = React.useState(
    null as ReturnType<typeof loadCalculatorRincianPayload>
  );

  React.useEffect(() => {
    setPayload(loadCalculatorRincianPayload());
  }, []);

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ctx = createCalculatorRincianEntrance(el);
    return () => ctx.revert();
  }, [payload]);

  if (!payload) {
    return (
      <div ref={rootRef} className="mx-auto w-full max-w-lg space-y-4 py-8 text-center sm:py-12">
        <p data-rincian-step className="text-muted-foreground">
          Belum ada data estimasi. Silakan isi kalkulator terlebih dahulu.
        </p>
        <div data-rincian-step>
          <Button asChild variant="outline" className="border-primary/40 text-primary">
            <Link href="/calculator">Kembali ke kalkulator</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { breakdown, glassTypeName, variant, thicknessLabel, panjang, lebar, production } =
    payload;

  function handleWhatsApp() {
    const lines = buildCalculatorWhatsAppLines({
      selectedGlassTypeName: glassTypeName,
      glassSpec: {
        variant: variant ?? null,
        thicknessLabel,
        panjang: panjang ?? "",
        lebar: lebar ?? "",
      },
      breakdown,
      production,
    });
    window.open(
      `${WHATSAPP_ME_URL}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-2xl space-y-8">

      <header data-rincian-step className="space-y-2">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Rincian Penawaran
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground sm:text-base">
          Berikut estimasi biaya berdasarkan spesifikasi yang Anda pilih. Lanjutkan ke
          WhatsApp untuk bernegosiasi bersama tim SAKTITEMP®.
        </p>
      </header>

      <div data-rincian-step data-rincian-card>
        <EstimateSummary
          breakdown={breakdown}
          glassTypeName={glassTypeName}
          variant={variant}
          thicknessLabel={thicknessLabel}
          panjang={panjang}
          lebar={lebar}
          heading="Rincian Estimasi"
          hideBuiltInActions
        />
      </div>

      <div
        data-rincian-step
        data-rincian-cta-group
        className="flex flex-col gap-3 sm:flex-row sm:justify-between"
      >
        <Button
          asChild
          variant="outline"
          className="gap-2 border-border font-semibold"
        >
          <Link href="/calculator">
            <ChevronLeft className="size-4" />
            Kembali Edit Spesifikasi
          </Link>
        </Button>
        <Button
          type="button"
          data-rincian-wa-button
          className="gap-2 bg-accent font-semibold text-primary-foreground hover:bg-accent/90"
          onClick={handleWhatsApp}
        >
          <WhatsAppIcon className="size-4" />
          Negosiasi Bersama Tim Kami
        </Button>
      </div>
    </div>
  );
}
