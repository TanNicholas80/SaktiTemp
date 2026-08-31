"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { Button } from "@/components/ui/button";
import type { PortofolioDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type PortofolioDetailSidebarProps = {
  portofolio: PortofolioDetailData;
  /** "landing" = add GSAP, link to contact page; "admin" = link to homepage contact */
  variant?: "landing" | "admin";
};

export function PortofolioDetailSidebar({
  portofolio,
  variant = "admin",
}: PortofolioDetailSidebarProps) {
  const t = useTranslations("portofolioDetailSection");
  const asideRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (variant !== "landing" || !asideRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        asideRef.current,
        { opacity: 0, x: 24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: asideRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, asideRef);

    return () => ctx.revert();
  }, [variant]);

  return (
    <aside ref={asideRef}>
      <div className="overflow-hidden rounded-xl bg-primary px-5 py-5 text-white">
        <h2 className="mb-5 text-xl font-bold">{t("projectDetail")}</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <MapPin className="size-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-normal text-white/80">{t("location")}</p>
              <p className="text-base font-semibold text-white">
                {portofolio.portofolioLocation}
              </p>
            </div>
          </div>

          {portofolio.portofolioApplicators &&
            portofolio.portofolioApplicators.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Building2 className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-normal text-white/80">{t("applicator")}</p>
                  <p className="text-base font-semibold text-white">
                    {portofolio.portofolioApplicators.join(", ")}
                  </p>
                </div>
              </div>
            )}
        </div>
        <div className="mt-5 border-t border-white/20 pt-5">
          <Button
            className="w-full gap-2 rounded-xl bg-accent py-4 font-semibold text-primary-foreground hover:bg-accent/90"
            asChild
          >
            <a
              href={WHATSAPP_ME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-5" />
              {t("projectConsultation")}
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
}
