"use client";

import * as React from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function scrollToCalculatorSection() {
  document
    .getElementById("calculator")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const STEP_KEYS = [
  { id: "01", titleKey: "step1Title", bodyKey: "step1Body" },
  { id: "02", titleKey: "step2Title", bodyKey: "step2Body" },
  { id: "03", titleKey: "step3Title", bodyKey: "step3Body" },
  { id: "04", titleKey: "step4Title", bodyKey: "step4Body" },
] as const;

export function CalculatorHeroActions() {
  const t = useTranslations("calculatorGuide");
  const [open, setOpen] = React.useState(false);
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const footerBarRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!open || !scrollBodyRef.current) return;
    const root = scrollBodyRef.current;
    const cards = root.querySelectorAll("[data-guide-step]");
    const note = root.querySelector("[data-guide-note]");
    const footerBar = footerBarRef.current;

    const tl = gsap.timeline();
    tl.fromTo(
      cards,
      { opacity: 0, y: 18, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.42,
        stagger: 0.07,
        ease: "power2.out",
      }
    );
    if (note) {
      tl.fromTo(
        note,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        "-=0.18"
      );
    }
    if (footerBar) {
      tl.fromTo(
        footerBar,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
        "-=0.15"
      );
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  const narrowBtn = cn(
    "w-full justify-center sm:w-auto",
    "h-9 gap-2 px-3.5 text-xs sm:h-10 sm:px-4 sm:text-sm md:h-11 md:px-6",
    "max-[475px]:h-auto max-[475px]:min-h-8 max-[475px]:gap-1.5 max-[475px]:px-3 max-[475px]:py-2 max-[475px]:text-[0.8125rem] max-[475px]:leading-snug",
    "[&_svg]:size-4 max-[475px]:[&_svg]:size-3.5"
  );

  return (
    <>
      <Button
        type="button"
        variant="default"
        className={cn(
          narrowBtn,
          "border-0 bg-accent text-white shadow-md hover:bg-accent/90"
        )}
        onClick={scrollToCalculatorSection}
      >
        <Calculator className="shrink-0" aria-hidden />
        {t("startEstimate")}
      </Button>
      <Button
        type="button"
        variant="outline"
        className={cn(
          narrowBtn,
          "border-white/85 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
        )}
        onClick={() => setOpen(true)}
      >
        <Calculator className="shrink-0" aria-hidden />
        {t("viewGuide")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "flex w-[calc(100vw-1rem)] max-w-[min(100vw-1rem,1180px)] flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card p-0 shadow-xl",
            "max-h-[min(92vh,900px)] sm:w-[calc(100vw-2rem)]",
            "sm:max-w-[min(100vw-2rem,1180px)]"
          )}
        >
          <div className="shrink-0 border-b border-border px-5 pt-5 pb-4 pr-14 sm:px-8 sm:pt-6 sm:pb-5 sm:pr-16">
            <DialogHeader className="space-y-0 text-left">
              <DialogTitle className="text-pretty text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                {t("guideTitle")}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div
            ref={scrollBodyRef}
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-8 sm:py-6"
          >
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:items-stretch lg:gap-5">
              {STEP_KEYS.map((step) => (
                <article
                  key={step.id}
                  data-guide-step
                  className="flex h-full flex-col rounded-lg border border-[#d4d4d4] bg-background p-4 sm:p-5"
                >
                  <span
                    className={cn(
                      "mb-3 inline-flex min-h-8 w-fit min-w-8 shrink-0 items-center justify-center rounded-md px-2.5",
                      "bg-[#f5eaea] text-sm font-bold tabular-nums text-primary sm:text-base"
                    )}
                  >
                    {step.id}
                  </span>
                  <h3 className="mb-2 text-sm font-bold leading-snug text-foreground sm:text-[0.95rem]">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-xs leading-relaxed text-foreground/85 sm:text-sm sm:leading-relaxed">
                    {t(step.bodyKey)}
                  </p>
                </article>
              ))}
            </div>

            <div
              data-guide-note
              className="mt-5 rounded-lg bg-[#efefef] px-4 py-3.5 text-sm leading-relaxed text-foreground sm:mt-6 sm:px-5 sm:py-4 sm:text-[0.9375rem]"
            >
              <span className="font-bold text-primary">
                {t("specialSizeLabel")}
              </span>{" "}
              <span className="text-foreground/90">{t("specialSizeBody")}</span>
            </div>
          </div>

          <div
            ref={footerBarRef}
            className="shrink-0 border-t border-border bg-card px-5 py-4 sm:px-8"
          >
            <div className="flex justify-end">
              <Button
                type="button"
                className="rounded-md bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() => scrollToCalculatorSection());
                }}
              >
                {t("understandCta")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
