import type { ReactElement } from "react"

/**
 * Renders the fallback page for unknown app routes.
 *
 * @returns A simple not found page.
 */
export function NotFound(): ReactElement {
  return (
    <section className="mx-auto flex min-h-full w-full max-w-8xl flex-col items-center justify-center gap-5 px-6 py-8 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl uppercase">Oops! Page not found.</h1>
        <p className="max-w-xl text-muted-foreground">Error 404: The dog ate the note.</p>
      </div>
      <img src="/404.png" alt="Dog holding a missing page" className="w-full max-w-xs opacity-90 sm:max-w-sm" />
    </section>
  )
}
