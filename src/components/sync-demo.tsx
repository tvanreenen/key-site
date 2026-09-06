import { FileLock2, Check, ArrowLeft } from "lucide-react"

function Mac({ desktop = false }: { desktop?: boolean }) {
  return (
    <svg
      className="sync-mac"
      viewBox="0 0 100 76"
      fill="none"
      aria-hidden="true"
    >
      <rect x="13" y="9" width="74" height="48" rx="4" />
      <path className="sync-screen" d="M18 14h64v37H18z" />
      {desktop ? (
        <path d="M43 57v9m14-9v9M35 67h30" />
      ) : (
        <path d="M13 57 5 63v2c0 2 2 3 4 3h82c2 0 4-1 4-3v-2l-8-6M40 61h20" />
      )}
      <path className="sync-screen-chain" d="M35 34h30" />
      {[32, 50, 68].map((x) => (
        <circle key={x} cx={x} cy="34" r="4" />
      ))}
    </svg>
  )
}

function VaultHistory() {
  return (
    <div className="sync-folder">
      <span className="sync-folder-tab" />
      <p className="sync-folder-title">Your sync folder</p>
      <div className="sync-records">
        {["01", "02", "03"].map((state, index) => (
          <div className="sync-record" key={state}>
            {index > 0 && <ArrowLeft className="sync-parent-link" />}
            <div className="sync-manifest">
              <span>State</span>
              <strong>{state}</strong>
            </div>
            <span className="sync-entry-link" />
            <FileLock2 className="sync-entry" />
          </div>
        ))}
      </div>
      <p className="sync-folder-note">
        Hash-linked history · Encrypted entries
      </p>
    </div>
  )
}

export function SyncDemo() {
  return (
    <div className="sync-demo">
      <figure
        className="demo-terminal sync-surface"
        aria-label="One vault, independently verified on each Mac"
      >
        <div className="sync-network" aria-hidden="true">
          <div className="sync-publisher">
            <Mac />
            <p>Your Mac</p>
            <span>Publish a change</span>
          </div>
          <svg className="sync-send" viewBox="0 0 40 40" fill="none">
            <path d="M0 20h36m-5-5 5 5-5 5" />
          </svg>
          <VaultHistory />
          <svg
            className="sync-fork"
            viewBox="0 0 40 200"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M0 100h15m0 0V46h23m-5-5 5 5-5 5M15 100v54h23m-5-5 5 5-5 5" />
          </svg>
          <svg
            className="sync-fork-mobile"
            viewBox="0 0 200 32"
            fill="none"
            preserveAspectRatio="none"
          >
            <path d="M0 32v-12h150V2m-4 5 4-5 4 5M50 20V2m-4 5 4-5 4 5" />
          </svg>
          <div className="sync-receivers">
            {[false, true].map((desktop, index) => (
              <div className="sync-receiver" key={index}>
                <Mac desktop={desktop} />
                <p>
                  <Check /> Local checkpoint
                </p>
              </div>
            ))}
          </div>
        </div>
        <figcaption className="sync-summary">
          <p className="sync-summary-title">
            Every Mac verifies before accepting.
          </p>
          <p>
            Each update records SHA-256 hashes of its predecessor and exact
            encrypted entries. Every receiving Mac authenticates that record and
            verifies its files and history before advancing its own local
            checkpoint.
          </p>
          <p className="sync-boundary">
            A missing file delays acceptance. An altered entry or competing
            history stops advancement.
          </p>
        </figcaption>
      </figure>
    </div>
  )
}
