---
category: React
order: 11
---

# Batching updates

> [!caution] 
> React waits until all code in the event handlers has run before processing your state updates!


```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0); // 🔴 WRONG: will be 1, 2, 3, ... in next re-renders that are triggered by updating state from inside the click handler


  return (
    <>
      <h1>{number}</h1>       
      <button onClick={() => {
        setNumber(number + 1); // 🔴 this will be batch updated in the next re-render (eg. initially: 0 + 1 = 1)
        setNumber(number + 1); // 🔴 this will be batch updated in the next re-render (eg. initially: 0 + 1 = 1)
        setNumber(number + 1); // 🔴 this will be batch updated in the next re-render (eg. initially: 0 + 1 = 1)
      }}>+3</button>
    </>
  )
}
```

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0); // ✅ CORRECT: will be 3, 6, 9, ... in next re-renders that are triggered by updating state from inside the click handler

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1); // ✅ this will be batch updated in the next re-render (eg. initially 0 + 1 = 1, because the updater function will calculate the next state based on the previous one in the queue: 0)
        setNumber(n => n + 1); // ✅ this will be batch updated in the next re-render (eg. initially 1 + 1 = 2, because the updater function will calculate the next state based on the previous one in the queue: 1)
        setNumber(n => n + 1); // ✅ this will be batch updated in the next re-render (eg. initially 2 + 1 = 3, because the updater function will calculate the next state based on the previous one in the queue: 2)
      }}>+3</button>
    </>
  )
}
```
