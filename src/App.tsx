import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <main className="grid min-h-svh place-content-center gap-6 p-8">
      <h1 className="text-6xl font-bold tracking-tighter">key</h1>
      <p className="text-muted-foreground">Your secrets. Your Mac. Your CLI.</p>
      <Button render={<a href="https://github.com/tvanreenen/key" />}>
        View on GitHub
      </Button>
    </main>
  )
}
