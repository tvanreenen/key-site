import { useState } from "react"
import { Button } from "@/components/ui/button"

const steps = ["Add", "Get", "Edit"] as const
const exampleSecret = "example-api-key"

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

  return (
    <figure className="use-demo" aria-label="Key command-line demonstration">
      <div className="demo-terminal">
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
                <span className="demo-tool">key</span>{" "}
                {steps[index].toLowerCase()} services/api
              </code>
            </pre>
            {index === 1 ? (
              <>
                <pre className="demo-output">
                  <code>{exampleSecret}</code>
                </pre>
                <div className="demo-return" aria-hidden="true">
                  ❯ <span className="demo-caret" />
                </div>
              </>
            ) : (
              <div className="demo-input">
                <span>
                  Secret: <span className="demo-caret" aria-hidden="true" />
                </span>
                <span className="demo-input-hint">input hidden</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <fieldset className="demo-steps">
        <legend className="sr-only">Command examples</legend>
        {steps.map((item, stepIndex) => (
          <Button
            key={item}
            variant="ghost"
            className="demo-step"
            aria-pressed={index === stepIndex}
            aria-label={`Show ${item.toLowerCase()} example`}
            onClick={() => {
              setChoice({ index: stepIndex, progress })
              onInteract()
            }}
          >
            <span className="demo-step-number">0{stepIndex + 1}</span>
            {item}
          </Button>
        ))}
      </fieldset>
    </figure>
  )
}
