"use client";

import "flag-icons/css/flag-icons.min.css";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_ME_URL } from "@/lib/constants/whatsapp";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  id: "ID",
  en: "EN",
  zh: "中文",
};

const LOCALE_FLAGS: Record<string, string> = {
  id: "fi fi-id",
  en: "fi fi-us",
  zh: "fi fi-cn",
};

const SUPPORTED_LOCALES = ["id", "en", "zh"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type NavItemLink = { href: string; label: string };
type NavItemGroup = {
  label: string;
  children: { href: string; label: string; desc?: string }[];
};
type NavItem = NavItemLink | NavItemGroup;

export function ErrorNavbar() {
  const params = useParams();
  const localeParam = typeof params?.locale === "string" ? params.locale : undefined;
  const pathname = usePathname();
  const locale = (SUPPORTED_LOCALES.includes(localeParam as SupportedLocale)
    ? (localeParam as SupportedLocale)
    : "id") satisfies SupportedLocale;

  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [aboutExpanded, setAboutExpanded] = React.useState(false);

  const basePath = React.useMemo(() => {
    if (!pathname) return "/";
    const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
    if (parts.length && SUPPORTED_LOCALES.includes(parts[0] as SupportedLocale)) {
      return `/${parts.slice(1).join("/")}` || "/";
    }
    return pathname;
  }, [pathname]);

  const withLocale = React.useCallback(
    (href: string, targetLocale: SupportedLocale = locale) => {
      if (!href.startsWith("/")) return href;
      if (targetLocale === "id") return href;
      if (href.startsWith(`/${targetLocale}`)) return href;
      return `/${targetLocale}${href}`;
    },
    [locale]
  );

  const isActive = (href: string) => {
    const target = href === "/" ? "/" : href;
    return basePath === target || (target !== "/" && basePath.startsWith(target));
  };

  const navItems: NavItem[] = [
    { href: "/", label: "Home" },
    {
      label: "About Us",
      children: [
        { href: "/about/company", label: "Company", desc: "Tentang perusahaan" },
        { href: "/about/contact", label: "Contact", desc: "Hubungi kami" },
      ],
    },
    { href: "/product", label: "Products" },
    { href: "/portofolio", label: "Portfolio" },
    { href: "/calculator", label: "Calculator" },
    { href: "/article", label: "Blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 md:px-5 lg:h-16 lg:gap-4 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-initial">
          <Sheet
            open={mobileMenuOpen}
            onOpenChange={(open) => {
              setMobileMenuOpen(open);
              if (!open) setAboutExpanded(false);
            }}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(85vw,320px)] flex-col p-0 sm:max-w-[320px]"
              showCloseButton
            >
              <SheetHeader className="border-b px-4 py-3 text-left">
                <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
              </SheetHeader>

              <nav className="flex flex-1 flex-col overflow-y-auto py-4">
                <Link
                  href={withLocale("/")}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "border-l-2 px-4 py-3 text-sm font-medium transition-colors",
                    isActive("/") 
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  Home
                </Link>

                <Collapsible open={aboutExpanded} onOpenChange={setAboutExpanded}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-l-2 border-transparent px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground [&[data-state=open]]:border-primary [&[data-state=open]]:text-primary">
                    About Us
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        aboutExpanded && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Link
                      href={withLocale("/about/company")}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-l-2 pl-6 pr-4 py-2.5 text-sm",
                        isActive("/about/company")
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Company
                    </Link>
                    <Link
                      href={withLocale("/about/contact")}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-l-2 pl-6 pr-4 py-2.5 text-sm",
                        isActive("/about/contact")
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Contact
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {navItems
                  .filter((item): item is NavItemLink => !("children" in item))
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={withLocale(item.href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "border-l-2 px-4 py-3 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>

              <div className="border-t p-4">
                <Button
                  asChild
                  className="w-full gap-2 rounded-lg bg-accent text-primary-foreground hover:bg-accent/90"
                >
                  <a
                    href={WHATSAPP_ME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <WhatsAppIcon className="size-4" />
                    Konsultasi Proyek
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href={withLocale("/")}
            className="relative flex h-10 w-32 shrink-0 items-center sm:h-11 sm:w-36 lg:h-14 lg:w-44 xl:w-52"
          >
            <Image
              src="/logo_saktitemp.png"
              alt="SaktiTemp"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 208px"
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            "children" in item ? (
              <DropdownMenu key={item.label} open={aboutOpen} onOpenChange={setAboutOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-0.5 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      aboutOpen && "border-primary text-primary"
                    )}
                    aria-haspopup="true"
                    aria-expanded={aboutOpen}
                  >
                    {item.label}
                    <ChevronDown className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[220px] border-0 bg-primary p-2 text-left text-primary-foreground shadow-lg"
                >
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.href} asChild className="rounded-none">
                      <Link
                        href={withLocale(child.href)}
                        onClick={() => setAboutOpen(false)}
                        className={cn(
                          "group flex cursor-pointer flex-col gap-0.5 border-l-2 border-primary-foreground/30 py-3 pl-4 pr-4 outline-none transition-colors focus:border-l-accent focus:bg-primary data-[highlighted]:border-l-accent data-[highlighted]:bg-primary",
                          isActive(child.href) && "border-l-accent"
                        )}
                      >
                        <span
                          className={cn(
                            "font-medium text-primary-foreground transition-colors group-focus:text-accent group-data-[highlighted]:text-accent",
                            isActive(child.href) && "text-accent"
                          )}
                        >
                          {child.label}
                        </span>
                        {child.desc ? (
                          <span className="text-left text-xs text-primary-foreground/70">
                            {child.desc}
                          </span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                className={cn(
                  "border-b-2 border-transparent px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary",
                  isActive(item.href) ? "border-primary text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <DropdownMenu open={langOpen} onOpenChange={setLangOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="min-h-9 gap-1.5 hover:bg-accent hover:text-accent-foreground"
                aria-label="Pilih bahasa"
              >
                <span
                  className={cn(
                    "fi block size-4 shrink-0 rounded-sm [background-size:cover]",
                    LOCALE_FLAGS[locale]
                  )}
                  aria-hidden
                />
                {LOCALE_LABELS[locale]}
                <ChevronDown className="size-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SUPPORTED_LOCALES.map((loc) => (
                <DropdownMenuItem key={loc} asChild>
                  <Link
                    href={withLocale(basePath, loc)}
                    onClick={() => setLangOpen(false)}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <span
                      className={cn(
                        "fi block size-4 shrink-0 rounded-sm [background-size:cover]",
                        LOCALE_FLAGS[loc]
                      )}
                      aria-hidden
                    />
                    {LOCALE_LABELS[loc]}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            size="sm"
            className="gap-1.5 rounded-lg bg-accent px-3 py-2 text-primary-foreground hover:bg-accent/90 sm:gap-2 sm:px-4 sm:py-2.5 lg:h-9 lg:px-5 lg:py-2 xl:px-6"
          >
            <a href={WHATSAPP_ME_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4 shrink-0" />
              <span className="hidden sm:inline">Konsultasi Proyek</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

