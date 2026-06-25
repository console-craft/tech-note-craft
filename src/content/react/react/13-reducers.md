---
category: React
order: 14
quiz:
  - type: choice
    question: "What must reducers be?"
    options: ["Pure", "Async", "Random", "Nested components"]
    answers: ["Pure"]

  - type: choice
    question: "What should a reducer return for the same input?"
    options: ["The same output", "A random ID", "The current date", "A network response"]
    answers: ["The same output"]

  - type: choice
    question: "Which side effect does the note say reducers should avoid?"
    options: ["API calls", "Switch statements", "Returning new objects", "Filtering arrays"]
    answers: ["API calls"]

  - type: choice
    question: "What should each reducer action describe?"
    options: ["A single user interaction", "One field change only", "A random value", "A component render"]
    answers: ["A single user interaction"]

  - type: choice
    question: "Why is the added action passed an id from the event handler?"
    options: ["To keep the reducer pure", "To mutate the reducer", "To avoid dispatch", "To force a context update"]
    answers: ["To keep the reducer pure"]

  - type: choice
    question: "Which hook is used with tasksReducer in App?"
    options: ["useReducer", "useState", "useEffect", "useRef"]
    answers: ["useReducer"]

  - type: choice
    question: "Which action type updates newTaskText?"
    options: ["changed", "added", "deleted", "submitted"]
    answers: ["changed"]

  - type: choice
    question: "Which array method removes a deleted task?"
    options: ["filter", "map", "push", "splice"]
    answers: ["filter"]

  - type: fill
    question: "Complete the reducer hook usage."
    text: "const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)"
    blanks: ["tasks", "dispatch", "useReducer"]

  - type: fill
    question: "Complete the deleted case update."
    text: "items: tasks.items.filter((t) => t.id !== action.id)"
    blanks: ["items", "filter", "action.id"]
---

# Reducers

- Reducers must be pure: same input should always return the same output, and they should not have side effects (eg. no API calls, no random values, no date/time functions, etc.).
- Each action describes a single **user interaction**, even if that leads to multiple changes in the data! Don't create actions that are too granular and each one changes a single field in the state.
- See a reducer example in the details below.

<details>

- `src/App.jsx`

```jsx
import { useReducer } from "react";
import { initialTasks, tasksReducer } from "./tasksReducer";

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleDeleteTask(id) {
    dispatch({ type: "deleted", id });
  }

  function handleChangeTask(text) {
    dispatch({ type: "changed", text });
  }

  function handleAddTask(event) {
    event.preventDefault();

    // No need to send more data in the payload, the reducer already has access to tasks.newTaskText.
    // Also, to keep the reducer pure and side-effect free, we generate the new task item's random id here inside the event handler.
    dispatch({ type: "added", id: crypto.randomUUID() });
  }

  return (
    <main>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={tasks.newTaskText}
          onChange={(event) => handleChangeTask(event.target.value)}
          placeholder="Add task..."
        />

        <button type="submit">Add</button>
      </form>

      {tasks.items.length === 0 ? (
        <p>No tasks yet.</p>;
      ) : (
        <ul>
          {tasks.items.map((t) => (
            <li key={t.id}>
              {t.text} <button type="button" onClick={() => handleDeleteTask(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

- `src/tasksReducer.js`

```jsx
export const initialTasks = {
  items: [
    { id: crypto.randomUUID(), text: "Learn useReducer" },
    { id: crypto.randomUUID(), text: "Build a small React app" },
  ],
  newTaskText: "",
};

export function tasksReducer(tasks, action) {
  switch (action.type) {
    case "changed": {
      return {
        ...tasks,
        newTaskText: action.text,
      };
    }

    case "added": {
      const text = tasks.newTaskText.trim();

      if (!text) {
        return tasks;
      }

      return {
        ...tasks,
        newTaskText: "",
        items: [
          ...tasks.items,
          {
            id: action.id,
            text,
          },
        ],
      };
    }

    case "deleted": {
      return {
        ...tasks,
        items: tasks.items.filter((t) => t.id !== action.id),
      };
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
```

</details>
