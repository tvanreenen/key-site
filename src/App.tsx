import { Hero } from "@/components/hero"
import { ChapterExplorer } from "@/components/chapter-explorer"
import { InstallSection } from "@/components/install-section"

export default function App() {
  return (
    <>
      <a href="#explore" className="skip-link">
        Skip to explore key
      </a>
      <main>
        <Hero />
        <ChapterExplorer />
        <InstallSection />
      </main>
    </>
  )
}
