import { fromHighlighter } from "@shikijs/markdown-exit/core"
import { createMarkdownExit, type MarkdownExit, type StateCore, type Token } from "markdown-exit"
import { createHighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import angularHtml from "shiki/langs/angular-html.mjs"
import angularTypescript from "shiki/langs/angular-ts.mjs"
import astro from "shiki/langs/astro.mjs"
import bash from "shiki/langs/bash.mjs"
import css from "shiki/langs/css.mjs"
import diff from "shiki/langs/diff.mjs"
import dockerfile from "shiki/langs/dockerfile.mjs"
import dotEnv from "shiki/langs/dotenv.mjs"
import go from "shiki/langs/go.mjs"
import graphql from "shiki/langs/graphql.mjs"
import html from "shiki/langs/html.mjs"
import javascript from "shiki/langs/javascript.mjs"
import json from "shiki/langs/json.mjs"
import jsonc from "shiki/langs/jsonc.mjs"
import jsx from "shiki/langs/jsx.mjs"
import lua from "shiki/langs/lua.mjs"
import markdownLang from "shiki/langs/markdown.mjs"
import mermaid from "shiki/langs/mermaid.mjs"
import mdx from "shiki/langs/mdx.mjs"
import prisma from "shiki/langs/prisma.mjs"
import python from "shiki/langs/python.mjs"
import rust from "shiki/langs/rust.mjs"
import shellscript from "shiki/langs/shellscript.mjs"
import sql from "shiki/langs/sql.mjs"
import svelte from "shiki/langs/svelte.mjs"
import toml from "shiki/langs/toml.mjs"
import tsx from "shiki/langs/tsx.mjs"
import typescript from "shiki/langs/typescript.mjs"
import vue from "shiki/langs/vue.mjs"
import yaml from "shiki/langs/yaml.mjs"
import { gruvcraftDark, gruvcraftLight } from "@/lib/markdown/themes"

const calloutMarkerPattern = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*/i

const calloutTitles = {
  caution: "Caution",
  important: "Important",
  note: "Note",
  tip: "Tip",
  warning: "Warning",
} as const

const highlighter = createHighlighterCore({
  engine: createJavaScriptRegexEngine(),
  langs: [
    angularHtml,
    angularTypescript,
    astro,
    bash,
    css,
    diff,
    dockerfile,
    dotEnv,
    go,
    graphql,
    html,
    javascript,
    json,
    jsonc,
    jsx,
    lua,
    markdownLang,
    mdx,
    mermaid,
    prisma,
    python,
    rust,
    shellscript,
    sql,
    svelte,
    toml,
    tsx,
    typescript,
    vue,
    yaml,
  ],
  themes: [gruvcraftDark, gruvcraftLight],
})

/**
 * Gets the normalized GitHub-style callout type from an inline token.
 *
 * @param token - The inline token at the start of a blockquote paragraph.
 * @returns A supported callout type, or null when the token is not a callout marker.
 */
function getCalloutType(token: Token | undefined): keyof typeof calloutTitles | null {
  const firstChild = token?.children?.[0]

  if (firstChild?.type !== "text") {
    return null
  }

  const match = calloutMarkerPattern.exec(firstChild.content)

  if (!match?.[1]) {
    return null
  }

  return match[1].toLowerCase() as keyof typeof calloutTitles
}

/**
 * Removes the leading callout marker from an inline token after blockquote classification.
 *
 * @param token - The inline token that starts with a GitHub-style callout marker.
 * @returns Nothing.
 */
function removeCalloutMarker(token: Token): void {
  const firstChild = token.children?.[0]

  if (firstChild?.type !== "text" || !token.children) {
    return
  }

  firstChild.content = firstChild.content.replace(calloutMarkerPattern, "")
  token.content = token.content.replace(calloutMarkerPattern, "")

  if (firstChild.content.length > 0) {
    return
  }

  token.children.shift()

  if (token.children[0]?.type === "softbreak") {
    token.children.shift()
    token.content = token.content.replace(/^\n/, "")
  }
}

/**
 * Converts GitHub-style blockquote callout markers into renderable attributes.
 *
 * @param md - The markdown renderer instance to extend.
 * @returns Nothing.
 */
function calloutPlugin(md: MarkdownExit): void {
  md.core.ruler.after("inline", "callouts", (state: StateCore) => {
    for (let index = 0; index < state.tokens.length - 2; index += 1) {
      const blockquoteOpen = state.tokens[index]
      const paragraphOpen = state.tokens[index + 1]
      const inline = state.tokens[index + 2]

      if (blockquoteOpen?.type !== "blockquote_open" || paragraphOpen?.type !== "paragraph_open") {
        continue
      }

      const calloutType = getCalloutType(inline)

      if (!calloutType) {
        continue
      }

      blockquoteOpen.attrJoin("class", `markdown-callout markdown-callout-${calloutType}`)
      blockquoteOpen.attrSet("data-callout", calloutType)
      blockquoteOpen.attrSet("data-callout-title", calloutTitles[calloutType])
      blockquoteOpen.attrSet("aria-label", calloutTitles[calloutType])
      removeCalloutMarker(inline)
    }
  })
}

/**
 * Creates a markdown renderer with the shared syntax highlighting setup.
 *
 * @param allowHtml - Whether raw HTML in markdown should be rendered.
 * @returns A promise that resolves to a markdown renderer instance.
 */
async function createRenderer(allowHtml: boolean): Promise<MarkdownExit> {
  const loadedHighlighter = await highlighter

  return createMarkdownExit({ linkify: true, html: allowHtml })
    .use(calloutPlugin)
    .use(
      fromHighlighter(loadedHighlighter, {
        themes: {
          dark: "gruvcraft-dark",
          light: "gruvcraft-light",
        },
      }),
    )
}

const markdownRenderer = createRenderer(false)
const trustedMarkdownRenderer = createRenderer(true)

interface RenderMarkdownOptions {
  allowHtml?: boolean
}

/**
 * Renders markdown to HTML using the app's shared markdown pipeline.
 *
 * @param content - Markdown content to render.
 * @param options - Markdown rendering options.
 * @returns Rendered HTML string.
 */
export async function renderMarkdown(
  content: string,
  { allowHtml = false }: RenderMarkdownOptions = {},
): Promise<string> {
  const renderer = await (allowHtml ? trustedMarkdownRenderer : markdownRenderer)

  return renderer.renderAsync(content)
}
