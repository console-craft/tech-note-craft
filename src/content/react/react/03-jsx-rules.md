---
category: React
---

# JSX rules

1. Return a **single root element**
   - use a fragment (`<></>` or `<Fragment></Fragment>`) for no extra DOM node
   - JSX is transformed into JS objects - you can’t return two objects from a function without wrapping them into an array
2. **Close all tags**, even the self-closing ones like `<img>` or `<input>`.
3. Use **camelCase** for HTML attributes except `aria-*` and `data-*` and use `className`, not `class`
