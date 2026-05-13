import type { ReactElement, ReactNode } from "react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Spinner } from "@/components/ui/spinner"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePageScrollbarVisibility } from "@/hooks/use-page-scrollbar-visibility"
import { useScrollAIChatCardIntoView } from "@/hooks/use-scroll-ai-chat-card-into-view"
import { cn } from "@/lib/utils"
import type { ActiveAIChat } from "@/components/ai-chat"

const sidePanelAnimationDuration = 200

const LazyAIChat = lazy(async () => {
  const module = await import("@/components/ai-chat")

  return { default: module.AIChat }
})

const LazyAIChatHistory = lazy(async () => {
  const module = await import("@/components/ai-chat/history")

  return { default: module.AIChatHistory }
})

export type AppSidePanelView = { mode: "ai-chat"; chat: ActiveAIChat } | { mode: "ai-chat-history" }

interface AppSidePanelContentProps {
  view: AppSidePanelView
  onClose: () => void
  onOpenChat: (chat: ActiveAIChat) => void
}

/**
 * Renders the active app side panel view.
 *
 * @param props - Active side panel view and panel event handlers.
 * @returns Side panel content for AI chat and AI chat history workflows.
 */
function AppSidePanelContent({ onClose, onOpenChat, view }: AppSidePanelContentProps): ReactElement {
  const title =
    view.mode === "ai-chat" ? (
      <div>
        Ask AI
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="uppercase">{view.chat.group}</span> › <span>{view.chat.category}</span> ›{" "}
          <span className="text-primary">{view.chat.title}</span>
        </p>
      </div>
    ) : (
      "AI Chat History"
    )

  return (
    <aside className="flex h-full min-w-0 flex-col overflow-hidden bg-background">
      <div className="flex items-start justify-between gap-4 border-b p-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Close side panel" onClick={onClose}>
          <IconX />
        </Button>
      </div>
      <Suspense fallback={<AppSidePanelLoading />}>
        {view.mode === "ai-chat" ? (
          <LazyAIChat
            key={view.chat.cardId}
            cardId={view.chat.cardId}
            group={view.chat.group}
            category={view.chat.category}
            title={view.chat.title}
            content={view.chat.content}
            isReadOnly={view.chat.isReadOnly}
          />
        ) : (
          <LazyAIChatHistory onOpenChat={onOpenChat} />
        )}
      </Suspense>
    </aside>
  )
}

/**
 * Renders the side panel loading state while lazy views download.
 *
 * @returns A compact loading indicator.
 */
function AppSidePanelLoading(): ReactElement {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
      <Spinner />
      Loading panel...
    </div>
  )
}

interface AppSidePanelProps {
  children: ReactNode
  view: AppSidePanelView | null
  onClosePanel: () => void
  onOpenChat: (chat: ActiveAIChat) => void
}

/**
 * Renders page content with an optional fixed, resizable app side panel.
 *
 * @param props - Page content, active side panel view, and side panel handlers.
 * @returns Scroll-contained content with a fixed side panel when active.
 */
export function AppSidePanel({ children, view, onClosePanel, onOpenChat }: AppSidePanelProps): ReactElement {
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [renderedView, setRenderedView] = useState<AppSidePanelView | null>(view)
  const contentScrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const { isPageScrolling, showPageScrollbar } = usePageScrollbarVisibility()

  useScrollAIChatCardIntoView(view?.mode === "ai-chat" ? view.chat : null, contentScrollRef)

  useEffect(() => {
    if (view) {
      setRenderedView(view)

      const animationFrame = requestAnimationFrame(() => {
        setIsPanelVisible(true)
      })

      return () => {
        cancelAnimationFrame(animationFrame)
      }
    }

    setIsPanelVisible(false)

    const timeout = window.setTimeout(() => {
      setRenderedView(null)
    }, sidePanelAnimationDuration)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [view])

  if (!renderedView) {
    return (
      <div
        ref={contentScrollRef}
        data-scrolling={isPageScrolling}
        className="page-scrollbar min-h-0 flex-1 overflow-y-auto"
        onScroll={showPageScrollbar}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "h-full min-w-0 bg-background transition-[opacity,transform] duration-200 ease-out",
            isPanelVisible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
          )}
        >
          <AppSidePanelContent view={renderedView} onOpenChat={onOpenChat} onClose={onClosePanel} />
        </div>
      </div>
    )
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1 overflow-hidden">
      <ResizablePanel className="min-w-0" defaultSize="66%" minSize="33%">
        <div
          ref={contentScrollRef}
          data-scrolling={isPageScrolling}
          className="page-scrollbar h-full overflow-y-auto"
          onScroll={showPageScrollbar}
        >
          {children}
        </div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={cn("transition-opacity duration-200 ease-out", isPanelVisible ? "opacity-100" : "opacity-0")}
      />
      <ResizablePanel
        className={cn(
          "min-w-0 overflow-hidden bg-background transition-[opacity,transform] duration-200 ease-out",
          isPanelVisible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
        )}
        defaultSize="33%"
        minSize="33%"
      >
        <AppSidePanelContent view={renderedView} onOpenChat={onOpenChat} onClose={onClosePanel} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
