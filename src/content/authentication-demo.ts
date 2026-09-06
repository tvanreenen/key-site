export const authenticationMethods = [
  { id: "touch", label: "Touch ID" },
  { id: "watch", label: "Apple Watch" },
  { id: "password", label: "Password" },
] as const

export type AuthenticationMethod = (typeof authenticationMethods)[number]["id"]
