import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/shared/admin-signin-form";
import { getServerSession } from "@/lib/session";

export default async function SignInPage() {
  const session = await getServerSession();

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  return <AdminSignInForm />;
}
