---
category: React
order: 13
quiz:
  - type: choice
    question: "When does React preserve component state?"
    options: ["Same component at the same tree position", "Different component at the same position", "Same component with a different key", "Unmounted component rendered later"]
    answers: ["Same component at the same tree position"]

  - type: choice
    question: "What happens when showCounter becomes false in showCounter && <Counter />?"
    options: ["Counter unmounts", "Counter keeps rendering", "Counter receives new props only", "Counter changes keys"]
    answers: ["Counter unmounts"]

  - type: choice
    question: "What happens to Counter state after it unmounts?"
    options: ["It is lost", "It is preserved forever", "It moves to props", "It becomes a ref"]
    answers: ["It is lost"]

  - type: choice
    question: "What happens when the same Counter stays at the same position with different props?"
    options: ["It keeps the same state", "It always resets state", "It unmounts", "It becomes a different component type"]
    answers: ["It keeps the same state"]

  - type: choice
    question: "What causes state loss at the same tree position?"
    options: ["Switching between different component types", "Changing props on the same component", "Re-rendering the parent", "Passing a boolean prop"]
    answers: ["Switching between different component types"]

  - type: choice
    question: "Which is one way to reset state?"
    options: ["Render components at different positions", "Mutate props", "Use the same key", "Avoid rendering JSX"]
    answers: ["Render components at different positions"]

  - type: choice
    question: "Which prop can tell React to treat two components as different?"
    options: ["key", "className", "children", "ref"]
    answers: ["key"]

  - type: choice
    question: "Which example resets state between players?"
    options: ["<Counter key=\"taylor\" /> and <Counter key=\"sarah\" />", "<Counter isMax={true} /> and <Counter isMax={false} />", "<Counter /> at the same position", "Passing a new prop without a key"]
    answers: ["<Counter key=\"taylor\" /> and <Counter key=\"sarah\" />"]

  - type: fill
    question: "Complete the preservation rule."
    text: "React keeps state while rendering the same component at the same position in the tree."
    blanks: ["same component", "same position", "tree"]

  - type: fill
    question: "Complete the key-based reset example."
    text: "isPlayerA ? <Counter key=\"taylor\" person=\"Taylor\" /> : <Counter key=\"sarah\" person=\"Sarah\" />"
    blanks: ["key", "taylor", "sarah"]
---

# Preserving and resetting state

- React will keep the state around for as long as you render the **same component** at the **same position** in the tree.
- When you use something like `{showCounter && <Counter />}`, if `showCounter` becomes false, the `Counter` component will be unmounted and its state will be lost and when you show it again, it will be mounted again with a fresh state.
- When you use something like `{isMax ? <Counter isMax={true} /> : <Counter isMax={false} />}`, the `Counter` component will be re-rendered with new props but it will keep the same state, because it is the same component at the same position in the tree.
- Different components at the same position in the tree like `{isPaused ? (<p>Paused</p> : <Counter />}`} also cause the state to be lost when switching between them.

## Resetting state

1. either render the component at different positions like `<div>{isPlayerA && <Counter person="Taylor" />}{!isPlayerA && <Counter person="Sarah" />}</div>`
2. or use a `key` prop to tell React to treat them as different components: `{isPlayerA ? <Counter key="taylor" person="Taylor" /> : <Counter key="sarah" person="Sarah" />}`
