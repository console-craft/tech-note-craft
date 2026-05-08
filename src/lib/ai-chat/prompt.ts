const labels: Record<string, string> = {
  ai: "AI",
  css: "CSS",
  fastapi: "FastAPI",
  graphql: "GraphQL",
  html: "HTML",
  javascript: "JavaScript",
  json: "JSON",
  node: "Node.js",
  sql: "SQL",
  toml: "TOML",
  typescript: "TypeScript",
  yaml: "YAML",
}

/**
 * Formats a language slug into the label used in AI prompts.
 *
 * @param lanbel - Content group or category slug.
 * @returns Human-readable language label.
 */
function formatSlug(lanbel: string): string {
  const normalized = lanbel.trim().toLowerCase()
  const mappedLabel = labels[normalized]

  if (mappedLabel) {
    return mappedLabel
  }

  return normalized.replace(/(^|-)([a-z])/g, (_, separator: string, letter: string) => {
    return `${separator ? " " : ""}${letter.toUpperCase()}`
  })
}

interface CardTutorPromptOptions {
  group: string
  category: string
  content: string
}

/**
 * Formats the prompt topic from a broad content group and specific category.
 *
 * @param group - Top-level content group slug.
 * @param category - Specific card category.
 * @returns Human-readable prompt topic.
 */
function formatPromptTopic(group: string, category: string): string {
  const formattedGroup = formatSlug(group)
  const formattedCategory = formatSlug(category)

  if (formattedGroup.toLowerCase() === formattedCategory.toLowerCase()) {
    return formattedGroup
  }

  return `${formattedGroup} and ${formattedCategory}`
}

/**
 * Builds the coding tutor prompt for a markdown study card.
 *
 * @param options - Prompt topic metadata and markdown card content.
 * @returns Complete prompt text ready for clipboard or AI chat use.
 */
export function createCardTutorPrompt({ category, content, group }: CardTutorPromptOptions): string {
  return `You are a coding tutor and the user is using study cards to learn about ${formatPromptTopic(group, category)}. Answer the user's technical questions in a helping manner. Here is the content of the current card:

<card-content>
${content.trim()}
</card-content>`
}
