/**
 * Gets whether the document is currently in browser fullscreen mode.
 *
 * @returns Whether any document element owns fullscreen mode.
 */
export function isBrowserFullscreen(): boolean {
  return Boolean(document.fullscreenElement)
}

/**
 * Toggles browser fullscreen mode for the application document.
 *
 * @returns A promise that settles when the browser fullscreen request completes.
 */
export async function toggleBrowserFullscreen(): Promise<void> {
  if (isBrowserFullscreen()) {
    await document.exitFullscreen()
    return
  }

  await document.documentElement.requestFullscreen()
}
