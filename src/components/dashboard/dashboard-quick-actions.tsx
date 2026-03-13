import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const actions = [
  { href: "/admin/blog/new", label: "Tambah Blog", variant: "default" as const },
  { href: "/admin/product/new", label: "Tambah Produk", variant: "outline" as const },
  {
    href: "/admin/portofolio/new",
    label: "Tambah Portofolio",
    variant: "outline" as const,
  },
];

export function DashboardQuickActions() {
  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Aksi Cepat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <Button
              key={action.href}
              variant={action.variant}
              size="sm"
              className="gap-2"
              asChild
            >
              <Link href={action.href}>
                <Plus className="size-4 shrink-0" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
