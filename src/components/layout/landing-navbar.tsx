"use client";

import "flag-icons/css/flag-icons.min.css";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
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

export function LandingNavbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [aboutExpanded, setAboutExpanded] = React.useState(false);

  const navItems = [
    { href: "/", label: t("home") },
    {
      label: t("aboutUs"),
      children: [
        { href: "/about/company", label: t("company"), desc: t("companyDesc") },
        { href: "/about/contact", label: t("contact"), desc: t("contactDesc") },
      ],
    },
    { href: "/product", label: t("products") },
    { href: "/portofolio", label: t("portofolio") },
    { href: "/calculator", label: t("calculator") },
    { href: "/article", label: t("article") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 md:px-5 lg:h-16 lg:gap-4 lg:px-8">
        {/* Mobile hamburger + Logo */}
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-initial">
          {/* Hamburger - tampil sampai lg (768–1023px), sembunyi di lg+ */}
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
                <SheetTitle className="text-base font-semibold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-1 flex-col overflow-y-auto py-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "border-l-2 px-4 py-3 text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {t("home")}
                </Link>

                <Collapsible open={aboutExpanded} onOpenChange={setAboutExpanded}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between border-l-2 border-transparent px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground [&[data-state=open]]:border-primary [&[data-state=open]]:text-primary">
                    {t("aboutUs")}
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        aboutExpanded && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <Link
                      href="/about/company"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-l-2 pl-6 pr-4 py-2.5 text-sm",
                        pathname.startsWith("/about/company")
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("company")}
                    </Link>
                    <Link
                      href="/about/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-l-2 pl-6 pr-4 py-2.5 text-sm",
                        pathname.startsWith("/about/contact")
                          ? "border-primary text-primary font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("contact")}
                    </Link>
                  </CollapsibleContent>
                </Collapsible>

                {navItems
                  .filter((item): item is { href: string; label: string } => !("children" in item))
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
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
                    {t("consultation")}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href="/"
            className="relative flex h-10 w-32 shrink-0 items-center sm:h-11 sm:w-36 lg:h-14 lg:w-44 xl:w-52"
          >
            <Image
              src="/logo_baru_warna.png"
              alt="SaktiTemp"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 208px"
            />
          </Link>
        </div>

        {/* Desktop Navigation - tampil hanya di lg (1024px)+ */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            "children" in item ? (
              <DropdownMenu
                key={item.label}
                open={aboutOpen}
                onOpenChange={setAboutOpen}
              >
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
                  {item.children?.map((child) => (
                    <DropdownMenuItem key={child.href} asChild className="rounded-none">
                      <Link
                        href={child.href}
                        onClick={() => setAboutOpen(false)}
                        className={cn(
                          "group flex items-start cursor-pointer flex-col gap-0.5 border-l-2 border-primary-foreground/30 py-3 pl-4 pr-4 outline-none transition-colors focus:border-l-accent focus:bg-primary data-[highlighted]:border-l-accent data-[highlighted]:bg-primary",
                          isActive(child.href) && "border-l-accent"
                        )}
                      >
                        <span
                          className={cn(
                            "font-medium transition-colors text-primary-foreground group-focus:text-accent group-data-[highlighted]:text-accent",
                            isActive(child.href) && "text-accent"
                          )}
                        >
                          {child.label}
                        </span>
                        {"desc" in child && (
                          <span className="text-left text-xs text-primary-foreground/70">
                            {child.desc}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 border-transparent px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary",
                  isActive(item.href)
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right section: Language + CTA */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
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
                    LOCALE_FLAGS[locale] ?? LOCALE_FLAGS[routing.defaultLocale]
                  )}
                  aria-hidden
                />
                {LOCALE_LABELS[locale] ?? LOCALE_LABELS[routing.defaultLocale]}
                <ChevronDown className="size-4 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {routing.locales.map((loc) => (
                <DropdownMenuItem key={loc} asChild>
                  <Link
                    href={pathname}
                    locale={loc as "id" | "en" | "zh"}
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

          {/* CTA Button - sembunyikan teks di layar sangat kecil */}
          <Button
            asChild
            size="sm"
            className="gap-1.5 rounded-lg bg-accent px-3 py-2 text-primary-foreground hover:bg-accent/90 sm:gap-2 sm:px-4 sm:py-2.5 lg:h-9 lg:px-5 lg:py-2 xl:px-6"
          >
            <a
              href={WHATSAPP_ME_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4 shrink-0" />
              <span className="hidden sm:inline">{t("consultation")}</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
