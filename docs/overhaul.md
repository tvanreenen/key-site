# Marketing site overhaul

## Scope

Local work on `codex/marketing-overhaul`. Do not push or deploy before approval.

Implement the approved Soft focus concept: a dark Touch ID photographic hero,
large white typography, the macOS / CLI / Open Source eyebrow, and the headline
“Your secrets. Your Mac. Your CLI.” Below the hero, build four selectable,
automatically cycling chapters: Use, Authenticate, Sync, Recover. Feature
demonstrations and deeper editorial content remain explicit placeholders.

Include working install links, chapter progress and playback controls, a
consistent detail dialog, responsive layouts, and accessible keyboard behavior.

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
- Automatic playback starts only when the chapter stage is visible.
- Tab selection, keyboard focus, and opening a dialog pause playback.
- Explicit Play resumes playback; closing a dialog never resumes it.
- An offscreen stage or hidden document suspends the clock without catch-up.
- Reduced motion defaults to paused and suppresses decorative animation.
- Tab semantics and orientation match the desktop and mobile presentation.
- Detail dialogs retain focus, close with Escape, and restore trigger focus.
- Placeholders are identified as unfinished content, not indefinite loading.

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
