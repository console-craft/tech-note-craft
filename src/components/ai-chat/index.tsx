import type { ReactElement } from "react"
import { useId } from "react"
import { IconGhost3 } from "@tabler/icons-react"
import { AIChatComposer } from "@/components/ai-chat/composer"
import { AIChatMessages } from "@/components/ai-chat/messages"
import { AIChatSettings } from "@/components/ai-chat/settings"
import { useAIChat } from "@/components/ai-chat/use-ai-chat"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AIChatProps {
  cardId: string
  category: string
  content: string
  group: string
  isReadOnly?: boolean
  title: string
}

export interface ActiveAIChat {
  cardId: string
  group: string
  category: string
  title: string
  content: string
  isReadOnly?: boolean
}

/**
 * Renders a local-only AI chat for a markdown card.
 *
 * @param props - Markdown card content and content group.
 * @returns Chat UI that sends the full conversation context to OpenAI.
 */
export function AIChat({ cardId, category, content, group, isReadOnly = false, title }: AIChatProps): ReactElement {
  const apiKeyId = useId()
  const modelId = useId()
  const messageId = useId()
  const chat = useAIChat({ cardId, category, content, group, isReadOnly, title })

  return (
    <form className="mt-3 flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4" onSubmit={chat.submitMessage}>
      <AIChatSettings
        apiKey={chat.apiKey}
        apiKeyId={apiKeyId}
        model={chat.model}
        modelId={modelId}
        onApiKeyChange={chat.updateApiKey}
        onModelChange={chat.updateModel}
      />

      {isReadOnly ? (
        <Alert variant="destructive">
          <IconGhost3 />
          <AlertTitle>Note card no longer available</AlertTitle>
          <AlertDescription className="mt-2 text-[0.9em]">
            This chat is read-only: you can download, copy or clear the chat messages, but you won't be able to send new
            messages to the AI tutor.
          </AlertDescription>
        </Alert>
      ) : null}

      <AIChatMessages
        isConversationLoaded={chat.isConversationLoaded}
        messages={chat.messages}
        messagesRef={chat.messagesRef}
      />

      <AIChatComposer actions={chat.composerActions} messageId={messageId} state={chat.composerState} />
    </form>
  )
}
