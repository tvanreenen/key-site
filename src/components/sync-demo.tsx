import { ArrowRight, Check, FileLock2 } from "lucide-react"

function EncryptedFile({ revision }: { revision: string }) {
  return (
    <span className="sync-file">
      <FileLock2 aria-hidden="true" />
      <span>{revision}</span>
    </span>
  )
}

export function SyncDemo() {
  return (
    <div className="sync-demo">
      <figure
        className="demo-terminal sync-surface"
        aria-label="File delivery and verified vault history"
      >
        <div className="sync-flow" aria-hidden="true">
          <div className="sync-delivery">
            <p className="sync-label">Delivered files</p>
            <div className="sync-files">
              {["03", "01", "02"].map((revision) => (
                <EncryptedFile key={revision} revision={revision} />
              ))}
            </div>
          </div>
          <div className="sync-verifier">
            <div className="sync-crossing">
              <span className="sync-wire" />
              <span className="sync-key">key</span>
              <ArrowRight />
            </div>
            <p>
              Authenticate
              <br />
              Verify history
            </p>
          </div>
          <div className="sync-history">
            <p className="sync-label">Verified history</p>
            <div className="sync-checkpoints">
              {["01", "02", "03"].map((revision) => (
                <div className="sync-checkpoint" key={revision}>
                  <span className="sync-node">
                    <Check />
                  </span>
                  <span>{revision}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <figcaption className="sync-caption">
          Files can arrive out of order. Key authenticates their contents and
          connects each change to verified history. Missing or conflicting data
          pauses progress.
        </figcaption>
      </figure>
    </div>
  )
}
