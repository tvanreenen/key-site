import { readFile, writeFile } from "node:fs/promises"
import { render } from "../.cache/prerender/entry-server.js"

const file = new URL("../dist/index.html", import.meta.url)
const html = await readFile(file, "utf8")
const outlet = '<div id="root"></div>'
if (!html.includes(outlet)) throw new Error("Missing prerender outlet")
await writeFile(
  file,
  html.replace(outlet, () => `<div id="root">${render()}</div>`)
)
console.log("Prerendered the marketing page to dist/index.html")
