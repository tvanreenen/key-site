// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import App from "@/App"
import { ChapterExplorer } from "./chapter-explorer"
import { InstallSection } from "./install-section"
import { installCommand } from "@/content/chapters"
import { installBrowserEnvironment } from "@/test/browser-environment"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("chapter interactions", () => {
  it.each([
    { compact: false, orientation: "vertical", key: "{ArrowDown}" },
    { compact: true, orientation: "horizontal", key: "{ArrowRight}" },
  ])(
    "uses $orientation keyboard navigation and pauses on selection",
    async ({ compact, orientation, key }) => {
      installBrowserEnvironment({ compact })
      const user = userEvent.setup()
      render(<ChapterExplorer />)
      expect(
        screen.getByRole("tablist").getAttribute("aria-orientation") ??
          "horizontal"
      ).toBe(orientation)
      await user.click(screen.getByRole("tab", { name: /01\s*Use/ }))
      await user.keyboard(key)
      expect(
        screen
          .getByRole("tab", { name: /02\s*Authenticate/ })
          .getAttribute("aria-selected")
      ).toBe("true")
      expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(
        screen.getByRole("tab", { name: /02\s*Authenticate/ }).id
      )
      expect(screen.getByRole("button", { name: "Play chapters" })).toBeTruthy()
    }
  )

  it("opens details, closes with Escape, and returns focus without restarting playback", async () => {
    installBrowserEnvironment()
    const user = userEvent.setup()
    render(<ChapterExplorer />)
    const trigger = screen.getByRole("button", { name: /Go deeper/ })
    await user.click(trigger)
    const dialog = screen.getByRole("dialog", {
      name: "At home in your shell.",
    })
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true)
    )
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(trigger))
    expect(screen.getByRole("button", { name: "Play chapters" })).toBeTruthy()
  })

  it("starts paused for reduced motion and allows an explicit Play", async () => {
    installBrowserEnvironment({ reducedMotion: true })
    const user = userEvent.setup()
    render(<ChapterExplorer />)
    await user.click(screen.getByRole("button", { name: "Play chapters" }))
    expect(screen.getByRole("button", { name: "Pause chapters" })).toBeTruthy()
  })

  it("has no automated accessibility violations in the page or open dialog", async () => {
    installBrowserEnvironment({ reducedMotion: true })
    const user = userEvent.setup()
    const { container } = render(<App />)
    // Color/geometry checks require a rendering browser, reviewed separately.
    const options = { rules: { "color-contrast": { enabled: false } } }
    expect((await axe.run(container, options)).violations).toEqual([])
    await user.click(screen.getByRole("button", { name: /Go deeper/ }))
    expect((await axe.run(document.body, options)).violations).toEqual([])
  })
})

describe("installation", () => {
  it("copies the exact commands and announces success", async () => {
    const user = userEvent.setup()
    const clipboard = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    render(<InstallSection />)
    await user.click(
      screen.getByRole("button", { name: "Copy install commands" })
    )
    expect(clipboard).toHaveBeenCalledWith(installCommand)
    expect(screen.getByRole("status").textContent).toBe("Copied to clipboard.")
  })

  it("leaves selectable commands and explains how to copy when clipboard access fails", async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("Denied")
    )
    render(<InstallSection />)
    await user.click(
      screen.getByRole("button", { name: "Copy install commands" })
    )
    expect(screen.getByRole("status").textContent).toContain(
      "copy them manually"
    )
    expect(screen.getByRole("code").textContent).toBe(installCommand)
  })
})
