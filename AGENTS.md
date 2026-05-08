# tech-note-craft

Markdown based technical notes renderer and explorer.

## Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Coding Style and Conventions

- Keep files <= ~200 LOC; functions <= ~50 LOC. Split larger files by concern rather than extracting utilities.
- Exception: test files in `tests/` can exceed ~200 LOC when keeping related assertions together improves test clarity and signal.
- Add JSDoc comments for all helper functions (exported or not) with a description, parameters, and return type. Keep them in sync with the actual code; don't let them become stale.
- Some duplication is ok (WET > DRY) for clarity and to avoid over-abstraction. Too much duplication is bad.
- Prefer explicit return types for functions.
- Don't use single line blocks (`if (x) return y;`); prefer braces and newlines for clarity.
- Prefer function declarations over function expressions, except when a function expression improves readability (e.g. when passing as an argument).

## Verification

- Before marking work as complete:
  - if code files or project config files were added or changed run the `/verify` command

## Repo Map

- `src/main.tsx` mounts the React app and imports global styles.
- `src/App.tsx` owns the application shell: routing state, sidebar layout, theme/fullscreen controls, card expansion state, markdown text sizing, and side-panel view state.
- `src/style.css` contains Tailwind v4 setup, theme tokens, global styles, markdown content styling, syntax-highlight theme variables, and route progress styles.
- `src/components/page.tsx` renders the notes landing/group pages, category tabs, and filtered card sections.
- `src/components/layout/` contains shell-level UI: `app-sidebar.tsx`, `top-navbar.tsx`, `cards-section.tsx`, and `app-side-panel.tsx`.
- `src/components/note-card/` renders individual note cards, note actions, and quiz UI.
- `src/components/ai-chat/` contains AI chat UI, history/settings panels, message rendering, composer, and the `use-ai-chat.ts` hook.
- `src/components/core/markdown-content.tsx` renders markdown HTML produced by the shared markdown renderer.
- `src/components/ui/` contains shadcn/Radix-style reusable primitives. Use the `shadcn` skill before adding, modifying, or debugging these components.
- `src/hooks/` contains browser/UI hooks for mobile detection, page scrollbar visibility, and scrolling AI chat cards into view.
- `src/lib/content/` loads and normalizes markdown notes from `src/content/**/*.md`, derives content groups/routes, normalizes quiz frontmatter, and maps group icons.
- `src/lib/markdown/` contains the markdown rendering pipeline and custom Shiki themes.
- `src/lib/ai-chat/` contains OpenAI chat helpers, model metadata, prompt construction, and persisted chat storage.
- `src/lib/browser/` wraps browser APIs for clipboard, fullscreen, routing/history, and local storage.
- `src/lib/utils.ts` contains shared utility helpers such as class-name merging.
- `src/content/` is the markdown knowledge base. Top-level folders are note groups; markdown frontmatter supports `category` and optional quiz data.
- `src/content/_examples_/` contains sample markdown for formatting and quiz structures.
- `vite.config.ts` configures Vite+, React, Tailwind, the `@` alias, lint/fmt settings, and the build-time markdown frontmatter plugin.
- `components.json` configures shadcn component generation and aliases.
- `.opencode/commands/verify.md`, `.opencode/agents/verify.md`, and `.opencode/skills/check/SKILL.md` define the local `/verify` workflow.
- `.opencode/skills/shadcn/` contains local shadcn instructions and rules for UI work.
- `public/` stores static assets copied into the build.
- `dist/` is generated build output and should not be edited by hand.
