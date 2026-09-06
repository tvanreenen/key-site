export const CHAPTER_DURATION_MS = 12_000

export interface PlaybackState {
  index: number
  elapsedMs: number
  paused: boolean
}

export type PlaybackEvent =
  | { type: "select"; index: number }
  | { type: "pause" }
  | { type: "play" }
  | { type: "tick"; deltaMs: number }

export const initialPlayback: PlaybackState = {
  index: 0,
  elapsedMs: 0,
  paused: false,
}

// The chapter clock is independent of rendering, focus, and observer APIs.
// The hook only delivers ticks while the experience is visible and running.
export function advancePlayback(
  state: PlaybackState,
  event: PlaybackEvent,
  count: number,
  durationMs = CHAPTER_DURATION_MS
): PlaybackState {
  switch (event.type) {
    case "select":
      if (
        !Number.isInteger(event.index) ||
        event.index < 0 ||
        event.index >= count
      ) {
        return state
      }
      return { index: event.index, elapsedMs: 0, paused: true }
    case "pause":
      return state.paused ? state : { ...state, paused: true }
    case "play":
      return state.paused ? { ...state, paused: false } : state
    case "tick": {
      if (
        state.paused ||
        !Number.isFinite(event.deltaMs) ||
        event.deltaMs <= 0
      ) {
        return state
      }
      const elapsedMs = state.elapsedMs + event.deltaMs
      if (elapsedMs >= durationMs) {
        return { index: (state.index + 1) % count, elapsedMs: 0, paused: false }
      }
      return { ...state, elapsedMs }
    }
  }
}
