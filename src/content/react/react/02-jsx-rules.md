---
category: React
order: 2
---

# JSX rules

- return a **single root element** - JSX is transformed into JS objects and you can’t return two objects from a function without wrapping them into an array (wrap children using a parent element, or use a fragment `<></>` or `<Fragment></Fragment>` to not add an extra DOM node)
- **close all tags**, even the self-closing ones like `<img />` or `<input />`.
- use **camelCase** for HTML attributes except `aria-*` and `data-*` and use `className`, not `class`
