import OpenAI from "openai"
import type { EasyInputMessage, ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses"
import type { AIChatModel } from "@/lib/ai-chat/models"

/**
 * Creates a stable-enough local message identifier.
 *
 * @returns Unique message identifier for local rendering and persistence.
 */
export function createAIChatMessageId(): string {
  if (window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Creates a filesystem-safe filename segment from chat metadata.
 *
 * @param value - Raw filename text.
 * @returns Safe filename text.
 */
function createAIChatFilenamePart(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  return normalized || "chat"
}

interface AIChatDownloadFilenameOptions {
  category: string
  date: Date
  language: string
  title: string
}

/**
 * Creates a download filename from chat metadata.
 *
 * @param options - Date, language, category, and title for the chat.
 * @returns Filesystem-safe JSON filename.
 */
export function createAIChatDownloadFilename({
  category,
  date,
  language,
  title,
}: AIChatDownloadFilenameOptions): string {
  const dateTimePart = createAIChatFilenamePart(date.toISOString())
  const filenameParts = [language, category, title].map(createAIChatFilenamePart)

  return `${[dateTimePart, ...filenameParts].join("_")}.json`
}

type AIChatRole = "assistant" | "user"

export interface AIChatMessage {
  content: string
  createdAt: string
  id: string
  model?: AIChatModel
  role: AIChatRole
}

/**
 * Formats visible chat messages as markdown for clipboard sharing.
 *
 * @param category - Current chat category.
 * @param chatTitle - Current chat title.
 * @param chatMessages - Visible chat conversation messages.
 * @returns Markdown-formatted chat transcript without the system prompt.
 */
export function formatAIChatMessagesAsMarkdown(
  category: string,
  chatTitle: string,
  chatMessages: AIChatMessage[],
): string {
  const sections = chatMessages.map((message) => {
    return `## <${message.role}>\n\n${message.content.trim()}\n\n---`
  })

  return [`# ${category}: ${chatTitle}`, ...sections].join("\n\n")
}

type AIChatRequestPayload = ResponseCreateParamsNonStreaming

interface SendAIChatMessageOptions {
  apiKey: string
  messages: AIChatMessage[]
  model: AIChatModel
  systemPrompt: string
}

/**
 * Creates the OpenAI responses request payload for a visible conversation.
 *
 * @param options - System prompt, visible chat history, and selected model.
 * @returns Request payload sent to the responses endpoint.
 */
export function createAIChatRequestPayload({
  messages,
  model,
  systemPrompt,
}: Omit<SendAIChatMessageOptions, "apiKey">): AIChatRequestPayload {
  return {
    input: messages.map((message) => ({ content: message.content, role: message.role }) satisfies EasyInputMessage),
    instructions: systemPrompt,
    model,
    store: false,
  }
}

/**
 * Sends the full card chat context to OpenAI from the browser.
 *
 * @param options - API key, system prompt, and full visible chat history.
 * @returns Assistant response text.
 */
export async function sendAIChatMessage({
  apiKey,
  messages,
  model,
  systemPrompt,
}: SendAIChatMessageOptions): Promise<string> {
  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
  const response = await client.responses.create(createAIChatRequestPayload({ messages, model, systemPrompt }))

  return response.output_text.trim() || "I could not generate a response."
}
