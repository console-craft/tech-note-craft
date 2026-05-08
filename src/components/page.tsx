import type { ReactElement } from "react"

import { CardsSection } from "@/components/layout/cards-section"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { contentGroups, notes } from "@/lib/content"
import type { ActiveAIChat } from "@/components/ai-chat"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { IconInfoCircle } from "@tabler/icons-react"

/**
 * Gets the decoded hash value from a route href.
 *
 * @param href - Current route href with optional hash.
 * @returns Decoded hash value without the leading `#`.
 */
function getHashValue(href: string): string {
  const hash = href.split("#")[1]

  return hash ? decodeURIComponent(hash) : ""
}

interface PageProps {
  href: string
  path: string
  getIsCardExpanded: (cardId: string) => boolean
  onAIChatOpen: (chat: ActiveAIChat) => void
  onCardExpandedChange: (cardId: string, isExpanded: boolean) => void
  onNavigate: (to: string) => void
}

/**
 * Renders the current markdown notes landing page.
 *
 * @param props - Current route information.
 * @returns The page content for the active route.
 */
export function Page({
  href,
  path,
  getIsCardExpanded,
  onAIChatOpen,
  onCardExpandedChange,
  onNavigate,
}: PageProps): ReactElement {
  const activeGroup = contentGroups.find((group) => group.path === path)
  const groupNotes = activeGroup ? notes.filter((note) => note.group === activeGroup.path.slice(1)) : notes
  const categoryTitles = activeGroup?.categories.map((category) => category.title) ?? []
  const hashCategory = getHashValue(href)
  const activeCategory = categoryTitles.includes(hashCategory) ? hashCategory : categoryTitles[0]
  const pageTitle = activeGroup ? activeGroup.title : "What do you want to learn today?"
  const pageDescription = activeGroup
    ? "Get started by reading a note card, or ask AI for personalized guidance."
    : "Browse through the categories to find note cards on a specific topic, or ask AI for personalized guidance."

  /**
   * Navigates to the same page with a different category hash.
   *
   * @param category - Selected category tab value.
   */
  function navigateToCategory(category: string): void {
    onNavigate(`${path}#${encodeURIComponent(category)}`)
  }

  return (
    <section className="mx-auto flex w-full max-w-8xl flex-col gap-8 px-6 py-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{pageTitle.toUpperCase()}</h1>
        {!activeGroup ? (
          <Alert className="my-4 py-4">
            <IconInfoCircle />
            <AlertTitle> Stay tuned for updates! More content coming soon.</AlertTitle>
            <AlertDescription className="mt-2 text-[11px]">
              <p className="mb-[0.5em]!">
                I'm working hard to create more note cards and quizzes to help you learn, review, and retain the
                information long-term.
              </p>
              <p>The cards are carefully thought through, curated, and verified, not mass AI-generated.</p>
            </AlertDescription>
          </Alert>
        ) : null}
        <p className="text-muted-foreground">{pageDescription}</p>
      </div>
      {activeGroup && activeCategory ? (
        <Tabs value={activeCategory} onValueChange={navigateToCategory} className="min-w-0">
          <ScrollArea className="mb-2 w-full max-w-full h-11">
            <TabsList variant="default">
              {activeGroup.categories.map((category) => (
                <TabsTrigger key={category.href} value={category.title}>
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {activeGroup.categories.map((category) => (
            <TabsContent key={category.href} value={category.title}>
              <CardsSection
                notes={groupNotes.filter((note) => note.category === category.title)}
                showFilter
                getIsCardExpanded={getIsCardExpanded}
                onAIChatOpen={onAIChatOpen}
                onCardExpandedChange={onCardExpandedChange}
                onNavigate={onNavigate}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <CardsSection
          notes={groupNotes}
          showFilter
          showGroupFilter
          getIsCardExpanded={getIsCardExpanded}
          onAIChatOpen={onAIChatOpen}
          onCardExpandedChange={onCardExpandedChange}
          onNavigate={onNavigate}
        />
      )}
    </section>
  )
}
