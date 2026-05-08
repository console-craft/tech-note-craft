/**
 * Copies text through a temporary textarea using the legacy selection API.
 *
 * @param text - Text content to copy.
 * @returns Whether the browser accepted the copy command.
 */
function copyTextWithTextarea(text: string): boolean {
  const legacyDocument = document as unknown as { execCommand: (commandId: string) => boolean }
  const textarea = document.createElement("textarea")

  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "0"
  textarea.style.left = "0"
  textarea.style.opacity = "0"
  textarea.style.pointerEvents = "none"

  document.body.append(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)

  try {
    return legacyDocument.execCommand("copy")
  } finally {
    textarea.remove()
  }
}

/**
 * Copies text to the user's clipboard with a mobile-friendly fallback.
 *
 * @param text - Text content to copy.
 * @returns A promise that resolves when copying succeeds.
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)

    return
  } catch {
    if (copyTextWithTextarea(text)) {
      return
    }
  }

  throw new Error("Unable to copy text to clipboard.")
}
