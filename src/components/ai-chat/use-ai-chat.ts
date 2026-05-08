import type { ComponentProps, KeyboardEvent, RefObject } from "react"
import { useEffect, useRef, useState } from "react"
import {
  type AIChatMessage,
  createAIChatDownloadFilename,
  createAIChatMessageId,
  createAIChatRequestPayload,
  formatAIChatMessagesAsMarkdown,
  sendAIChatMessage,
} from "@/lib/ai-chat/chat"
import { isAIChatModel, type AIChatModel } from "@/lib/ai-chat/models"
import { createCardTutorPrompt } from "@/lib/ai-chat/prompt"
import { deleteAIChatConversation, getAIChatConversation, saveAIChatConversation } from "@/lib/ai-chat/storage"
import {
  getStoredOpenAIApiKey,
  getStoredOpenAIModel,
  setStoredOpenAIApiKey,
  setStoredOpenAIModel,
} from "@/lib/browser/storage"
import { copyTextToClipboard } from "@/lib/browser/clipboard"

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0]

interface UseAIChatComposerActions {
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  onDraftChange: (value: string) => void
  onShortcut: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

interface UseAIChatComposerState {
  canSubmit: boolean
  copyStatus: string | null
  draft: string
  error: string | null
  hasMessages: boolean
  isConversationLoaded: boolean
  isPending: boolean
  isReadOnly: boolean
}

interface UseAIChatResult {
  apiKey: string
  composerState: UseAIChatComposerState
  composerActions: UseAIChatComposerActions
  downloadChatMessages: () => void
  isConversationLoaded: boolean
  messages: AIChatMessage[]
  messagesRef: RefObject<HTMLDivElement | null>
  model: AIChatModel
  submitMessage: (event: FormSubmitEvent) => Promise<void>
  updateApiKey: (value: string) => void
  updateModel: (value: string) => void
}

interface UseAIChatOptions {
  cardId: string
  category: string
  content: string
  group: string
  isReadOnly: boolean
  title: string
}

/**
 * Manages the local AI chat state, persistence, and side effects.
 *
 * @param options - Card metadata and read-only state for the active chat.
 * @returns Chat state, refs, and event handlers consumed by the UI shell.
 */
export function useAIChat({ cardId, category, content, group, isReadOnly, title }: UseAIChatOptions): UseAIChatResult {
  const messagesRef = useRef<HTMLDivElement>(null)
  const [apiKey, setApiKey] = useState(getStoredOpenAIApiKey)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isConversationLoaded, setIsConversationLoaded] = useState(false)
  const [messages, setMessages] = useState<AIChatMessage[]>([])
  const [model, setModel] = useState(getStoredOpenAIModel)
  const canSubmit = Boolean(apiKey.trim() && draft.trim() && !isPending && !isReadOnly)
  const systemPrompt = createCardTutorPrompt({ group, category, content })

  useEffect(() => {
    let ignore = false

    setError(null)
    setMessages([])
    setIsConversationLoaded(false)

    void (async () => {
      try {
        const conversation = await getAIChatConversation(cardId)

        if (!ignore) {
          setMessages(conversation?.messages ?? [])
          setIsConversationLoaded(true)
        }
      } catch (cause) {
        if (!ignore) {
          setError(cause instanceof Error ? cause.message : "Unable to load saved chat.")
          setIsConversationLoaded(true)
        }
      }
    })()

    return () => {
      ignore = true
    }
  }, [cardId])

  useEffect(() => {
    if (!isConversationLoaded || messages.length === 0) {
      return
    }

    void saveAIChatConversation({ cardId, group, messages, title })
  }, [cardId, group, isConversationLoaded, messages, title])

  useEffect(() => {
    messagesRef.current?.scrollTo({ behavior: "smooth", top: messagesRef.current.scrollHeight })
  }, [messages])

  /**
   * Sends the current message draft to the AI agent.
   *
   * @returns Nothing.
   */
  async function sendMessage(): Promise<void> {
    if (!canSubmit || isReadOnly) {
      return
    }

    const userMessage = {
      content: draft.trim(),
      createdAt: new Date().toISOString(),
      id: createAIChatMessageId(),
      role: "user",
    } satisfies AIChatMessage
    const nextMessages = [...messages, userMessage]

    setDraft("")
    setError(null)
    setIsPending(true)
    setMessages(nextMessages)

    try {
      const response = await sendAIChatMessage({ apiKey: apiKey.trim(), messages: nextMessages, model, systemPrompt })

      setMessages([
        ...nextMessages,
        {
          content: response,
          createdAt: new Date().toISOString(),
          id: createAIChatMessageId(),
          model,
          role: "assistant",
        },
      ])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send message.")
    } finally {
      setIsPending(false)
    }
  }

  /**
   * Submits the chat form.
   *
   * @param event - Chat form submit event.
   * @returns Nothing.
   */
  async function submitMessage(event: FormSubmitEvent): Promise<void> {
    event.preventDefault()
    await sendMessage()
  }

  /**
   * Submits the chat when using the textarea keyboard shortcut.
   *
   * @param event - Textarea keyboard event.
   * @returns Nothing.
   */
  function submitMessageWithShortcut(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== "Enter" || (!event.metaKey && !event.ctrlKey) || event.shiftKey) {
      return
    }

    event.preventDefault()
    void sendMessage()
  }

  /**
   * Updates the OpenAI API key in memory and tab-scoped session storage.
   *
   * @param value - API key value from the password input.
   * @returns Nothing.
   */
  function updateApiKey(value: string): void {
    setApiKey(value)
    setStoredOpenAIApiKey(value)
  }

  /**
   * Updates the selected OpenAI model in memory and local storage.
   *
   * @param value - Model value selected from the model picker.
   * @returns Nothing.
   */
  function updateModel(value: string): void {
    if (!isAIChatModel(value)) {
      return
    }

    setModel(value)
    setStoredOpenAIModel(value)
  }

  /**
   * Permanently clears the saved and visible messages for this chat.
   *
   * @returns Nothing.
   */
  async function clearChat(): Promise<void> {
    try {
      await deleteAIChatConversation(cardId)
      setDraft("")
      setError(null)
      setMessages([])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to clear chat.")
    }
  }

  /**
   * Downloads the current responses request payload as JSON.
   *
   * @returns Nothing.
   */
  function downloadChatMessages(): void {
    const payload = createAIChatRequestPayload({ messages, model, systemPrompt })
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = createAIChatDownloadFilename({ category, date: new Date(), language: group, title })
    link.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Copies the visible chat messages to the clipboard as markdown.
   *
   * @returns Nothing.
   */
  async function copyChatMessages(): Promise<void> {
    try {
      await copyTextToClipboard(formatAIChatMessagesAsMarkdown(category, title, messages))
      setCopyStatus("Chat copied.")
      setError(null)
    } catch (cause) {
      setCopyStatus(null)
      setError(cause instanceof Error ? cause.message : "Unable to copy chat messages.")
    }
  }

  return {
    apiKey,
    composerActions: {
      onClear: () => {
        void clearChat()
      },
      onCopy: () => {
        void copyChatMessages()
      },
      onDownload: downloadChatMessages,
      onDraftChange: setDraft,
      onShortcut: submitMessageWithShortcut,
    },
    composerState: {
      canSubmit,
      copyStatus,
      draft,
      error,
      hasMessages: messages.length > 0,
      isConversationLoaded,
      isPending,
      isReadOnly,
    },
    downloadChatMessages,
    isConversationLoaded,
    messages,
    messagesRef,
    model,
    submitMessage,
    updateApiKey,
    updateModel,
  }
}
