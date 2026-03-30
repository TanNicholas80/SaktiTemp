"use client";

import { useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { APP_TIME_ZONE } from "@/i18n/constants";

import idMessages from "../../messages/id.json";
import enMessages from "../../messages/en.json";
import zhMessages from "../../messages/zh.json";

const MESSAGES_BY_LOCALE = {
  id: idMessages,
  en: enMessages,
  zh: zhMessages,
} as const;

type SupportedLocale = keyof typeof MESSAGES_BY_LOCALE;

type FooterPayload = {
  contacts: Array<{
    contactId: string;
    contactType: string;
    contactLabel: string;
    contactValue: string;
    contactValueExtra: string | null;
    contactIcon: string;
  }>;
  socialMedia: Array<{
    socialMediaId: string;
    platformName: string;
    profileUrl: string;
    iconName: string;
  }>;
  categories: Array<{
    categoryProductId: string;
    categoryProductName: string;
    categoryProductSlug: string;
  }>;
};

export default function RootNotFoundPage() {
  const pathname = usePathname();
  const localeFromPath = (() => {
    const seg = pathname?.split("/").filter(Boolean)[0];
    return (seg === "en" || seg === "zh" || seg === "id" ? seg : "id") as SupportedLocale;
  })();

  const [footerData, setFooterData] = useState<FooterPayload>({
    contacts: [],
    socialMedia: [],
    categories: [],
  });

  const footerLocale = useMemo(() => localeFromPath, [localeFromPath]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/footer?locale=${footerLocale}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed footer fetch"))))
      .then((data: FooterPayload) => {
        if (mounted) setFooterData(data);
      })
      .catch(() => {
        if (mounted) {
          setFooterData({ contacts: [], socialMedia: [], categories: [] });
        }
      });
    return () => {
      mounted = false;
    };
  }, [footerLocale]);

  return (
    <NextIntlClientProvider
      locale={localeFromPath}
      messages={MESSAGES_BY_LOCALE[localeFromPath]}
      timeZone={APP_TIME_ZONE}
    >
      <div className="min-h-screen">
        <LandingNavbar />
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
          <AnimatedErrorPage
            code="404"
            title="Halaman Tidak Ditemukan."
            description="Kami tidak bisa menemukan halaman yang kamu tuju. Yuk, balik lagi ke halaman utama."
            primaryLabel="Kembali Ke Beranda"
            primaryHref="/"
          />
          <FooterSection
            contacts={footerData.contacts}
            socialMedia={footerData.socialMedia}
            categories={footerData.categories}
          />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}

