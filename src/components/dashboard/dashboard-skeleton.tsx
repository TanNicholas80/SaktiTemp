import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden rounded-xl border"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <Card>
            <CardHeader>
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
              <div className="mt-3 flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 animate-pulse rounded-md bg-muted"
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 items-center gap-4 rounded-lg bg-muted/50 px-3"
                  >
                    <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map((section) => (
                <div key={section}>
                  <div className="mb-3 h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex h-10 items-center justify-between rounded-lg bg-muted/50 px-3"
                      >
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 w-36 animate-pulse rounded-md bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
