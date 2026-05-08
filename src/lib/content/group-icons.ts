import {
  IconBrandAngular,
  IconBrandAstro,
  IconBrandCss3,
  IconBrandDocker,
  IconBrandGit,
  IconBrandGolang,
  IconBrandGraphql,
  IconBrandHtml5,
  IconBrandJavascript,
  IconBrandNodejs,
  IconBrandPrisma,
  IconBrandPython,
  IconBrandReact,
  IconBrandRust,
  IconBrandSvelte,
  IconBrandTypescript,
  IconBrandVimeo,
  IconBrandVue,
  IconClearAll,
  IconDatabase,
  IconHash,
  IconJson,
  IconMarkdown,
  IconMoonStars,
  IconSettings,
  IconSitemap,
  IconSparkles,
  IconTag,
  IconToml,
} from "@tabler/icons-react"

type GroupIcon = typeof IconTag

const groupIcons: Record<string, GroupIcon> = {
  ai: IconSparkles,
  angular: IconBrandAngular,
  astro: IconBrandAstro,
  bash: IconHash,
  css: IconBrandCss3,
  docker: IconBrandDocker,
  dotfiles: IconSettings,
  git: IconBrandGit,
  go: IconBrandGolang,
  graphql: IconBrandGraphql,
  html: IconBrandHtml5,
  javascript: IconBrandJavascript,
  json: IconJson,
  lua: IconMoonStars,
  markdown: IconMarkdown,
  mermaid: IconSitemap,
  neovim: IconBrandVimeo,
  node: IconBrandNodejs,
  prisma: IconBrandPrisma,
  python: IconBrandPython,
  react: IconBrandReact,
  rust: IconBrandRust,
  sql: IconDatabase,
  svelte: IconBrandSvelte,
  toml: IconToml,
  typescript: IconBrandTypescript,
  vue: IconBrandVue,
  yaml: IconClearAll,
}

/**
 * Normalizes a group label into a stable lookup key.
 *
 * @param label - Group label, slug, or path segment.
 * @returns Lowercase alphanumeric key used for icon lookup.
 */
function getGroupIconKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "")
}

/**
 * Gets the icon component for a content group label.
 *
 * @param label - Group label, slug, or path segment to match.
 * @returns Matching group icon or generic tag fallback.
 */
export function getGroupIcon(label: string): GroupIcon {
  return groupIcons[getGroupIconKey(label)] ?? IconTag
}
