import { vi } from "vitest"

// jsdom has no layout engine. These adapters let tests drive browser signals;
// the production observers and playback hook remain intact.
export function installBrowserEnvironment({
  reducedMotion = false,
  compact = false,
} = {}) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reducedMotion : compact,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  let intersection: IntersectionObserverCallback | undefined
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersection = callback
      }
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  let visibility = "visible"
  vi.spyOn(document, "visibilityState", "get").mockImplementation(
    () => visibility as DocumentVisibilityState
  )
  return {
    intersect(visible: boolean) {
      intersection?.(
        [
          {
            isIntersecting: visible,
            intersectionRatio: visible ? 1 : 0,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver
      )
    },
    visibility(visible: boolean) {
      visibility = visible ? "visible" : "hidden"
      document.dispatchEvent(new Event("visibilitychange"))
    },
  }
}
