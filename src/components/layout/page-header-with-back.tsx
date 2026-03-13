import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";

type PageHeaderWithBackProps = {
  title: string;
  description?: string;
  backHref: string;
  action?: ReactNode;
};

export function PageHeaderWithBack({
  title,
  description,
  backHref,
  action,
}: PageHeaderWithBackProps) {
  const showTitle = title || description;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}>
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        {showTitle && (
          <div>
            {title && <h1 className="text-2xl font-semibold">{title}</h1>}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
