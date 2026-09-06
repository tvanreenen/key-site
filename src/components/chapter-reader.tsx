import { useEffect, useRef } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FeatureDetails } from "@/components/feature-details"
import { UseDemo } from "@/components/use-demo"
import { FeaturePlaceholder } from "@/components/feature-placeholder"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { Chapter } from "@/content/chapters"

export function ChapterReader({
  chapter,
  compact,
  onRead,
}: {
  chapter: Chapter
  compact: boolean
  onRead: () => void
}) {
  const viewport = useRef<HTMLDivElement>(null)
  const overview = useRef<HTMLDivElement>(null)
  const overviewHeading = useRef<HTMLHeadingElement>(null)
  const article = useRef<HTMLElement>(null)
  const articleHeading = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  // On mobile the document owns scrolling. Pause when the article enters view,
  // including readers who reach it without using the jump control.
  useEffect(() => {
    if (!compact) return
    const checkReading = () => {
      const bounds = article.current?.getBoundingClientRect()
      if (bounds && bounds.top < window.innerHeight * 0.65 && bounds.bottom > 0)
        onRead()
    }
    checkReading()
    window.addEventListener("scroll", checkReading, { passive: true })
    return () => window.removeEventListener("scroll", checkReading)
  }, [compact, onRead])

  function jump(toArticle: boolean) {
    onRead()
    const target = toArticle ? article.current : overview.current
    const heading = toArticle ? articleHeading.current : overviewHeading.current
    if (!target) return
    heading?.focus({ preventScroll: true })
    const behavior = reducedMotion ? "instant" : "smooth"
    if (compact) {
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top,
        behavior,
      })
    } else if (viewport.current) {
      viewport.current.scrollTo({
        top:
          viewport.current.scrollTop +
          target.getBoundingClientRect().top -
          viewport.current.getBoundingClientRect().top,
        behavior,
      })
    }
  }

  const content = (
    <>
      <div className="chapter-overview" ref={overview}>
        <div className="chapter-heading">
          <p className="eyebrow text-muted-foreground">
            {chapter.number} / {chapter.label}
          </p>
          <h2 className="chapter-title" ref={overviewHeading} tabIndex={-1}>
            {chapter.title}
          </h2>
          <p className="chapter-description text-muted-foreground">
            {chapter.description}
          </p>
        </div>
        {chapter.id === "use" ? (
          <UseDemo onInteract={onRead} />
        ) : (
          <FeaturePlaceholder chapter={chapter} />
        )}
        <div className="chapter-footer">
          <Button
            variant="ghost"
            className="detail-trigger h-auto justify-start rounded-none p-0 text-left"
            onClick={() => jump(true)}
            aria-controls={`details-${chapter.id}`}
          >
            <span className="text-link">
              Go deeper <ArrowDown aria-hidden="true" />
            </span>
          </Button>
        </div>
      </div>
      <article
        className="chapter-article"
        id={`details-${chapter.id}`}
        ref={article}
        aria-labelledby={`details-heading-${chapter.id}`}
      >
        <div className="reading-toolbar">
          <Button
            variant="ghost"
            className="reading-back h-11 rounded-none p-0 text-sm font-normal"
            onClick={() => jump(false)}
          >
            <ArrowUp aria-hidden="true" /> Back to overview
          </Button>
          <span className="eyebrow text-muted-foreground">
            {chapter.number} / {chapter.label}
          </span>
        </div>
        <div className="detail-copy">
          <h3
            className="detail-title"
            id={`details-heading-${chapter.id}`}
            ref={articleHeading}
            tabIndex={-1}
          >
            {chapter.detail}
          </h3>
          <FeatureDetails chapter={chapter} />
        </div>
      </article>
    </>
  )

  if (compact) return <div className="chapter-reader-mobile">{content}</div>
  return (
    <ScrollArea
      className="chapter-reader"
      viewportProps={{
        ref: viewport,
        "aria-label": `${chapter.label} overview and explanation`,
        role: "region",
        onScroll: (event) => {
          if (event.currentTarget.scrollTop > 0) onRead()
        },
      }}
    >
      {content}
    </ScrollArea>
  )
}
