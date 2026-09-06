export const commandWalkthrough = [
  {
    label: "Add",
    commands: ["key add services/api", "key add --totp github/mfa"],
    explanation:
      "Create a named secret using a hidden prompt. With --totp, enter the Base32 setup secret for your authenticator instead.",
  },
  {
    label: "List",
    commands: ["key list"],
    explanation:
      "See the names of your stored entries without displaying their secret values. Use those names with get, copy, or edit.",
  },
  {
    label: "Get",
    commands: ["key get services/api"],
    explanation:
      "Retrieve a stored secret by name. For a TOTP entry, the same command generates the current one-time code.",
  },
  {
    label: "Copy",
    commands: ["key copy services/api"],
    explanation:
      "Copy a secret or current one-time code to your clipboard, ready to paste without printing it in the terminal.",
  },
  {
    label: "Edit",
    commands: ["key edit services/api"],
    explanation:
      "Replace the value of an existing entry. Enter the updated secret at the hidden prompt; the entry keeps its name.",
  },
  {
    label: "Delete",
    commands: ["key remove services/api"],
    explanation:
      "Remove an entry you no longer need. Key asks for confirmation before deleting it.",
  },
] as const
