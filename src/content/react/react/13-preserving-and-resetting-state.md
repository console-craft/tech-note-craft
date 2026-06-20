---
category: React
order: 13
---

# Preserving and resetting state

- React will keep the state around for as long as you render the **same component** at the **same position** in the tree.
- When you use something like `{showCounter && <Counter />}`, if `showCounter` becomes false, the `Counter` component will be unmounted and its state will be lost and when you show it again, it will be mounted again with a fresh state.
- When you use something like `{isMax ? <Counter isMax={true} /> : <Counter isMax={false} />}`, the `Counter` component will be re-rendered with new props but it will keep the same state, because it is the same component at the same position in the tree.
- Different components at the same position in the tree like `{isPaused ? (<p>Paused</p> : <Counter />}`} also cause the state to be lost when switching between them.

## Resetting state

1. either render the component at different positions like `<div>{isPlayerA && <Counter person="Taylor" />}{!isPlayerA && <Counter person="Sarah" />}</div>`
2. or use a `key` prop to tell React to treat them as different components: `{isPlayerA ? <Counter key="taylor" person="Taylor" /> : <Counter key="sarah" person="Sarah" />}`
