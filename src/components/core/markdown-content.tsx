import type { CSSProperties, ReactElement, ReactNode } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { copyTextToClipboard } from "@/lib/browser/clipboard"
import { cn } from "@/lib/utils"

const markdownContentClassName = cn(
  "text-[0.8em]",
  "[&_p]:leading-[1.5em] [&_p:not(:first-child)]:mt-3",
  "[&_a]:text-primary [&_a]:hover:underline",
  "[&_h1]:my-3 [&_h1]:tracking-tight [&_h1]:text-[2em] [&_h1]:font-extrabold [&_h1]:text-balance",
  "[&_h2]:my-3 [&_h2]:tracking-tight [&_h2]:text-[1.625em] [&_h2]:font-semibold [&_h2]:pb-1 [&_h2]:first:mt-0 [&_h2]:border-b [&_h2]:block",
  "[&_h3]:my-3 [&_h3]:tracking-tight [&_h3]:text-[1.375em] [&_h3]:font-semibold",
  "[&_h4]:my-3 [&_h4]:tracking-tight [&_h4]:text-[1.125em] [&_h4]:font-semibold",
  "[&_h5]:my-3 [&_h5]:tracking-tight [&_h5]:text-[1em] [&_h5]:font-semibold",
  "[&_h6]:my-3 [&_h6]:tracking-tight [&_h6]:text-[0.875em] [&_h6]:font-semibold",
  "[&_code:not(pre_code)]:rounded-sm [&_code:not(pre_code)]:bg-muted [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:text-[#79740e] [&_code:not(pre_code)]:dark:text-[#bac584]",
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-2",
  "[&_blockquote]:mt-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_table]:w-full",
  "[&_tr]:m-0 [&_tr]:border-t [&_tr]:p-0 [&_tr]:even:bg-muted [&_tr]:even:dark:bg-chart-3",
  "[&_th]:border [&_th]:px-1.5 [&_th]:py-1.5 [&_th]:text-center [&_th]:font-bold [&_th]:[&[align=left]]:text-left [&_th]:[&[align=right]]:text-right",
  "[&_td]:border [&_td]:px-1.5 [&_td]:py-1.5 [&_td]:text-left [&_td]:[&[align=center]]:text-center [&_td]:[&[align=right]]:text-right [&_td_code]:bg-secondary!",
  "[&_ul]:my-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:[&>li]:mt-0.5",
  "[&_ol]:my-3 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:[&>li]:mt-0.5",
  "[&_li>ul]:ml-4 [&_li>ol]:ml-6 [&_li>ul]:my-1 [&_li>ol]:my-1",
  "[&_large]:text-[1.15em] [&_large]:font-semibold",
  "[&_small]:text-[0.8em] [&_small]:leading-none [&_small]:font-medium",
  "[&_hr]:my-4",
  "[&_video]:mb-4 [&_video]:w-full [&_video]:mx-auto [&_video]:min-h-[350px] [&_video]:rounded-md [&_video]:border [&_video]:border-border",
  "[&_iframe]:mb-4 [&_iframe]:w-full [&_iframe]:mx-auto [&_iframe]:min-h-[350px] [&_iframe]:rounded-md [&_iframe]:border [&_iframe]:border-border",
  "[&_details]:-mx-3 [&_details]:mt-4 [&_details]:-mb-4 [&_details:not(:last-child)]:mb-4 [&_details]:border-y [&_details:last-child]:border-b-0 [&_details]:border-border [&_details]:p-3 [&_details]:py-3 [&_details]:bg-muted/65 [&_details]:dark:bg-chart-3/65 [&_details]:cursor-pointer [&_details>*]:cursor-auto [&_details]:text-primary [&_details]:font-semibold [&_details]:uppercase [&_details>*]:font-normal [&_details>*]:normal-case [&_details>*]:text-foreground [&_details_summary]:text-primary [&_details_summary]:font-semibold [&_details_summary]:uppercase [&_details_summary]:cursor-pointer",
)

const markdownContentStyle = {
  fontSize: "var(--markdown-content-text-size, 0.8em)",
} satisfies CSSProperties

const codeBlockCopyButtonClassName = cn(
  "pointer-events-none absolute right-1 top-1 z-10 rounded-md border border-border/70 bg-background/85 px-2 py-1 text-[10px] font-medium text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-[opacity,colors] touch-manipulation [@media(pointer:coarse)]:pointer-events-auto [@media(pointer:coarse)]:opacity-100",
  "group-hover/code-block:pointer-events-auto group-hover/code-block:opacity-100 group-focus-within/code-block:pointer-events-auto group-focus-within/code-block:opacity-100 group-data-[copy-active=true]/code-block:pointer-events-auto group-data-[copy-active=true]/code-block:opacity-100",
  "hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
)

type CodeBlockCopyControl = { button: HTMLButtonElement; cleanup: () => void }

/**
 * Creates a copy button for a rendered markdown code block.
 *
 * @param code - The rendered code element whose text should be copied.
 * @param pre - The rendered pre element that owns the code block.
 * @param wrapper - The positional wrapper added around the pre element.
 * @returns The configured copy button and cleanup callback.
 */
