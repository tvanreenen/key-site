import { ArrowUpRight, Plus, X } from "lucide-react"
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
import { chapterDetails } from "@/content/chapter-details"
import type { Chapter } from "@/content/chapters"

export function FeatureDetails({
  chapter,
  onOpen,
}: {
  chapter: Chapter
  onOpen: () => void
}) {
  const detail = chapterDetails[chapter.id]

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
            className="detail-trigger h-auto justify-start rounded-none p-0 text-left"
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
        <div className="reading-toolbar flex items-center justify-between gap-4">
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
        <section
          className="detail-scroll"
          aria-label={`${chapter.label} explanation`}
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The scroll region must be reachable for keyboard reading.
          tabIndex={0}
        >
          <DialogHeader className="gap-6">
            <DialogTitle className="detail-title">{chapter.title}</DialogTitle>
            <DialogDescription className="detail-intro">
              {detail.intro}
            </DialogDescription>
          </DialogHeader>
          <div className="detail-body">
            {detail.sections.map((section) => (
              <section className="detail-section" key={section.heading}>
                {section.label && (
                  <p className="eyebrow mb-3 text-muted-foreground">
                    {section.label}
                  </p>
                )}
                <h3>{section.heading}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.code && (
                  <pre className="detail-code">
                    <code>{section.code}</code>
                  </pre>
                )}
              </section>
            ))}
            <footer className="detail-sources">
              {detail.scope && <p className="detail-scope">{detail.scope}</p>}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {detail.references.map((reference) => (
                  <a
                    className="detail-reference"
                    href={reference.href}
                    key={reference.href}
                  >
                    {reference.label} <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </footer>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
