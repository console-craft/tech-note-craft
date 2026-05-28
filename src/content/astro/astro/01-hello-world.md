---
category: Astro
order: 1
---

# Hello, World!

An Astro page can mix frontmatter JavaScript with plain HTML markup.

```astro
---
const message = "Hello, World!"
---

<h1>{message}</h1>
```

The frontmatter runs at build time, and the markup becomes the rendered page.
