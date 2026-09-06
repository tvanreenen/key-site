# Marketing site overhaul

## Scope

Implementation on `codex/marketing-overhaul`. Publishing the branch and draft PR is approved; deployment remains separate.

Implement the approved Soft focus concept: a dark Touch ID photographic hero,
large white typography, the macOS / CLI / Open Source eyebrow, and the headline
“Your Mac. Your CLI. Your secrets.” Below the hero, build four selectable,
automatically cycling chapters: Use, Authenticate, Sync, Recover. Each chapter has a completed overview illustration or command walkthrough. The inline Go deeper articles contain
source-grounded technical explanations; see `docs/chapter-content.md`.

Include working install links, chapter progress and playback controls, a
consistent inline reader, responsive layouts, and accessible keyboard behavior.

## Foundation

Use the current stable npm releases of React, TypeScript, Vite, Tailwind CSS,
shadcn, and Base UI. Lock resolved versions in package-lock.json.

Follow shadcn's Vite installation with its Base UI preset, then select button,
tabs, dialog, and skeleton from the official registry using the CLI. Keep
registry primitives in `src/components/ui`; compose the branded experience
around their supported APIs. Use Tailwind's Vite integration and CSS theme
variables. No backend or hosting integration is required.

This replaces the small static site's global animation loop with React
components and one playback owner. The added toolchain supports the planned
interactive chapters, keyboard navigation, and future content changes.

## Interaction contract

- The hero does not change with chapter selection.
- Automatic playback starts only when the chapter rail is visible.
- Tab selection, keyboard focus, and scrolling into an article pause playback.
- Explicit Play resumes playback; returning to the overview never resumes it.
- An offscreen stage or hidden document suspends the clock without catch-up.
- Reduced motion defaults to paused and suppresses decorative animation.
- Tab semantics and orientation match the desktop and mobile presentation.
- Articles follow each overview. Go deeper and Back to overview scroll and focus
  their destinations, with instant scrolling for reduced motion. Desktop uses
  Scroll Area; mobile uses document scrolling. Each chapter starts at its overview.
- PIV hardware recovery is identified as planned; other demonstrations describe the inspected device-enrolled implementation.

## Sources checked on 2026-09-06

- https://ui.shadcn.com/docs/installation/vite
- https://ui.shadcn.com/docs/cli
- https://ui.shadcn.com/docs/components/base/tabs
- https://ui.shadcn.com/docs/components/base/dialog
- https://base-ui.com/react/components/tabs
- https://base-ui.com/react/components/dialog
- https://tailwindcss.com/docs/responsive-design

## Verification plan

Run TypeScript, lint, and production build checks. Exercise actual browser
behavior for cycling, pause/resume, manual and keyboard selection, dialogs,
reduced motion, visibility, and responsive overflow. Visually review desktop,
tablet, and mobile layouts. Check accessibility with automation and keyboard
inspection. Record results after implementation.

## Implementation

The official CLI generated the Vite Base UI / Nova foundation and installed
Button, Tabs, Dialog, and Skeleton from its registry. Tailwind 4 uses the Vite
plugin. The page uses custom monochrome tokens and compositions around those
primitives. The registry Tabs wrapper forwards orientation to Base UI; chapter
tabs explicitly activate on arrow-key focus.

The production build follows Vite's client/SSR entry pattern for build-time
prerendering. It writes a static HTML page and browser assets to `dist/`; there
is no runtime server. The development server retains ordinary Vite hot reload.

Additional primary references:

- https://vite.dev/guide/ssr
- https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
- https://oxc.rs/docs/guide/usage/linter.html

## Initial scaffold verification on September 6, 2026

- TypeScript, Oxlint, production build, and 13 Vitest tests pass.
- Tests exercise actual Base UI components for horizontal/vertical arrow-key
  selection, dialog Escape and focus restoration, reduced-motion startup,
  explicit Play, and clipboard success/failure.
- Playback tests cover wraparound, manual selection, pause/resume, hidden
  documents, offscreen stages, no catch-up, and cleanup on unmount.
- Axe reports no violations in the rendered page and open dialog in jsdom.
  Color contrast is excluded because jsdom does not render pixels.
- The production page hydrates without console warnings or errors. Automatic
  cycling was observed in the browser; manual selection pauses it.
- Browser layouts inspected at 320, 390, 768, and desktop widths. Narrow and
  full-screen dialogs support scrolling; focus stays in the open dialog.
- Browser review caught and corrected an animation translation that shifted
  the mobile dialog offscreen. The final mobile panel fills the viewport.
- Responsive hero files are approximately 16, 28, and 56 KB. The font is served
  locally. The production JavaScript is approximately 103 KB gzip.
- `npm outdated --json` returns an empty object; the installed dependency tree
  has no invalid peer dependencies. The install audit reports no vulnerabilities.

Limits: this is not a screen-reader certification or a full cross-browser/device
matrix. Reduced motion and visibility are driven through DOM-environment tests;
OS-level motion settings were not changed. Feature artwork and demonstrations remain placeholders by design. The deeper
editorial content was added in the subsequent content pass. No push or deployment
has been performed.

## Inline reader follow-up

The modal articles have been replaced with continuous chapter documents. The
Base Nova Scroll Area was added through the official shadcn CLI, with viewport
props exposed for the chapter composition. The reader owns scroll navigation and
focus; the existing playback hook remains the clock owner. Visibility observes
the chapter rail so a long mobile article does not dilute the visibility ratio.

The updated suite has 15 passing tests, including all four inline articles under
axe, direct-scroll pausing, fresh chapter surfaces, and desktop/mobile focus
navigation with reduced motion. Native scrolling, sticky return navigation,
article positioning, and responsive overflow are checked in the production
browser separately from the DOM tests. No deployment has been performed.

## Final branch verification

All four overview visuals and inline articles are implemented. The final branch passes the production build (including TypeScript and prerendering), Oxlint, and all 17 Vitest tests. The current accessibility test covers every chapter and command example; dialog checks above refer to the superseded scaffold. Desktop and narrow mobile layouts were inspected during implementation, including Sync and Recover. The same screen-reader and cross-browser limits apply. Deployment has not been performed.
