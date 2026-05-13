import type { MouseEvent, ReactElement } from "react"
import { MarkdownContent } from "@/components/core/markdown-content"
import { NoteCardActions } from "@/components/note-card/actions"
import { QuizCarousel } from "@/components/note-card/quiz-carousel"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserHref } from "@/lib/browser/routing"
import type { QuizType } from "@/lib/content"
import { getGroupIcon } from "@/lib/content/group-icons"
import { cn } from "@/lib/utils"
import type { ActiveAIChat } from "@/components/ai-chat"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

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

interface NoteCardProps {
  className?: string
  cardId: string
  group: string
  category: string
  content: string
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
  quiz,
  isExpanded,
  onAIChatOpen,
  onExpandedChange,
  onNavigate,
}: NoteCardProps): ReactElement {
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
          <button
            className="text-xl font-extrabold text-balance flex w-full items-center gap-2 text-left outline-none transition-colors hover:text-primary focus-visible:text-primary"
            type="button"
            aria-expanded={isExpanded}
            onClick={() => onExpandedChange(!isExpanded)}
          >
            <span className="flex items-center gap-2 text-primary">
              <GroupIcon />
            </span>
            <span className="flex-1">{title}</span>
            {isExpanded ? <IconChevronUp className="text-border" /> : <IconChevronDown className="text-border" />}
          </button>
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
          <MarkdownContent allowHtml content={body}>
            {quiz.length > 0 ? <QuizCarousel quiz={quiz} /> : null}
          </MarkdownContent>
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
    </Card>
  )
}
