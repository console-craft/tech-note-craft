import type { MouseEvent, ReactElement } from "react"
import {
  IconChevronDown,
  IconChevronUp,
  IconHistory,
  IconMaximize,
  IconMinimize,
  IconMoon,
  IconSun,
  IconTextDecrease,
  IconTextIncrease,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { createBrowserHref } from "@/lib/browser/routing"
import { cn } from "@/lib/utils"

interface TopNavbarProps {
  areCardsExpanded: boolean
  canDecreaseMarkdownTextSize: boolean
  canIncreaseMarkdownTextSize: boolean
  isDark: boolean
  isFullscreen: boolean
  onDecreaseMarkdownTextSize: () => void
  onIncreaseMarkdownTextSize: () => void
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
  onToggleCardsExpanded: () => void
  onOpenAIChatHistory: () => void
  onToggleFullscreen: () => void
  onToggleTheme: () => void
}

/**
 * Renders the top application navbar.
 *
 * @param props - Navbar state and event handlers.
 * @returns A shadcn-styled top bar with branding and control buttons.
 */
export function TopNavbar({
  areCardsExpanded,
  canDecreaseMarkdownTextSize,
  canIncreaseMarkdownTextSize,
  isDark,
  isFullscreen,
  onDecreaseMarkdownTextSize,
  onIncreaseMarkdownTextSize,
  onNavigate,
  onToggleCardsExpanded,
  onOpenAIChatHistory,
  onToggleFullscreen,
  onToggleTheme,
}: TopNavbarProps): ReactElement {
  const isMobile = useIsMobile()
  const { state } = useSidebar()

  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <a
          href={createBrowserHref("/")}
          className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight"
          onClick={(event) => onNavigate(event, "/")}
        >
          <span className={cn({ hidden: state !== "collapsed" })}>tech-note-craft</span>
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label={areCardsExpanded ? "Collapse all cards" : "Expand all cards"}
              aria-pressed={areCardsExpanded}
              onClick={onToggleCardsExpanded}
            >
              {areCardsExpanded ? <IconChevronDown className="h-5! w-5!" /> : <IconChevronUp className="h-5! w-5!" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{areCardsExpanded ? "Collapse all cards" : "Expand all cards"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="Decrease markdown text size"
              disabled={!canDecreaseMarkdownTextSize}
              onClick={onDecreaseMarkdownTextSize}
            >
              <IconTextDecrease className="h-5! w-5!" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease markdown text size</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="Increase markdown text size"
              disabled={!canIncreaseMarkdownTextSize}
              onClick={onIncreaseMarkdownTextSize}
            >
              <IconTextIncrease className="h-5! w-5!" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase markdown text size</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Open AI chat history" onClick={onOpenAIChatHistory}>
              <IconHistory className="h-5! w-5!" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI chat history</TooltipContent>
        </Tooltip>
        {!isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                aria-pressed={isFullscreen}
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? <IconMinimize className="h-5! w-5!" /> : <IconMaximize className="h-5! w-5!" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}</TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={onToggleTheme}
            >
              {isDark ? <IconSun className="h-5! w-5!" /> : <IconMoon className="h-5! w-5!" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isDark ? "Switch to light mode" : "Switch to dark mode"}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
