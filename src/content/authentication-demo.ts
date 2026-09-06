export const authenticationMethods = [
  {
    id: "touch",
    label: "Touch ID",
    title: "Touch to approve.",
    explanation:
      "macOS can offer Touch ID while checking for a nearby, paired Apple Watch. Use the method that’s convenient.",
  },
  {
    id: "watch",
    label: "Apple Watch",
    title: "Approve from your wrist.",
    explanation:
      "When macOS offers Apple Watch, double-click its side button to approve access to your vault.",
  },
  {
    id: "password",
    label: "Password",
    title: "A password you already know.",
    explanation:
      "Your Mac’s login password can approve access, too. There’s no separate vault password to remember.",
  },
] as const

export type AuthenticationMethod = (typeof authenticationMethods)[number]["id"]