function createCodeBlockCopyButton(code: HTMLElement, pre: HTMLElement, wrapper: HTMLDivElement): CodeBlockCopyControl {
  const abortController = new AbortController()
  const button = document.createElement("button")
  let clearActiveTimeout: number | undefined
  let resetLabelTimeout: number | undefined

  const clearCopyActive = () => {
    window.clearTimeout(clearActiveTimeout)
    delete wrapper.dataset.copyActive
  }

  button.className = codeBlockCopyButtonClassName
  button.textContent = "Copy"
  button.type = "button"
  button.setAttribute("aria-label", "Copy code block")

  button.addEventListener(
    "click",
    () => {
      window.clearTimeout(resetLabelTimeout)

      void (async () => {
        try {
          await copyTextToClipboard(code.textContent ?? "")
          button.textContent = "Copied"
        } catch {
          button.textContent = "Failed"
        }

        resetLabelTimeout = window.setTimeout(() => {
          button.textContent = "Copy"
        }, 1600)
      })()
    },
    { signal: abortController.signal },
  )

  wrapper.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target instanceof Node && button.contains(event.target)) {
        return
      }

      clearCopyActive()
      wrapper.dataset.copyActive = "true"
      clearActiveTimeout = window.setTimeout(() => {
        delete wrapper.dataset.copyActive
      }, 2400)
    },
    { signal: abortController.signal },
  )

  wrapper.addEventListener(
    "pointerleave",
    () => {
      clearCopyActive()

      if (document.activeElement instanceof HTMLElement && wrapper.contains(document.activeElement)) {
        document.activeElement.blur()
      }
    },
    { signal: abortController.signal },
  )

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.target instanceof Node && wrapper.contains(event.target)) {
        return
      }

      clearCopyActive()
    },
    { signal: abortController.signal },
  )

  return {
    button,
    cleanup: () => {
      abortController.abort()
      window.clearTimeout(clearActiveTimeout)
      window.clearTimeout(resetLabelTimeout)
      button.remove()

      if (wrapper.parentElement && pre.parentElement === wrapper) {
        wrapper.parentElement.insertBefore(pre, wrapper)
        wrapper.remove()
      }
    },
  }
}

/**
 * Adds client-side copy buttons to rendered markdown code blocks.
 *
 * @param container - The rendered markdown container to enhance.
 * @returns A cleanup function for timers and event targets owned by the enhancement.
 */
function addCodeBlockCopyButtons(container: HTMLElement): () => void {
  const controls: CodeBlockCopyControl[] = []
  const codeBlocks = container.querySelectorAll<HTMLElement>("pre > code")

  for (const code of codeBlocks) {
    const pre = code.parentElement

    if (!pre?.parentElement) {
      continue
    }

    const wrapper = document.createElement("div")
    const control = createCodeBlockCopyButton(code, pre, wrapper)

    wrapper.className = "relative group/code-block"
    pre.parentElement.insertBefore(wrapper, pre)
    wrapper.append(pre, control.button)
    controls.push(control)
  }

  return () => {
    for (const control of controls) {
      control.cleanup()
    }
  }
}

interface MarkdownContentProps {
  allowHtml?: boolean
  children?: ReactNode
  className?: string
  content: string
  emptyMessage?: string
}

/**
 * Renders markdown content through the shared app markdown pipeline.
 *
 * @param props - Markdown text, rendering options, and optional trailing content.
 * @returns Markdown content, a fallback message, or a render error.
 */
export function MarkdownContent({
  allowHtml = false,
  children,
  className,
  content,
  emptyMessage = "No content.",
}: MarkdownContentProps): ReactElement {
  const [html, setHtml] = useState("")
  const [error, setError] = useState<string | null>(null)
  const renderedContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ignore = false

    void (async () => {
      try {
        const { renderMarkdown } = await import("@/lib/markdown/renderer")
        const rendered = await renderMarkdown(content, { allowHtml })

        if (!ignore) {
          setError(null)
          setHtml(rendered)
        }
      } catch (cause) {
        if (!ignore) {
          setError(cause instanceof Error ? cause.message : "Unable to render markdown.")
          setHtml("")
        }
      }
    })()

    return () => {
      ignore = true
    }
  }, [allowHtml, content])

  useLayoutEffect(() => {
    const renderedContent = renderedContentRef.current

    if (!html || !renderedContent) {
      return
    }

    return addCodeBlockCopyButtons(renderedContent)
  })

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!html) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className={cn(markdownContentClassName, className)} style={markdownContentStyle}>
      <div ref={renderedContentRef} dangerouslySetInnerHTML={{ __html: html }} />
      {children ? <div>{children}</div> : null}
    </div>
  )
}

interface DeferredMarkdownContentProps extends MarkdownContentProps {
  rootMargin?: string
}

/**
 * Defers markdown rendering until the content is near the viewport.
 *
 * @param props - Markdown content props plus an optional observer margin.
 * @returns Deferred markdown content or a lightweight placeholder.
 */
export function DeferredMarkdownContent({
  emptyMessage = "Loading content...",
  rootMargin = "600px 0px",
  ...props
}: DeferredMarkdownContentProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const container = containerRef.current

    if (!container || shouldRender) {
      return
    }

    if (!("IntersectionObserver" in window)) {
      setShouldRender(true)

      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [rootMargin, shouldRender])

  return (
    <div ref={containerRef}>
      {shouldRender ? (
        <MarkdownContent emptyMessage={emptyMessage} {...props} />
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  )
}
