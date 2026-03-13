import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border py-12">
      <div className="flex gap-2">
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="size-3 rounded-full" />
        <Skeleton className="size-3 rounded-full" />
      </div>
      <p className="text-muted-foreground text-sm">Memuat...</p>
    </div>
  );
}
