import { requireCmsSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await requireCmsSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-muted-foreground text-sm">
          Kelola informasi profil Anda
        </p>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Selamat datang, {session.user.name ?? "Pengguna"}. Halaman edit profile
          dapat Anda kembangkan sesuai kebutuhan.
        </p>
      </div>
    </div>
  );
}
