"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  ChevronDownIcon,
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
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type NavItem = {
  name: string;
  href?: string;
  icon?: LucideIcon;
  items?: { name: string; href: string }[];
};

const defaultNavItems: NavItem[] = [
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

type DashboardSidebarProps = {
  navItems?: NavItem[];
  logo?: React.ReactNode;
};

export function DashboardSidebar({
  navItems = defaultNavItems,
  logo,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
          {logo ?? (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-bold">
                ST
              </span>
              <span
                className="text-sidebar-foreground truncate text-sm font-semibold group-data-[collapsible=icon]:hidden"
                data-sidebar="logo-text"
              >
                SaktiTemp CMS
              </span>
            </Link>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarNavItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const hasSubmenu = item.items && item.items.length > 0;
  const isActive = item.href ? pathname === item.href : false;
  const isSubItemActive =
    item.items?.some((sub) => pathname === sub.href) ?? false;

  const [open, setOpen] = React.useState(isSubItemActive);

  React.useEffect(() => {
    if (isSubItemActive) setOpen(true);
  }, [isSubItemActive]);

  if (hasSubmenu && item.items) {
    return (
      <SidebarMenuItem>
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isSubItemActive}
              tooltip={item.name}
              className="w-full"
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              <span className="truncate">{item.name}</span>
              <ChevronDownIcon
                className={cn(
                  "ml-auto size-4 shrink-0 transition-transform duration-200",
                  "group-data-[state=open]/collapsible:rotate-180"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((sub) => {
                const subActive = pathname === sub.href;
                return (
                  <SidebarMenuSubItem key={sub.href}>
                    <SidebarMenuSubButton asChild isActive={subActive}>
                      <Link href={sub.href}>{sub.name}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  if (item.href) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
          <Link href={item.href} className="flex items-center gap-2">
            {Icon && <Icon className="size-4 shrink-0" />}
            <span className="truncate">{item.name}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return null;
}
