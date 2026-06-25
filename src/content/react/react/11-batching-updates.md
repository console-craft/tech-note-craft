---
category: React
order: 11
quiz:
  - type: choice
    question: "When does React process state updates from an event handler?"
    options: ["After all handler code has run", "Before the handler starts", "After each line immediately", "Only after page reload"]
    answers: ["After all handler code has run"]

  - type: choice
    question: "What is this behavior called?"
    options: ["Batching updates", "Prop mirroring", "Event bubbling", "Fragment wrapping"]
    answers: ["Batching updates"]

  - type: choice
    question: "What should you use when the next state depends on queued updates?"
    options: ["Updater function form", "The stale state variable", "A nested component", "useId"]
    answers: ["Updater function form"]

  - type: choice
    question: "What happens when setNumber(number + 1) is called three times from number 0?"
    options: ["The next value is 1", "The next value is 3", "The next value is 0", "The component unmounts"]
    answers: ["The next value is 1"]

  - type: choice
    question: "Why do three setNumber(number + 1) calls produce only one increment?"
    options: ["Each call reads the same render snapshot", "React ignores duplicate functions", "number is a ref", "The button prevents default behavior"]
    answers: ["Each call reads the same render snapshot"]

  - type: choice
    question: "What happens when setNumber(n => n + 1) is called three times from 0?"
    options: ["The next value is 3", "The next value is 1", "The next value is 0", "The state is null"]
    answers: ["The next value is 3"]

  - type: choice
    question: "What does the updater function receive?"
    options: ["The previous queued state value", "The DOM node", "The event target only", "The component props object"]
    answers: ["The previous queued state value"]

  - type: choice
    question: "Which update form is correct for repeated increments in one handler?"
    options: ["setNumber(n => n + 1)", "setNumber(number + 1)", "number += 1", "setNumber(++number)"]
    answers: ["setNumber(n => n + 1)"]

  - type: fill
    question: "Complete the batched updater sequence."
    text: "setNumber(n => n + 1)\nsetNumber(n => n + 1)\nsetNumber(n => n + 1)"
    blanks: ["n => n + 1", "n => n + 1", "n => n + 1"]

  - type: fill
    question: "Complete the batching rule."
    text: "React waits until all code in the event handler has run before processing state updates."
    blanks: ["event handler", "processing", "state updates"]
---

# Batching updates

> [!caution] 
> React waits until all code in the event handlers has run before processing your state updates! If you need the next state value in your event handler, you should use the updater function form of `setState` (which can calculate the next value based on queued updates) instead of reading the state variable directly.


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
