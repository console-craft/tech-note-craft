import type { AIChatMessage } from "@/lib/ai-chat/chat"
import { AI_CHAT_CONVERSATIONS_STORE_NAME, openAppDatabase } from "@/lib/browser/storage"

export interface AIChatConversation {
  cardId: string
  createdAt: string
  group: string
  id: string
  messages: AIChatMessage[]
  title: string
  updatedAt: string
}

/**
 * Loads the persisted chat conversation for a card.
 *
 * @param cardId - Stable note card identifier.
 * @returns The saved conversation, or null when no chat has been saved.
 */
export async function getAIChatConversation(cardId: string): Promise<AIChatConversation | null> {
  const database = await openAppDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AI_CHAT_CONVERSATIONS_STORE_NAME, "readonly")
    const request = transaction.objectStore(AI_CHAT_CONVERSATIONS_STORE_NAME).get(cardId)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve((request.result as AIChatConversation | undefined) ?? null)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

/**
 * Loads every persisted AI chat conversation ordered by most recent activity.
 *
 * @returns Saved conversations sorted newest first.
 */
export async function listAIChatConversations(): Promise<AIChatConversation[]> {
  const database = await openAppDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AI_CHAT_CONVERSATIONS_STORE_NAME, "readonly")
    const request = transaction.objectStore(AI_CHAT_CONVERSATIONS_STORE_NAME).getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const conversations = (request.result as AIChatConversation[]).sort((left, right) => {
        return right.updatedAt.localeCompare(left.updatedAt)
      })

      resolve(conversations)
    }
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

/**
 * Deletes the persisted AI chat conversation for a card.
 *
 * @param cardId - Stable note card identifier.
 * @returns Nothing.
 */
export async function deleteAIChatConversation(cardId: string): Promise<void> {
  const database = await openAppDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AI_CHAT_CONVERSATIONS_STORE_NAME, "readwrite")
    const request = transaction.objectStore(AI_CHAT_CONVERSATIONS_STORE_NAME).delete(cardId)

    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => reject(transaction.error)
  })
}

interface SaveAIChatConversationOptions {
  cardId: string
  group: string
  messages: AIChatMessage[]
  title: string
}

/**
 * Saves the visible chat conversation for a card.
 *
 * @param options - Card metadata and ordered chat messages.
 * @returns Nothing.
 */
export async function saveAIChatConversation({
  cardId,
  group,
  messages,
  title,
}: SaveAIChatConversationOptions): Promise<void> {
  const previousConversation = await getAIChatConversation(cardId)
  const database = await openAppDatabase()
  const now = new Date().toISOString()
  const conversation: AIChatConversation = {
    cardId,
    createdAt: previousConversation?.createdAt ?? now,
    group,
    id: cardId,
    messages,
    title,
    updatedAt: now,
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(AI_CHAT_CONVERSATIONS_STORE_NAME, "readwrite")
    const request = transaction.objectStore(AI_CHAT_CONVERSATIONS_STORE_NAME).put(conversation)

    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => {
      database.close()
      resolve()
    }
    transaction.onerror = () => reject(transaction.error)
  })
}
