"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BrandText } from "@/components/shared/brand-text";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layout sesuai desain:
 * - Baris 1: 3 gambar (lebar tidak sejajar ~45% | ~27% | ~28%)
 * - Baris 2: 2 gambar (50% | 50%)
 * - Baris 3: 2 gambar (lebar tidak sejajar ~70% | ~30%)
 * - Logo: absolute, center overlay di atas grid
 */
const COLLAGE_IMAGES = [
  {
    key: "a",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    alt: "Angular glass facade",
    from: { opacity: 0, x: -30, y: 0 },
  },
  {
    key: "b",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80",
    alt: "Modern glass building",
    from: { opacity: 0, y: -30, x: 0 },
  },
  {
    key: "c",
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&q=80",
    alt: "Glass interior",
    from: { opacity: 0, x: 30, y: 0 },
  },
  {
    key: "d",
    src: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&q=80",
    alt: "Glass building facade",
    from: { opacity: 0, x: -24, y: 0 },
  },
  {
    key: "e",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    alt: "Sky through glass",
    from: { opacity: 0, x: -24, y: 0 },
  },
  {
    key: "f",
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&q=80",
    alt: "Glass staircase interior",
    from: { opacity: 0, y: 30, x: 0 },
  },
  {
    key: "g",
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80",
    alt: "Glass building exterior",
    from: { opacity: 0, x: 30, y: 0 },
  },
];

type ImgRef = HTMLDivElement | null;

/** Highlight kata terakhir dengan warna primary (maroon) */
function HeadingWithHighlight({ text }: { text: string }) {
  const parts = text.split(" ");
  const last = parts.pop();
  const rest = parts.join(" ");

  return (
    <h2
      data-animate
      className={cn(
        "mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
        "text-foreground"
      )}
    >
      {rest && <BrandText text={rest + " "} />}
      {last && <span className="text-primary"><BrandText text={last} /></span>}
    </h2>
  );
}

/** Parse **bold** dan [[maroon]] dari teks (format aman untuk next-intl) */
function RichParagraph({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(\*\*[\s\S]*?\*\*|\[\[[\s\S]*?\]\])/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const boldMatch = part.match(/^\*\*([\s\S]*?)\*\*$/);
        const maroonMatch = part.match(/^\[\[([\s\S]*?)\]\]$/);
        if (boldMatch) return <strong key={i} className="font-bold"><BrandText text={boldMatch[1]} /></strong>;
        if (maroonMatch) return <span key={i} className="text-primary"><BrandText text={maroonMatch[1]} /></span>;
        return <BrandText key={i} text={part} />;
      })}
    </span>
  );
}

