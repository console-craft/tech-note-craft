import type { MouseEvent, ReactElement } from "react"
import { useState } from "react"
import { IconBackspace, IconLayoutSidebar, IconSticker2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { contentGroups, type ContentGroup } from "@/lib/content"
import { getGroupIcon } from "@/lib/content/group-icons"
import { cn } from "@/lib/utils"

/**
 * Renders the sidebar collapse control.
 *
 * @returns A footer button that toggles the sidebar and exposes collapsed tooltips.
 */
function SidebarCollapseButton(): ReactElement {
  const { state, toggleSidebar } = useSidebar()
  const label = state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"

  return (
    <SidebarMenuButton tooltip={label} onClick={toggleSidebar}>
      <IconLayoutSidebar />
      <span>{label}</span>
    </SidebarMenuButton>
  )
}

interface SidebarNavGroupProps {
  currentHref: string
  group: ContentGroup
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}

/**
 * Renders one grouped section of sidebar links.
 *
 * @param props - The sidebar group configuration and router state.
 * @returns A labeled sidebar navigation group.
 */
function SidebarNavGroup({ currentHref, group, onNavigate }: SidebarNavGroupProps): ReactElement {
  const LinkIcon = getGroupIcon(group.title)

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary">{group.title.toUpperCase()}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.categories.map((category) => (
            <SidebarMenuItem key={category.href}>
              <SidebarMenuButton
                asChild
                isActive={currentHref === category.href}
                tooltip={`${group.title}: ${category.title}`}
              >
                <a
                  href={category.href}
                  onClick={(event) => onNavigate(event, category.href)}
                  className="h-[1.8em] text-[0.8em]"
                >
                  <LinkIcon className="text-muted-foreground" />
                  <span className="font-thin">{category.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

/**
 * Checks whether a label contains a query token using case-insensitive matching.
 *
 * @param label - Display label to search.
 * @param token - Normalized query token to find.
 * @returns True when the label contains the token.
 */
function includesToken(label: string, token: string): boolean {
  return label.toLowerCase().includes(token)
}

/**
 * Checks whether a label contains every query token.
 *
 * @param label - Display label to search.
 * @param tokens - Normalized query tokens to find.
 * @returns True when every token is present in the label.
 */
function includesAllTokens(label: string, tokens: string[]): boolean {
  return tokens.every((token) => includesToken(label, token))
}

/**
 * Filters sidebar groups by preferring the first token as a group title match.
 *
 * @param groups - Available sidebar navigation groups.
 * @param query - Raw sidebar filter query.
 * @returns Groups with categories narrowed to the active query.
 */
function filterContentGroups(groups: ContentGroup[], query: string): ContentGroup[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  if (tokens.length === 0) {
    return groups
  }

  const [firstToken, ...categoryTokens] = tokens
  const matchedGroups = groups.filter((group) => includesToken(group.title, firstToken))

  if (matchedGroups.length > 0) {
    return matchedGroups
      .map((group) => ({
        ...group,
        categories:
          categoryTokens.length === 0
            ? group.categories
            : group.categories.filter((category) => includesAllTokens(category.title, categoryTokens)),
      }))
      .filter((group) => group.categories.length > 0)
  }

  return groups
    .map((group) => ({
      ...group,
      categories: group.categories.filter((category) => includesAllTokens(category.title, tokens)),
    }))
    .filter((group) => group.categories.length > 0)
}

interface AppSidebarProps {
  currentHref: string
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void
}

/**
 * Renders the app-level navigation sidebar.
 *
 * @returns A collapsible shadcn sidebar with generated content navigation groups.
 */
export function AppSidebar({ currentHref, onNavigate }: AppSidebarProps): ReactElement {
  const [filterQuery, setFilterQuery] = useState("")
  const filteredGroups = filterContentGroups(contentGroups, filterQuery)
  const { isMobile, setOpenMobile, state } = useSidebar()

  /**
   * Navigates from the sidebar and dismisses the mobile sheet after link activation.
   *
   * @param event - Sidebar link click event.
   * @param href - Internal route to navigate to.
   */
  function navigateAndCloseMobile(event: MouseEvent<HTMLAnchorElement>, href: string): void {
    onNavigate(event, href)

    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentHref === "/"}
              size="lg"
              tooltip="tech-note-craft"
              className="mt-1"
            >
              <a
                href="/"
                onClick={(event) => navigateAndCloseMobile(event, "/")}
                className="flex items-center justify-center"
              >
                <IconSticker2 className="text-primary text-bold" />
                <span className={cn({ hidden: state === "collapsed" })}>tech-note-craft</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <ButtonGroup aria-label="Filter sidebar links" className="w-full group-data-[collapsible=icon]:hidden">
          <Input
            aria-label="Filter sidebar links"
            className="h-8"
            placeholder="Filter..."
            value={filterQuery}
            onChange={(event) => setFilterQuery(event.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Clear sidebar filter"
            disabled={!filterQuery}
            onClick={() => setFilterQuery("")}
          >
            <IconBackspace />
          </Button>
        </ButtonGroup>
      </SidebarHeader>
      <SidebarContent>
        {filteredGroups.map((group) => (
          <SidebarNavGroup
            key={group.path}
            currentHref={currentHref}
            group={group}
            onNavigate={navigateAndCloseMobile}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarCollapseButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
