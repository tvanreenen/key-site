export const chapters = [
  {
    id: "use",
    number: "01",
    label: "Use",
    title: "At home in your shell.",
    description: "Pipe in. Copy out. Keep your workflow.",
    detail: "Pipes, TOTP, and everyday commands",
  },
  {
    id: "authenticate",
    number: "02",
    label: "Authenticate",
    title: "Your presence opens it.",
    description: "Touch ID. Apple Watch. Your Mac password.",
    detail: "Device keys and the unlocked session",
  },
  {
    id: "sync",
    number: "03",
    label: "Sync",
    title: "Your folder. Your choice.",
    description:
      "Your provider moves encrypted files. Key verifies what arrives.",
    detail: "History, conflicts, and checkpoints",
  },
  {
    id: "recover",
    number: "04",
    label: "Recover",
    title: "Plan for a lost Mac.",
    description: "Keep another enrolled Mac. Keep a way forward.",
    detail: "Device continuity and planned hardware recovery",
  },
] as const

export type Chapter = (typeof chapters)[number]

export const projectUrl = "https://github.com/tvanreenen/key"
export const installCommand =
  "brew tap tvanreenen/tap && brew install --cask key"
