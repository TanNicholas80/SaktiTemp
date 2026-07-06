"use client";

import { Phone, Mail, Clock, MapPin, type LucideIcon } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const CONTACT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  Mail,
  Clock,
  MapPin,
  WhatsApp: WhatsAppIcon,
};

type ContactItemPreviewProps = {
  iconName: string;
  label: string;
  value: string;
  valueExtra?: string | null;
  variant?: "default" | "compact";
};

export function ContactItemPreview({
  iconName,
  label,
  value,
  valueExtra,
  variant = "default",
}: ContactItemPreviewProps) {
  const IconComponent = CONTACT_ICON_MAP[iconName] ?? Phone;

  if (variant === "compact") {
    return (
      <div className="flex max-w-[200px] items-center gap-3 truncate border-l-4 border-primary pl-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary">
          <IconComponent className="size-4 text-white" />
        </div>
        <div className="min-w-0 flex-1 truncate">
          <p className="truncate text-sm font-medium">{label || "Label"}</p>
          <p className="text-muted-foreground truncate text-xs">{value || "Nilai"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-medium">
        Preview tampilan kontak
      </p>
      <div className="flex items-start gap-3 border-l-4 border-primary pl-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary">
          <IconComponent className="size-5 text-white" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="font-medium">{label || "Label"}</p>
          <p className="text-muted-foreground text-sm">{value || "Nilai"}</p>
          {valueExtra && (
            <p className="text-muted-foreground text-sm">{valueExtra}</p>
          )}
        </div>
      </div>
    </div>
  );
}
