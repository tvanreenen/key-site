// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UseDemo } from "./use-demo"

afterEach(cleanup)

it("keeps command references reader-controlled and pairs commands with explanations", async () => {
  const onInteract = vi.fn()
  const user = userEvent.setup()
  const { rerender } = render(<UseDemo onInteract={onInteract} />)
  expect(screen.getByRole("code").textContent).toBe("key add services/api")
  await user.click(screen.getByRole("button", { name: "Show totp example" }))
  expect(onInteract).toHaveBeenCalledOnce()
  expect(screen.getByRole("code").textContent).toBe(
    "key add --totp github/mfa\nkey get github/mfa"
  )
  expect(screen.getByText(/Base32 secret/)).toBeTruthy()
  rerender(<UseDemo onInteract={onInteract} />)
  expect(
    screen
      .getByRole("button", { name: "Show totp example" })
      .getAttribute("aria-pressed")
  ).toBe("true")
  await user.click(screen.getByRole("button", { name: "Show delete example" }))
  expect(screen.getByRole("code").textContent).toBe("key remove services/api")
  expect(screen.getByText(/asks for confirmation/)).toBeTruthy()
})
