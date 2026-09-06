import { ArrowUpRight } from "lucide-react"
import { projectUrl } from "@/content/chapters"

export function SiteFooter() {
  return (
    <footer className="site-footer page-gutter flex flex-wrap items-center justify-between gap-6 border-t border-border">
      <div className="flex items-center gap-6">
        <a className="wordmark" href="#top" aria-label="key home">
          key
        </a>
        <p className="text-sm text-muted-foreground">
          Your secrets, under your control.
        </p>
      </div>
      <a className="nav-link" href={projectUrl}>
        Built in the open <ArrowUpRight aria-hidden="true" />
      </a>
    </footer>
  )
}
