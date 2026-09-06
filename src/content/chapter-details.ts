import type { Chapter } from "./chapters"
import { projectUrl } from "./chapters"

interface DetailSection {
  heading: string
  paragraphs: string[]
  code?: string
  label?: string
}

interface ChapterDetail {
  intro: string
  sections: DetailSection[]
  scope?: string
  references: { label: string; href: string }[]
}

// Evidence and release boundaries are recorded in docs/chapter-content.md.
export const chapterDetails: Record<Chapter["id"], ChapterDetail> = {
  use: {
    intro:
      "A secret can start at a prompt, arrive through a pipe, and leave as input to another tool. Key fits into those paths while keeping vault access behind your Mac’s authentication.",
    sections: [
      {
        heading: "Save a value without putting it in the command.",
        paragraphs: [
          "Run key add with an entry name and Key asks for the value with typing hidden. Or send the value through standard input. The command you type contains the name and the operation, so the secret itself does not need to become a command-line argument or a literal in shell history.",
          "Password generation stays with the tools you already use. Here, OpenSSL generates a random value and passes it directly to Key:",
        ],
        code: "openssl rand -base64 32 | key add services/api",
      },
      {
        heading: "Output that belongs in a pipeline.",
        paragraphs: [
          "key get writes the value to standard output. When that output goes to a pipe or file, Key adds no presentation newline; prompts and errors use standard error. For ordinary secret entries, piped input preserves its UTF-8 text, including line breaks. Those details keep a stored value from changing simply because it passed through the CLI.",
          "key list returns entry names, which makes it useful as input to a selector. With fzf installed, this command lets you choose an entry and copy its value:",
        ],
        code: 'key copy "$(key list | fzf)"',
      },
      {
        heading: "One-time codes use the same workflow.",
        paragraphs: [
          "Save an authenticator’s Base32 setup secret with --totp. Key keeps that seed encrypted and generates the current time-based one-time password, or TOTP, when you read or copy the entry. The changing code and the password you use beside it can live behind the same vault access model.",
          "Provide the Base32 secret from the authenticator setup, rather than a full otpauth:// URL.",
        ],
        code: "key add --totp github/mfa\nkey copy github/mfa",
      },
      {
        heading: "Unlock once, work across commands.",
        paragraphs: [
          "The CLI sends vault operations to Key Agent, the signed background service. An unlocked session can be reused across separate invocations, so a short sequence of commands does not need a new authentication prompt at every step. Run key lock to end that session on this Mac.",
          "Once you print, copy, or hand a value to another program, that destination has the plaintext. Locking the vault ends access through Key; it does not erase terminal output or clipboard contents.",
        ],
      },
    ],
    references: [
      { label: "Command reference", href: `${projectUrl}#command-reference` },
    ],
  },
  authenticate: {
    intro:
      "In a device-enrolled vault, unlocking starts with keys that belong to this Mac. macOS requires your presence to use them, and Key Agent turns that approval into a bounded session.",
    sections: [
      {
        heading: "Your Mac brings the available ways to approve.",
        paragraphs: [
          "User presence means macOS asks you to authorize protected key access using the authentication available on your Mac. It can offer Touch ID while looking for a nearby paired Apple Watch, with your Mac password as a fallback. The choices depend on your hardware and settings.",
          "Key attaches that requirement to the protected private keys themselves. macOS enforces it when those keys are used. There is no separate vault password to remember, and your Mac password is not used to derive the vault’s encryption key.",
        ],
      },
      {
        heading: "Two private keys, each bound to this Mac.",
        paragraphs: [
          "Each enrolled Mac creates two P-256 private keys protected by the Secure Enclave, Apple’s hardware security subsystem. A signing key authorizes changes to which devices can access the vault. A separate key-agreement key opens the vault-key wrapper addressed to this Mac.",
          "Those private keys cannot be exported as usable keys for another Mac. The folder carries the public information needed to recognize devices and encrypt for them. Copying that folder, or signing into the same cloud account, does not enroll another computer.",
        ],
      },
      {
        heading: "A random vault key, encrypted for each device.",
        paragraphs: [
          "The vault has a random 256-bit encryption key. Key uses CryptoKit’s HPKE, Hybrid Public Key Encryption, to wrap it separately for every active Mac, combining P-256 key agreement, HKDF-SHA256 key derivation, and AES-256-GCM encryption.",
          "Each wrapper is cryptographically bound to the vault, the exact vault key, its recipient, and the device-access change that created it. Moving a wrapper between those contexts does not create valid access.",
          "Secret values are sealed with AES-256-GCM. Their vault, entry identity, name, type, and revision are authenticated alongside the ciphertext, so the checks cover both the encrypted value and where it belongs.",
        ],
      },
      {
        heading: "The session has a defined lifetime.",
        paragraphs: [
          "The Secure Enclave protects the device private keys. Vault decryption happens in Key Agent, which holds the unwrapped vault key in memory during the session. The device-enrolled model does not persist that raw key in the synced folder or as a reusable Keychain item.",
          "The session expires after 15 minutes without vault-key use. Using the key extends that window; key lock or a helper restart ends it. Ordinary commands reuse the session, so approval is not requested separately for every secret read. An unlocked session is not a defense against malicious software acting through an authorized CLI on your Mac.",
        ],
      },
    ],
    scope:
      "This describes device-enrolled vaults. Older Keychain-backed vaults use a different key-storage model; moving to device enrollment is an explicit migration.",
    references: [
      { label: "Key’s access model", href: `${projectUrl}#how-access-works` },
      {
        label: "Apple’s authentication policy",
        href: "https://developer.apple.com/documentation/LocalAuthentication/LAPolicy/deviceOwnerAuthentication",
      },
    ],
  },
  sync: {
    intro:
      "Your provider moves the files. In a device-enrolled vault, Key independently checks their contents, their history, and the authority behind changes before using them.",
    sections: [
      {
        heading: "A vault records how it changed.",
        paragraphs: [
          "A saved change creates new encrypted objects and a new manifest: a record of the vault’s entries and the history that led to them. Existing versions stay immutable. SHA-256 digests identify exact file contents, while HMAC-SHA256 authenticates the manifest. Changes to device access also require an active Mac’s digital signature.",
          "That gives Key evidence to check beyond a filename or modification date. An encrypted entry must match the exact object and revision its authenticated manifest describes before Key releases its value.",
        ],
      },
      {
        heading: "Arrival order does not decide what is trusted.",
        paragraphs: [
          "Each Mac keeps a local checkpoint of the exact vault history it has already verified. New history must connect to that checkpoint and pass authentication. A returning Mac follows device-access and key changes in order, verifying each transition before opening its next wrapped key.",
          "If a manifest arrives before an entry it references, Key treats the state as incomplete. It preserves the previous checkpoint and pauses operations that need the missing files. A newer timestamp cannot make incomplete data valid, and an older copy cannot silently reset what this Mac already trusts.",
          "An explicit --allow-stale read can use the last complete version already verified on this Mac. It cannot authorize a write or bypass failed security checks.",
        ],
      },
      {
        heading: "Competing edits stay visible.",
        paragraphs: [
          "Two Macs can each save a change before receiving the other’s update. If those changes produce competing histories, Key detects the divergence and pauses ordinary reads and writes. The immutable files preserve both branches, and an explicit stale read can still use this Mac’s last complete verified state. The provider’s last-write timestamp does not choose the winning secret.",
          "Changes to device access have a stricter boundary. Competing enrollment, revocation, or key transitions are security conflicts and are never automatically merged as ordinary content edits.",
        ],
      },
      {
        heading: "A write finishes only after verification.",
        paragraphs: [
          "For ordinary writes, Key stages encrypted files, publishes entries before their manifest, and verifies the saved objects before advancing its local checkpoint. That final update is conditional on the previous checkpoint still being the one the operation started from.",
          "Local recovery records let Key inspect an interrupted transaction and retain the previous state or finish a verified new one. Missing or contradictory evidence stops the operation. It does not trigger creation of an empty replacement vault.",
        ],
      },
      {
        heading: "The provider transports data; Key owns these decisions.",
        paragraphs: [
          "Encryption, history verification, conflict handling, and device authorization live in Key. They do not rely on an iCloud-specific service. Local APFS and iCloud Drive have been directly qualified; other folder-based providers still need compatible filesystem behavior and testing.",
          "These checks can detect unacceptable data, but they cannot force a provider to deliver missing files or replace a backup. Secret values are encrypted; entry names and structural metadata remain visible in storage.",
        ],
      },
    ],
    scope:
      "These history and synchronization protections belong to device-enrolled vaults. Older Keychain-backed vaults use individually encrypted named files.",
    references: [
      {
        label: "Provider support and conflicts",
        href: `${projectUrl}#provider-setup-and-conflicts`,
      },
    ],
  },
  recover: {
    intro:
      "A second enrolled Mac preserves a way to authorize a replacement. It has its own device keys and equal authority, so continuity does not depend on keeping the first Mac forever.",
    sections: [
      {
        heading: "Keep access on more than one Mac.",
        paragraphs: [
          "Every active Mac in a device-enrolled vault can approve a new Mac or revoke a lost one after authentication and review. There is no special original computer that must remain available. With one active Mac and usable vault files, you can add a replacement without exporting the surviving Mac’s private keys.",
          "Keep at least two Macs enrolled, and keep backups of the vault files. An enrolled Mac preserves authority to open the vault; a file backup preserves the data. You need both access and usable data to continue.",
        ],
        code: "key share devices",
      },
      {
        heading: "Enrollment proves which Mac you are adding.",
        paragraphs: [
          "A new Mac creates its own Secure Enclave identity and answers a short-lived invitation. You compare the displayed device pair and comparison code on both Macs before approving. The invitation lasts 10 minutes, and the approval is bound to that exact exchange.",
          "The resulting access change is signed by the approving Mac, and the vault key is wrapped for the approved identity. A provider can carry those messages, but copying them cannot substitute a different device into the agreement.",
        ],
      },
      {
        heading: "Changing access changes the encryption.",
        paragraphs: [
          "Adding or removing a Mac creates a new random vault key and re-encrypts the complete current snapshot. Each remaining active Mac receives its own wrapper for that new key. A newly enrolled Mac receives current data without receiving the old encryption keys.",
          "Revocation leaves the removed Mac without a wrapper for the new key, preventing it from reading the new current snapshot and future changes. It cannot erase old secrets, exports, or encrypted history that Mac already had the keys to open.",
        ],
      },
      {
        label: "Planned",
        heading: "Physical recovery keys for the loss of every Mac.",
        paragraphs: [
          "The next recovery direction is PIV smart-card hardware, including compatible YubiKeys. The design under evaluation uses independent primary and backup tokens, registered before a loss and kept separately. Each would hold its own non-exportable recovery key; either could provide recovery authority alongside the encrypted vault files.",
          "A PIN would activate the physical token, rather than serve as a password for decrypting a copied vault. This is a separate recovery path from Touch ID, Apple Watch approval, or a security key’s FIDO login function. Hardware compatibility, PIN and touch behavior, and replacement procedures still need physical qualification.",
        ],
      },
    ],
    scope:
      "Available today: continuity through a surviving enrolled Mac. Recovery after the last enrolled Mac is lost is not yet available. If every enrolled Mac and its access keys are lost, a vault-folder backup, your Mac password, or your cloud account cannot restore access.",
    references: [
      {
        label: "Enrollment and device continuity",
        href: `${projectUrl}#enrolling-another-mac`,
      },
      {
        label: "Current recovery limits",
        href: `${projectUrl}#install-and-choose-a-release-channel`,
      },
    ],
  },
}
