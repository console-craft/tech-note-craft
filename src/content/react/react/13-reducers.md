---
category: React
order: 14
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
