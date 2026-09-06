import { useState } from "react"
import { ArrowRight, ChevronRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  { label: "Save", caption: "Generate with OpenSSL. Store with Key." },
  { label: "Read", caption: "Your value on stdout. Ready for the next tool." },
  { label: "Compose", caption: "Pick with fzf. Copy with Key." },
] as const

// Illustrative output: 24 random bytes would produce 32 Base64 characters.
const exampleSecret = "m7Kp2vN9xR4bT6wY8cD3fH5jL1sA0qEz"

export function UseDemo({
  progress,
  paused,
  onInteract,
}: {
  progress: number
  paused: boolean
  onInteract: () => void
}) {
  const [choice, setChoice] = useState<{
    index: number
    progress: number
  } | null>(null)
  const index =
    paused && choice?.progress === progress
      ? choice.index
      : Math.min(2, Math.floor(progress * steps.length))
  const step = steps[index]

  return (
    <figure className="use-demo" aria-label="Key command-line demonstration">
      <div className="demo-terminal">
        <div className="demo-chrome" aria-hidden="true">
          <span>
            <Terminal /> zsh
          </span>
          <span>
            EXAMPLE <span className="demo-chrome-divider">/</span>{" "}
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div
          className="demo-screen"
          aria-live={paused ? "polite" : "off"}
          aria-atomic="true"
        >
          <div className="demo-scene" key={index}>
            <pre className="demo-command">
              <code>
                <span className="demo-prompt" aria-hidden="true">
                  ❯{" "}
                </span>
                {index === 0 ? (
                  <>
                    <span className="demo-tool">openssl</span> rand -base64 24{" "}
                    <span className="demo-pipe">|</span> <wbr />
                    <span className="demo-tool">key</span> add services/api
                  </>
                ) : index === 1 ? (
                  <>
                    <span className="demo-tool">key</span> get services/api
                  </>
                ) : (
                  <>
                    <span className="demo-tool">key</span> copy{" "}
                    <span className="demo-syntax">"$(</span>
                    <span className="demo-tool">key</span> list{" "}
                    <span className="demo-pipe">|</span> fzf
                    <span className="demo-syntax">)"</span>
                  </>
                )}
              </code>
            </pre>
            {index === 0 && (
              <div className="demo-return">
                <span className="sr-only">
                  Command completes without printing the secret.
                </span>
                <span aria-hidden="true">
                  ❯ <span className="demo-caret" />
                </span>
              </div>
            )}
            {index === 1 && (
              <>
                <pre className="demo-output">
                  <code>{exampleSecret}</code>
                </pre>
                <div className="demo-return" aria-hidden="true">
                  ❯ <span className="demo-caret" />
                </div>
              </>
            )}
            {index === 2 && (
              <section
                className="demo-picker"
                aria-label="Example fzf selection: services/api"
              >
                <div className="demo-picker-search">
                  <span aria-hidden="true">›</span> services/{" "}
                  <span className="demo-caret" />
                  <span className="demo-picker-count">3 / 3</span>
                </div>
                <div className="demo-picker-selected">
                  <ChevronRight aria-hidden="true" /> services/api{" "}
                  <span>↵</span>
                </div>
                <div className="demo-picker-option">services/deploy</div>
                <div className="demo-picker-option">services/staging</div>
              </section>
            )}
          </div>
        </div>
        <p className="demo-caption">
          <ArrowRight aria-hidden="true" />
          <span>{step.caption}</span>
        </p>
      </div>
      <fieldset className="demo-steps">
        <legend className="sr-only">Command examples</legend>
        {steps.map((item, stepIndex) => (
          <Button
            key={item.label}
            variant="ghost"
            className="demo-step"
            aria-pressed={index === stepIndex}
            aria-label={`Show ${item.label.toLowerCase()} example`}
            onClick={() => {
              setChoice({ index: stepIndex, progress })
              onInteract()
            }}
          >
            <span className="demo-step-number">0{stepIndex + 1}</span>
            {item.label}
          </Button>
        ))}
      </fieldset>
    </figure>
  )
}
