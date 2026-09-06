# Go deeper content

The four inline articles explain the CLI workflow, device-enrolled authentication, verified folder synchronization, and device continuity. The writing names mechanisms, explains their consequences, and states the limits that matter to the reader. Use provides a command walkthrough; Authenticate, Sync, and Recover use explanatory illustrations.

Copy lives in `src/content/chapter-details.ts`. `src/components/feature-details.tsx` renders the shared article content; `src/components/chapter-reader.tsx` owns the overview, reading layout, focus, and scroll navigation. Desktop uses shadcn Scroll Area, while mobile uses document scrolling. The article stays available below the overview, with a sticky Back to overview control. Go deeper moves focus to the article heading and scrolls its start into view. Both controls respect reduced motion. Reading pauses automatic playback, and changing chapters mounts a fresh overview.

## Evidence reviewed

Source repository: `/Users/tim.vanreenen/Code/key`, clean checkout at `2adba7de353acce68f5a3a0303259cba25d851f5`, inspected September 6, 2026. These are source and documentation observations, not a new execution or security audit of Key. The marketing site's build, accessibility checks, and browser checks are separate.

### Use

- `Sources/KeyCore/KeyCLIApplication.swift`: secure/piped input, get output formatting, copy dispatch, lock, and TOTP normalization.
- `Sources/KeyCore/InputOutput.swift`: terminal echo suppression, UTF-8 piped input, and separate stdout/stderr.
- `Sources/KeyCore/V3DeviceWrappedVaultMutationService.swift`: ordinary secrets preserve their input; TOTP seeds are normalized.
- `README.md`, Quick start: supported command examples, external generator composition, optional fzf, Base32 seeds, and the absence of full otpauth URL support.

The examples do not put a secret literal in command arguments. This does not promise that piping a value removes it from the memory or output of receiving programs. Locking does not erase previously revealed values.

### Authenticate