export function AboutContentSection() {
  const t = useTranslations("aboutContentSection");
  const sectionRef = React.useRef<HTMLElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const imageRefs = React.useRef<ImgRef[]>([]);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const nodes = textRef.current.querySelectorAll("[data-animate]");
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        const img = COLLAGE_IMAGES[i];
        gsap.fromTo(
          el,
          { ...img.from, scale: 1 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            delay: 0.06 * i,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: logoRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background"
    >
      {/* Full-bleed two-column grid — min height for taller section */}
      <div className="grid min-h-[65vh] grid-cols-1 lg:min-h-[70vh] lg:grid-cols-2">

        {/* ─── SISI KIRI: Image Collage (full-bleed, flush) ─── */}
        <div className="order-2 lg:order-1 relative min-h-[480px] sm:min-h-[580px] lg:min-h-0">
          {/* Absolute fill — collage stretches to match right column height */}
          <div className="absolute inset-0">
            <div
              className="grid h-full gap-1 sm:gap-1.5"
              style={{
                gridTemplateColumns: "repeat(12, 1fr)",
                gridTemplateRows: "1fr 1fr 1.2fr",
                gridTemplateAreas: `
                  "a a a a a a b b b c c c"
                  "d d d d d d e e e e e e"
                  "f f f f f f f f g g g g"
                `,
              }}
            >
              {/* Baris 1 */}
              {[
                { idx: 0, area: "a", sizes: "45vw" },
                { idx: 1, area: "b", sizes: "27vw" },
                { idx: 2, area: "c", sizes: "28vw" },
              ].map(({ idx, area, sizes }) => (
                <div
                  key={area}
                  ref={(el) => { imageRefs.current[idx] = el; }}
                  className="group relative overflow-hidden"
                  style={{ gridArea: area }}
                >
                  <Image
                    src={COLLAGE_IMAGES[idx].src}
                    alt={COLLAGE_IMAGES[idx].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={`(max-width: 1024px) 100vw, ${sizes}`}
                  />
                  {/* Default: white overlay — hover: primary/maroon overlay */}
                  <div
                    className="absolute inset-0 bg-white/35 transition-all duration-400 group-hover:bg-primary/50"
                    aria-hidden
                  />
                </div>
              ))}

              {/* Baris 2 */}
              {[
                { idx: 3, area: "d", sizes: "50vw" },
                { idx: 4, area: "e", sizes: "50vw" },
              ].map(({ idx, area, sizes }) => (
                <div
                  key={area}
                  ref={(el) => { imageRefs.current[idx] = el; }}
                  className="group relative overflow-hidden"
                  style={{ gridArea: area }}
                >
                  <Image
                    src={COLLAGE_IMAGES[idx].src}
                    alt={COLLAGE_IMAGES[idx].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={`(max-width: 1024px) 100vw, ${sizes}`}
                  />
                  <div
                    className="absolute inset-0 bg-white/35 transition-all duration-400 group-hover:bg-primary/50"
                    aria-hidden
                  />
                </div>
              ))}

              {/* Baris 3 */}
              {[
                { idx: 5, area: "f", sizes: "35vw" },
                { idx: 6, area: "g", sizes: "15vw" },
              ].map(({ idx, area, sizes }) => (
                <div
                  key={area}
                  ref={(el) => { imageRefs.current[idx] = el; }}
                  className="group relative overflow-hidden"
                  style={{ gridArea: area }}
                >
                  <Image
                    src={COLLAGE_IMAGES[idx].src}
                    alt={COLLAGE_IMAGES[idx].alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={`(max-width: 1024px) 100vw, ${sizes}`}
                  />
                  <div
                    className="absolute inset-0 bg-white/35 transition-all duration-400 group-hover:bg-primary/50"
                    aria-hidden
                  />
                </div>
              ))}
            </div>

            {/* Logo overlay — row-2 center, full-width white band */}
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center"
              aria-hidden
            >
              <div
                ref={logoRef}
                className={cn(
                  "pointer-events-auto flex w-full items-center justify-center",
                  "bg-white py-5 shadow-md sm:py-6",
                  "transition-shadow duration-300 hover:shadow-lg"
                )}
              >
                <Image
                  src="/logo_saktitemp.png"
                  alt="SAKTITEMP® Tempered Glass"
                  width={210}
                  height={84}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── SISI KANAN: Content (with internal padding) ─── */}
        <div
          ref={textRef}
          className={cn(
            "order-1 flex flex-col justify-center lg:order-2",
            "px-6 py-14 sm:px-10 sm:py-16 md:px-14 lg:px-16 lg:py-20 xl:px-20"
          )}
        >
          <p
            data-animate
            className="text-xs font-semibold uppercase tracking-[0.28em] text-accent sm:text-sm"
          >
            {t("preHeading")}
          </p>

          <HeadingWithHighlight text={t("mainHeading")} />

          <p
            data-animate
            className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg md:leading-8"
          >
            <RichParagraph text={t("paragraph1")} />
          </p>

          <p
            data-animate
            className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg md:leading-8"
          >
            <RichParagraph text={t("paragraph2")} />
          </p>

          <Separator
            data-animate
            className="mt-6 w-full bg-accent"
            decorative
          />

          <Button
            data-animate
            variant="link"
            size="lg"
            className={cn(
              "group mt-8 h-auto w-fit p-0 text-base font-medium",
              "inline-flex items-center gap-2 text-primary",
              "transition-all duration-200 hover:gap-3 hover:text-primary/90"
            )}
            asChild
          >
            <Link href="/portofolio">
              {t("cta")}
              <ArrowRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
