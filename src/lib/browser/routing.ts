/**
 * Gets the current browser route including hash state.
 *
 * @returns Current pathname and hash.
 */
export function getCurrentHref(): string {
  return `${window.location.pathname}${window.location.hash}`
}

/**
 * Gets the route-matching path from a URL href.
 *
 * @param href - Browser href value.
 * @returns Pathname without the hash.
 */
export function getPathname(href: string): string {
  return href.split("#")[0] || "/"
}

/**
 * Gets whether route transitions should avoid animation for accessibility.
 *
 * @returns True when the user prefers reduced motion.
 */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export type FinishRouteProgress = () => void
type StartRouteProgress = () => FinishRouteProgress

/**
 * Updates route state inside a native View Transition when available.
 *
 * @param setHref - State setter used to notify React about the new location.
 * @param startRouteProgress - Optional progress indicator starter.
 * @returns Nothing.
 */
export function updateRouteHref(setHref: (href: string) => void, startRouteProgress?: StartRouteProgress): void {
  const updateHref = () => setHref(getCurrentHref())
  const finishRouteProgress = startRouteProgress?.()

  if (!document.startViewTransition || prefersReducedMotion()) {
    updateHref()
    window.setTimeout(() => finishRouteProgress?.(), 120)
    return
  }

  const transition = document.startViewTransition(updateHref)

  void transition.finished.finally(() => finishRouteProgress?.())
}

/**
 * Pushes an internal route into browser history.
 *
 * @param to - Destination pathname with optional hash.
 * @param setHref - State setter used to notify React about the new location.
 * @param startRouteProgress - Optional progress indicator starter.
 * @returns Nothing.
 */
export function navigateTo(to: string, setHref: (href: string) => void, startRouteProgress?: StartRouteProgress): void {
  window.history.pushState(null, "", to)
  updateRouteHref(setHref, startRouteProgress)
}
