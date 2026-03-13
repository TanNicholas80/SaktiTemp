"use client";

import * as React from "react";
import { getBenefitIcon } from "@/components/shared/icon-preview-card";
import { CardActionsMenu } from "@/components/shared/card-actions-menu";
import type { BenefitCardData } from "@/components/benefit/types";

export type { BenefitCardData } from "@/components/benefit/types";

type BenefitCardProps = {
  benefit: BenefitCardData;
  onEdit: (benefit: BenefitCardData) => void;
  onDelete: (benefit: BenefitCardData) => void;
};

export function BenefitCard({
  benefit,
  onEdit,
  onDelete,
}: BenefitCardProps) {
  const Icon = getBenefitIcon(benefit.benefitIcon);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <CardActionsMenu
        onEdit={() => onEdit(benefit)}
        onDelete={() => onDelete(benefit)}
        position="top-right"
      />

      <div className="flex flex-col gap-4 pr-10">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          {React.createElement(Icon, { className: "size-6 text-primary" })}
        </div>

        <h2 className="text-base font-bold leading-tight text-foreground">
          {benefit.benefitName}
        </h2>

        <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
          {benefit.benefitDescription}
        </p>
      </div>
    </article>
  );
}
