---
category: React
---

# Pure functions

- components should be pure functions: they should not modify their inputs (props) and should return the same output for the same inputs.
- local mutations (eg. Changing variables that you just defined in your component during rerendering) is allowed.
- side-effects (eg. Changing variables external to the component) should not happen during rendering. Instead, they should be done in event handlers or effects.
- using an `useState()` setter is not a local mutation because it queues a React state update for a **future render** (usually also triggering it), but it does not change the current render’s state variable. Still, just like side-effects it's also normally called from event handlers or Effects, not unconditionally during render (to avoid infinite loops).

1. Event handlers - functions that React runs when you perform some action (eg. click a button), and don’t run during rendering so they don't need to be pure.
2. `useEffect` - last resort if your mutation can't be handled in an event handler - it's executed later, after rendering, when side effects are allowed.

