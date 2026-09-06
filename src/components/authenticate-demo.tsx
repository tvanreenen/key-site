import {
  authenticationMethods,
  type AuthenticationMethod,
} from "@/content/authentication-demo"

// The supplied Touch ID mark and device illustrations are decorative, not
// OS controls. They never request credentials or authentication.
function AuthenticationArtwork({ method }: { method: AuthenticationMethod }) {
  if (method === "touch") {
    return (
      <span className="auth-artwork auth-artwork-touch" aria-hidden="true">
        <img src="/assets/touch-id-mark.png" width="270" height="270" alt="" />
      </span>
    )
  }

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

export function AuthenticateDemo() {
  return (
    <div className="auth-demo">
      <figure
        className="demo-terminal auth-surface"
        aria-label="Ways to approve the same macOS request"
      >
        <ul className="auth-options">
          {authenticationMethods.map((method) => (
            <li key={method.id}>
              <AuthenticationArtwork method={method.id} />
              <span className="auth-method-label">{method.label}</span>
            </li>
          ))}
        </ul>
        <figcaption className="auth-caption">
          macOS can prompt Touch ID and Apple Watch together. Approve with
          either, or use your Mac password.
        </figcaption>
      </figure>
    </div>
  )
}
