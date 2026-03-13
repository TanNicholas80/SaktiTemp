import Image from "next/image";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/logo_saktitemp.png"
        alt="Logo SaktiTemp"
        width={220}
        height={60}
        priority
        className="h-auto w-auto max-w-[220px]"
      />
    </div>
  );
}
