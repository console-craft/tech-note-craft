import type { MouseEvent, ReactElement } from "react"
import { useState } from "react"
import { DeferredMarkdownContent } from "@/components/core/markdown-content"
import { NoteCardActions } from "@/components/note-card/actions"
import { QuizCarousel } from "@/components/note-card/quiz-carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createBrowserHref } from "@/lib/browser/routing"
import type { QuizType } from "@/lib/content"
import { getGroupIcon } from "@/lib/content/group-icons"
import { cn } from "@/lib/utils"
import type { ActiveAIChat } from "@/components/ai-chat"
import { IconArrowsMaximize, IconChevronDown, IconChevronUp } from "@tabler/icons-react"

interface CardContentParts {
  body: string
  title: string
}

/**
 * Splits note card content into a display title and rendered body.
 *
 * @param content - Full note card markdown content.
 * @returns Card title and body content without the first heading.
 */
function getCardContent(content: string): CardContentParts {
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m)

  return {
    body: headingMatch ? content.replace(headingMatch[0], "").trimStart() : content,
    title: headingMatch?.[1] ?? "Untitled note",
  }
}

interface NoteCardBodyProps {
  body: string
  quiz: QuizType[]
}

/**
 * Renders the markdown content shared by the inline card and modal view.
 *
 * @param props - Markdown body and quiz data to render.
 * @returns Rendered note content.
 */
function NoteCardBody({ body, quiz }: NoteCardBodyProps): ReactElement {
  return (
    <DeferredMarkdownContent allowHtml content={body}>
      {quiz.length > 0 ? <QuizCarousel quiz={quiz} /> : null}
    </DeferredMarkdownContent>
  )
}

interface NoteCardProps {
  className?: string
  cardId: string
  group: string
  category: string
  content: string
  order: number
  quiz: QuizType[]
  isExpanded: boolean
  onAIChatOpen: (chat: ActiveAIChat) => void
  onExpandedChange: (isExpanded: boolean) => void
  onNavigate: (to: string) => void
}

/**
 * Renders an expandable note card with markdown content and note actions.
 *
 * @param props - Note content, routing callbacks, and expansion controls.
 * @returns An expandable note card.
 */
export function NoteCard({
  className,
  cardId,
  group,
  category,
  content,
  order,
  quiz,
  isExpanded,
  onAIChatOpen,
  onExpandedChange,
  onNavigate,
}: NoteCardProps): ReactElement {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { body, title } = getCardContent(content)
  const categoryHref = `/${group}#${encodeURIComponent(category)}`
  const GroupIcon = getGroupIcon(group)

  function navigateToCategory(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault()
    onNavigate(categoryHref)
  }

  return (
    <Card
      data-ai-chat-card-id={cardId}
      className={cn(
        "w-full transition-[box-shadow] data-[ai-chat-highlighted=true]:animate-pulse data-[ai-chat-highlighted=true]:ring-2 data-[ai-chat-highlighted=true]:ring-primary/70",
        className,
      )}
      size="sm"
    >
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <button
              className="flex min-w-0 flex-1 items-center gap-2 text-left text-xl font-extrabold text-balance outline-none transition-colors hover:text-primary focus-visible:text-primary"
              type="button"
              aria-expanded={isExpanded}
              onClick={() => onExpandedChange(!isExpanded)}
            >
              <span className="flex items-center gap-2 text-primary">
                <GroupIcon />
              </span>
              <span className="min-w-0 flex-1">{title}</span>
            </button>
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              className="text-border hover:bg-transparent hover:text-border aria-expanded:bg-transparent aria-expanded:text-border [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:group-focus-within/card:opacity-100 [@media(hover:none)]:hidden"
              aria-label={`Open ${title} in a large preview`}
              onClick={() => setIsPreviewOpen(true)}
            >
              <IconArrowsMaximize data-icon="inline-start" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              type="button"
              className="text-border hover:bg-transparent hover:text-border aria-expanded:bg-transparent aria-expanded:text-border [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:group-focus-within/card:opacity-100"
              aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
              aria-expanded={isExpanded}
              onClick={() => onExpandedChange(!isExpanded)}
            >
              {isExpanded ? <IconChevronUp data-icon="inline-start" /> : <IconChevronDown data-icon="inline-start" />}
            </Button>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold tabular-nums text-border">
              {order}
            </span>
          </div>
          <div className="mt-2 flex">
            <Badge asChild variant="secondary" className="text-primary">
              <a href={createBrowserHref(categoryHref)} onClick={navigateToCategory}>
                {category}
              </a>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      {isExpanded ? (
        <CardContent>
          <NoteCardBody body={body} quiz={quiz} />
        </CardContent>
      ) : null}
      {isExpanded ? (
        <NoteCardActions
          group={group}
          category={category}
          content={content}
          onAskAI={() => onAIChatOpen({ cardId, group, category, content, title })}
        />
      ) : null}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden p-0 sm:max-w-[min(80rem,calc(100%-2rem))]">
          <DialogHeader className="border-b p-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-balance">
              <span className="flex items-center gap-2 text-primary">
                <GroupIcon />
              </span>
              <span>{title}</span>
            </DialogTitle>
            <div className="flex">
              <Badge variant="secondary" className="text-primary">
                {category}
              </Badge>
            </div>
          </DialogHeader>
          <div className="max-h-[calc(100dvh-8rem)] overflow-auto p-4">
            <NoteCardBody body={body} quiz={quiz} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
