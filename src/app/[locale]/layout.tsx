import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTimeZone, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LandingNavbar } from "@/components/layout/landing-navbar";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const BASE_URL = "https://www.saktitemp.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const canonicalPath = locale === "id" ? "" : `/${locale}`;
  return {
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}`,
      languages: {
        id: `${BASE_URL}/`,
        en: `${BASE_URL}/en`,
        "zh-CN": `${BASE_URL}/zh`,
        "x-default": `${BASE_URL}/`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, timeZone] = await Promise.all([getMessages(), getTimeZone()]);

  return (
    <NextIntlClientProvider messages={messages} timeZone={timeZone}>
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
