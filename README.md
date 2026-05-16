# tech-note-craft

Markdown based technical notes renderer and explorer + AI chat.

[https://console-craft.com/tech-note-craft](https://console-craft.com/tech-note-craft)

## Features

- Renders a browsable technical note library from local Markdown files in `src/content/**/*.md`.
- Groups notes by top-level content folder and categories from Markdown frontmatter.
- Displays notes as expandable cards with syntax-highlighted code blocks.
- Supports light/dark mode, fullscreen mode, global card expand/collapse, and adjustable Markdown text size.
- Includes quiz support through Markdown frontmatter: multiple-choice and fill-in-the-blank cards.
- Provides per-card AI tutor chats using OpenAI models, with card content included as context.
- Saves AI chat history locally in IndexedDB and supports copying/downloading chat payloads.
- Uses Tailwind CSS v4 and shadcn/Radix-style UI primitives.
- Uses Vite+ (`vp`) for development, checking, testing, and builds.

## Usage

```shell
bun install
bun run dev
```

Build and preview production output:

```shell
bun run build
bun run preview
```

Quality checks:

```shell
bun run check
bun run typecheck
bun run test
```

## Writing notes

Notes live under `src/content/`. The first folder segment becomes the content group route.

Example path:

```text
src/content/typescript/typescript/01-hello-world.md
```

The app reads all Markdown files with `import.meta.glob` and derives routes from the top-level content folders. Each note can provide a `category` in frontmatter:

```markdown
---
category: Basics
---

# Hello World

Your note content goes here.
```

## Quiz frontmatter

Multiple-choice quiz:

```yaml
---
category: Basics
quiz:
  - type: choice
    question: Which keyword defines a function in Python?
    options: [def, define, function]
    answers: [def]
---
```

Fill-in-the-blank quiz:

```yaml
---
category: Basics
quiz:
  - type: fill
    question: "The correct code to read a file in Python is:"
    text: "with open('file.txt') as f:\n\tprint(f.read())"
    blanks: [open, read]
---
```

See `src/content/_examples_/` for formatting and quiz examples.

## AI chat

AI chat runs in the browser through the OpenAI client with `dangerouslyAllowBrowser: true`.

- The OpenAI API key is entered in the UI and stored in `sessionStorage` ONLY for the current tab session (until you close the tab!).
- The selected model is stored in `localStorage`.
- Conversations are stored locally in IndexedDB.
- Supported models are currently `gpt-4.1-mini` and `gpt-5-mini`.

Do not use this flow for secrets you do not want exposed to the browser runtime.

## Tech stack

- React 19
- TypeScript
- Vite+
- Tailwind CSS v4
- shadcn/Radix-style primitives
- markdown-exit and Shiki
- OpenAI Responses API
- Bun

## License

MIT.

See `LICENSE.txt` for the full license text.
