"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

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
import {
  defaultNavItems,
  type NavItem,
} from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export type { NavItem };

type DashboardSidebarProps = {
  navItems?: NavItem[];
  logo?: React.ReactNode;
  homeHref?: string;
};

export function DashboardSidebar({
  navItems = defaultNavItems,
  logo,
  homeHref = "/admin",
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-14 items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
          {logo ?? (
            <Link href={homeHref} className="flex items-center gap-2">
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
