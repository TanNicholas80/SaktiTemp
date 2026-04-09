import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  isBlogEditorAllowedPath,
  isBlogEditorRole,
} from "@/lib/roles";
import { getServerSession } from "@/lib/session";

export default async function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const pathname =
    (await headers()).get("x-pathname")?.trim() ?? "";

  if (
    session?.user &&
    isBlogEditorRole(session.user.role) &&
    pathname &&
    !isBlogEditorAllowedPath(pathname)
  ) {
    redirect("/admin/blog");
  }

  return <>{children}</>;
}
