import { Skeleton } from "@/components/ui/skeleton"
import type { Chapter } from "@/content/chapters"

export function FeaturePlaceholder({ chapter }: { chapter: Chapter }) {
  return (
    <div
      className="feature-placeholder relative flex flex-col justify-between overflow-hidden"
      aria-label={`${chapter.label} demonstration placeholder`}
    >
      <div className="space-y-4" aria-hidden="true">
        <Skeleton className="h-2 w-20 animate-none rounded-none bg-white/15" />
        <Skeleton className="h-2 w-2/5 animate-none rounded-none bg-white/8" />
        <Skeleton className="h-2 w-1/4 animate-none rounded-none bg-white/8" />
      </div>
      <span className="placeholder-number absolute" aria-hidden="true">
        {chapter.number}
      </span>
      <div className="relative">
        <p className="eyebrow text-muted-foreground">Feature preview</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Demonstration to follow.
        </p>
      </div>
    </div>
  )
}
