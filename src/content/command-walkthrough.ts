export const commandWalkthrough = [
  {
    label: "Add",
    commands: ["key add services/api", "key add --totp github/mfa"],
    explanation:
      "Store a password or API key at a prompt that hides what you type. Use --totp to store an authenticator’s Base32 setup secret.",
  },
  {
    label: "List",
    commands: ["key list"],
    explanation: "List entry names without revealing their values.",
  },
  {
    label: "Get",
    commands: ["key get services/api"],
    explanation:
      "Print a secret by name. For a TOTP entry, print the current one-time code.",
  },
  {
    label: "Copy",
    commands: ["key copy services/api"],
    explanation:
      "Copy a secret or one-time code to the clipboard without printing it.",
  },
  {
    label: "Edit",
    commands: ["key edit services/api"],
    explanation:
      "Update a secret without changing its name. Key hides what you type.",
  },
  {
    label: "Delete",
    commands: ["key remove services/api"],
    explanation: "Remove an entry. Key asks for confirmation first.",
  },
] as const
