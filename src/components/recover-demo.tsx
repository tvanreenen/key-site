import { ArrowRight, Check, FolderLock, Plus } from "lucide-react"
import { MacIllustration } from "@/components/mac-illustration"

function RecoveryKeys() {
  return (
    <svg
      className="recovery-keys"
      viewBox="0 0 90 100"
      fill="none"
      aria-hidden="true"
    >
      {[
        { x: 12, angle: -12 },
        { x: 43, angle: 8 },
      ].map(({ x, angle }, index) => (
        <g
          key={x}
          transform={`translate(${x} 7) rotate(${angle} 16 43)`}
          opacity={index === 0 ? 0.55 : 1}
        >
          <rect
            className="recovery-key-body"
            x="0"
            y="20"
            width="30"
            height="65"
            rx="8"
          />
          <path d="M7 20V3h16v17M12 8v7m6-7v7" />
          <circle cx="15" cy="46" r="8" />
          <circle cx="15" cy="73" r="3" />
        </g>
      ))}
    </svg>
  )
}

export function RecoverDemo() {
  return (
    <div className="recover-demo">
      <figure
        className="demo-terminal recover-surface"
        aria-label="An enrolled Mac and vault files can authorize a replacement"
      >
        <div className="recover-path" aria-hidden="true">
          <div className="recover-device">
            <MacIllustration />
            <span>Enrolled Mac</span>
          </div>
          <Plus className="recover-plus" />
          <div className="recover-files">
            <FolderLock />
            <span>Vault files</span>
          </div>
          <ArrowRight className="recover-arrow" />
          <div className="recover-device recover-replacement">
            <div className="recover-new-mac">
              <MacIllustration />
              <Check className="recover-approved" />
            </div>
            <span>Replacement Mac</span>
          </div>
        </div>
        <figcaption className="recover-caption">
          An enrolled Mac approves the replacement’s own Secure Enclave keys.
          Adding or revoking a device creates a fresh vault key and re-encrypts
          the current vault for the Macs that retain access.
        </figcaption>
      </figure>
      <section
        className="recover-planned"
        aria-labelledby="hardware-recovery-title"
      >
        <RecoveryKeys />
        <div>
          <div className="recover-plan-heading">
            <h3 id="hardware-recovery-title">Physical-key recovery</h3>
            <span className="recover-plan-label">Planned</span>
          </div>
          <p>
            A registered PIV hardware key would work with your vault files if
            every Mac is lost. Primary and backup keys would each recover access
            independently.
          </p>
        </div>
      </section>
    </div>
  )
}
