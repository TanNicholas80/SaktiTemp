"use client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardNavbar } from "@/components/shared/dashboard-navbar";
import {
  DashboardSidebar,
  type NavItem,
} from "@/components/shared/dashboard-sidebar";
import { getCmsHomeHref, getNavItemsForRole } from "@/lib/admin-nav";

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  userRole?: string | null;
  navItems?: NavItem[];
  homeHref?: string;
  userEmail?: string | null;
  userName?: string | null;
  userImage?: string | null;
  showSearch?: boolean;
};

export function DashboardLayoutShell({
  children,
  userRole,
  navItems,
  homeHref,
  userEmail,
  userName,
  userImage,
  showSearch = true,
}: DashboardLayoutShellProps) {
  const resolvedNavItems = navItems ?? getNavItemsForRole(userRole);
  const resolvedHomeHref = homeHref ?? getCmsHomeHref(userRole);

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar navItems={resolvedNavItems} homeHref={resolvedHomeHref} />
      <SidebarInset>
        <DashboardNavbar
          userEmail={userEmail}
          userName={userName}
          userImage={userImage}
          showSearch={showSearch}
        />
        <main className="flex flex-1 flex-col p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
