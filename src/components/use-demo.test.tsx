// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UseDemo } from "./use-demo"

afterEach(cleanup)

it("follows chapter progress, lets readers hold an example, and resumes with playback", async () => {
  const onInteract = vi.fn()
  const user = userEvent.setup()
  const { rerender } = render(
    <UseDemo progress={0} paused={false} onInteract={onInteract} />
  )
  expect(
    screen
      .getByRole("button", { name: "Show add example" })
      .getAttribute("aria-pressed")
  ).toBe("true")
  rerender(<UseDemo progress={0.4} paused={false} onInteract={onInteract} />)
  expect(
    screen
      .getByRole("button", { name: "Show get example" })
      .getAttribute("aria-pressed")
  ).toBe("true")
  await user.click(screen.getByRole("button", { name: "Show edit example" }))
  expect(onInteract).toHaveBeenCalledOnce()
  rerender(<UseDemo progress={0.4} paused={true} onInteract={onInteract} />)
  expect(screen.getByText("input hidden")).toBeTruthy()
  rerender(<UseDemo progress={0.5} paused={false} onInteract={onInteract} />)
  expect(
    screen
      .getByRole("button", { name: "Show get example" })
      .getAttribute("aria-pressed")
  ).toBe("true")
  rerender(<UseDemo progress={0.8} paused={false} onInteract={onInteract} />)
  expect(
    screen
      .getByRole("button", { name: "Show edit example" })
      .getAttribute("aria-pressed")
  ).toBe("true")
})
