"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ModificationData, ModificationItem } from "./types";

type Props = {
  modifications: ModificationData[];
  items: ModificationItem[];
  onChange: (items: ModificationItem[]) => void;
  defaultOpen?: boolean;
};

function createEmptyModification(): ModificationItem {
  return {
    id: crypto.randomUUID(),
    modificationName: null,
    thicknessId: null,
    sides: "1",
  };
}

type ModTabProps = {
  index: number;
  item: ModificationItem;
  modifications: ModificationData[];
  onChange: (item: ModificationItem) => void;
  onRemove: () => void;
  canRemove: boolean;
  t: ReturnType<typeof useTranslations>;
};

function ModTab({
  index,
  item,
  modifications,
  onChange,
  onRemove,
  canRemove,
  t,
}: ModTabProps) {
  // Unique modification names
  const uniqueNames = React.useMemo(() => {
    const seen = new Set<string>();
    const names: Array<{ name: string; imageUrl: string }> = [];
    for (const m of modifications) {
      if (!seen.has(m.name)) {
        seen.add(m.name);
        names.push({ name: m.name, imageUrl: m.modificationImageUrl });
      }
    }
    return names;
  }, [modifications]);

  // Available thicknesses for selected modification name
  const availableThicknesses = React.useMemo(() => {
    if (!item.modificationName) return [];
    return modifications
      .filter((m) => m.name === item.modificationName)
      .sort((a, b) => a.thicknessValue - b.thicknessValue);
  }, [item.modificationName, modifications]);

  // Selected modification data
  const selectedMod = React.useMemo(() => {
    if (!item.modificationName || !item.thicknessId) return undefined;
    return modifications.find(
      (m) => m.name === item.modificationName && m.thicknessId === item.thicknessId
    );
  }, [item.modificationName, item.thicknessId, modifications]);

  function handleNameSelect(name: string) {
    onChange({ ...item, modificationName: name, thicknessId: null });
  }

  function handleThicknessChange(thicknessId: string) {
    onChange({ ...item, thicknessId });
  }

  const sidesNum = parseInt(item.sides);
  const totalCost =
    selectedMod && !isNaN(sidesNum) && sidesNum > 0
      ? selectedMod.pricePerSide * sidesNum
      : null;

  return (
    <div className="rounded-lg border border-border bg-background p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {t("itemLabel", { index: index + 1 })}
          {item.modificationName && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              — {item.modificationName}
            </span>
          )}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Tipe Modifikasi */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("typeLabel")}
        </Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {uniqueNames.map((mn) => (
            <button
              key={mn.name}
              type="button"
              onClick={() => handleNameSelect(mn.name)}
              className={cn(
                "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                "hover:border-primary/60 hover:shadow-sm",
                item.modificationName === mn.name
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background"
              )}
            >
              <div className="relative mb-1.5 aspect-[4/3] w-full overflow-hidden rounded-md bg-muted">
                {mn.imageUrl ? (
                  <Image
                    src={mn.imageUrl}
                    alt={mn.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <span className="text-xs font-medium leading-tight text-foreground line-clamp-2">
                {mn.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Ketebalan */}
      {item.modificationName && availableThicknesses.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor={`mod-thickness-${item.id}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("thicknessLabel")}
          </Label>
          <Select
            value={item.thicknessId ?? ""}
            onValueChange={handleThicknessChange}
          >
            <SelectTrigger id={`mod-thickness-${item.id}`} className="w-full sm:w-64">
              <SelectValue placeholder={t("thicknessPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {availableThicknesses.map((t) => (
                <SelectItem key={t.thicknessId} value={t.thicknessId}>
                  {t.thicknessValue} {t.thicknessUnit} — Rp{" "}
                  {t.pricePerSide.toLocaleString("id-ID")} / sisi
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Jumlah Sisi */}
      {item.thicknessId && selectedMod && (
        <div className="space-y-1.5">
          <Label htmlFor={`mod-sides-${item.id}`} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("sideCountLabel")}
          </Label>
          <div className="flex items-center gap-1.5">
            <Input
              id={`mod-sides-${item.id}`}
              type="number"
              min={1}
              max={4}
              placeholder={t("sideCountPlaceholder")}
              className="w-24"
              value={item.sides}
              onChange={(e) => onChange({ ...item, sides: e.target.value })}
            />
            <span className="text-sm text-muted-foreground">{t("sideUnit")}</span>
            {totalCost !== null && (
              <span className="ml-2 text-xs font-medium text-muted-foreground">
                = Rp {totalCost.toLocaleString("id-ID")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Rp {selectedMod.pricePerSide.toLocaleString("id-ID")} × {item.sides || 0} sisi
          </p>
        </div>
      )}
    </div>
  );
}

export function ModificationSection({
  modifications,
  items,
  onChange,
  defaultOpen = false,
}: Props) {
  const t = useTranslations("calculatorSection.modification");
  function handleItemChange(index: number, item: ModificationItem) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleAdd() {
    onChange([...items, createEmptyModification()]);
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "modification" : undefined}
      className="w-full"
    >
      <AccordionItem
        value="modification"
        className="rounded-xl border border-border bg-card shadow-sm border-b-0"
      >
        <AccordionTrigger className="px-5 py-4 text-base font-bold text-primary hover:no-underline">
          <div className="flex items-center gap-2">
            <span>{t("title")}</span>
            {items.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {items.length}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-5 pb-6 text-[0.9375rem]">
            {items.map((item, idx) => (
              <ModTab
                key={item.id}
                index={idx}
                item={item}
                modifications={modifications}
                t={t}
                onChange={(updated) => handleItemChange(idx, updated)}
                onRemove={() => handleRemove(idx)}
                canRemove={items.length > 1}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={handleAdd}
            >
              <Plus className="size-4" />
              {t("addButton")}
            </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
