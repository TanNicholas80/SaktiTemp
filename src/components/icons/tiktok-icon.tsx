import * as React from "react";
import { FaTiktok } from "react-icons/fa";

import { cn } from "@/lib/utils";

export type TiktokIconProps = React.ComponentProps<typeof FaTiktok>;

/**
 * Ikon merek TikTok (lucide tidak menyediakan). Memakai react-icons/fa.
 */
export function TiktokIcon({ className, ...props }: TiktokIconProps) {
  return (
    <FaTiktok className={cn("shrink-0", className)} aria-hidden {...props} />
  );
}
