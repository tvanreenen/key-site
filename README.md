# key marketing site

A static marketing page built with React, Tailwind CSS, and shadcn components
backed by Base UI. The visual design follows the approved dark Touch ID concept.

This overhaul lives on `codex/marketing-overhaul`. Keep it local until approved.
The four chapter demonstrations remain placeholders. The Go deeper dialogs
contain technical explanations grounded in the current Key implementation.

## Local development

Use Node.js 24.15+ LTS and npm. Node.js 22.22.2+ is also supported by the
installed build and test dependencies.

```sh
npm ci
npm run dev
```

For the production page:

```sh
npm run build
npm run preview
```

The build generates a static `dist/` directory. It renders the React page into
HTML at build time, then hydrates its controls in the browser. No application
server is needed for hosting. The normal development server uses client rendering.
Canonical and social URLs in `index.html` continue to target `key.tvr.works`.

## Editing the page

| Change                                                        | Location                                   |
| ------------------------------------------------------------- | ------------------------------------------ |
| Chapter labels, headlines, summaries, links, install commands | `src/content/chapters.ts`                  |
| Hero copy and image composition                               | `src/components/hero.tsx`, `src/index.css` |
| Colors, type, spacing, responsive layouts                     | `src/index.css`                            |
| Feature demonstrations                                        | `src/components/feature-placeholder.tsx`   |
| Deeper chapter content                                        | `src/content/chapter-details.ts`           |
| Detail dialog layout                                          | `src/components/feature-details.tsx`       |
| Chapter duration and state transitions                        | `src/lib/playback.ts`                      |
| Visibility and reduced-motion playback behavior               | `src/hooks/use-chapter-playback.ts`        |
| Static HTML and social metadata                               | `index.html`, `scripts/prerender.mjs`      |

Replace the demonstration placeholders one chapter at a time. Update the
technical copy against the evidence and release boundaries in
`docs/chapter-content.md`. Keep
chapter IDs stable. The hero is independent of selection, and each chapter uses
the same panel and detail-dialog composition. PIV recovery is still planned:
review product claims against the actual key release before publishing.

The approved photographic source is `assets/source/touch-id.png`. Run
`npm run images` to regenerate responsive WebP variants and the social image.
The generation brief is in `docs/hero-asset.md`. Earlier assets remain under
`assets/` as design references; only `public/` is copied to the built site.

## Component foundation

The official shadcn Vite scaffold used `--base base --preset nova`. Its
`base-nova` registry supplied Button, Tabs, Dialog, and Skeleton. Shared primitive
files live in `src/components/ui`; branded compositions live alongside them.

Add future components with the official CLI:

```sh
npx shadcn@latest add <component>
```

Review generated changes, especially if overwriting existing primitives. The
Tabs wrapper forwards `orientation` to Base UI as well as its data attribute so
the keyboard direction matches the responsive layout. The mobile detail dialog
also resets Tailwind translation variables used by the registry's animations.

Dependencies are pinned to current stable releases as of September 6, 2026.
Oxlint provides React, TypeScript, and accessibility linting. The scaffold's
TypeScript ESLint version did not support the current TypeScript 7 release;
Oxlint avoids forcing incompatible peer dependencies.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The tests cover playback transitions, browser visibility signals, reduced-motion
startup, responsive keyboard navigation, dialog focus restoration, clipboard
success/failure, and automated accessibility rules. DOM tests use jsdom; they do
not prove rendered layout, color contrast, or assistive-technology behavior.
See `docs/overhaul.md` for the browser review and remaining verification limits.
