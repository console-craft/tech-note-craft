import { defaultAIChatModel, isAIChatModel, type AIChatModel } from "@/lib/ai-chat/models"

export const AI_CHAT_CONVERSATIONS_STORE_NAME = "aiChatConversations"

const OPENAI_API_KEY_STORAGE_KEY = "tech-note-craft:openai-api-key"
const OPENAI_MODEL_STORAGE_KEY = "tech-note-craft:openai-model"
const THEME_MODE_STORAGE_KEY = "tech-note-craft:theme-mode"
const APP_DATABASE_NAME = "tech-note-craft"
const APP_DATABASE_VERSION = 2

type ThemeMode = "dark" | "light"

/**
 * Reads the saved theme mode from browser local storage.
 *
 * @returns The saved theme mode, or dark mode when unavailable or unset.
 */
export function getStoredThemeMode(): ThemeMode {
  try {
    const value = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)

    return value === "light" ? "light" : "dark"
  } catch {
    return "dark"
  }
}

/**
 * Saves the active theme mode to browser local storage.
 *
 * @param mode - Theme mode to persist across browser sessions.
 * @returns Nothing.
 */
export function setStoredThemeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
  } catch {
    // Ignore storage failures so the UI can still toggle themes.
  }
}

/**
 * Reads the OpenAI API key from browser session storage.
 *
 * @returns The saved API key for the current tab session, or an empty string.
 */
export function getStoredOpenAIApiKey(): string {
  try {
    return window.sessionStorage.getItem(OPENAI_API_KEY_STORAGE_KEY) ?? ""
  } catch {
    return ""
  }
}

/**
 * Saves or clears the OpenAI API key in browser session storage.
 *
 * @param apiKey - API key value to keep for the current tab session.
 * @returns Nothing.
 */
export function setStoredOpenAIApiKey(apiKey: string): void {
  try {
    if (apiKey) {
      window.sessionStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, apiKey)
      return
    }

    window.sessionStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY)
  } catch {
    // Ignore storage failures so chat can still use the in-memory value.
  }
}

/**
 * Reads the selected OpenAI chat model from local storage.
 *
 * @returns The saved model, or the default model when unavailable or unset.
 */
export function getStoredOpenAIModel(): AIChatModel {
  try {
    const value = window.localStorage.getItem(OPENAI_MODEL_STORAGE_KEY)

    return value && isAIChatModel(value) ? value : defaultAIChatModel
  } catch {
    return defaultAIChatModel
  }
}

/**
 * Saves the selected OpenAI chat model to local storage.
 *
 * @param model - Model to persist across browser sessions.
 * @returns Nothing.
 */
export function setStoredOpenAIModel(model: AIChatModel): void {
  try {
    window.localStorage.setItem(OPENAI_MODEL_STORAGE_KEY, model)
  } catch {
    // Ignore storage failures so chat can still use the in-memory value.
  }
}

/**
 * Opens the app IndexedDB database for future larger local data needs.
 *
 * @returns A promise that resolves with the app database connection.
 */
export function openAppDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(APP_DATABASE_NAME, APP_DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(AI_CHAT_CONVERSATIONS_STORE_NAME)) {
        const store = database.createObjectStore(AI_CHAT_CONVERSATIONS_STORE_NAME, { keyPath: "id" })

        store.createIndex("cardId", "cardId", { unique: true })
        store.createIndex("updatedAt", "updatedAt")
      }
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
