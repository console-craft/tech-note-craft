---
category: React
---

# Components

- JavaScript functions, but their names must **start with a capital letter**
- can render other components, but you must **never nest their definitions**:

```jsx
// Gallery.js
export default function Gallery() {
  function Profile() {
    // 🔴 Never define a component inside another component!
    // ...
  }
  // ...
}
```
