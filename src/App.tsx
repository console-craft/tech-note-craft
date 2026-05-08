import type { ComponentType, CSSProperties, MouseEvent, ReactElement } from "react"
import { useEffect, useRef, useState } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppSidePanel } from "@/components/layout/app-side-panel"
import { TopNavbar } from "@/components/layout/top-navbar"
import { NotFound } from "@/components/not-found"
import { Page } from "@/components/page"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isBrowserFullscreen, toggleBrowserFullscreen } from "@/lib/browser/fullscreen"
import {
  getCurrentHref,
  getPathname,
  navigateTo,
  updateRouteHref,
  type FinishRouteProgress,
} from "@/lib/browser/routing"
import { getStoredThemeMode, setStoredThemeMode } from "@/lib/browser/storage"
import { routePaths } from "@/lib/content"
import type { ActiveAIChat } from "@/components/ai-chat"
import type { AppSidePanelView } from "@/components/layout/app-side-panel"

interface RouteComponentProps {
  href: string
  getIsCardExpanded: (cardId: string) => boolean
  onAIChatOpen: (chat: ActiveAIChat) => void
  onCardExpandedChange: (cardId: string, isExpanded: boolean) => void
  onNavigate: (to: string) => void
  path: string
}

const MARKDOWN_TEXT_SIZE_STEP = 0.1
const DEFAULT_MARKDOWN_TEXT_SIZE = 0.8
const MIN_MARKDOWN_TEXT_SIZE = 0.8
const MAX_MARKDOWN_TEXT_SIZE = 1.1

interface MarkdownTextSizeStyle extends CSSProperties {
  "--markdown-content-text-size": string
}

const routes = Object.fromEntries(routePaths.map((path) => [path, Page])) as Partial<
  Record<string, ComponentType<RouteComponentProps>>
>

/**
 * Renders the root application shell.
 *
 * @returns The themed app layout with navigation and active page content.
 */
export function App(): ReactElement {
  const [areCardsExpanded, setAreCardsExpanded] = useState(true)
  const [cardExpansionOverrides, setCardExpansionOverrides] = useState<Record<string, boolean>>({})
  const [isDark, setIsDark] = useState(() => getStoredThemeMode() === "dark")
  const [isFullscreen, setIsFullscreen] = useState(isBrowserFullscreen)
  const [isRouteProgressVisible, setIsRouteProgressVisible] = useState(false)
  const [markdownTextSize, setMarkdownTextSize] = useState(DEFAULT_MARKDOWN_TEXT_SIZE)
  const [routeProgressKey, setRouteProgressKey] = useState(0)
  const [sidePanelView, setSidePanelView] = useState<AppSidePanelView | null>(null)
  const [href, setHref] = useState(getCurrentHref)
  const routeProgressIdRef = useRef(0)
  const path = getPathname(href)
  const CurrentPage = routes[path]
  const markdownTextSizeStyle: MarkdownTextSizeStyle = {
    "--markdown-content-text-size": `${markdownTextSize.toFixed(1)}em`,
  }

  /**
   * Resets every card to the next global expanded/collapsed state.
   */
  function toggleAllCardsExpanded(): void {
    setAreCardsExpanded((current) => !current)
    setCardExpansionOverrides({})
  }

  /**
   * Gets the effective expansion state for a single card.
   *
   * @param cardId - Stable card identifier.
   * @returns Whether the card should be expanded.
   */
  function getIsCardExpanded(cardId: string): boolean {
    return cardExpansionOverrides[cardId] ?? areCardsExpanded
  }

  /**
   * Overrides the expansion state for a single card.
   *
   * @param cardId - Stable card identifier.
   * @param isExpanded - Next expansion state for that card.
   */
  function setCardExpanded(cardId: string, isExpanded: boolean): void {
    setCardExpansionOverrides((current) => ({ ...current, [cardId]: isExpanded }))
  }

  /**
   * Decreases the rendered markdown body text size.
   */
  function decreaseMarkdownTextSize(): void {
    setMarkdownTextSize((current) => Math.max(MIN_MARKDOWN_TEXT_SIZE, current - MARKDOWN_TEXT_SIZE_STEP))
  }

  /**
   * Increases the rendered markdown body text size.
   */
  function increaseMarkdownTextSize(): void {
    setMarkdownTextSize((current) => Math.min(MAX_MARKDOWN_TEXT_SIZE, current + MARKDOWN_TEXT_SIZE_STEP))
  }

  /**
   * Starts the route progress bar and returns a guarded finisher.
   *
   * @returns A callback that hides the progress bar if no newer route transition started.
   */
  function startRouteProgress(): FinishRouteProgress {
    const progressId = routeProgressIdRef.current + 1

    routeProgressIdRef.current = progressId
    setRouteProgressKey(progressId)
    setIsRouteProgressVisible(true)

    return () => {
      if (routeProgressIdRef.current === progressId) {
        setIsRouteProgressVisible(false)
      }
    }
  }

  /**
   * Navigates to an internal app route without reloading the page.
   *
   * @param event - Anchor click event.
   * @param to - Destination pathname with optional hash.
   */
  function navigate(event: MouseEvent<HTMLAnchorElement>, to: string): void {
    event.preventDefault()

    navigateTo(to, setHref, startRouteProgress)
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    setStoredThemeMode(isDark ? "dark" : "light")
  }, [isDark])

  useEffect(() => {
    function handleFullscreenChange(): void {
      setIsFullscreen(isBrowserFullscreen())
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    handleFullscreenChange()

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    function handlePopState(): void {
      updateRouteHref(setHref, startRouteProgress)
    }

    window.addEventListener("popstate", handlePopState)
    window.addEventListener("hashchange", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("hashchange", handlePopState)
    }
  }, [])

  return (
    <TooltipProvider>
      <div key={routeProgressKey} aria-hidden="true" className="route-progress" data-active={isRouteProgressVisible} />
      <SidebarProvider>
        <AppSidebar currentHref={href} onNavigate={navigate} />
        <SidebarInset className="h-svh overflow-hidden" style={markdownTextSizeStyle}>
          <TopNavbar
            areCardsExpanded={areCardsExpanded}
            isDark={isDark}
            isFullscreen={isFullscreen}
            canDecreaseMarkdownTextSize={markdownTextSize > MIN_MARKDOWN_TEXT_SIZE}
            canIncreaseMarkdownTextSize={markdownTextSize < MAX_MARKDOWN_TEXT_SIZE}
            onNavigate={navigate}
            onDecreaseMarkdownTextSize={decreaseMarkdownTextSize}
            onIncreaseMarkdownTextSize={increaseMarkdownTextSize}
            onOpenAIChatHistory={() => setSidePanelView({ mode: "ai-chat-history" })}
            onToggleCardsExpanded={toggleAllCardsExpanded}
            onToggleFullscreen={() => {
              void toggleBrowserFullscreen()
            }}
            onToggleTheme={() => setIsDark((current) => !current)}
          />
          <AppSidePanel
            view={sidePanelView}
            onOpenChat={(chat) => setSidePanelView({ chat, mode: "ai-chat" })}
            onClosePanel={() => setSidePanelView(null)}
          >
            {CurrentPage ? (
              <CurrentPage
                href={href}
                path={path}
                getIsCardExpanded={getIsCardExpanded}
                onAIChatOpen={(chat) => setSidePanelView({ chat, mode: "ai-chat" })}
                onCardExpandedChange={setCardExpanded}
                onNavigate={(to) => navigateTo(to, setHref, startRouteProgress)}
              />
            ) : (
              <NotFound />
            )}
          </AppSidePanel>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
