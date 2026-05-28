---
category: React
order: 10
---

# Rendering

## 1. Triggering a render

There are two reasons for a component to render:

- It's the component's initial render -> Starting from the root component (`createRoot(document.getElementById('root')).render()`) and propagated down to the entire components tree.
- The component's (or one of its ancestors') state has been updated, so a re-render was enqueued.

## 2. Rendering a component

- Recursively render (call) the component and all of its children to "calculate" what the UI should look like at a given point in time.
- Rendering takes a state snapshot in time: a component's props, event handlers, and local variables are all calculated using its state at the time of the render.
- Every render (and functions inside it) will always “see” the snapshot of the state that React gave to that render.
- Local variables and event handlers don’t “survive” re-renders. Every render has its own new event handlers.
- React won't do anything with the render result until the next step, the commit phase.

## 3. Committing changes to the DOM

- React applies the minimal necessary operations calculated while rendering, to make the DOM match the latest rendering output.
- React only changes the DOM nodes if there’s a difference between renders. That's why text inside input elements is preserved if the value is the same, even if the component re-renders.

<details>

```jsx
import { useState } from "react"

export default function Counter() {
  const [number, setNumber] = useState(0) // will be 5, 10, 15, ... in next re-renders that are triggered by updating state from inside the click handler

  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 5) // this will be updated in the next re-render
          alert(number) // 🔴 this render's state value (eg. initially 0, not 5, because the event handler is created during the render when `number` is 0)
          setTimeout(() => alert(number), 1000) // 🔴 this will also show the same value as the alert above, because the setTimeout callback is also created during the same render as above
        }}
      >
        +5
      </button>
    </>
  )
}
```

</details>
