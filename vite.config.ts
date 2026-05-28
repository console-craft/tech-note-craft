import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import type { Plugin } from "vite"
import { readFileSync } from "node:fs"
import { defineConfig } from "vite-plus"
import matter from "gray-matter"

/**
 * Parses markdown frontmatter at build time so gray-matter stays out of the browser bundle.
 *
 * @returns A Vite plugin that turns `?frontmatter` markdown imports into JS objects.
 */
function markdownFrontmatterPlugin(): Plugin {
  return {
    load(id: string): string | null {
      if (!id.includes(".md?frontmatter")) {
        return null
      }

      const filePath = id.slice(0, id.indexOf("?"))
      const parsed = matter(readFileSync(filePath, "utf8"))

      return `export default ${JSON.stringify({ content: parsed.content, data: parsed.data })}`
    },
    name: "markdown-frontmatter",
  }
}

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  fmt: { ignorePatterns: [".opencode/**", "src/content/**"], printWidth: 120, semi: false },
  lint: {
    ignorePatterns: [".opencode/**"],
    options: { typeAware: true, typeCheck: true },
  },
  plugins: [markdownFrontmatterPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
})
