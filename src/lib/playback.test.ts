import { describe, expect, it } from "vitest"
import {
  advancePlayback,
  CHAPTER_DURATION_MS,
  initialPlayback,
} from "./playback"

describe("chapter playback", () => {
  it("advances through all chapters and wraps without skipping a chapter", () => {
    let state = initialPlayback
    for (const index of [1, 2, 3, 0]) {
      state = advancePlayback(
        state,
        { type: "tick", deltaMs: CHAPTER_DURATION_MS },
        4
      )
      expect(state.index).toBe(index)
      expect(state.elapsedMs).toBe(0)
    }
    const afterBlockedFrame = advancePlayback(
      state,
      { type: "tick", deltaMs: 100_000 },
      4
    )
    expect(afterBlockedFrame.index).toBe(1)
    expect(afterBlockedFrame.elapsedMs).toBe(0)
  })

  it("preserves time when paused and resumes the remaining duration", () => {
    let state = advancePlayback(
      initialPlayback,
      { type: "tick", deltaMs: 4000 },
      4
    )
    state = advancePlayback(state, { type: "pause" }, 4)
    const paused = state
    state = advancePlayback(state, { type: "tick", deltaMs: 20_000 }, 4)
    expect(state).toBe(paused)
    state = advancePlayback(state, { type: "play" }, 4)
    state = advancePlayback(state, { type: "tick", deltaMs: 7999 }, 4)
    expect(state.index).toBe(0)
    state = advancePlayback(state, { type: "tick", deltaMs: 1 }, 4)
    expect(state.index).toBe(1)
  })

  it("manual selection stops autoplay and starts that chapter at the beginning", () => {
    const timed = advancePlayback(
      initialPlayback,
      { type: "tick", deltaMs: 6000 },
      4
    )
    const selected = advancePlayback(timed, { type: "select", index: 2 }, 4)
    expect(selected).toEqual({ index: 2, elapsedMs: 0, paused: true })
    expect(
      advancePlayback(selected, { type: "tick", deltaMs: 20_000 }, 4)
    ).toBe(selected)
  })

  it("reselecting the active chapter pauses and resets its presentation", () => {
    const timed = advancePlayback(
      initialPlayback,
      { type: "tick", deltaMs: 6000 },
      4
    )
    expect(advancePlayback(timed, { type: "select", index: 0 }, 4)).toEqual({
      index: 0,
      elapsedMs: 0,
      paused: true,
    })
  })

  it("rejects invalid selections and clock values", () => {
    for (const index of [-1, 4, 1.5, NaN]) {
      expect(
        advancePlayback(initialPlayback, { type: "select", index }, 4)
      ).toBe(initialPlayback)
    }
    for (const deltaMs of [-1, 0, Infinity, NaN]) {
      expect(
        advancePlayback(initialPlayback, { type: "tick", deltaMs }, 4)
      ).toBe(initialPlayback)
    }
  })
})
