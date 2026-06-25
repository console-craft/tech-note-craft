import type { ReactElement, RefObject } from "react"
import { MarkdownContent } from "@/components/core/markdown-content"
import type { AIChatMessage } from "@/lib/ai-chat/chat"
import { cn } from "@/lib/utils"

interface AIChatMessagesProps {
  isConversationLoaded: boolean
  messages: AIChatMessage[]
  messagesRef: RefObject<HTMLDivElement | null>
}

/**
 * Renders the visible AI chat message history.
 *
 * @param props - Message list state and scroll container ref.
 * @returns Scrollable message history with loading and empty states.
 */
export function AIChatMessages({ isConversationLoaded, messages, messagesRef }: AIChatMessagesProps): ReactElement {
  return (
    <div
      ref={messagesRef}
      className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg border bg-primary-foreground dark:bg-secondary p-3"
    >
      {messages.length > 0 ? (
        messages.map((message) => (
          <article
            key={message.id}
            className={cn(
              "max-w-[88%] rounded-lg border p-3",
              message.role === "user" ? "self-end bg-primary text-primary-foreground" : "self-start bg-card",
            )}
          >
            <p className="mb-1 font-medium opacity-75">{message.role === "assistant" ? "AI tutor" : "You"}</p>
            {message.role === "user" ? (
              <p className="whitespace-pre-wrap font-semibold">{message.content}</p>
            ) : (
              <MarkdownContent content={message.content} emptyMessage={<span>Empty response.</span>} />
            )}
          </article>
        ))
      ) : !isConversationLoaded ? (
        <p className="m-auto max-w-xs text-center text-[0.9em] text-muted-foreground">Loading saved chat...</p>
      ) : (
        <p className="m-auto max-w-xs text-center text-[0.9em] text-muted-foreground">
          Ask a question about this card. The AI will receive the card content and this conversation each time.
        </p>
      )}
    </div>
  )
}
