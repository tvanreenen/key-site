import { useCallback, useEffect, useReducer, useRef, useState } from "react"
import {
  advancePlayback,
  initialPlayback,
  CHAPTER_DURATION_MS,
} from "@/lib/playback"
import type { PlaybackEvent, PlaybackState } from "@/lib/playback"
import { useMediaQuery } from "@/hooks/use-media-query"

export function useChapterPlayback(count: number) {
  const stageRef = useRef<HTMLElement>(null)
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const [inView, setInView] = useState(false)
  const [documentVisible, setDocumentVisible] = useState(false)
  const [state, dispatch] = useReducer(
    (current: PlaybackState, event: PlaybackEvent) =>
      advancePlayback(current, event, count),
    initialPlayback
  )
  const pause = useCallback(() => dispatch({ type: "pause" }), [])
  const running = !state.paused && inView && documentVisible

  useEffect(() => {
    if (reducedMotion) pause()
  }, [reducedMotion, pause])

  useEffect(() => {
    const update = () =>
      setDocumentVisible(document.visibilityState === "visible")
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25)
      },
      { threshold: [0, 0.25] }
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    let frame = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const deltaMs = now - previous
      if (deltaMs >= 80) {
        // A blocked main thread must not fast-forward unseen chapters.
        dispatch({ type: "tick", deltaMs: Math.min(deltaMs, 250) })
        previous = now
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])

  return {
    stageRef,
    state,
    running,
    pause,
    play: () => dispatch({ type: "play" }),
    select: (index: number) => dispatch({ type: "select", index }),
    progress: state.elapsedMs / CHAPTER_DURATION_MS,
  }
}
