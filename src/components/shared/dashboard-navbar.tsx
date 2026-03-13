"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Search, User } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type DashboardNavbarProps = {
  userEmail?: string | null;
  userName?: string | null;
  userImage?: string | null;
  showSearch?: boolean;
  className?: string;
};

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardNavbar({
  userEmail,
  userName,
  userImage,
  showSearch = true,
  className,
}: DashboardNavbarProps) {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleSignOut() {
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("Gagal logout. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur",
        className
      )}
    >
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center gap-4">
        {showSearch && (
          <form
            className="hidden md:block flex-1 max-w-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Cari..."
                className="pl-9 pr-9"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 select-none items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-muted-foreground">⌘</span>K
              </kbd>
            </div>
          </form>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Menu profil"
            >
              <Avatar className="size-8">
                {userImage && (
                  <AvatarImage src={userImage} alt={userName ?? "Avatar"} />
                )}
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">
                {userName ?? "Pengguna"}
              </span>
              <ChevronDown
                className={cn(
                  "text-muted-foreground hidden size-4 transition-transform duration-200 ease-in-out sm:inline-block",
                  isProfileOpen && "rotate-180"
                )}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">{userName ?? "Pengguna"}</p>
                {userEmail && (
                  <p className="text-muted-foreground text-xs font-normal">
                    {userEmail}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="flex cursor-pointer items-center gap-2">
                <User className="size-4" />
                Edit profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "Keluar..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
