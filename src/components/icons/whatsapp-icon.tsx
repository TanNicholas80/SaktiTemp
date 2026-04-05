import * as React from "react";
import { FaWhatsapp } from "react-icons/fa";

import { cn } from "@/lib/utils";

export type WhatsAppIconProps = React.ComponentProps<typeof FaWhatsapp>;

/**
 * Ikon merek WhatsApp (lucide tidak menyediakan). Memakai react-icons/fa.
 */
export function WhatsAppIcon({ className, ...props }: WhatsAppIconProps) {
  return (
    <FaWhatsapp className={cn("shrink-0", className)} aria-hidden {...props} />
  );
}
