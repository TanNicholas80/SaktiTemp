"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("calculatorSection.rincian");
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
          {t("emptyState")}
        </p>
        <div data-rincian-step>
          <Button asChild variant="outline" className="border-primary/40 text-primary">
            <Link href="/calculator">{t("backToCalculator")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { breakdown, glassTypeName, variant, thicknessLabel, panjang, lebar } = payload;

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
    });
    window.open(
      `${WHATSAPP_ME_URL}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-2xl space-y-8">

      <div data-rincian-step data-rincian-card>
        <EstimateSummary
          breakdown={breakdown}
          glassTypeName={glassTypeName}
          variant={variant}
          thicknessLabel={thicknessLabel}
          panjang={panjang}
          lebar={lebar}
          heading={t("heading")}
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
            {t("backEdit")}
          </Link>
        </Button>
        <Button
          type="button"
          data-rincian-wa-button
          className="gap-2 bg-accent font-semibold text-primary-foreground hover:bg-accent/90"
          onClick={handleWhatsApp}
        >
          <WhatsAppIcon className="size-4" />
          {t("ctaWhatsapp")}
        </Button>
      </div>
    </div>
  );
}
