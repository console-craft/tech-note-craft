---
category: React
order: 6
quiz:
  - type: choice
    question: "What should React components behave like?"
    options: ["Pure functions", "Random generators", "Global mutators", "Async jobs"]
    answers: ["Pure functions"]

  - type: choice
    question: "What should a pure component not modify?"
    options: ["Its inputs", "Local variables it just created", "Returned JSX", "Constants outside React"]
    answers: ["Its inputs"]

  - type: choice
    question: "What should a pure component return for the same inputs?"
    options: ["The same output", "A random output", "A mutated prop", "A different component each time"]
    answers: ["The same output"]

  - type: choice
    question: "Which mutation is allowed during rendering?"
    options: ["Local mutation of variables just defined", "Changing props", "Changing external variables", "Writing to browser storage"]
    answers: ["Local mutation of variables just defined"]

  - type: choice
    question: "Where should side effects usually happen?"
    options: ["Event handlers or Effects", "Unconditionally during render", "Inside JSX attributes only", "Inside component definitions nested in render"]
    answers: ["Event handlers or Effects"]

  - type: choice
    question: "What does a useState setter queue?"
    options: ["A future React state update", "A local variable mutation", "A direct prop change", "A synchronous DOM rewrite only"]
    answers: ["A future React state update"]

  - type: choice
    question: "Why avoid calling state setters unconditionally during render?"
    options: ["It can cause infinite loops", "It disables JSX", "It mutates props", "It closes all tags"]
    answers: ["It can cause infinite loops"]

  - type: choice
    question: "When do event handlers run?"
    options: ["When you perform an action", "During every render", "Before importing modules", "Only during commit cleanup"]
    answers: ["When you perform an action"]

  - type: fill
    question: "Complete the pure component rule."
    text: "Components should not modify their inputs and should return the same output for the same inputs."
    blanks: ["inputs", "same output", "same inputs"]

  - type: fill
    question: "Complete the side-effect locations."
    text: "Side effects should be done in event handlers or effects, not during rendering."
    blanks: ["event handlers", "effects", "rendering"]
---

# Pure functions

- components should be pure functions: they should not modify their inputs (props) and should return the same output for the same inputs.
- local mutations (eg. Changing variables that you just defined in your component during re-rendering) is allowed.
- side-effects (eg. Changing variables external to the component) should not happen during rendering. Instead, they should be done in event handlers or effects.
- using an `useState()` setter is not a local mutation because it queues a React state update for a **future render** (usually also triggering it), but it does not change the current render’s state variable. Still, just like side-effects it's also normally called from event handlers or Effects, not unconditionally during render (to avoid infinite loops).

1. Event handlers - functions that React runs when you perform some action (eg. click a button), and don’t run during rendering so they don't need to be pure.
2. `useEffect` - last resort if your mutation can't be handled in an event handler - it's executed later, after rendering, when side effects are allowed.
