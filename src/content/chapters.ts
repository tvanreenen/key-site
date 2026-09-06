export const chapters = [
  {
    id: "use",
    number: "01",
    label: "Use",
    title: "Secrets in your terminal.",
    description: "Store passwords, API keys, and authenticator secrets.",
    detail: "Use Key in pipes and scripts",
  },
  {
    id: "authenticate",
    number: "02",
    label: "Authenticate",
    title: "Your presence opens it.",
    description:
      "Approve access with Touch ID, Apple Watch, or your Mac password.",
    detail: "Device keys and the unlocked session",
  },
  {
    id: "sync",
    number: "03",
    label: "Sync",
    title: "Your folder. Your choice.",
    description:
      "Your file sync provider moves encrypted files. Key controls access and verifies every change.",
    detail: "History, conflicts, and checkpoints",
  },
  {
    id: "recover",
    number: "04",
    label: "Recover",
    title: "Keep access when a Mac is lost.",
    description:
      "With another enrolled Mac and your vault files, you can authorize a replacement.",
    detail: "Device continuity and planned hardware recovery",
  },
] as const

export type Chapter = (typeof chapters)[number]

export const projectUrl = "https://github.com/tvanreenen/key"
export const installCommand =
  "brew tap tvanreenen/tap && brew install --cask key"

export const setupUrl = `${projectUrl}#install-and-choose-a-release-channel`
