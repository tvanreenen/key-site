// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axe from "axe-core"
import { AuthenticateDemo } from "./authenticate-demo"

afterEach(cleanup)

it("lets readers explore authentication by keyboard without requesting credentials", async () => {
  const user = userEvent.setup()
  const onInteract = vi.fn()
  const { container, rerender } = render(
    <AuthenticateDemo onInteract={onInteract} />
  )
  expect(screen.getByText(/while checking for a nearby/)).toBeTruthy()
  await user.tab()
  await user.tab()
  await user.keyboard("{Enter}")
  expect(
    screen.getByRole("heading", { name: "Approve from your wrist." })
  ).toBeTruthy()
  expect(onInteract).toHaveBeenCalledOnce()
  await user.tab()
  await user.keyboard(" ")
  expect(screen.getByText(/no separate vault password/)).toBeTruthy()
  expect(onInteract).toHaveBeenCalledTimes(2)
  rerender(<AuthenticateDemo onInteract={onInteract} />)
  const selected = screen.getByRole("button", {
    name: "Show Password authentication",
  })
  expect(selected.getAttribute("aria-pressed")).toBe("true")
  expect(
    document.getElementById(selected.getAttribute("aria-controls")!)
      ?.textContent
  ).toContain("no separate vault password")
  expect(container.querySelector("input")).toBeNull()
  expect(
    (
      await axe.run(container, {
        rules: {
          "color-contrast": { enabled: false },
          region: { enabled: false },
        },
      })
    ).violations
  ).toEqual([])
})