- `Sources/KeyCore/V3EnrollmentDeviceIdentityStore.swift`: separate Secure Enclave P-256 signing and key-agreement keys; `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`; `.privateKeyUsage` and `.userPresence` access control.
- `Sources/KeyCore/V3VaultKeyHPKE.swift`: CryptoKit HPKE with P-256, HKDF-SHA256, AES-256-GCM, and binding to vault ID, key ID, recipient, and authority transition.
- `Sources/KeyCore/V3EntryCipher.swift` and `V3EntryAuthenticationContext.swift`: authenticated encryption tied to entry identity, name, type, revision, vault, and key.
- `Sources/KeyCore/V3DeviceWrappedVaultKeySession.swift`: memory-only raw key storage, 15-minute inactivity expiration, invalidation, and refresh on key use.
- `Sources/KeyCore/KeyServiceHandler.swift`: production composition of device-wrapped key access, reads, mutations, and catch-up.
- [Apple authentication policy](https://developer.apple.com/documentation/LocalAuthentication/LAPolicy/deviceOwnerAuthentication): Touch ID and paired Watch discovery can run in parallel; password fallback and hardware/settings conditions apply.
- [Apple Secure Enclave key protection](https://developer.apple.com/documentation/Security/protecting-keys-with-the-secure-enclave): private key material is not exportable in plaintext.

Do not imply that the vault's AES operations happen inside the Secure Enclave, that the raw vault key never enters process memory, or that each secret read requires separate approval. The Enclave protects device private keys; Key Agent uses the unwrapped vault key in a bounded session. The Mac password authorizes key access and is not a vault-key derivation or catastrophe-recovery method.

### Sync

- `Sources/KeyCore/V3DeviceWrappedManifestEnvelope.swift`, `V3ManifestAuthentication.swift`, and `V3EntryCipher.swift`: authenticated manifests, exact object digests, and entry verification.
- `Sources/KeyCore/V3ManifestReplayProtection.swift` and `V3ManifestCheckpointKeychainStore.swift`: exact, local, conditionally advanced checkpoints.
- `Sources/KeyCore/V3DeviceWrappedCatchUpCoordinator.swift`: authenticated forward progress, ordered content/key transitions, conflict classification, and explicit stale-read gates.
- `Sources/KeyCore/V3DeviceWrappedContentMutationPublisher.swift`: anchored transaction recovery records, staged immutable publication, entries before manifest, read-back validation, and conditional checkpoint advance.
- `Sources/KeyCore/V3DeviceWrappedInterruptedTransactionRecoverer.swift`: recovery of ordinary device-wrapped transactions.
- `docs/security-continuity-recovery.md`: APFS/iCloud qualification, filesystem requirements, availability versus failed verification, and recovery limitations.

The text distinguishes hashes that identify bytes from keyed authentication that establishes trust. It does not promise provider availability, hidden entry names, compatibility with every provider, or recovery from a folder backup alone.

#### Documentation mismatch: automatic merging

The README describes automatic merging of independent edits. The repository also contains a reconciler and tests for such merge plans, but this is insufficient evidence for automatic merging in the shipping device-enrolled path. `KeyServiceHandler.swift` wires `V3DeviceWrappedVaultRuntime` to `V3DeviceWrappedReadOnlyVaultRuntime` and the device-wrapped catch-up coordinator. `V3DeviceWrappedCatchUpAccessGate.requireCurrent` refuses competing content histories for ordinary reads/writes; explicit stale reads retain the local checkpoint. The inspected device-wrapped read-only adapter's conflict-inspection methods are empty/not-found, and resolution is refused.

The site therefore describes detection, branch preservation, pausing, and explicit stale reads. It does not promise automatic merging or an interactive per-entry resolution workflow for this path. Before adding those claims, trace their integration into the device-enrolled production composition and verify end-to-end behavior. The separate Key repository and its README were not modified in this task.

### Recover

- `Sources/KeyCore/V3DeviceWrappedEnrollmentTransition.swift`, `V3DeviceWrappedEnrollmentTransitionValidation.swift`, and `V3DeviceWrappedEnrollmentTransitionPublisher.swift`: approved enrollment, fresh vault key, complete current-snapshot re-encryption, per-device wrappers, and publication.
- `Sources/KeyCore/V3DeviceWrappedRevocationWorkflow.swift`: device revocation and a new key for remaining active devices.
- `docs/v3-device-wrapped-key-architecture.md` and `docs/security-continuity-recovery.md`: equal authority across active devices, comparison ceremony, key rotation, surviving-device continuity, and permanent loss after every identity is lost.
- `docs/offline-recovery-models.md`: PIV primary/backup hardware is a later design candidate requiring physical qualification, not an implemented recovery capability.

PIV is visibly labeled Planned. Either independently provisioned token is the leading design direction, not a two-token threshold requirement. Compatible YubiKeys are a candidate, not a qualified-hardware guarantee. PIN and touch policy, replacement, and provisioning remain subject to qualification. Do not present an existing cloud, password, support, or hardware recovery path after the last enrolled Mac is lost.

## Release scope

Authentication, synchronization, and continuity copy describes device-enrolled vaults. Stable 0.2.0 also supports the older Keychain-backed model, and migration is explicit. The copy does not imply that installing the current Stable release silently converts existing vaults. The development-only `key init` path is not used in the marketing examples.

## Site verification

- Production build, TypeScript, Oxlint, formatting, and all 15 Vitest tests pass.
- The existing accessibility test now checks the page and all four inline articles with axe. Geometry and color contrast are excluded from that jsdom check.
- The production preview was inspected at desktop, 390px, and 320px widths. The articles fit without horizontal overflow, code wraps on narrow screens, and the return control stays visible while reading.
- Keyboard scrolling reaches the end of the articles; jump and return focus, direct-scroll pausing, chapter reset, and reduced-motion navigation are covered by interaction tests.

These checks do not constitute a screen-reader certification or execution of the product's cryptographic and recovery tests. No deployment was performed.

## Use command walkthrough

`src/content/command-walkthrough.ts` contains command references and short
explanations in lifecycle order: Add, List, Get, Copy, Edit, Delete. Add includes regular and TOTP entries.
`src/components/use-demo.tsx` supplies the shared reading surface. There is no
simulated output, prompt, cursor, or terminal chrome. The examples do not execute
commands or access the clipboard.

The walkthrough is reader-controlled, independent of chapter progress. Choosing
a command pauses the chapter, and the selection stays put until another command
is selected or the chapter is changed. Reduced motion suppresses the brief
transition between commands. Command text remains selectable.

Commands were checked against the Key README and `KeyCLIApplication`: add/edit
use secure input; get prints the value; copy writes it to the clipboard; list
returns names; remove asks for confirmation. TOTP uses a Base32 setup secret and
retrieves the current code with get. Delete is the reader-facing label; its
actual command is `key remove`, without the force flag.

All 16 tests pass, including automated accessibility checks for all six
references and their articles, manual selection, the two Add variants, and
the removal explanation. Build, TypeScript, and lint also pass.

## Editorial refinement

The hero identifies Key as a password and secret vault before describing Mac
authentication and folder storage. Overview copy now names the action or access
benefit directly; the authentication headline remains “Your presence opens it.”
The site footer was removed, and installation links now lead to the README’s
installation and vault setup guidance. Metadata follows the same vault framing.

The Use article focuses on composition instead of repeating the walkthrough.
Authentication defines enrollment and user presence before describing the keys.
Sync opens with an out-of-order delivery example, and recovery explains access
continuity before enrollment mechanics. The evidence and release boundaries
above remain applicable; PIV hardware recovery still requires qualification and
is visibly planned. No new recovery or automatic conflict resolution capability
is claimed. The desktop reading pane allows room for the revised headings while
keeping Play and Go deeper aligned.

## Authentication overview

`AuthenticateDemo` shows Touch ID, Apple Watch, and password together in one
surface. The caption explains that macOS can prompt Touch ID and Apple Watch
at the same time, with either method approving the request and the Mac password
as an alternative. This is a simultaneous choice, not a sequence of steps.

The supplied Touch ID PNG is rendered white with CSS, preserving its original
transparency and shape. Watch and password remain inline SVGs. There are
no scene selectors, credential inputs, OS authentication calls, live announcements,
or independent playback timers. All three methods remain visible on mobile.
Protected-key policy and device dependencies remain grounded in the product
sources recorded above. This illustrates available authentication methods rather
than reproducing a system prompt.

## Sync overview

The Sync overview leads with “Safe sync. Your choice of provider.” and explains
one vault across multiple Macs. `SyncDemo` shows one Mac publishing through a
shared folder to two independently verifying Macs. The folder contains a sequence
of manifest states: backward arrows represent parent-hash references, and downward
links identify the encrypted entries referenced by each state. Numbers 01–03 are
illustrative state labels, not filenames or the storage schema. Each receiving
Mac has its own local checkpoint; the diagram does not imply a central server
or a distinguished primary device. It depicts one publication, and any active
enrolled Mac can publish changes.

The summary names SHA-256 references, authenticated records, exact entry
verification, and local checkpoint advancement. A missing file delays acceptance;
altered entries and competing histories stop advancement. This remains scoped to
the device-enrolled implementation and does not promise automatic conflict merging.
Source tracing confirmed these mechanisms at product commit
`2adba7de353acce68f5a3a0303259cba25d851f5`:

- `V3DeviceWrappedManifestCandidateBuilder.swift`: the parent envelope digest and
  entry inventory are covered by HMAC authentication.
- `V3DeviceWrappedSameEpochCatchUpService.swift`: verify the direct parent,
  authentication, unchanged device authority, and the complete referenced snapshot
  before conditionally replacing the checkpoint.
- `V3DeviceWrappedReadOnlyVaultRuntime.swift`: the snapshot validator checks exact
  entry bytes, structure, and authenticated metadata against manifest references.
- `V3EntryCipher.swift`: verify the expected digest and context, then authenticate
  and decrypt the entry with AES-256-GCM before releasing plaintext.

The network folds into a vertical arrangement at narrow container widths. Sync
has additional reading-pane height for its diagram and summary, with the same
bottom inset for Go deeper and Play. Other chapters retain their existing height.
The caption conveys the diagram’s meaning in accessible text; decorative graphics
are hidden from assistive technology. No additional controls or animation timers
are introduced. The existing automated page accessibility check covers the new
figure and the unchanged technical article.

## Recover overview

`RecoverDemo` depicts an enrolled Mac plus usable encrypted vault files enabling
a replacement Mac. The summary explains that the replacement has its own Secure
Enclave keys and that adding or revoking a device rotates the vault key and
re-encrypts the current snapshot. The evidence and limits in the Recover section
above still apply. The overview does not imply automatic replacement enrollment
or that revocation erases previously accessible data.

A separate Physical-key recovery section is explicitly labeled Planned and uses
conditional wording. The primary and backup PIV recipients would be independent,
not a two-token requirement; the encrypted vault files would still be necessary.
The two token drawings are generic illustrations, not a claim of qualified
hardware support.

Sync and Recover share `MacIllustration` to preserve their device artwork.
Recover replaces the final placeholder; the unused placeholder component and
its styles were removed. The overview remains static and accessible through
its caption, with no extra controls or timers. Desktop and narrow mobile
layouts were inspected; the Go deeper and Play controls share a bottom inset.
The existing automated accessibility check covers both current and planned
recovery content.
