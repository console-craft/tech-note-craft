const APP_BASE_PATH = normalizeBasePath(import.meta.env.BASE_URL)

/**
 * Normalizes Vite's base URL into a path prefix without a trailing slash.
 *
 * @param baseUrl - Vite base URL for the current build.
 * @returns Browser pathname prefix, or an empty string for root hosting.
 */
function normalizeBasePath(baseUrl: string): string {
  const pathname = new URL(baseUrl, window.location.origin).pathname.replace(/\/$/, "")

  return pathname === "" || pathname === "/" ? "" : pathname
}

/**
 * Converts an app-internal route into a browser href for the current base path.
 *
 * @param to - App route beginning with `/`, optionally including a hash.
 * @returns Browser href including the configured Vite base path.
 */
export function createBrowserHref(to: string): string {
  if (to === "/") {
    return `${APP_BASE_PATH}/`
  }

  return `${APP_BASE_PATH}${to}`
}

/**
 * Converts an app-internal route into an absolute browser URL.
 *
 * @param to - App route beginning with `/`, optionally including a hash.
 * @returns Absolute browser URL including the configured Vite base path.
 */
export function createAbsoluteBrowserHref(to: string): string {
  return new URL(createBrowserHref(to), window.location.origin).href
}

/**
 * Gets the current browser route including hash state.
 *
 * @returns Current pathname and hash.
 */
export function getCurrentHref(): string {
  const pathname = window.location.pathname
  const appPathname =
    APP_BASE_PATH && pathname.startsWith(APP_BASE_PATH) ? pathname.slice(APP_BASE_PATH.length) : pathname
  const normalizedPathname = appPathname.startsWith("/") ? appPathname : `/${appPathname}`

  return `${normalizedPathname}${window.location.hash}`
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
  window.history.pushState(null, "", createBrowserHref(to))
  updateRouteHref(setHref, startRouteProgress)
}
