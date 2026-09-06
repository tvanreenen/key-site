// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest"
import { cleanup, render, screen, within } from "@testing-library/react"
import { AuthenticateDemo } from "./authenticate-demo"

afterEach(cleanup)

it("presents all approval methods together without requiring interaction", () => {
  render(<AuthenticateDemo />)
  const overview = screen.getByRole("figure", {
    name: "Ways to approve the same macOS request",
  })
  for (const label of ["Touch ID", "Apple Watch", "Password"]) {
    expect(within(overview).getByText(label)).toBeTruthy()
  }
  expect(
    within(overview).getByText(/Touch ID and Apple Watch together/)
  ).toBeTruthy()
  expect(within(overview).queryByRole("button")).toBeNull()
  expect(within(overview).queryByRole("textbox")).toBeNull()
})
