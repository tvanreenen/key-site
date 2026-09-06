// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, renderHook } from "@testing-library/react"
import { useChapterPlayback } from "./use-chapter-playback"
import { installBrowserEnvironment } from "@/test/browser-environment"

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("playback browser lifecycle", () => {
  it("only runs while visible, suspends without catch-up, and releases scheduled work on unmount", () => {
    vi.useFakeTimers()
    let clock = 0
    let frame: FrameRequestCallback | undefined
    vi.spyOn(performance, "now").mockImplementation(() => clock)
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frame = callback
      return 1
    })
    const cancel = vi.fn(() => {
      frame = undefined
    })
    vi.stubGlobal("cancelAnimationFrame", cancel)
    const browser = installBrowserEnvironment()
    const stage = document.createElement("div")
    // Attach the real hook ref before effects, as React does for the chapter rail.
    const { result, unmount } = renderHook(() => {
      const playback = useChapterPlayback(4)
      Object.assign(playback.stageRef, { current: stage })
      return playback
    })
    const advance = (ms: number) => {
      for (let elapsed = 0; elapsed < ms; elapsed += 100) {
        clock += 100
        act(() => frame?.(clock))
      }
    }
    expect(result.current.running).toBe(false)
    act(() => browser.intersect(true))
    advance(4000)
    expect(result.current.state.elapsedMs).toBe(4000)
    act(() => browser.visibility(false))
    advance(20_000)
    expect(result.current.state.elapsedMs).toBe(4000)
    act(() => browser.visibility(true))
    advance(4000)
    act(() => browser.intersect(false))
    advance(20_000)
    expect(result.current.state.elapsedMs).toBe(8000)
    act(() => browser.intersect(true))
    advance(4000)
    expect(result.current.state.index).toBe(1)
    expect(result.current.state.elapsedMs).toBe(0)
    unmount()
    expect(cancel).toHaveBeenCalled()
    expect(frame).toBeUndefined()
  })
})
