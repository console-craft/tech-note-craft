---
category: React
order: 18
quiz:
  - type: choice
    question: "How should you measure performance before adding memoization?"
    options: ["Build in production and observe with CPU throttling", "Always add useMemo first", "Only read source code", "Disable rendering"]
    answers: ["Build in production and observe with CPU throttling"]

  - type: choice
    question: "Which browser tool setting is mentioned for simulating slower devices?"
    options: ["CPU throttling", "Dark mode", "Network offline", "Print preview"]
    answers: ["CPU throttling"]

  - type: choice
    question: "Which API measures the filtering example?"
    options: ["console.time", "performance.reset", "useEffect", "createRoot"]
    answers: ["console.time"]

  - type: choice
    question: "Which hook memoizes the visibleTodos calculation?"
    options: ["useMemo", "useEffect", "useRef", "useContext"]
    answers: ["useMemo"]

  - type: choice
    question: "When should the memoized filter run again?"
    options: ["When todos or filter changes", "On every keypress in unrelated state", "Only on app load", "Never after mount"]
    answers: ["When todos or filter changes"]

  - type: choice
    question: "Where should code that runs once per app load go?"
    options: ["A separate initialization module imported by the root entry point", "useEffect([], []) in App", "Inside every component render", "Inside a list key"]
    answers: ["A separate initialization module imported by the root entry point"]

  - type: choice
    question: "Why avoid App useEffect(..., []) for once-per-app-load code?"
    options: ["It runs on App mount and can run twice in dev", "It never runs", "It blocks imports", "It resets all keys"]
    answers: ["It runs on App mount and can run twice in dev"]

  - type: choice
    question: "What should you use to reset child state when a prop changes?"
    options: ["A key", "A useEffect reset", "A mutable prop", "A nested component definition"]
    answers: ["A key"]

  - type: fill
    question: "Complete the memoized filtering example."
    text: "const visibleTodos = useMemo(() => {\n  return getFilteredTodos(todos, filter)\n}, [todos, filter])"
    blanks: ["useMemo", "todos", "filter"]

  - type: fill
    question: "Complete the key reset example."
    text: "<Profile userId={userId} key={userId} />"
    blanks: ["Profile", "userId", "key"]
---

# Misc

## Measure performance and add memoization where necessary

- Build the app in `production` mode, then turn on [CPU throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) to simulate a slower user device and observe the performance impact for multiple renders.

```jsx
// measure non-memoized version (eg. filtering a large array)
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');

// measure memoized version (eg. filtering a large array)
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

> [!important]
> The improvement from the above example becomes obvious when you consider there could be other unrelated state variables in the component that when updated trigger frequent re-renders of the whole component, (eg. Calling a `setNewTodoText()` on every keypress inside a text input), but the expensive filtering operation should not run unless `todos` and `filter` changed. 

## Run code once per app load

- Avoid putting initialization code in a `useEffect(..., [])` in `App.tsx` because that technically runs on every App component **mount** (and in dev mode it will run twice), not on app **load**. Instead, put such code in a separate file that will be imported by the root entry point (eg. `main.tsx` in SPAs; Note that SSR apps usually have two entry points - one for client and one for server) and it will only run once, when that initialization module is imported.

```jsx
// main.tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import { initialize } from "./initialize"; // Put any code that should run once per app load in this file

initialize();

createRoot(document.getElementById("root")!).render(<App />);
```

## Reset state when a prop changes

- A parent render can produce new props for a child, causing React to render that child with those new props. But that ordinary re-render preserves the child’s existing state unless React sees a different component type, tree position, or key.
- For such a case, use a `key` instead of `useEffect` to reset the component state.

```jsx
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

```jsx
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This state and any other state will reset automatically because of the key change
  const [comment, setComment] = useState('');
  // ...
}
```

- TODO: continue quiz - https://react.dev/learn/you-might-not-need-an-effect#reset-state-without-effects
