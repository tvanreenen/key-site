export const commandWalkthrough = [
  {
    label: "Add",
    commands: ["key add services/api"],
    explanation:
      "Create a named entry. Key prompts for the secret with typing hidden, so the value stays out of the command itself.",
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
      "Print a stored value in your terminal when you need to inspect it. Use the same entry name you chose when adding it.",
  },
  {
    label: "Copy",
    commands: ["key copy services/api"],
    explanation:
      "Copy a secret straight to your clipboard, ready to paste without printing it in the terminal.",
  },
  {
    label: "Edit",
    commands: ["key edit services/api"],
    explanation:
      "Replace the value of an existing entry. Enter the updated secret at the hidden prompt; the entry keeps its name.",
  },
  {
    label: "TOTP",
    commands: ["key add --totp github/mfa", "key get github/mfa"],
    explanation:
      "Store the Base32 secret supplied when you set up two-factor authentication. Use get to generate the current one-time code from the encrypted seed.",
  },
  {
    label: "Delete",
    commands: ["key remove services/api"],
    explanation:
      "Remove an entry you no longer need. Key asks for confirmation before deleting it.",
  },
] as const
