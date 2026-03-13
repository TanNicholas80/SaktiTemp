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

type DashboardLayoutShellProps = {
  children: React.ReactNode;
  navItems?: NavItem[];
  userEmail?: string | null;
  userName?: string | null;
  userImage?: string | null;
  showSearch?: boolean;
};

export function DashboardLayoutShell({
  children,
  navItems,
  userEmail,
  userName,
  userImage,
  showSearch = true,
}: DashboardLayoutShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar navItems={navItems} />
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
