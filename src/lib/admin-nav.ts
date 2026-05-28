import {
  Award,
  LayoutDashboard,
  FileText,
  MapPin,
  Package,
  Briefcase,
  Users,
  Wrench,
  Star,
  SlidersHorizontal,
  Share2,
  Phone,
  BarChart3,
  LayoutPanelTop,
  Calculator,
  type LucideIcon,
} from "lucide-react";

import { isBlogEditorRole } from "@/lib/roles";

export type NavItem = {
  name: string;
  href?: string;
  icon?: LucideIcon;
  items?: { name: string; href: string }[];
};

export const defaultNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "User",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Calculator",
    icon: Calculator,
    items: [
      { name: "Daftar PriceList Kaca", href: "/admin/price-list/glass" },
    ],
  },
  {
    name: "Blog",
    icon: FileText,
    items: [
      { name: "Daftar Blog", href: "/admin/blog" },
      { name: "Kategori Blog", href: "/admin/blog/categories" },
    ],
  },
  {
    name: "Product",
    icon: Package,
    items: [
      { name: "Daftar Product", href: "/admin/product" },
      { name: "Aplikasi Produk", href: "/admin/product-application" },
      { name: "Kategori Product", href: "/admin/product/categories" },
      { name: "Ketebalan", href: "/admin/thickness" },
      { name: "Keunggulan Product", href: "/admin/product/excellence" },
    ],
  },
  {
    name: "Portofolio",
    icon: Briefcase,
    items: [
      { name: "Daftar Portofolio", href: "/admin/portofolio" },
      { name: "Kategori Portofolio", href: "/admin/portofolio/categories" },
      { name: "Tipe Portofolio", href: "/admin/portofolio/types" },
    ],
  },
  {
    name: "Lokasi",
    href: "/admin/location",
    icon: MapPin,
  },
  {
    name: "Layanan",
    href: "/admin/service",
    icon: Wrench,
  },
  {
    name: "Keunggulan",
    href: "/admin/benefit",
    icon: Star,
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: SlidersHorizontal,
  },
  {
    name: "Media Sosial",
    href: "/admin/social-media",
    icon: Share2,
  },
  {
    name: "Kontak",
    href: "/admin/contact",
    icon: Phone,
  },
  {
    name: "Statistik Perusahaan",
    href: "/admin/company-stat",
    icon: BarChart3,
  },
  {
    name: "Sertifikasi",
    href: "/admin/certification",
    icon: Award,
  },
  {
    name: "Hero Section",
    href: "/admin/hero-section",
    icon: LayoutPanelTop,
  },
];

const blogEditorNavItems: NavItem[] = [
  {
    name: "Blog",
    icon: FileText,
    items: [
      { name: "Daftar Blog", href: "/admin/blog" },
      { name: "Kategori Blog", href: "/admin/blog/categories" },
    ],
  },
];

export function getNavItemsForRole(role: string | undefined | null): NavItem[] {
  if (isBlogEditorRole(role)) {
    return blogEditorNavItems;
  }
  return defaultNavItems;
}

export function getCmsHomeHref(role: string | undefined | null): string {
  return isBlogEditorRole(role) ? "/admin/blog" : "/admin";
}
