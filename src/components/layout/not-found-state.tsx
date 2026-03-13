import Link from "next/link";

import { Button } from "@/components/ui/button";

type NotFoundStateProps = {
  message: string;
  backHref: string;
  backLabel: string;
};

export function NotFoundState({
  message,
  backHref,
  backLabel,
}: NotFoundStateProps) {
  return (
    <div className="space-y-4 py-12 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href={backHref}>← {backLabel}</Link>
      </Button>
    </div>
  );
}
