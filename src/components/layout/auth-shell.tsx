import { BrandLogo } from "@/components/shared/brand-logo";

type AuthShellProps = {
  children: React.ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="grid h-dvh grid-cols-1 overflow-hidden bg-background lg:grid-cols-2">
      <section className="flex h-full items-center justify-center overflow-y-auto px-6 py-6 sm:px-10">
        <div className="w-full max-w-md">
          <BrandLogo className="mb-8" />
          {children}
        </div>
      </section>

      <section className="relative hidden h-full overflow-hidden lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          poster="/logo_baru_warna.png"
        >
          <source src="/aset_video_saktitemp.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-primary/30" />
      </section>
    </div>
  );
}
