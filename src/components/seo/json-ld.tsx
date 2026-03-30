import type { ProductDetailData } from "@/components/product/types";
import type { BlogDetailData } from "@/components/blog/types";
import type { PortofolioDetailData } from "@/components/portofolio/types";

const BASE_URL = "https://www.saktitemp.com";

export function ProductJsonLd({
  product,
  url,
}: {
  product: ProductDetailData;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.productDescription,
    image: product.productImageUrl
      ? [product.productImageUrl]
      : [`${BASE_URL}/og-default.jpg`],
    url,
    brand: {
      "@type": "Brand",
      name: "SAKTITEMP®",
    },
    manufacturer: {
      "@type": "Organization",
      name: "SAKTITEMP®",
      url: BASE_URL,
    },
    ...(product.category && {
      category: product.category.name,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogJsonLd({
  blog,
  url,
}: {
  blog: BlogDetailData;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.blogTitle,
    image: blog.blogImageUrl
      ? [blog.blogImageUrl]
      : [`${BASE_URL}/og-default.jpg`],
    datePublished: blog.blogIsPublishedAt,
    dateModified: blog.blogIsPublishedAt,
    author: {
      "@type": "Organization",
      name: "SAKTITEMP®",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SAKTITEMP®",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo_saktitemp.png`,
      },
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(blog.category && {
      articleSection: blog.category.name,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PortofolioJsonLd({
  portofolio,
  url,
}: {
  portofolio: PortofolioDetailData;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: portofolio.portofolioName,
    description: portofolio.portofolioAbout ?? undefined,
    image: portofolio.portofolioImageUrl
      ? [portofolio.portofolioImageUrl]
      : [`${BASE_URL}/og-default.jpg`],
    url,
    creator: {
      "@type": "Organization",
      name: "SAKTITEMP®",
      url: BASE_URL,
    },
    ...(portofolio.portofolioLocation && {
      locationCreated: {
        "@type": "Place",
        name: portofolio.portofolioLocation,
      },
    }),
    ...(portofolio.portofolioClient && {
      contributor: {
        "@type": "Organization",
        name: portofolio.portofolioClient,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SAKTITEMP®",
    url: BASE_URL,
    logo: `${BASE_URL}/logo_saktitemp.png`,
    description:
      "Produsen kaca tempered berkualitas tinggi berstandar Eropa untuk proyek komersial, residensial, dan arsitektur.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
    },
    sameAs: [
      "https://www.instagram.com/saktitemp",
      "https://www.facebook.com/saktitemp",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
