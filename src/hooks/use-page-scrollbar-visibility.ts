import { useEffect, useRef, useState } from "react"

const scrollbarVisibilityDuration = 900

interface PageScrollbarVisibility {
  isPageScrolling: boolean
  showPageScrollbar: () => void
}

/**
 * Tracks when the main page scrollbar should be visible.
 *
 * @returns Current visibility state and an event handler for scroll events.
 */
export function usePageScrollbarVisibility(): PageScrollbarVisibility {
  const [isPageScrolling, setIsPageScrolling] = useState(false)
  const scrollbarTimeoutRef = useRef(0)

  /**
   * Shows the page scrollbar while the main content area is actively scrolling.
   */
  function showPageScrollbar(): void {
    window.clearTimeout(scrollbarTimeoutRef.current)
    setIsPageScrolling(true)

    scrollbarTimeoutRef.current = window.setTimeout(() => {
      setIsPageScrolling(false)
    }, scrollbarVisibilityDuration)
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(scrollbarTimeoutRef.current)
    }
  }, [])

  return { isPageScrolling, showPageScrollbar }
}
