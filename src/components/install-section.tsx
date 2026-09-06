import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { installCommand, projectUrl } from "@/content/chapters"

export function InstallSection() {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle")
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timeout.current), [])

  async function copyCommand() {
    clearTimeout(timeout.current)
    try {
      await navigator.clipboard.writeText(installCommand)
      setFeedback("copied")
    } catch {
      setFeedback("failed")
    }
    timeout.current = setTimeout(() => setFeedback("idle"), 4000)
  }

  return (
    <section
      id="install"
      className="install-section page-gutter"
      aria-labelledby="install-title"
    >
      <div>
        <p className="eyebrow text-muted-foreground">Get started / macOS 14+</p>
        <h2 id="install-title" className="install-title">
          Make it
          <br />
          your CLI.
        </h2>
        <a className="text-link mt-8" href={`${projectUrl}#readme`}>
          Read the documentation <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <div className="install-instructions">
        <div className="mb-5 flex items-center justify-between gap-5">
          <h3 className="eyebrow text-muted-foreground">
            Install with Homebrew
          </h3>
          <Button
            variant="ghost"
            className="size-11 rounded-none"
            size="icon"
            onClick={copyCommand}
            aria-label="Copy install commands"
          >
            {feedback === "copied" ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
          </Button>
        </div>
        <pre className="install-code">
          <code>{installCommand}</code>
        </pre>
        <output className="copy-feedback block text-sm text-muted-foreground">
          {feedback === "copied"
            ? "Copied to clipboard."
            : feedback === "failed"
              ? "Select the commands above to copy them manually."
              : ""}
        </output>
        <p className="install-note text-muted-foreground">
          Open <span className="text-foreground">Key.app</span> once to register
          Key Agent with macOS. Then follow the setup guide for your vault.
        </p>
      </div>
    </section>
  )
}
