import type { RefObject } from "react"
import { useEffect } from "react"
import type { ActiveAIChat } from "@/components/ai-chat"

const cardScrollTopOffset = 10
const cardHighlightDuration = 1400

/**
 * Finds the markdown card element that opened the active AI chat.
 *
 * @param container - Scroll container that owns the rendered cards.
 * @param cardId - Stable note card identifier.
 * @returns Matching card element when it is rendered.
 */
function getAIChatCardElement(container: HTMLElement, cardId: string): HTMLElement | null {
  const cards = container.querySelectorAll<HTMLElement>("[data-ai-chat-card-id]")

  return Array.from(cards).find((card) => card.dataset.aiChatCardId === cardId) ?? null
}

/**
 * Gets the scroll offset that aligns a card with its scroll container top.
 *
 * @param container - Main content scroll container.
 * @param card - Card element to align beneath the navbar.
 * @returns Scroll top value for the container with a small top offset.
 */
function getCardScrollTop(container: HTMLElement, card: HTMLElement): number {
  const containerRect = container.getBoundingClientRect()
  const cardRect = card.getBoundingClientRect()

  return container.scrollTop + cardRect.top - containerRect.top - cardScrollTopOffset
}

/**
 * Smoothly scrolls a card to the top of the main content scroll container.
 *
 * @param container - Main content scroll container.
 * @param card - Card element to bring into view.
 */
function scrollCardIntoView(container: HTMLElement, card: HTMLElement): void {
  container.scrollTo({ behavior: "smooth", top: getCardScrollTop(container, card) })
}

/**
 * Temporarily marks a card for a visual pulse highlight.
 *
 * @param card - Card element to highlight.
 * @returns Timeout ID that clears the highlight.
 */
function highlightCard(card: HTMLElement): number {
  card.dataset.aiChatHighlighted = "true"

  return window.setTimeout(() => {
    delete card.dataset.aiChatHighlighted
  }, cardHighlightDuration)
}

/**
 * Scrolls and highlights the card that opened the active AI chat.
 *
 * @param chat - Active AI chat metadata.
 * @param contentScrollRef - Main content scroll container ref.
 */
export function useScrollAIChatCardIntoView(
  chat: ActiveAIChat | null,
  contentScrollRef: RefObject<HTMLDivElement | null>,
): void {
  useEffect(() => {
    if (!chat) {
      return
    }

    let secondAnimationFrame = 0
    let highlightTimeout = 0
    const firstAnimationFrame = requestAnimationFrame(() => {
      secondAnimationFrame = requestAnimationFrame(() => {
        const container = contentScrollRef.current

        if (!container) {
          return
        }

        const card = getAIChatCardElement(container, chat.cardId)

        if (card) {
          scrollCardIntoView(container, card)
          highlightTimeout = highlightCard(card)
        }
      })
    })

    return () => {
      cancelAnimationFrame(firstAnimationFrame)
      cancelAnimationFrame(secondAnimationFrame)
      window.clearTimeout(highlightTimeout)
    }
  }, [chat, contentScrollRef])
}
