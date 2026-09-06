import { ArrowUpRight } from "lucide-react"
import { chapterDetails } from "@/content/chapter-details"
import type { Chapter } from "@/content/chapters"

export function FeatureDetails({ chapter }: { chapter: Chapter }) {
  const detail = chapterDetails[chapter.id]
  return (
    <>
      <p className="detail-intro">{detail.intro}</p>
      <div className="detail-body">
        {detail.sections.map((section) => (
          <section className="detail-section" key={section.heading}>
            {section.label && (
              <p className="eyebrow mb-3 text-muted-foreground">
                {section.label}
              </p>
            )}
            <h4>{section.heading}</h4>
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
    </>
  )
}
