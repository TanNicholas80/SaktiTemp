"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { TiktokIcon } from "@/components/icons/tiktok-icon";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";

import type { ContactOutput } from "@/lib/translate";
import type { CategoryProductOutput } from "@/lib/translate";

gsap.registerPlugin(ScrollTrigger);

type SocialIconComponent = React.ComponentType<{ className?: string }>;

const SOCIAL_ICON_MAP: Record<string, SocialIconComponent> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  linkedin_in: Linkedin,
  tiktok: TiktokIcon,
  whatsapp: WhatsAppIcon,
};

const CONTACT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  Mail,
  MapPin,
  "map-pin": MapPin,
  WhatsApp: WhatsAppIcon,
};

type SocialMediaItem = {
  socialMediaId: string;
  platformName: string;
  profileUrl: string;
  iconName: string;
};

type FooterSectionProps = {
  contacts: ContactOutput[];
  socialMedia: SocialMediaItem[];
  categories: CategoryProductOutput[];
};

function getSocialIcon(iconName: string): SocialIconComponent {
  const key = iconName.toLowerCase().replace(/\s+/g, "_");
  return SOCIAL_ICON_MAP[key] ?? MessageCircle;
}

function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "62" + cleaned.slice(1);
  else if (!cleaned.startsWith("62")) cleaned = "62" + cleaned;
  return cleaned;
}

export function FooterSection({
  contacts,
  socialMedia,
  categories,
}: FooterSectionProps) {
  const t = useTranslations("footerSection");
  const tNav = useTranslations("nav");
  const sectionRef = React.useRef<HTMLElement>(null);
  const colRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const copyrightRef = React.useRef<HTMLDivElement>(null);

  const addressContact = contacts.find((c) => c.contactType === "address");
  const phoneContact = contacts.find((c) => c.contactType === "phone");
  const emailContact = contacts.find((c) => c.contactType === "email");

  const AddressIcon = addressContact ? (CONTACT_ICON_MAP[addressContact.contactIcon] ?? MapPin) : MapPin;
  const PhoneIcon = phoneContact ? (CONTACT_ICON_MAP[phoneContact.contactIcon] ?? Phone) : Phone;
  const EmailIcon = emailContact ? (CONTACT_ICON_MAP[emailContact.contactIcon] ?? Mail) : Mail;

  const quickLinks = [
    { href: "/", label: tNav("home") },
    { href: "/about/company", label: tNav("aboutUs") },
    { href: "/portofolio", label: tNav("portofolio") },
    { href: "/article", label: tNav("article") },
    { href: "/about/contact", label: tNav("contact") },
  ];

  React.useEffect(() => {
    const ctx = gsap.context(() => {
      colRefs.current.forEach((el, i) => {
        if (el) {
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
        }
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
      className="relative w-full overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-16 lg:px-12 lg:py-20 xl:max-w-[110rem] xl:px-16 2xl:max-w-[150rem] 2xl:px-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-10 xl:gap-x-16 2xl:gap-x-20">
          {/* Kolom 1: Logo & Deskripsi */}
          <div
            ref={(el) => {
              colRefs.current[0] = el;
            }}
            className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1"
          >
            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-90"
            >
              <Image
                src="/logo_saktitemp_putih.png"
                alt="SAKTITEMP"
                width={140}
                height={56}
                className="h-10 w-auto object-contain sm:h-12 lg:h-14 2xl:h-16"
              />
            </Link>
            <p className="text-primary-foreground/90 max-w-md text-sm leading-relaxed sm:max-w-xs lg:max-w-sm">
              {t("companyDesc")}
            </p>
            <p className="text-accent text-sm italic sm:text-base">{t("slogan")}</p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div
            ref={(el) => {
              colRefs.current[1] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">
              {t("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-primary-foreground/90 inline-block text-sm transition-colors duration-200",
                      "hover:text-accent hover:underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Produk (Category) */}
          <div
            ref={(el) => {
              colRefs.current[2] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">
              {t("products")}
            </h3>
            <ul className="flex flex-col gap-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.categoryProductId}>
                    <Link
                      href={`/product?category=${cat.categoryProductSlug}`}
                      className={cn(
                        "text-primary-foreground/90 inline-block text-sm transition-colors duration-200",
                        "hover:text-accent hover:underline"
                      )}
                    >
                      {cat.categoryProductName}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-primary-foreground/70 text-sm">
                  {t("noProducts")}
                </li>
              )}
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div
            ref={(el) => {
              colRefs.current[3] = el;
            }}
          >
            <h3 className="mb-4 text-base font-bold uppercase tracking-wide">
              {t("contact")}
            </h3>
            <ul className="flex flex-col gap-3">
              {addressContact && (
                <li className="flex items-start gap-3">
                  <AddressIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="text-primary-foreground/90 text-sm">
                    {addressContact.contactValue}
                  </span>
                </li>
              )}
              {phoneContact && (
                <li className="flex items-center gap-3">
                  <PhoneIcon className="size-5 shrink-0 text-accent" />
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(phoneContact.contactValue)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-primary-foreground/90 text-sm transition-colors duration-200",
                      "hover:text-accent hover:underline"
                    )}
                  >
                    {phoneContact.contactValue}
                  </a>
                </li>
              )}
              {emailContact && (
                <li className="flex items-center gap-3">
                  <EmailIcon className="size-5 shrink-0 text-accent" />
                  <a
                    href={`mailto:${emailContact.contactValue}`}
                    className={cn(
                      "text-primary-foreground/90 text-sm transition-colors duration-200",
                      "hover:text-accent hover:underline"
                    )}
                  >
                    {emailContact.contactValue}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Media Icons */}
            {socialMedia.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                {socialMedia.map((sm) => {
                  const Icon = getSocialIcon(sm.iconName);
                  return (
                    <Button
                      key={sm.socialMediaId}
                      variant="ghost"
                      size="icon"
                      asChild
                      className="size-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-accent sm:size-10"
                    >
                      <a
                        href={sm.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={sm.platformName}
                      >
                        <Icon className="size-4 sm:size-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div
          ref={copyrightRef}
          className="mt-10 w-full border-t border-primary-foreground/20 pt-6 text-left text-xs text-primary-foreground/80 sm:mt-12 sm:pt-8 sm:text-sm"
        >
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
