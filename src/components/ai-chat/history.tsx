import type { ReactElement } from "react"
import { useEffect, useState } from "react"
import { IconGhost3, IconTrash } from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteAIChatConversation, type AIChatConversation, listAIChatConversations } from "@/lib/ai-chat/storage"
import { notes } from "@/lib/content"
import type { ActiveAIChat } from "@/components/ai-chat"

/**
 * Formats a saved timestamp for compact history display.
 *
 * @param value - ISO timestamp value.
 * @returns Locale-aware display text, or N/A when invalid.
 */
function formatUpdatedAt(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "N/A"
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)
}

/**
 * Gets the first markdown heading from a note body.
 *
 * @param content - Markdown note content.
 * @returns The note title, or null when no heading exists.
 */
function getNoteTitle(content: string): string | null {
  const headingMatch = content.match(/^#{1,6}\s+(.+)$/m)

  return headingMatch?.[1] ?? null
}

interface HistoryItem {
  chat: ActiveAIChat
  conversation: AIChatConversation
}

/**
 * Builds an active chat payload from saved history and current note metadata.
 *
 * @param conversation - Persisted chat conversation.
 * @returns Active chat state ready for the app side panel.
 */
function createHistoryItem(conversation: AIChatConversation): HistoryItem {
  const note = notes.find((item) => item.id === conversation.cardId)
  const savedGroup = conversation.group || "N/A"
  const savedTitle = conversation.title || "N/A"

  return {
    chat: {
      cardId: conversation.cardId,
      category: note?.category ?? "N/A",
      content: note?.content ?? "",
      group: note?.group ?? savedGroup,
      isReadOnly: !note,
      title: note ? (getNoteTitle(note.content) ?? savedTitle) : savedTitle,
    },
    conversation,
  }
}

interface AIChatHistoryProps {
  onOpenChat: (chat: ActiveAIChat) => void
}

/**
 * Renders saved AI chat conversations from IndexedDB.
 *
 * @param props - History selection handler.
 * @returns A selectable saved chat list.
 */
export function AIChatHistory({ onOpenChat }: AIChatHistoryProps): ReactElement {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    let ignore = false

    void (async () => {
      try {
        const conversations = await listAIChatConversations()

        if (!ignore) {
          setItems(conversations.map(createHistoryItem))
          setError(null)
          setIsLoading(false)
        }
      } catch (cause) {
        if (!ignore) {
          setError(cause instanceof Error ? cause.message : "Unable to load chat history.")
          setIsLoading(false)
        }
      }
    })()

    return () => {
      ignore = true
    }
  }, [])

  /**
   * Deletes a saved chat and removes it from the visible history list.
   *
   * @param cardId - Card identifier for the saved conversation.
   * @returns Nothing.
   */
  async function deleteChat(cardId: string): Promise<void> {
    try {
      await deleteAIChatConversation(cardId)
      setItems((current) => current.filter((item) => item.conversation.cardId !== cardId))
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete chat.")
    }
  }

  if (isLoading) {
    return <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">Loading chat history...</p>
  }

  if (error) {
    return <p className="m-auto max-w-xs text-center text-sm text-destructive">{error}</p>
  }

  if (items.length === 0) {
    return <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">No saved AI chats yet.</p>
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      {items.map(({ chat, conversation }) => (
        <div key={conversation.id} className="flex gap-2 rounded-lg border bg-card p-2">
          <Button
            type="button"
            variant="ghost"
            className="h-auto min-w-0 flex-1 justify-start whitespace-normal p-1 text-left"
            onClick={() => onOpenChat(chat)}
          >
            <span className="flex min-w-0 flex-col gap-1">
              <span className="truncate font-semibold">{chat.title}</span>
              <span className="text-[0.9em] text-muted-foreground">
                {chat.group} &bull; {conversation.messages.length} messages &bull;{" "}
                {formatUpdatedAt(conversation.updatedAt)}
              </span>
              {chat.isReadOnly ? (
                <span className="text-[0.9em] text-destructive flex gap-2 mt-3">
                  <IconGhost3 /> Source note not available anymore! (Read-only)
                </span>
              ) : null}
            </span>
          </Button>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Delete chat">
                    <IconTrash className="text-destructive" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Delete chat</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the saved chat for {chat.title}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    void deleteChat(conversation.cardId)
                  }}
                >
                  Delete chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  )
}
