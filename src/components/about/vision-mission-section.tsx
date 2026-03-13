"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Eye, Compass } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function VisionMissionSection() {
  const t = useTranslations("visionMissionSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const visiBlockRef = React.useRef<HTMLDivElement>(null);
  const misiBlockRef = React.useRef<HTMLDivElement>(null);
  const visiNumberRef = React.useRef<HTMLDivElement>(null);
  const misiNumberRef = React.useRef<HTMLDivElement>(null);
  const visiIconRef = React.useRef<HTMLDivElement>(null);
  const misiIconRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      const headerTargets = [
        { ref: pillRef, y: 16, delay: 0 },
        { ref: titleRef, y: 20, delay: 0.06 },
        { ref: subtitleRef, y: 18, delay: 0.12 },
      ];
      headerTargets.forEach(({ ref, y, delay }) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ref.current,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      if (visiBlockRef.current) {
        gsap.fromTo(
          visiBlockRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: visiBlockRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (misiBlockRef.current) {
        gsap.fromTo(
          misiBlockRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: misiBlockRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (visiNumberRef.current) {
        gsap.fromTo(
          visiNumberRef.current,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            delay: 0.25,
            ease: "power2.out",
            scrollTrigger: {
              trigger: visiNumberRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (visiIconRef.current) {
        gsap.fromTo(
          visiIconRef.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: visiIconRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (misiNumberRef.current) {
        gsap.fromTo(
          misiNumberRef.current,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: misiNumberRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
      if (misiIconRef.current) {
        gsap.fromTo(
          misiIconRef.current,
          { scale: 0.6, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: 0.55,
            ease: "power3.out",
            scrollTrigger: {
              trigger: misiIconRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const missionPoints = [
    t("missionPoint1"),
    t("missionPoint2"),
    t("missionPoint3"),
  ] as const;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: pill, judul, subteks */}
        <div className="mx-auto max-w-3xl text-center">
          <div ref={pillRef}>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              {t("pillLabel")}
            </Badge>
          </div>
          <h2
            ref={titleRef}
            className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </h2>
          <p
            ref={subtitleRef}
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Konten Visi & Misi — tanpa card, sesuai desain */}
        <div className="mt-12 grid grid-cols-1 gap-16 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* Visi */}
          <div
            ref={visiBlockRef}
            className="group flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="flex w-full flex-col items-center lg:items-start">
              {/* Angka 01 rata kiri, icon berada di dalam angka 0 */}
              <div
                ref={visiNumberRef}
                className="relative flex h-24 items-start justify-start sm:h-28 lg:h-32"
              >
                <div className="relative inline-flex items-center justify-center">
                  <span
                    className="select-none text-8xl font-bold leading-none text-primary/15 sm:text-9xl"
                    aria-hidden
                  >
                    0
                  </span>
                  <div
                    ref={visiIconRef}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "transition-transform duration-300 group-hover:scale-110"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center",
                        "rounded-full border-2 border-primary bg-background text-primary"
                      )}
                    >
                      <Eye className="h-6 w-6" strokeWidth={2} />
                    </span>
                  </div>
                </div>
                <span
                  className="select-none text-8xl font-bold leading-none text-primary/15 sm:text-9xl"
                  aria-hidden
                >
                  1
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {t("visionTitle")}
              </h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                {t("visionDesc")}
              </p>
            </div>
          </div>

          {/* Misi */}
          <div
            ref={misiBlockRef}
            className="group flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="flex w-full flex-col items-center lg:items-start">
              {/* Angka 02 rata kiri, icon berada di dalam angka 0 */}
              <div
                ref={misiNumberRef}
                className="relative flex h-24 items-start justify-start sm:h-28 lg:h-32"
              >
                <div className="relative inline-flex items-center justify-center">
                  <span
                    className="select-none text-8xl font-bold leading-none text-accent/15 sm:text-9xl"
                    aria-hidden
                  >
                    0
                  </span>
                  <div
                    ref={misiIconRef}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "transition-transform duration-300 group-hover:scale-110"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center",
                        "rounded-full border-2 border-accent bg-background text-accent"
                      )}
                    >
                      <Compass className="h-6 w-6" strokeWidth={2} />
                    </span>
                  </div>
                </div>
                <span
                  className="select-none text-8xl font-bold leading-none text-accent/15 sm:text-9xl"
                  aria-hidden
                >
                  2
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {t("missionTitle")}
              </h3>
              <ul className="mt-3 max-w-lg space-y-2.5 text-left">
                {missionPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-base leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
