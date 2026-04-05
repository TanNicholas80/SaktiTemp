"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { cn } from "@/lib/utils";

type ErrorFooterProps = {
  className?: string;
};

gsap.registerPlugin(ScrollTrigger);

export function ErrorFooter({ className }: ErrorFooterProps) {
  const params = useParams();
  const localeParam = typeof params?.locale === "string" ? params.locale : undefined;
  const withLocale = (href: string) => {
    if (!localeParam || localeParam === "id") return href;
    if (!href.startsWith("/")) return href;
    if (href.startsWith(`/${localeParam}`)) return href;
    return `/${localeParam}${href}`;
  };

  const sectionRef = React.useRef<HTMLElement>(null);
  const colRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const copyrightRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      colRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1 + i * 0.08,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      if (copyrightRef.current) {
        gsap.fromTo(
          copyrightRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.6,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: copyrightRef.current,
              start: "top 95%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className={cn("relative w-full overflow-hidden bg-primary text-primary-foreground", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            ref={(el) => {
              colRefs.current[0] = el;
            }}
            className="space-y-4"
          >
            <Link href={withLocale("/")} className="inline-flex items-center hover:opacity-90">
              <Image
                src="/sakti_putih.png"
                alt="SAKTITEMP"
                width={160}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/90">
              Manufaktur Kaca Tempered Berkualitas Tinggi Dengan Standar Eropa. Solusi
              Kaca Premium Untuk Proyek Komersial, Residensial, Dan Arsitektur.
            </p>
            <p className="text-sm italic text-accent">
              &quot;We Understand What You Need&quot;
            </p>
          </div>

          <div
            ref={(el) => {
              colRefs.current[1] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/about/company", label: "About Us" },
                { href: "/portofolio", label: "Portfolio" },
                { href: "/article", label: "Blog" },
                { href: "/about/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={withLocale(item.href)}
                    className={cn(
                      "text-primary-foreground/90 transition-colors hover:text-accent hover:underline"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={(el) => {
              colRefs.current[2] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">Produk</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Tempered Glass",
                "Laminated Glass",
                "Insulated Glass",
                "Decorative Glass",
                "Custom Solutions",
              ].map((label) => (
                <li key={label} className="text-primary-foreground/90">
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={(el) => {
              colRefs.current[3] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
                <span className="text-primary-foreground/90">
                  Jl. Kaligawe Raya No.310, Trimulyo, Banjardowo, Kec. Genuk, Kota
                  Semarang, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-accent" />
                <a
                  href={WHATSAPP_ME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/90 hover:text-accent hover:underline"
                >
                  0821 3705 6377
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-accent" />
                <a
                  href="mailto:3s.glassindo@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/90 hover:text-accent hover:underline"
                >
                  3s.glassindo@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-accent"
                asChild
              >
                <a
                  href="#"
                  aria-label="Facebook"
                  onClick={(e) => e.preventDefault()}
                >
                  <Facebook className="size-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-accent"
                asChild
              >
                <a
                  href="#"
                  aria-label="Instagram"
                  onClick={(e) => e.preventDefault()}
                >
                  <Instagram className="size-4" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-accent"
                asChild
              >
                <a
                  href="#"
                  aria-label="TikTok"
                  onClick={(e) => e.preventDefault()}
                >
                  <MessageCircle className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={copyrightRef}
          className="mt-10 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/80 sm:text-sm"
        >
          © 2026 SAKTITEMP®. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

