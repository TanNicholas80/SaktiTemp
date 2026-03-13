"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import {
  Building2,
  MapPin,
  Calendar,
  Ruler,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PortofolioDetailData } from "./types";

gsap.registerPlugin(ScrollTrigger);

type PortofolioDetailSidebarProps = {
  portofolio: PortofolioDetailData;
  /** "landing" = add GSAP, link to contact page; "admin" = link to homepage contact */
  variant?: "landing" | "admin";
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icon className="size-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white/80 text-sm font-normal">{label}</p>
        <p className="text-white text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function PortofolioDetailSidebar({
  portofolio,
  variant = "admin",
}: PortofolioDetailSidebarProps) {
  const areaDisplay = `${portofolio.portofolioAreaSize.toLocaleString("id-ID")} ${portofolio.portofolioAreaSizeUnit}`;
  const consultationHref = variant === "landing" ? "/about/contact" : "/#kontak";
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
        <h2 className="mb-5 text-xl font-bold">Detail Proyek</h2>
        <div className="space-y-5">
          <DetailRow
            icon={Building2}
            label="Klien"
            value={portofolio.portofolioClient}
          />
          <DetailRow
            icon={MapPin}
            label="Location"
            value={portofolio.portofolioLocation}
          />
          <DetailRow
            icon={Calendar}
            label="Tahun"
            value={portofolio.portofolioYear}
          />
          <DetailRow
            icon={Ruler}
            label="Luas Area"
            value={areaDisplay}
          />
        </div>
        <div className="mt-5 border-t border-white/20 pt-5">
          <Button
            className="w-full gap-2 rounded-xl bg-accent py-4 font-semibold text-primary-foreground hover:bg-accent/90"
            asChild
          >
            <Link href={consultationHref}>
              <MessageCircle className="size-5" />
              Konsultasi Proyek
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
