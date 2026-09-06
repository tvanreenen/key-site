import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  authenticationMethods,
  type AuthenticationMethod,
} from "@/content/authentication-demo"

// Illustrations share a coordinate system and stroke treatment. They are not
// OS controls: selecting a view never requests credentials or authentication.
function AuthenticationArtwork({ method }: { method: AuthenticationMethod }) {
  return (
    <svg
      className={`auth-artwork auth-artwork-${method}`}
      viewBox={method === "password" ? "0 45 180 90" : "0 0 180 180"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {method === "touch" && (
        <>
          <circle className="auth-metal" cx="90" cy="90" r="68" />
          <circle className="auth-edge" cx="90" cy="90" r="63" />
          <g className="auth-fingerprint">
            <path d="M61 76c4-13 15-21 29-21s26 9 30 22" />
            <path d="M53 92c0-23 16-39 37-39" opacity=".35" />
            <path d="M61 94c0-17 12-29 29-29s29 12 29 29c0 9 1 16 5 23" />
            <path d="M71 124c5-11 6-19 6-30a13 13 0 0 1 26 0c0 17 3 28 10 39" />
            <path d="M60 116c6-10 7-15 7-22a23 23 0 0 1 46 0c0 11 2 20 7 29" />
            <path d="M90 88c-3 0-5 3-5 6 0 18-3 31-10 43" />
            <path d="M94 98c0 15 2 29 9 42" />
            <path d="M85 140c3-6 5-12 6-18" />
            <path d="M61 95c0 4-1 8-3 12" />
          </g>
        </>
      )}
      {method === "watch" && (
        <>
          <path
            className="auth-metal"
            d="M69 47 72 15h36l3 32M69 133l3 32h36l3-32"
          />
          <rect
            className="auth-metal"
            x="53"
            y="42"
            width="74"
            height="96"
            rx="25"
          />
          <rect
            className="auth-edge"
            x="59"
            y="48"
            width="62"
            height="84"
            rx="20"
          />
          <path className="auth-watch-button" d="M130 84v20" strokeWidth="3" />
          <path className="auth-edge" d="M129 62v10" strokeWidth="3" />
          <path d="m76 90 9 9 18-19" strokeWidth="2" />
          <path className="auth-watch-signal" d="M140 88v12m6-15v18" />
        </>
      )}
      {method === "password" && (
        <>
          <rect
            className="auth-metal"
            x="16"
            y="69"
            width="148"
            height="44"
            rx="9"
          />
          <g fill="currentColor" stroke="none">
            {[35, 47, 59, 71, 83, 95].map((x) => (
              <circle key={x} cx={x} cy="91" r="2.4" />
            ))}
          </g>
          <path className="auth-edge" d="M117 81v20" />
          <path d="M143 85v7h-13m5-5-5 5 5 5" />
        </>
      )}
    </svg>
  )
}

export function AuthenticateDemo({ onInteract }: { onInteract: () => void }) {
  const [index, setIndex] = useState(0)
  const sceneId = useId()
  const method = authenticationMethods[index]

  return (
    <figure className="auth-demo" aria-label="Mac authentication walkthrough">
      <div className="demo-terminal">
        <div id={sceneId} aria-live="polite" aria-atomic="true">
          <div className="auth-scene demo-scene" key={method.id}>
            <AuthenticationArtwork method={method.id} />
            <div className="auth-explanation">
              <h3>{method.title}</h3>
              <p>{method.explanation}</p>
            </div>
          </div>
        </div>
      </div>
      <fieldset className="demo-steps auth-methods">
        <legend className="sr-only">Authentication examples</legend>
        {authenticationMethods.map((item, methodIndex) => (
          <Button
            key={item.id}
            variant="ghost"
            className="demo-step"
            aria-pressed={index === methodIndex}
            aria-controls={sceneId}
            aria-label={`Show ${item.label} authentication`}
            onClick={() => {
              setIndex(methodIndex)
              onInteract()
            }}
          >
            {item.label}
          </Button>
        ))}
      </fieldset>
    </figure>
  )
}
