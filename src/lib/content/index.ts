/**
 * Formats a content group slug for display.
 *
 * @param group - Content group slug.
 * @returns Human-readable group label.
 */
function formatGroupTitle(group: string): string {
  return group.replace(/(^|-)([a-z])/g, (_, separator: string, letter: string) => {
    return `${separator ? " " : ""}${letter.toUpperCase()}`
  })
}

/**
 * Normalizes a frontmatter field into a non-empty trimmed string.
 *
 * @param value - Raw frontmatter value.
 * @returns Trimmed string when present, otherwise null.
 */
function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  return trimmed ? trimmed : null
}

/**
 * Normalizes a frontmatter field into non-empty string values.
 *
 * @param value - Raw frontmatter value.
 * @returns Trimmed string array, or an empty array when invalid.
 */
function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    const normalized = normalizeString(item)

    return normalized ? [normalized] : []
  })
}

interface ChoiceQuiz {
  type: "choice"
  question: string
  options: string[]
  answers: string[]
}

interface FillQuiz {
  type: "fill"
  question: string
  text: string
  blanks: string[]
}

export type QuizType = ChoiceQuiz | FillQuiz

interface FrontmatterResult {
  category: string
  content: string
  draft: boolean
  order: number
  quiz: QuizType[]
}

/**
 * Normalizes the display order from note frontmatter.
 *
 * @param value - Raw frontmatter order value.
 * @returns Positive order number, or 1 when invalid.
 */
function normalizeOrder(value: unknown): number {
  const order = typeof value === "number" ? value : Number(value)

  return Number.isFinite(order) && order > 0 ? order : 1
}

/**
 * Normalizes supported quiz frontmatter entries.
 *
 * @param value - Raw quiz frontmatter value.
 * @returns Valid quiz entries ready to render.
 */
function normalizeQuiz(value: unknown): QuizType[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item): QuizType[] => {
    if (!item || typeof item !== "object") {
      return []
    }

    const data = item as Record<string, unknown>
    const question = normalizeString(data.question)

    if (!question) {
      return []
    }

    if (data.type === "choice") {
      const options = normalizeStringArray(data.options)
      const answers = normalizeStringArray(data.answers)

      return options.length > 0 && answers.length > 0 ? [{ answers, options, question, type: "choice" }] : []
    }

    if (data.type === "fill") {
      const text = normalizeString(data.text)
      const blanks = normalizeStringArray(data.blanks)

      return text && blanks.length > 0 ? [{ blanks, question, text, type: "fill" }] : []
    }

    return []
  })
}

interface NoteModule {
  content: string
  data: {
    category?: unknown
    draft?: unknown
    order?: unknown
    quiz?: unknown
  }
}

/**
 * Normalizes frontmatter metadata and markdown body from a parsed note module.
 *
 * @param noteModule - Parsed markdown module emitted by the Vite markdown plugin.
 * @returns Normalized category metadata and markdown body.
 */
function normalizeNoteModule(noteModule: NoteModule): FrontmatterResult {
  const category = noteModule.data.category

  return {
    category: typeof category === "string" && category.trim() ? category.trim() : "Uncategorized",
    content: noteModule.content,
    draft: noteModule.data.draft === true,
    order: normalizeOrder(noteModule.data.order),
    quiz: normalizeQuiz(noteModule.data.quiz),
  }
}

/**
 * Gets the top-level content folder name from an import path.
 *
 * @param path - Vite import path for a markdown file.
 * @returns Top-level content group slug.
 */
function getGroupFromPath(path: string): string {
  return path.replace(/^\.\.\/\.\.\/content\//, "").split("/")[0] ?? "notes"
}

/**
 * Gets the content category slug from an import path.
 *
 * @param path - Vite import path for a markdown file.
 * @returns Second-level content folder slug, or `notes` when absent.
 */
function getCategorySlugFromPath(path: string): string {
  return path.replace(/^\.\.\/\.\.\/content\//, "").split("/")[1] ?? "notes"
}

/**
 * Gets a stable note name from an import path.
 *
 * @param path - Vite import path for a markdown file.
 * @returns Markdown filename without extension.
 */
function getNameFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "note"
}

const noteModules = import.meta.glob<NoteModule>("../../content/**/*.md", {
  eager: true,
  import: "default",
  query: "?frontmatter",
})

export interface Note {
  id: string
  group: string
  category: string
  name: string
  permalinkPath: string
  content: string
  order: number
  quiz: QuizType[]
}

export const notes = Object.entries(noteModules)
  .sort(([left], [right]) => left.localeCompare(right))
  .flatMap(([path, noteModule]): Note[] => {
    const { category, content, draft, order, quiz } = normalizeNoteModule(noteModule)

    if (draft) {
      return []
    }

    const group = getGroupFromPath(path)
    const categorySlug = getCategorySlugFromPath(path)
    const name = getNameFromPath(path)

    return [
      {
        category,
        content,
        group,
        id: path,
        name,
        order,
        permalinkPath: `/${group}/${categorySlug}/${name}`,
        quiz,
      },
    ]
  }) satisfies Note[]

interface ContentCategory {
  title: string
  href: string
}

export interface ContentGroup {
  title: string
  path: string
  categories: ContentCategory[]
}

export const contentGroups = Array.from(new Set(notes.map((note) => note.group))).map((group) => {
  const categories = Array.from(new Set(notes.filter((note) => note.group === group).map((note) => note.category))).map(
    (category) => ({
      href: `/${group}#${encodeURIComponent(category)}`,
      title: category,
    }),
  )

  return {
    categories,
    path: `/${group}`,
    title: formatGroupTitle(group),
  }
}) satisfies ContentGroup[]

export const routePaths = ["/", ...contentGroups.map((group) => group.path), ...notes.map((note) => note.permalinkPath)]
