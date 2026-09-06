import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { Chapter } from "@/content/chapters"

export function FeatureDetails({
  chapter,
  onOpen,
}: {
  chapter: Chapter
  onOpen: () => void
}) {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) onOpen()
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            className="detail-trigger h-auto justify-start rounded-none p-0 text-left hover:bg-transparent"
          />
        }
      >
        <span>
          <span className="text-link">
            Go deeper <Plus aria-hidden="true" />
          </span>
          <span className="mt-2 block text-sm font-normal whitespace-normal text-muted-foreground">
            {chapter.detail}
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="reading-dialog" showCloseButton={false}>
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow text-muted-foreground">
            {chapter.number} / {chapter.label}
          </p>
          <DialogClose
            render={
              <Button
                variant="ghost"
                className="size-11 rounded-full"
                size="icon"
              />
            }
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Close details</span>
          </DialogClose>
        </div>
        <DialogHeader className="gap-6">
          <DialogTitle className="detail-title">{chapter.title}</DialogTitle>
          <DialogDescription className="max-w-lg text-base leading-relaxed">
            {chapter.detail}. This chapter’s detailed explanation is being
            developed.
          </DialogDescription>
        </DialogHeader>
        <div className="detail-placeholder space-y-5" aria-hidden="true">
          <Skeleton className="h-4 w-2/3 animate-none rounded-none bg-white/10" />
          <Skeleton className="h-3 w-full animate-none rounded-none bg-white/5" />
          <Skeleton className="h-3 w-5/6 animate-none rounded-none bg-white/5" />
          <Skeleton className="mt-10 h-32 w-full animate-none rounded-none bg-white/4" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
