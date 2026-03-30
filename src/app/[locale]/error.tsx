"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { AnimatedErrorPage } from "@/components/errors/animated-error-page";
import { FooterSection } from "@/components/footer";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

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

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const params = useParams();
  const locale = useMemo(() => {
    const p = typeof params?.locale === "string" ? params.locale : "id";
    return p === "en" || p === "zh" || p === "id" ? p : "id";
  }, [params]);

  const [footerData, setFooterData] = useState<FooterPayload>({
    contacts: [],
    socialMedia: [],
    categories: [],
  });

  useEffect(() => {
    let mounted = true;
    fetch(`/api/footer?locale=${locale}`)
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
  }, [locale]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
      <AnimatedErrorPage
        code="500"
        title="Terjadi Gangguan Pada Sistem."
        description="Maaf, sistem sedang mengalami kendala. Silakan coba lagi beberapa saat atau kembali ke beranda."
        primaryLabel="Kembali Ke Beranda"
        primaryHref="/"
        onRetry={reset}
      />
      <FooterSection
        contacts={footerData.contacts}
        socialMedia={footerData.socialMedia}
        categories={footerData.categories}
      />
    </div>
  );
}

